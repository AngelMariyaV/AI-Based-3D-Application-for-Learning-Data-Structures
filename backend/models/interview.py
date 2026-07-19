"""
Data access layer for AI Mock Interview results.

Each finished interview is saved as one document in the "interviews"
Mongo collection, scoped to the user's email so history and progress
never leak between different accounts.
"""

import datetime
from database import db

interviews = db["interviews"]


def save_interview_result(email, difficulty, transcript, scores):
    """Persist one completed interview and return the saved document
    (with a JSON-friendly string _id)."""

    doc = {
        "email": email,
        "difficulty": difficulty,
        "transcript": transcript,  # list of {question, answer, feedback, correct}
        "communication": scores.get("communication"),
        "technical": scores.get("technical"),
        "confidence": scores.get("confidence"),
        "overall": scores.get("overall"),
        "createdAt": datetime.datetime.utcnow().isoformat(),
    }

    result = interviews.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


def get_history(email, limit=10):
    """Return this user's most recent interviews, newest first."""

    if not email:
        return []

    docs = list(
        interviews.find({"email": email}).sort("createdAt", -1).limit(limit)
    )
    for d in docs:
        d["_id"] = str(d["_id"])
    return docs
