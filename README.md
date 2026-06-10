# HairDrama Task Manager

A full-stack task management web application built as part of an internship assignment. The project covers the complete cycle of a real-world task management system — user authentication, task creation and assignment, status tracking, email notifications, and a dashboard for monitoring progress.

---

## Project Overview

HairDrama Task Manager is a multi-user task management application where authenticated users can create tasks, assign them to other team members, track completion status, and receive email notifications at key points in the workflow. The backend is built with Flask (Python) and the frontend runs on Next.js. Supabase handles authentication and database storage.

The project was designed to simulate a production-level internship assignment with attention to real-world concerns like authentication flow, relational data design, and transactional email delivery.

---

## Features

- **Google OAuth Authentication** — Users sign in via Google through Supabase Auth. No custom password management is needed, and session handling is taken care of automatically.

- **User Management** — Authenticated users are stored in the database with their profile information. The app tracks which user created or was assigned a task.

- **Task Creation** — Authenticated users can create tasks with a title, description, and deadline. Each task is tied to the creator's account.

- **Task Assignment** — Tasks can be assigned to any registered user. The assigned user receives an email notification informing them of the new task.

- **Status Tracking** — Tasks carry a status of either `Pending` or `Completed`. Assigned users can mark their tasks as completed, which triggers another email to the task creator.

- **Email Notifications** — Automated emails are sent on two events: when a task is assigned and when a task is marked as completed. Emails are dispatched from the Flask backend using Gmail SMTP.

- **Dashboard Analytics** — The main dashboard displays a summary of all tasks — total count, number of pending tasks, and number of completed tasks — giving users a quick overview of workload status.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS |
| Backend | Flask (Python) |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (Google OAuth) |
| Email | Gmail SMTP via Python `smtplib` |
| Deployment | Vercel (frontend), local / any Python host (backend) |

---

## Project Structure

```
hairdrama-task-manager/
│
├── frontend/                   # Next.js application
│   ├── app/
│   │   ├── page.tsx            # Landing / login page
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Main dashboard with analytics
│   │   ├── tasks/
│   │   │   ├── page.tsx        # Task list view
│   │   │   ├── create/
│   │   │   │   └── page.tsx    # Task creation form
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Task detail and status update
│   ├── components/             # Reusable UI components
│   ├── lib/
│   │   └── supabaseClient.ts   # Supabase client initialization
│   └── .env.local              # Frontend environment variables
│
├── backend/                    # Flask application
│   ├── app.py                  # Main Flask app and route definitions
│   ├── email_service.py        # Gmail SMTP email logic
│   ├── supabase_client.py      # Supabase admin client for backend operations
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Backend environment variables
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js >= 18
- Python >= 3.10
- A Supabase project (free tier works)
- A Google Cloud project with OAuth credentials configured
- A Gmail account with an App Password enabled (for SMTP)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hairdrama-task-manager.git
cd hairdrama-task-manager
```

---

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **Authentication → Providers** and enable Google. Add your Google OAuth client ID and secret.
3. Set your site URL and redirect URLs under **Authentication → URL Configuration**.
4. Run the SQL from the [Database Tables](#database-tables) section below in the Supabase SQL editor.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_FLASK_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000`.

---

### 4. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GMAIL_ADDRESS=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
FLASK_SECRET_KEY=any_random_secret_string
```

Start the Flask server:

```bash
python app.py
```

The backend runs at `http://localhost:5000`.

---

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key |
| `NEXT_PUBLIC_FLASK_API_URL` | URL where the Flask backend is running |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `GMAIL_ADDRESS` | Gmail address used to send notifications |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not your regular Gmail password) |
| `FLASK_SECRET_KEY` | Secret key for Flask session management |

> **Note:** Never commit `.env` or `.env.local` files to version control. Both are listed in `.gitignore`.

---

## Database Tables

Run the following SQL in your Supabase SQL editor to create the required tables.

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Row Level Security (RLS) is recommended. At minimum, enable RLS on both tables and write policies that allow authenticated users to read all tasks and update only the tasks assigned to them.

---

## Application Workflow

```
User visits app
    └── Redirected to login page
            └── Clicks "Sign in with Google"
                    └── Supabase OAuth flow completes
                            └── User record created/updated in `users` table
                                    └── Redirected to Dashboard

Dashboard
    ├── Shows total / pending / completed task counts
    └── Link to task list

Task List
    ├── View all tasks with status indicators
    └── Click a task → Task Detail page

Create Task
    ├── Fill in title, description, deadline, assign to user
    └── On submit → Flask API called → task saved → assignment email sent

Task Detail
    ├── View full task information
    └── If assigned to current user → "Mark as Complete" button
            └── Status updated in Supabase → completion email sent to creator
```

---

## Screenshots

> _Screenshots will be added here after deployment. Sections will include: Login Page, Dashboard, Task List, Create Task Form, Task Detail View._

| Screen | Preview |
|---|---|
| Login Page | _Coming soon_ |
| Dashboard | _Coming soon_ |
| Task List | _Coming soon_ |
| Create Task | _Coming soon_ |
| Task Detail | _Coming soon_ |

---

## Future Improvements

- **Role-based access** — Separate admin and member roles with different permissions (e.g., only admins can delete tasks or manage users).
- **Task priority levels** — Add a priority field (Low / Medium / High) and sort tasks accordingly on the dashboard.
- **In-app notifications** — Real-time notifications using Supabase Realtime instead of relying solely on email.
- **Deadline reminders** — Scheduled background job that sends reminder emails for tasks approaching their deadline.
- **Search and filters** — Filter tasks by status, assignee, or deadline range on the task list page.
- **Pagination** — Paginate task lists to handle larger datasets cleanly.
- **Testing** — Add unit tests for Flask API endpoints and integration tests for the auth and task flows.

---

## Author

**Kartik**  
B.Tech CSE — AIMT Lucknow (AKTU), 2023–2027  
[LinkedIn](https://linkedin.com/in/your-profile) · [GitHub](https://github.com/your-username)

---

## License

This project was built as part of an internship evaluation assignment. Feel free to reference the code for learning purposes.
