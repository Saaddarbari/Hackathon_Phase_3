# Evolution of Todo - Backend (Phase II)

Python FastAPI backend for full-stack todo application.

## Tech Stack

- Python 3.11+
- FastAPI 0.104+
- SQLModel 0.0.14+
- Pydantic 2.5+
- Alembic 1.13+
- psycopg2 2.9+
- Uvicorn 0.24+

## Database

- Neon Serverless PostgreSQL
- Connection string configured via `.env` file

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── main.py          # FastAPI application
│   │   ├── dependencies.py   # Dependency injection
│   │   ├── routes/
│   │   │   ├── auth.py       # Auth endpoints
│   │   │   └── todos.py      # Todo CRUD endpoints
│   │   └── schemas/
│   │       ├── user.py       # User DTOs
│   │       └── todo.py       # Todo DTOs
│   ├── models/
│   │   ├── user.py           # User model
│   │   └── todo.py           # Todo model
│   ├── services/
│   │   ├── auth_service.py   # Auth business logic
│   │   └── todo_service.py   # Todo business logic
│   └── config/
│       ├── settings.py       # Environment config
│       └── database.py      # Database connection
├── tests/
│   ├── conftest.py
│   ├── unit/
│   ├── integration/
│   └── contract/
├── requirements.txt
├── pyproject.toml
├── alembic/
│   ├── env.py
│   └── versions/
└── Dockerfile
```

## Setup

### Prerequisites

1. Python 3.11+ installed
2. Create virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # OR
   source .venv/bin/activate  # Linux/Mac
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

5. Edit `.env` with your Neon PostgreSQL connection string:
   ```env
   DATABASE_URL=postgresql://neondb_owner:your_password@ep-twilight-breeze-ah8ijng4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-secret-key-change-in-production
   ```

6. Run database migrations:
   ```bash
   alembic upgrade head
   ```

## Running the Application

### Development Server

```bash
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### API Documentation

- OpenAPI Swagger UI: http://localhost:8000/docs
- Interactive API docs: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Authenticate user
- `POST /api/auth/signout` - Sign out user

### Todos

- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create new todo
- `GET /api/todos/{id}` - Get specific todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo
- `PATCH /api/todos/{id}/complete` - Toggle completion

## Health Check

- `GET /health` - Health check endpoint
- `GET /` - API info endpoint

## Authentication

JWT-based authentication with tokens stored in secure HTTP-only cookies.

## Features

- User registration with email/password
- User authentication with email/password
- Todo CRUD operations (Create, Read, Update, Delete)
- Toggle todo completion status
- User data isolation (each user sees only their todos)

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)

## Docker

Build and run container:

```bash
docker build -t todo-backend .
docker run -p 8000:8000 todo-backend
```
