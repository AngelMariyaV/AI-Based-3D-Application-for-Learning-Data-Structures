"""
AI Mock Interview backend.

Flow:
  1. POST /interview/start   -> creates a session, returns question 1
  2. POST /interview/answer  -> grades the answer, returns feedback +
                                 the next question (or final scores if
                                 that was the last question)
  3. POST /interview/end     -> lets the student stop early and still
                                 get scored on whatever was answered
  4. GET  /interview/history -> past interview results for a user

All interview state lives server-side in an in-memory SESSIONS dict,
keyed by a random sessionId, so the frontend never has to trust (or
resend) the model's own questions/answers as ground truth.
"""

import json
import random
import re
import uuid

from flask import Blueprint, request, jsonify
from groq import Groq
from dotenv import load_dotenv
import os

from models.interview import save_interview_result, get_history

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

interview = Blueprint("interview", __name__, url_prefix="/interview")

# In-memory session store: { sessionId: {...} }
SESSIONS = {}

TOPIC_POOL = [
    "Array",
    "Stack",
    "Queue",
    "Linked List",
    "Binary Tree",
    "Graph",
    "Sorting Algorithms",
    "Searching Algorithms",
    "Time & Space Complexity",
    "Recursion",
    "Hashing",
]

DIFFICULTIES = ("easy", "medium", "hard")
DEFAULT_QUESTIONS = 5


def _extract_json(text):
    """The model is asked to return raw JSON, but sometimes wraps it in
    ```json fences or adds stray text. Pull out the first {...} block
    and parse it, raising if nothing usable is found."""

    text = text.strip()
    text = re.sub(r"^```(json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in model response")

    return json.loads(match.group(0))


def _ask_model(prompt, temperature=0.4):
    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
    )
    return completion.choices[0].message.content


def _generate_question(topic, difficulty, asked_questions):
    avoid = "\n".join(f"- {q}" for q in asked_questions) or "(none yet)"

    prompt = f"""
You are a strict but fair technical interviewer conducting a Data Structures
& Algorithms mock interview.

Ask ONE interview question about the topic: {topic}
Difficulty level: {difficulty}

Rules:
- The question must be answerable in a few sentences (no take-home coding tasks).
- Do not repeat or closely resemble any of these already-asked questions:
{avoid}
- Keep it concise, one question only.

Respond with ONLY valid JSON, no markdown, no code fences, in this exact shape:
{{"question": "the interview question text"}}
"""
    raw = _ask_model(prompt, temperature=0.6)
    data = _extract_json(raw)
    return data["question"].strip()


def _evaluate_answer(topic, question, answer):
    prompt = f"""
You are a technical interviewer evaluating a candidate's spoken answer during
a Data Structures & Algorithms mock interview.

Topic: {topic}
Question asked: {question}
Candidate's answer: {answer if answer.strip() else "(no answer given)"}

Evaluate the answer and respond with ONLY valid JSON, no markdown, no code
fences, in this exact shape:
{{
  "correct": true or false,
  "feedback": "one or two short sentences of direct, encouraging feedback"
}}
"""
    raw = _ask_model(prompt, temperature=0.3)
    data = _extract_json(raw)
    return bool(data.get("correct")), str(data.get("feedback", "")).strip()


def _score_interview(transcript, difficulty):
    lines = []
    for i, turn in enumerate(transcript, start=1):
        lines.append(
            f"Q{i} ({turn['topic']}): {turn['question']}\n"
            f"Answer: {turn['answer'] if turn['answer'].strip() else '(no answer given)'}\n"
        )
    transcript_text = "\n".join(lines)

    prompt = f"""
You are a senior technical interviewer scoring a completed Data Structures
mock interview (difficulty: {difficulty}).

Full transcript:
{transcript_text}

Score the candidate on a scale of 1 to 10 for each category:
- communication: clarity, structure, how well they explained their thinking
- technical: correctness and depth of Data Structures knowledge
- confidence: decisiveness of tone, avoiding excessive hedging/uncertainty

Also write a short (2-4 sentence) overall summary of strengths and what to
improve.

Respond with ONLY valid JSON, no markdown, no code fences, in this exact shape:
{{
  "communication": 8,
  "technical": 9,
  "confidence": 8,
  "overall": "short summary text"
}}
"""
    raw = _ask_model(prompt, temperature=0.3)
    data = _extract_json(raw)

    def clamp(v):
        try:
            v = int(round(float(v)))
        except (TypeError, ValueError):
            v = 5
        return max(1, min(10, v))

    return {
        "communication": clamp(data.get("communication")),
        "technical": clamp(data.get("technical")),
        "confidence": clamp(data.get("confidence")),
        "overall": str(data.get("overall", "")).strip(),
    }


