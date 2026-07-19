from flask import Blueprint, request, jsonify
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

chat = Blueprint("chat", __name__)

@chat.route("/chat", methods=["POST"])
def chatbot():

    data = request.json
    question = data.get("question")

    prompt = f"""
You are an expert Data Structure teacher.

Explain in simple English.

Format:

Definition

Working

Operations

Time Complexity

Real-life Example

Interview Tip

Rules:
- Answer only Data Structure questions.
- Maximum 200 words.
- Use bullet points.
- If question is outside Data Structures, politely refuse.

Question:
{question}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    answer = completion.choices[0].message.content

    return jsonify({
        "answer": answer
    })