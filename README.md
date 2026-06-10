# HairDrama Task Manager

A modern task management portal built for team collaboration and workflow tracking.

## Features

* Google OAuth Authentication (Supabase)
* User Management System
* Task Creation & Assignment
* Task Status Tracking
* Pending & Completed Task Dashboard
* Email Notifications
* Responsive Dark Theme UI
* Real-Time Task Updates
* Supabase Database Integration

## Tech Stack

### Frontend

* Next.js 15
* React
* Tailwind CSS
* Supabase Auth
* React Icons

### Backend

* Flask
* Python
* SMTP Email Service

### Database

* Supabase PostgreSQL

## Screenshots

### Login Page

* Secure Google OAuth Login
* Modern Dark Theme Interface

### Dashboard

* Task Assignment
* Task Tracking
* Task Statistics
* Email Notifications

## Installation

### Clone Repository

```bash
git clone https://github.com/kartikshukla2301-eng/Hairdrama-Task-Manager.git
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

## Environment Variables

Frontend (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Backend (.env)

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_KEY=YOUR_SUPABASE_KEY

EMAIL_ADDRESS=YOUR_EMAIL
EMAIL_PASSWORD=YOUR_APP_PASSWORD
```

## Project Structure

```text
HairDrama-Task-Manager/
│
├── frontend/
│   ├── app/
│   ├── lib/
│   └── components/
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
└── README.md
```

## Author

**Kartik Shukla**

Computer Science Engineering Student

Passionate about Full Stack Development, AI and Building Real World Products.

---

Built with ❤️ using Next.js, Flask and Supabase.