def _finalize(session_id):
    """Score whatever was answered so far, save it, and remove the
    session from memory."""

    session = SESSIONS.pop(session_id, None)
    if session is None:
        return None

    transcript = session["transcript"]

    if transcript:
        try:
            scores = _score_interview(transcript, session["difficulty"])
        except Exception:
            scores = {
                "communication": 5,
                "technical": 5,
                "confidence": 5,
                "overall": "We couldn't fully score this interview automatically. "
                "Here is your transcript for self-review.",
            }
    else:
        scores = {
            "communication": 0,
            "technical": 0,
            "confidence": 0,
            "overall": "No questions were answered.",
        }

    saved = save_interview_result(
        session.get("email"), session["difficulty"], transcript, scores
    )

    return {
        "communication": scores["communication"],
        "technical": scores["technical"],
        "confidence": scores["confidence"],
        "overall": scores["overall"],
        "transcript": transcript,
        "interviewId": saved["_id"],
    }


# ---------------- START ----------------
@interview.route("/start", methods=["POST"])
def start_interview():
    data = request.json or {}
    email = data.get("email")
    difficulty = data.get("difficulty", "medium")
    num_questions = data.get("numQuestions", DEFAULT_QUESTIONS)

    if difficulty not in DIFFICULTIES:
        difficulty = "medium"

    try:
        num_questions = int(num_questions)
    except (TypeError, ValueError):
        num_questions = DEFAULT_QUESTIONS
    num_questions = max(3, min(10, num_questions))

    topics = TOPIC_POOL.copy()
    random.shuffle(topics)
    if num_questions > len(topics):
        topics = (topics * ((num_questions // len(topics)) + 1))[:num_questions]
    else:
        topics = topics[:num_questions]

    session_id = str(uuid.uuid4())

    try:
        first_question = _generate_question(topics[0], difficulty, [])
    except Exception:
        return jsonify({"message": "AI Tutor is unavailable right now. Please try again."}), 502

    SESSIONS[session_id] = {
        "email": email,
        "difficulty": difficulty,
        "topics": topics,
        "index": 0,
        "current_question": first_question,
        "transcript": [],
    }

    return jsonify({
        "sessionId": session_id,
        "question": first_question,
        "topic": topics[0],
        "questionNumber": 1,
        "totalQuestions": num_questions,
        "finished": False,
    })


# ---------------- ANSWER ----------------
@interview.route("/answer", methods=["POST"])
def answer_interview():
    data = request.json or {}
    session_id = data.get("sessionId")
    answer = str(data.get("answer", ""))

    session = SESSIONS.get(session_id)
    if session is None:
        return jsonify({"message": "Interview session not found or already ended"}), 404

    topics = session["topics"]
    index = session["index"]
    topic = topics[index]
    question = session["current_question"]

    try:
        correct, feedback = _evaluate_answer(topic, question, answer)
    except Exception:
        correct, feedback = False, "Could not evaluate this answer automatically."

    session["transcript"].append({
        "topic": topic,
        "question": question,
        "answer": answer,
        "correct": correct,
        "feedback": feedback,
    })

    next_index = index + 1

    # Interview complete -> score and clean up
    if next_index >= len(topics):
        result = _finalize(session_id)
        return jsonify({
            "feedback": feedback,
            "correct": correct,
            "questionNumber": index + 1,
            "totalQuestions": len(topics),
            "finished": True,
            "nextQuestion": None,
            "scores": result,
        })

    asked_questions = [t["question"] for t in session["transcript"]]
    try:
        next_question = _generate_question(topics[next_index], session["difficulty"], asked_questions)
    except Exception:
        return jsonify({"message": "AI Tutor is unavailable right now. Please try again."}), 502

    session["index"] = next_index
    session["current_question"] = next_question

    return jsonify({
        "feedback": feedback,
        "correct": correct,
        "questionNumber": next_index + 1,
        "totalQuestions": len(topics),
        "finished": False,
        "nextQuestion": next_question,
        "topic": topics[next_index],
        "scores": None,
    })


# ---------------- END (stop early) ----------------
@interview.route("/end", methods=["POST"])
def end_interview():
    data = request.json or {}
    session_id = data.get("sessionId")

    result = _finalize(session_id)
    if result is None:
        return jsonify({"message": "Interview session not found or already ended"}), 404

    return jsonify(result)


# ---------------- HISTORY ----------------
@interview.route("/history", methods=["GET"])
def interview_history():
    email = request.args.get("email")
    if not email:
        return jsonify({"message": "email is required"}), 400

    return jsonify(get_history(email))
