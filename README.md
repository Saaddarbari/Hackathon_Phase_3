# Hackathon_Phase_2

**Author:** Saad Darbari  
**Project:** Full-stack Todo Application (Phase II)

---

# Smart Todo Manager

Full-stack todo application built with **Python FastAPI backend** and **Next.js frontend**.

## Architecture Overview

This is a monorepo with separate backend and frontend applications:

- **Backend:** Python FastAPI REST API with Neon PostgreSQL
- **Frontend:** Next.js (App Router) with React and TypeScript
- **Database:** Neon Serverless PostgreSQL

## Quick Start

### Prerequisites

1. Python 3.11+
2. Node.js 18+
3. Neon PostgreSQL account

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# OR
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Neon PostgreSQL connection string
alembic upgrade head
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
Frontend Setup
cd frontend
npm install
cp ../.env.example .env
# Edit .env with API URL
npm run dev
Using Docker Compose (Optional)
cp .env.example .env
docker-compose up --build
API Endpoints
Authentication
POST /api/auth/signup - Register new user

POST /api/auth/signin - Authenticate user

POST /api/auth/signout - Sign out user

Todos
GET /api/todos - Get all todos

POST /api/todos - Create new todo

GET /api/todos/{id} - Get specific todo

PUT /api/todos/{id} - Update todo

DELETE /api/todos/{id} - Delete todo

PATCH /api/todos/{id}/complete - Toggle completion

Features
Phase II
Authentication
 User registration & authentication

 JWT-based sessions

 Email validation

 Password rules & duplicate prevention

Todo Management
 Create, view, update, delete todos

 Toggle completion status

 User data isolation

User Stories
Sign Up / Sign In

Create Todo

View Todos

Mark Complete

Edit Todo

Delete Todo

Out of Scope
Password reset / Email verification / Social login

Categories, due dates, reminders, search, bulk operations, undo

User profiles & settings pages

Development Structure
Backend: backend/

Frontend: frontend/

Docs: specs/1-phase2-fullstack/

Technology Stack
Backend
Python 3.11+, FastAPI, SQLModel, Pydantic, Alembic, psycopg2, Uvicorn

Frontend
Next.js, React, TypeScript, Tailwind CSS

Database
Neon Serverless PostgreSQL

Authentication
JWT-based with Python jose library and HTTP-only cookies

License
MIT