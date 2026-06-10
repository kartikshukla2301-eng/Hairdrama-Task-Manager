from dotenv import load_dotenv
from supabase import create_client
import os
import smtplib
from email.mime.text import MIMEText

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

tasks = []

def send_email(to_email, subject, body):
    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = os.getenv("EMAIL_ADDRESS")
    msg["To"] = to_email

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()

    server.login(
        os.getenv("EMAIL_ADDRESS"),
        os.getenv("EMAIL_PASSWORD")
    )

    server.send_message(msg)
    server.quit()


@app.route("/")
def home():
    return {"message": "API Running"}


@app.route("/test-email")
def test_email():

    send_email(
        os.getenv("EMAIL_ADDRESS"),
        "HairDrama Test",
        "Email notification system working."
    )

    return {"message": "Email Sent"}


@app.route("/send-task-email", methods=["POST"])
def send_task_email():

    data = request.json

    send_email(
        data["email"],
        "New Task Assigned",
        f"You have been assigned a task: {data['title']}"
    )

    return {"message": "Email Sent"}


@app.route("/task-completed-email", methods=["POST"])
def task_completed_email():

    data = request.json

    send_email(
        data["email"],
        "Task Completed",
        f"Task Completed: {data['title']}"
    )

    return {"message": "Email Sent"}


@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

@app.route("/debug-email")
def debug_email():
    return {
        "email": os.getenv("EMAIL_ADDRESS"),
        "password_exists": bool(os.getenv("EMAIL_PASSWORD"))
    }
@app.route("/tasks", methods=["POST"])
def create_task():

    data = request.json

    task = {
        "title": data["title"],
        "description": data["description"],
        "assigned_to": data["assigned_to"],
        "status": "pending"
    }

    tasks.append(task)

    return jsonify(task)


if __name__ == "__main__":
    app.run(debug=True)