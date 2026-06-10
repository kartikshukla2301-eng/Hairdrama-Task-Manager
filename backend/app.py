from urllib import response

from dotenv import load_dotenv
from supabase import create_client
import os
import requests

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

  response = requests.post(
    "https://api.resend.com/emails",
    headers={
        "Authorization": f"Bearer {os.getenv('RESEND_API_KEY')}",
        "Content-Type": "application/json"
    },
    json={
        "from": "onboarding@resend.dev",
        "to": [to_email],
        "subject": subject,
        "html": body
    }
)

print("STATUS:", response.status_code)
print("BODY:", response.text)

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

    send_email(
        os.getenv("EMAIL_ADDRESS"),
        "Debug Test",
        "Testing Resend"
    )

    return {"message": "Sent"}
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