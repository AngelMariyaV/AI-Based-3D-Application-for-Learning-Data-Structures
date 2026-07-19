from flask import Blueprint, request, jsonify
from database import users
import bcrypt
import os
import uuid
from werkzeug.utils import secure_filename

auth = Blueprint("auth", __name__)

UPLOAD_FOLDER = "uploads"


def public_user(user):
    """Shape a Mongo user document into what the frontend should see.
    Never leak the password hash, and always include the per-user
    progress fields so each account's data stays separate."""
    return {
        "id": str(user.get("_id")),
        "name": user.get("name"),
        "email": user.get("email"),
        "profileImage": user.get("profileImage"),
        "visitedTopics": user.get("visitedTopics", []),
        "quizScore": user.get("quizScore") or {},
    }


# ---------------- REGISTER ----------------
@auth.route("/register", methods=["POST"])
def register():

    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")

    image = request.files.get("profileImage")

    if users.find_one({"email": email}):
        return jsonify({"message": "Email already exists"}), 400

    # Generate unique filename
    filename = None

    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"

        image.save(os.path.join(UPLOAD_FOLDER, filename))

    # Hash password
    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    # Save user - every account starts with its own empty progress so
    # one user's activity never shows up under another user's login.
    users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password,
        "profileImage": filename,
        "visitedTopics": [],
        "quizScore": {}
    })

    return jsonify({
        "message": "Registration Successful"
    })


# ---------------- LOGIN ----------------
@auth.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = users.find_one({"email": email})

    if user is None:
        return jsonify({"message": "User not found"}), 404

    if bcrypt.checkpw(password.encode("utf-8"), user["password"]):

        return jsonify({
            "message": "Login Successful",
            **public_user(user)
        })

    return jsonify({"message": "Incorrect Password"}), 401


# ---------------- GET FRESH PROFILE ----------------
# Lets the frontend re-sync a user's own name/photo/progress from the
# database (e.g. on Dashboard/Profile/Progress load), instead of trusting
# whatever another user last left behind in shared browser storage.
@auth.route("/profile", methods=["GET"])
def get_profile():

    email = request.args.get("email")

    if not email:
        return jsonify({"message": "email is required"}), 400

    user = users.find_one({"email": email})

    if user is None:
        return jsonify({"message": "User not found"}), 404

    return jsonify(public_user(user))


# ---------------- UPDATE PROFILE PHOTO ----------------
# Each user uploads/replaces only their OWN photo, matched by their email,
# so different users never overwrite each other's picture.
@auth.route("/profile/photo", methods=["POST"])
def update_profile_photo():

    email = request.form.get("email")
    image = request.files.get("profileImage")

    if not email:
        return jsonify({"message": "email is required"}), 400

    if not image or not image.filename:
        return jsonify({"message": "profileImage file is required"}), 400

    user = users.find_one({"email": email})

    if user is None:
        return jsonify({"message": "User not found"}), 404

    ext = os.path.splitext(secure_filename(image.filename))[1]
    filename = f"{uuid.uuid4()}{ext}"
    image.save(os.path.join(UPLOAD_FOLDER, filename))

    old_filename = user.get("profileImage")

    users.update_one({"email": email}, {"$set": {"profileImage": filename}})

    # Clean up the old photo file so uploads/ doesn't grow forever.
    if old_filename:
        old_path = os.path.join(UPLOAD_FOLDER, old_filename)
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
            except OSError:
                pass

    return jsonify({
        "message": "Profile photo updated",
        "profileImage": filename
    })


# ---------------- MARK TOPIC VISITED ----------------
@auth.route("/progress/visit", methods=["POST"])
def mark_topic_visited():

    data = request.json or {}
    email = data.get("email")
    topic_id = data.get("topicId")

    if not email or not topic_id:
        return jsonify({"message": "email and topicId are required"}), 400

    user = users.find_one({"email": email})

    if user is None:
        return jsonify({"message": "User not found"}), 404

    # addToSet keeps this idempotent and scoped to just this user's doc.
    users.update_one({"email": email}, {"$addToSet": {"visitedTopics": topic_id}})

    updated = users.find_one({"email": email})

    return jsonify({
        "message": "Progress updated",
        "visitedTopics": updated.get("visitedTopics", [])
    })


# ---------------- SAVE QUIZ SCORE (per difficulty level) ----------------
@auth.route("/progress/quiz", methods=["POST"])
def save_quiz_score():

    data = request.json or {}
    email = data.get("email")
    level = data.get("level", "easy")
    score = data.get("score")
    total = data.get("total")

    if not email or score is None or total is None:
        return jsonify({"message": "email, score and total are required"}), 400

    if level not in ("easy", "medium", "hard"):
        return jsonify({"message": "level must be easy, medium or hard"}), 400

    user = users.find_one({"email": email})

    if user is None:
        return jsonify({"message": "User not found"}), 404

    # Defense in depth: even if someone calls this endpoint directly,
    # Medium/Hard can only be recorded once the previous level was
    # passed by 80%+ for THIS same user.
    order = ["easy", "medium", "hard"]
    idx = order.index(level)
    if idx > 0:
        prev_level = order[idx - 1]
        prev_result = (user.get("quizScore") or {}).get(prev_level)
        if not prev_result or prev_result.get("percent", 0) < 80:
            return jsonify({
                "message": f"Score {prev_level.title()} with 80% or higher to unlock {level.title()}"
            }), 403

    import datetime

    percent = round((score / total) * 100) if total else 0

    quiz_entry = {
        "score": score,
        "total": total,
        "percent": percent,
        "date": datetime.datetime.utcnow().isoformat()
    }

    # Stored as quizScore.<level> on THIS user's own document only, so
    # each user's progress through Easy/Medium/Hard stays independent.
    users.update_one({"email": email}, {"$set": {f"quizScore.{level}": quiz_entry}})

    updated = users.find_one({"email": email})

    return jsonify({
        "message": "Quiz score saved",
        "quizScore": updated.get("quizScore", {})
    })
