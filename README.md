# Evolution of Todo - Phase III

**Agent-First Todo Chatbot with MCP Tools**

[![Phase](https://img.shields.io/badge/Phase-III-blue.svg)](https://github.com)
[![Architecture](https://img.shields.io/badge/Architecture-Agent--First-green.svg)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Ready%20for%20Testing-yellow.svg)](https://github.com)

---

## 🚀 What is Phase III?

Phase III represents a **fundamental architectural evolution** from traditional REST APIs to an **agent-first, MCP-driven system**. Instead of clicking buttons and filling forms, users manage their todos through **natural language conversation** with an AI assistant.

### Key Innovations

- 🤖 **Agent-First**: OpenAI Agents SDK interprets natural language and decides actions
- 🔧 **MCP Tools**: All task mutations occur exclusively through Model Context Protocol tools
- 💬 **Single Chat Endpoint**: One endpoint (`POST /api/{user_id}/chat`) handles all interactions
- 🔄 **Stateless Server**: Conversation context reconstructed from database on every request
- 📊 **Database as Source of Truth**: All state persists in Neon PostgreSQL

### Phase II → Phase III Evolution

| Aspect | Phase II | Phase III |
|--------|----------|-----------|
| **Interface** | Forms & buttons | Natural language chat |
| **API** | REST CRUD endpoints | Single chat endpoint |
| **Logic** | Direct business logic | AI agent decides actions |
| **Mutations** | Direct database writes | MCP tools only |
| **State** | Potentially stateful | Strictly stateless |

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Constitutional Compliance](#constitutional-compliance)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture

### Request Flow

```
User: "Add buy groceries"
    ↓
Frontend Chat Interface
    ↓
POST /api/{user_id}/chat
    ↓
Chat Endpoint (FastAPI)
    ↓
Load Conversation History from Database
    ↓
Agent Service (OpenAI Agents SDK)
    ↓
Interpret Intent: "User wants to create a task"
    ↓
Call MCP Tool: add_task(title="buy groceries")
    ↓
Database: INSERT INTO todos...
    ↓
Return: {task_id, title, created_at}
    ↓
Agent: "I've added 'buy groceries' to your list!"
    ↓
Persist Response to Database
    ↓
Return to User
```

### Core Components

**1. Agent Service** (`backend/src/services/agent.py`)
- Interprets natural language using OpenAI Agents SDK
- Decides which MCP tools to call
- Sequences multiple tool calls when needed
- Generates user-friendly responses

**2. MCP Server** (`backend/src/mcp/server.py`)
- Exposes 5 tools: add_task, list_tasks, complete_task, update_task, delete_task
- All tools are stateless and database-persistent
- Input/output validation with Pydantic schemas

**3. Chat Endpoint** (`backend/src/api/chat.py`)
- Single endpoint for all user interactions
- Implements stateless conversation cycle
- Reconstructs context from database on every request

**4. Chat Interface** (`frontend/src/components/ChatInterface.tsx`)
- Natural language input
- Message history display
- Loading and error states

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Neon PostgreSQL account
- OpenAI API key

### 1. Clone Repository

```bash
git clone <repository-url>
cd Phase_2_frontend
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials:
# - DATABASE_URL (Neon PostgreSQL)
# - OPENAI_API_KEY (OpenAI)
# - JWT_SECRET (random string)

# Apply database migrations
alembic upgrade head

# Start backend server
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp ../.env.example .env
# Edit .env with:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start frontend dev server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 4. Create Account & Start Chatting

1. Navigate to `http://localhost:3000`
2. Click "Get Started" to create an account
3. Sign in with your credentials
4. You'll be redirected to `/chat`
5. Start managing your todos through conversation!

---

## 💬 Usage Examples

### Creating Tasks

```
You: "Add buy groceries"
Assistant: "I've added 'buy groceries' to your list!"

You: "Remind me to call mom tomorrow"
Assistant: "I've added 'call mom tomorrow' to your list!"

You: "Add finish report and review code"
Assistant: "I've added two tasks: 'finish report' and 'review code'!"
```

### Listing Tasks

```
You: "Show my tasks"
Assistant: "Here's your task list:
1. Buy groceries
2. Call mom tomorrow
3. Finish report
4. Review code"

You: "What do I need to do?"
Assistant: "You have 4 tasks. 2 are completed, 2 are still pending."
```

### Completing Tasks

```
You: "Mark buy groceries as done"
Assistant: "Great! I've marked 'buy groceries' as complete."

You: "Complete the first one"
Assistant: "I've marked 'buy groceries' as complete!"

You: "I finished calling mom"
Assistant: "Awesome! I've marked 'call mom tomorrow' as complete."
```

### Updating Tasks

```
You: "Change buy groceries to buy organic groceries"
Assistant: "I've updated the task to 'buy organic groceries'!"

You: "Update the first task to include milk"
Assistant: "I've updated 'buy groceries' to 'buy groceries and milk'!"
```

### Deleting Tasks

```
You: "Delete buy groceries"
Assistant: "I've removed 'buy groceries' from your list."

You: "Remove the second task"
Assistant: "I've deleted 'call mom tomorrow'."
```

### Ambiguous Commands

```
You: "groceries"
Assistant: "Would you like me to add 'groceries' as a task to your list?"

You: "Mark the first one as done"
Assistant: "Let me show you your tasks first:
1. Buy groceries
2. Call mom
Which one would you like to mark as complete?"
```

---

## 🛠️ Technology Stack

### Backend

- **Python 3.11+** - Programming language
- **FastAPI** - Web framework
- **OpenAI Agents SDK** - AI orchestration
- **MCP SDK** - Model Context Protocol
- **SQLModel** - ORM (built on SQLAlchemy + Pydantic)
- **Alembic** - Database migrations
- **Neon PostgreSQL** - Serverless database
- **Better Auth** - Authentication
- **Pydantic** - Data validation

### Frontend

- **Next.js 14** - React framework (App Router)
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Infrastructure

- **Neon** - Serverless PostgreSQL hosting
- **Vercel** - Frontend hosting (recommended)
- **Any Python host** - Backend hosting (Railway, Render, etc.)

---

## 📁 Project Structure

```
Phase_2_frontend/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── main.py              # FastAPI app (Phase III)
│   │   │   ├── chat.py              # Single chat endpoint
│   │   │   ├── routes/
│   │   │   │   └── auth.py          # Authentication routes
│   │   │   └── schemas/
│   │   │       └── chat.py          # Chat request/response schemas
│   │   ├── models/
│   │   │   ├── user.py              # User model
│   │   │   ├── todo.py              # Todo model
│   │   │   ├── conversation.py      # Conversation model (NEW)
│   │   │   └── message.py           # Message model (NEW)
│   │   ├── services/
│   │   │   ├── auth.py              # Auth service
│   │   │   └── agent.py             # Agent orchestration (NEW)
│   │   ├── mcp/                     # MCP infrastructure (NEW)
│   │   │   ├── server.py            # MCP server
│   │   │   └── tools/               # MCP tools
│   │   │       ├── base.py          # Base tool class
│   │   │       ├── add_task.py      # Create task tool
│   │   │       ├── list_tasks.py    # List tasks tool
│   │   │       ├── complete_task.py # Complete task tool
│   │   │       ├── update_task.py   # Update task tool
│   │   │       └── delete_task.py   # Delete task tool
│   │   └── config/
│   │       ├── database.py          # Database connection
│   │       └── settings.py          # App settings
│   ├── alembic/                     # Database migrations
│   ├── tests/                       # Tests (to be written)
│   ├── requirements.txt             # Python dependencies
│   └── pyproject.toml               # Python project config
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── chat/
│   │   │   │   └── page.tsx         # Chat page (NEW)
│   │   │   ├── signin/
│   │   │   │   └── page.tsx         # Sign in page
│   │   │   ├── signup/
│   │   │   │   └── page.tsx         # Sign up page
│   │   │   ├── todos/
│   │   │   │   └── page.tsx         # Deprecated (redirects to chat)
│   │   │   ├── layout.tsx           # Root layout
│   │   │   └── page.tsx             # Landing page
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx    # Chat UI (NEW)
│   │   │   └── layout/
│   │   │       ├── Header.tsx       # Public header
│   │   │       └── AuthenticatedHeader.tsx  # Auth header (NEW)
│   │   └── services/
│   │       └── chat.ts              # Chat API client (NEW)
│   ├── package.json                 # Node dependencies
│   └── tsconfig.json                # TypeScript config
├── specs/                           # Spec-Kit Plus specifications
│   ├── 1-phase2-fullstack/          # Phase II specs
│   └── 2-phase3-agentic-mcp/        # Phase III specs (NEW)
│       ├── spec.md                  # Feature specification
│       ├── plan.md                  # Implementation plan
│       └── tasks.md                 # Task breakdown
├── history/                         # Prompt History Records
│   └── prompts/
│       ├── constitution/            # Constitution-related prompts
│       └── 2-phase3-agentic-mcp/    # Phase III prompts
├── .specify/                        # SpecKit Plus templates
├── CLAUDE.md                        # Claude Code rules
├── IMPLEMENTATION_PROGRESS.md       # Backend progress
├── FRONTEND_IMPLEMENTATION.md       # Frontend progress
├── PHASE_III_COMPLETE.md           # Complete summary
└── README.md                        # This file
```

---

## ⚖️ Constitutional Compliance

Phase III strictly adheres to the constitutional requirements defined in `.specify/memory/constitution.md`:

### Non-Negotiable Rules

✅ **Stateless Server** - No in-memory session, cache, or global variables
✅ **Database as Source of Truth** - All state in Neon PostgreSQL
✅ **Single Chat Entry Point** - Only `POST /api/{user_id}/chat`
✅ **Agent-First Design** - No direct business logic in API layer
✅ **MCP as Only Mutation Layer** - All task operations via MCP tools
✅ **Stateless MCP Tools** - Accept parameters, persist to DB, return structured outputs
✅ **Required MCP Tools** - All 5 tools implemented (add, list, complete, update, delete)
✅ **Stateless Conversation Cycle** - Reconstruct context from DB on every request
✅ **Conversation Persistence** - Every message stored in database
✅ **Technology Lock** - FastAPI, OpenAI SDK, MCP SDK, SQLModel, Neon, Better Auth

### Verification

Run constitutional compliance checks:

```bash
# Verify no REST CRUD endpoints exist
curl http://localhost:8000/api/todos  # Should return 404

# Verify only chat endpoint exists
curl http://localhost:8000/api/{user_id}/chat  # Should work

# Verify server is stateless (same input = same output)
# Send same message twice, should get consistent responses
```

---

## 🔧 Development

### Running Tests

```bash
# Backend tests (to be written)
cd backend
pytest

# Frontend tests (to be written)
cd frontend
npm test
```

### Database Migrations

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

### Code Quality

```bash
# Backend linting
cd backend
black src/  # Format code
mypy src/   # Type checking

# Frontend linting
cd frontend
npm run lint
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Sign out
- [ ] Redirect to signin when not authenticated

**Task Creation:**
- [ ] "Add buy groceries" creates task
- [ ] "Remind me to call mom" creates task
- [ ] Multiple tasks in one message
- [ ] Vague input triggers clarification

**Task Listing:**
- [ ] "Show my tasks" displays all tasks
- [ ] "What do I need to do?" displays tasks
- [ ] Empty list shows friendly message
- [ ] Filter by completed/incomplete

**Task Completion:**
- [ ] "Mark buy groceries as done" completes task
- [ ] "Complete the first one" completes task
- [ ] Ambiguous reference asks for clarification

**Task Updates:**
- [ ] "Change X to Y" updates task title
- [ ] "Update task 1 to Z" updates task

**Task Deletion:**
- [ ] "Delete buy groceries" removes task
- [ ] "Remove the first one" removes task
- [ ] "Clear my list" asks for confirmation

**Conversation Context:**
- [ ] "Also add eggs" after "Add milk" works
- [ ] "Mark the first one as done" after listing works
- [ ] Agent remembers previous context

**Error Handling:**
- [ ] Invalid commands show friendly errors
- [ ] Network errors display properly
- [ ] OpenAI API errors handled gracefully

### Automated Testing (To Be Implemented)

```bash
# Unit tests for MCP tools
pytest backend/tests/unit/test_add_task.py
pytest backend/tests/unit/test_list_tasks.py
pytest backend/tests/unit/test_complete_task.py
pytest backend/tests/unit/test_update_task.py
pytest backend/tests/unit/test_delete_task.py

# Integration tests for chat flow
pytest backend/tests/integration/test_chat_flow.py

# End-to-end tests
pytest backend/tests/e2e/test_full_conversation.py
```

---

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. **Prepare Environment Variables:**
   ```
   DATABASE_URL=postgresql://...
   OPENAI_API_KEY=sk-...
   JWT_SECRET=...
   ```

2. **Deploy:**
   ```bash
   # Railway
   railway up

   # Render
   # Connect GitHub repo and configure build command:
   pip install -r backend/requirements.txt
   # Start command:
   uvicorn src.api.main:app --host 0.0.0.0 --port $PORT
   ```

3. **Apply Migrations:**
   ```bash
   railway run alembic upgrade head
   # or
   render run alembic upgrade head
   ```

### Frontend Deployment (Vercel)

1. **Configure Environment:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Domain:**
   - Set up custom domain in Vercel dashboard
   - Update CORS settings in backend

---

## 🐛 Troubleshooting

### Backend Issues

**"OpenAI API key not configured"**
- Ensure `OPENAI_API_KEY` is set in `.env`
- Restart backend server after adding key

**"Database connection failed"**
- Verify `DATABASE_URL` in `.env`
- Check Neon database is running
- Ensure migrations are applied: `alembic upgrade head`

**"MCP tool not found"**
- Check tool is registered in `backend/src/mcp/server.py`
- Verify tool class is imported correctly

### Frontend Issues

**"Failed to send message"**
- Check backend is running on correct port
- Verify `NEXT_PUBLIC_API_URL` in `.env`
- Check browser console for CORS errors

**"Not authenticated"**
- Clear browser cookies
- Sign in again
- Check Better Auth configuration

**"Chat not loading"**
- Check authentication endpoint is working
- Verify user session is valid
- Check browser console for errors

### Common Errors

**"Conversation not found"**
- This is normal for first message (creates new conversation)
- Check database has conversations table

**"Task not found"**
- Verify task ID is correct
- Check user owns the task
- Ensure task wasn't already deleted

---

## 📚 Additional Resources

- [Phase III Specification](specs/2-phase3-agentic-mcp/spec.md)
- [Implementation Plan](specs/2-phase3-agentic-mcp/plan.md)
- [Task Breakdown](specs/2-phase3-agentic-mcp/tasks.md)
- [Implementation Progress](IMPLEMENTATION_PROGRESS.md)
- [Frontend Implementation](FRONTEND_IMPLEMENTATION.md)
- [Complete Summary](PHASE_III_COMPLETE.md)
- [Constitution](CLAUDE.md)

---

## 🤝 Contributing

This is a hackathon project demonstrating agent-first architecture. Contributions welcome!

### Development Workflow

1. Read the constitution (`CLAUDE.md`)
2. Follow Spec-Kit Plus methodology
3. Create specification → plan → tasks → implement
4. Ensure constitutional compliance
5. Write tests
6. Submit PR

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👤 Author

**Saad Darbari**
- Hackathon Phase III Implementation
- Agent-First Architecture Design

---

## 🎯 Project Status

**Phase III Status**: ✅ **Implementation Complete - Ready for Testing**

**Next Steps:**
1. Apply database migrations
2. Configure OpenAI API key
3. Run end-to-end tests
4. Deploy to production
5. Collect user feedback

---

**Built with ❤️ using Claude Code and Spec-Kit Plus methodology**
