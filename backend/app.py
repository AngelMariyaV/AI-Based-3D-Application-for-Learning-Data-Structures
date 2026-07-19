from flask import Flask
from flask_cors import CORS
from routes.auth import auth
from flask import send_from_directory
from routes.chatbot import chat
from routes.topics import topics
from routes.interview import interview
app = Flask(__name__)
CORS(app)


app.register_blueprint(auth)
app.register_blueprint(chat)
app.register_blueprint(topics)
app.register_blueprint(interview)
@app.route("/")
def home():
    return {"message": "MongoDB Connected Successfully"}

@app.route("/uploads/<filename>")
def uploaded_file(filename):

    return send_from_directory(
        "uploads",
        filename
    )

if __name__ == "__main__":
    app.run(debug=True)