from flask import Blueprint, jsonify
from database import db

topics = Blueprint("topics", __name__)

@topics.route("/topics", methods=["GET"])
def get_topics():
    data = list(db["topics"].find({}, {"_id": 0}))
    return jsonify(data)