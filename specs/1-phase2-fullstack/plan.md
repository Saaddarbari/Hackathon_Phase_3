# Implementation Plan: Phase II - Full-Stack Web Application

**Branch**: `1-phase2-fullstack` | **Date**: 2026-01-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/1-phase2-fullstack/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Phase II transforms the Evolution of Todo application from an in-memory console app to a full-stack web application. This involves implementing user authentication via Better Auth, building a Python REST API backend with Neon PostgreSQL persistence, and creating a responsive Next.js frontend with React and TypeScript. The application will support user signup/signin, and enable authenticated users to create, view, edit, delete, and toggle completion status of their todos.

## Technical Context

**Language/Version**:
- Backend: Python 3.11+
- Frontend: TypeScript 5.0+

**Primary Dependencies**:
- Backend: FastAPI (REST API framework), Better Auth (authentication), SQLModel (ORM), Pydantic (validation)
- Frontend: Next.js (App Router), React 18+, Better Auth client SDK
- Database: Neon Serverless PostgreSQL

**Storage**: Neon Serverless PostgreSQL (PostgreSQL 15+)

**Testing**:
- Backend: pytest with httpx for API testing
- Frontend: Vitest with React Testing Library

**Target Platform**:
- Backend: Linux server (containerized)
- Frontend: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)

**Project Type**: web (full-stack application with separate frontend and backend)

**Performance Goals**:
- API response time: p95 < 2 seconds
- Page load time: p95 < 3 seconds
- Support up to 1000 concurrent users

**Constraints**:
- No AI/ML features
- No background job processing
- No real-time features
- No websockets
- No email notifications
- No social login
- No role-based access control
- No undo functionality

**Scale/Scope**:
- User accounts: up to 10,000
- Todos per user: up to 1,000
- APIs: 5 core endpoints + 4 auth endpoints
- Frontend pages: 7 (signup, signin, todos, create, edit, delete, toggle)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**CONSTITUTION STATUS**: Constitution is in template form with placeholders. Proceeding based on user-defined Phase II technology matrix requirements:

**Phase II Technology Requirements** (from user input):
- Backend: Python REST API
- Database: Neon Serverless PostgreSQL
- ORM/Data layer: SQLModel or equivalent
- Frontend: Next.js (React, TypeScript)
- Authentication: Better Auth (signup/signin)
- Architecture: Full-stack web application

**Phase Constraints**:
- Authentication is allowed starting Phase II
- Web frontend is allowed starting Phase II
- Neon PostgreSQL is allowed starting Phase II
- No AI or agent frameworks until later phases

**Compliance Assessment**:
- ✅ Uses Python REST API for backend
- ✅ Uses Neon Serverless PostgreSQL for persistence
- ✅ Uses SQLModel for data layer
- ✅ Uses Next.js with React and TypeScript for frontend
- ✅ Uses Better Auth for authentication
- ✅ Implements full-stack web application architecture
- ✅ No AI or agent frameworks included
- ⚠️ Constitution needs to be updated to formalize these Phase II technology requirements

**Gate Status**: **PASS** - Plan aligns with Phase II requirements defined by user. Constitution update recommended to formalize technology matrix.

## Project Structure

### Documentation (this feature)

```text
specs/1-phase2-fullstack/
├── spec.md              # Feature specification
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── openapi.yaml     # API specification
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── dependencies.py   # Dependency injection (auth, db session)
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py       # Signup, signin endpoints
│   │   │   └── todos.py      # CRUD endpoints for todos
│   │   └── schemas/
│   │       ├── __init__.py
│   │       ├── user.py       # User DTOs (signup, signin requests/responses)
│   │       └── todo.py       # Todo DTOs (create, update, response)
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py           # User SQLAlchemy/SQLModel definition
│   │   └── todo.py           # Todo SQLAlchemy/SQLModel definition
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py   # Authentication business logic
│   │   └── todo_service.py   # Todo CRUD business logic
│   └── config/
│       ├── __init__.py
│       └── settings.py       # Environment configuration (DB URL, etc.)
├── tests/
│   ├── __init__.py
│   ├── conftest.py           # Pytest fixtures
│   ├── unit/                 # Unit tests for services
│   ├── integration/          # Integration tests for API endpoints
│   └── contract/             # Contract tests for data models
├── alembic/                  # Database migrations
│   ├── versions/
│   └── env.py
├── requirements.txt          # Python dependencies
├── pyproject.toml            # Project metadata and pytest config
└── Dockerfile                # Backend container definition

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with auth provider
│   │   ├── page.tsx          # Landing page (redirects to signin)
│   │   ├── signup/
│   │   │   └── page.tsx      # Signup page
│   │   ├── signin/
│   │   │   └── page.tsx      # Signin page
│   │   ├── todos/
│   │   │   ├── page.tsx      # Todos list page
│   │   │   ├── components/
│   │   │   │   ├── TodoList.tsx       # Display all todos
│   │   │   │   ├── TodoItem.tsx       # Single todo with actions
│   │   │   │   ├── CreateTodoForm.tsx # Form to add new todo
│   │   │   │   └── EmptyState.tsx    # Display when no todos
│   │   │   └── hooks/
│   │   │       └── useTodos.ts        # Custom hook for todo API calls
│   │   └── todos/[id]/
│   │       └── edit/
│   │           └── page.tsx  # Edit todo page
│   ├── components/
│   │   ├── ui/               # Reusable UI components (buttons, forms, inputs)
│   │   ├── auth/              # Authentication-specific components
│   │   └── layout/            # Navigation, header, footer
│   ├── lib/
│   │   ├── api/              # API client functions
│   │   │   ├── auth.ts       # Auth API calls
│   │   │   └── todos.ts      # Todo API calls
│   │   └── utils/            # Helper utilities
│   └── types/                # TypeScript type definitions
│       └── index.d.ts
├── tests/
│   ├── __init__.py
│   ├── unit/                 # Component unit tests
│   └── e2e/                  # End-to-end tests (if applicable)
├── package.json              # Node.js dependencies
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── Dockerfile                # Frontend container definition

docker-compose.yml            # Local development orchestration
.env.example                 # Environment variable template
README.md                     # Project overview and setup instructions
```

**Structure Decision**: This is a monorepo structure with separate `backend/` and `frontend/` directories. The backend uses Python with FastAPI following standard web application patterns (routes, services, models, schemas). The frontend uses Next.js App Router with React components organized by feature (auth, todos). This separation allows independent development, testing, and deployment while maintaining clear ownership boundaries. Database migrations are managed via Alembic in the backend directory.

## Architecture Overview

### Backend Architecture

The backend follows a layered architecture pattern to separate concerns:

**1. API Layer (`api/`)**
- **Purpose**: HTTP request handling and response formatting
- **Responsibilities**:
  - Define RESTful endpoints for authentication and todo operations
  - Validate incoming requests using Pydantic schemas
  - Map HTTP requests to service layer methods
  - Return appropriate HTTP status codes and error messages
- **Structure**:
  - `main.py`: FastAPI application instance, middleware, CORS configuration
  - `dependencies.py`: Dependency injection for authentication context and database sessions
  - `routes/auth.py`: POST /signup, POST /signin
  - `routes/todos.py`: POST /todos, GET /todos, PUT /todos/{id}, DELETE /todos/{id}, PATCH /todos/{id}/complete

**2. Service Layer (`services/`)**
- **Purpose**: Business logic and orchestration
- **Responsibilities**:
  - `auth_service.py`: User registration, authentication, session management
  - `todo_service.py`: Todo CRUD operations with ownership enforcement
  - Enforce business rules (e.g., users can only access their own todos)
  - Handle errors and translate to appropriate exceptions
- **Design**: Stateless services that accept context (user, session) as parameters

**3. Data Layer (`models/`)**
- **Purpose**: Data persistence and entity definitions
- **Responsibilities**:
  - `models/user.py`: User table definition with SQLModel
  - `models/todo.py`: Todo table definition with SQLModel
  - Define relationships (User → Todos: One-to-Many)
  - Provide query methods for data access
- **ORM**: SQLModel provides type-safe database models

**4. Configuration Layer (`config/`)**
- **Purpose**: Environment-based configuration
- **Responsibilities**:
  - Load database connection string from environment
  - Configure Better Auth settings
  - Define application settings (API base path, CORS origins)

**Authentication Integration**:
- Better Auth integrated into FastAPI via dependency injection
- Auth middleware validates session tokens on protected routes
- User context attached to request via `Depends(auth.get_current_user)`
- Session tokens stored in secure HTTP-only cookies

**Error Handling Strategy**:
- Input validation: Pydantic schemas validate request bodies, return 400 on failure
- Authentication errors: 401 Unauthorized for missing/invalid credentials
- Authorization errors: 403 Forbidden for accessing other users' todos
- Not found errors: 404 Not Found for non-existent resources
- Server errors: 500 Internal Server Error with generic message for unexpected failures
- All error responses include a JSON body with `{"detail": "error message"}`

**API Response Format**:
- Success responses: 200 OK with JSON body containing requested data
- Created responses: 201 Created with JSON body containing created resource
- No content responses: 204 No Content (DELETE operations)
- Error responses: Appropriate 4xx/5xx status with `{"detail": "error message"}`

### Frontend Architecture

The frontend follows Next.js App Router conventions with React component patterns:

**1. Page Routing (`app/`)**
- **Purpose**: Route definitions and page-level components
- **Structure**:
  - `/`: Landing page (redirects to `/signin`)
  - `/signup`: User registration form
  - `/signin`: User authentication form
  - `/todos`: Protected page displaying user's todos
  - `/todos/[id]/edit`: Protected page to edit a specific todo
- **Protection**: Middleware or route-level checks redirect unauthenticated users to `/signin`

**2. Component Organization (`components/`)**
- **ui/**: Reusable generic components (Button, Input, Form, Card, Modal)
- **auth/**: Authentication-specific forms (SignupForm, SigninForm)
- **layout/**: Application-wide components (Header, Navigation, Footer)
- **Feature components**: Organized by feature (`todos/components/`)

**3. API Client Layer (`lib/api/`)**
- **Purpose**: Centralized HTTP client for backend communication
- **Responsibilities**:
  - `auth.ts`: Functions for signup, signin, signout
  - `todos.ts`: Functions for CRUD operations on todos
  - Handle authentication headers (cookies)
  - Parse responses and throw errors for HTTP failures
- **Implementation**: Uses `fetch` API or lightweight HTTP client

**4. Custom Hooks (`hooks/`)**
- **Purpose**: Encapsulate stateful logic and data fetching
- **Example**:
  - `useTodos.ts`: Fetch, create, update, delete todos with optimistic updates
  - `useAuth.ts`: Manage authentication state and redirect logic
- **Design**: Follows React hooks patterns (state, effects, memoization)

**Authentication State Handling**:
- Auth state managed via React Context or Zustand
- Session token stored in secure HTTP-only cookies (managed by Better Auth client)
- Auth provider wraps application at root layout
- Protected pages check auth status on mount, redirect to `/signin` if unauthenticated
- Signout clears auth state and redirects to `/signin`

**Responsive UI Strategy**:
- CSS-in-JS with Tailwind CSS or CSS Modules for component styling
- Mobile-first design with breakpoints (sm: 640px, md: 768px, lg: 1024px)
- Fluid layouts using Flexbox and CSS Grid
- Touch-friendly button and form input sizes on mobile devices
- Responsive navigation: Hamburger menu on mobile, horizontal links on desktop
- Images and media use `max-width: 100%` to prevent overflow

**State Management Approach**:
- Local component state: React `useState` for UI state (forms, modals)
- Server state: Custom hooks wrapping fetch API (no heavy state management library)
- Auth state: React Context or Zustand for global auth state
- No global Redux/Zustand for feature data (keep it simple for Phase II)

**API Communication Strategy**:
- All API calls go through `lib/api/` client functions
- Authentication: Cookies handled automatically by browser, no manual token injection
- Error handling: Try/catch blocks in hooks, display error messages via UI
- Loading states: Hooks return `{ data, loading, error }` for UI feedback
- Optimistic updates: For delete/complete operations, update UI immediately then refetch

### Database Architecture

**1. Data Models**

**User Model**:
```python
fields:
  - id: UUID (primary key)
  - email: String (unique, indexed)
  - password_hash: String (bcrypt)
  - created_at: DateTime (auto-generated)
  - updated_at: DateTime (auto-updated)
```

**Todo Model**:
```python
fields:
  - id: UUID (primary key)
  - user_id: UUID (foreign key to User.id, indexed)
  - title: String (not null, max length)
  - description: String (nullable)
  - completed: Boolean (default false)
  - created_at: DateTime (auto-generated)
  - updated_at: DateTime (auto-updated)

relationships:
  - belongs_to: User (many-to-one)
  - user has many: Todos (one-to-many)

indexes:
  - (user_id, created_at) for efficient user todo queries
  - (user_id, completed) for filtering by completion status
```

**2. Data Ownership Strategy**
- Each todo includes `user_id` foreign key referencing the owner
- All todo queries filter by `user_id = current_user.id`
- API endpoints enforce ownership at service layer before database operations
- Foreign key constraint ensures referential integrity
- Index on `user_id` ensures efficient filtering

**3. Migration Management**
- Alembic for database migrations
- Migration files in `backend/alembic/versions/`
- Initial migration creates users and todos tables with constraints
- Migration scripts are version-controlled and applied in order
- Development: Migrations applied locally via `alembic upgrade head`
- Production: Migrations applied as part of deployment process

### Integration Architecture

**1. Frontend ↔ Backend Communication Flow**

```
User Action (Browser)
    ↓
Frontend Component (React)
    ↓
API Client Function (lib/api/*.ts)
    ↓
HTTP Request (fetch)
    ↓
Backend API Route (FastAPI)
    ↓
Service Layer (Business Logic)
    ↓
Data Layer (SQLModel + PostgreSQL)
    ↓
Response (JSON)
    ↓
Frontend Component (Update UI)
```

**Request/Response Flow Examples**:

**Create Todo**:
```
Frontend: POST http://localhost:8000/api/todos
  Headers: Cookie: session_token=...
  Body: { "title": "Buy groceries", "description": "Milk, eggs, bread" }

Backend:
  1. Dependency: auth.get_current_user validates session token → User object
  2. Route: validate request body via TodoCreate schema
  3. Service: todo_service.create_todo(user, todo_data) → Todo object
  4. Response: 201 Created { "id": "...", "title": "...", ... }

Frontend: Update UI state with returned todo
```

**View Todos**:
```
Frontend: GET http://localhost:8000/api/todos
  Headers: Cookie: session_token=...

Backend:
  1. Dependency: auth.get_current_user validates session token → User object
  2. Service: todo_service.get_todos(user.id) → list of Todo objects
  3. Response: 200 OK [{ "id": "...", "title": "...", ... }, ...]

Frontend: Display todo list component
```

**Auth Token/Session Flow**:

**Signup Flow**:
```
1. User submits signup form → Frontend calls POST /api/signup
2. Backend: auth_service.register_user(email, password)
   - Hash password with bcrypt
   - Create user record in database
   - Create session token via Better Auth
   - Return user info and session cookie
3. Frontend: Set session cookie (HTTP-only, secure)
4. Frontend: Redirect to /signin or /todos (based on auth flow)
```

**Signin Flow**:
```
1. User submits signin form → Frontend calls POST /api/signin
2. Backend: auth_service.authenticate_user(email, password)
   - Find user by email
   - Verify password hash with bcrypt
   - Create session token via Better Auth
   - Return user info and session cookie
3. Frontend: Set session cookie (HTTP-only, secure)
4. Frontend: Update auth state, redirect to /todos
```

**Protected Route Access**:
```
1. User navigates to /todos
2. Frontend: Middleware or page component checks auth state
3. If not authenticated → redirect to /signin
4. If authenticated → render todos page
5. Page loads: GET /api/todos with session cookie
6. Backend: auth.get_current_user validates session token
7. If valid → return user's todos
8. If invalid → return 401, frontend redirects to /signin
```

**2. Local Development Setup**

**Prerequisites**:
- Python 3.11+ installed
- Node.js 18+ installed
- Docker and Docker Compose installed (for PostgreSQL)
- Neon PostgreSQL account with database URL

**Backend Setup**:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env: DATABASE_URL="postgresql://...", JWT_SECRET="..."
alembic upgrade head  # Run migrations
uvicorn src.api.main:app --reload  # Start dev server on http://localhost:8000
```

**Frontend Setup**:
```bash
cd frontend
npm install
cp ../.env.example .env
# Edit .env: NEXT_PUBLIC_API_URL="http://localhost:8000/api"
npm run dev  # Start dev server on http://localhost:3000
```

**Database Setup (Neon PostgreSQL)**:
1. Create Neon account and database at https://neon.tech
2. Get connection string from Neon dashboard
3. Set `DATABASE_URL` in `.env` file
4. Run backend migrations: `alembic upgrade head`

**Orchestration with Docker Compose (Optional)**:
```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000/api

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://...
      - JWT_SECRET=...

  # Note: Neon is cloud-hosted, so no local PostgreSQL container needed
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | Constitution check passed with recommendations |

**Note**: Constitution needs to be updated to formalize Phase II technology matrix. This is a documentation gap, not a violation.

## Open Questions / Needs Clarification

None. All technical decisions specified by user requirements or derived from industry standards for this scope.

## Non-Functional Design Decisions

**Security**:
- Passwords hashed with bcrypt (work factor 12)
- Session tokens stored in HTTP-only, secure, SameSite cookies
- CSRF protection enabled (Better Auth default)
- SQL injection prevention via parameterized queries (SQLModel)
- CORS configured for allowed origins in development and production

**Performance**:
- Database indexes on `user_id`, `(user_id, created_at)`, `(user_id, completed)` for efficient queries
- Connection pooling for PostgreSQL (SQLAlchemy default)
- API response compression via gzip (FastAPI middleware)
- Frontend code splitting via Next.js dynamic imports

**Reliability**:
- Input validation at API layer (Pydantic schemas)
- Database constraints (unique email, not null fields, foreign keys)
- Error handling with appropriate HTTP status codes
- Graceful degradation for network errors (retry logic in API client)

**Scalability**:
- Stateless API design (no in-memory session storage)
- Database connection pooling
- Frontend server-side rendering via Next.js reduces client load
- Neon PostgreSQL auto-scaling for storage and compute

**Maintainability**:
- Clear separation of layers (API, service, data)
- Type safety with TypeScript (frontend) and Pydantic (backend)
- Consistent code structure and naming conventions
- Database migrations versioned via Alembic
- Comprehensive testing approach (unit, integration, contract)

## Dependencies and Integration Points

**Backend Dependencies**:
- FastAPI 0.104+ - Web framework
- Better Auth - Authentication library (to be confirmed availability for Python)
- SQLModel 0.0.14+ - ORM with Pydantic integration
- Pydantic 2.5+ - Data validation
- uvicorn 0.24+ - ASGI server
- alembic 1.13+ - Database migrations
- psycopg2 2.9+ - PostgreSQL adapter

**Frontend Dependencies**:
- Next.js 14+ - React framework with App Router
- React 18+ - UI library
- TypeScript 5.0+ - Type system
- Better Auth client SDK - Authentication (to be confirmed)
- Tailwind CSS 3.4+ - Utility-first CSS (optional, can use CSS Modules)

**External Services**:
- Neon Serverless PostgreSQL - Primary database

## Design Trade-offs and Rationale

**Choice of FastAPI over Flask/Django**:
- Rationale: FastAPI provides automatic API documentation (Swagger), async support, and type hints via Pydantic, which accelerates development and improves API contract clarity.
- Trade-off: Smaller ecosystem compared to Django, but sufficient for Phase II scope.

**Choice of SQLModel over SQLAlchemy alone**:
- Rationale: SQLModel combines SQLAlchemy ORM with Pydantic validation, providing type safety and reducing boilerplate code.
- Trade-off: Newer library with less community support, but actively maintained and well-documented.

**Choice of Better Auth**:
- Rationale: User requirement specified Better Auth for signup/signin. Assuming a Python-compatible authentication solution exists or will be available.
- Alternative considered: Auth0, Firebase Auth - rejected due to user requirement.
- Note: If Better Auth Python SDK does not exist, will need clarification from user or choose alternative (e.g., FastAPI Users, Authlib).

**Choice of Next.js over Create React App**:
- Rationale: Next.js provides server-side rendering, API routes, and built-in routing, reducing infrastructure complexity and improving SEO (though not critical for this app).
- Trade-off: Steeper learning curve than CRA, but better long-term scalability.

**Choice of Session-based Auth over JWT**:
- Rationale: Sessions stored server-side (via Better Auth) provide better security (server-controlled invalidation) and simpler implementation for Phase II.
- Trade-off: Requires server session storage, but acceptable for this scale.

**No State Management Library (Redux/Zustand)**:
- Rationale: React Context and custom hooks are sufficient for Phase II scope. Avoid unnecessary complexity.
- Trade-off: May need to add state management in future phases, but easy to refactor later.

## Risk Assessment and Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Better Auth Python SDK may not exist | Medium | High | Research Better Auth options; if unavailable, use FastAPI Users or Authlib with similar patterns |
| Neon PostgreSQL service disruption | Low | High | Implement graceful error handling; consider local PostgreSQL fallback for dev |
| CORS configuration issues in development | Medium | Medium | Document CORS setup clearly; provide dev environment configuration |
| Database migration errors | Low | High | Test migrations in staging; maintain rollback strategy (alembic downgrade) |
| Session token handling complexity | Medium | Medium | Document cookie handling; test cross-browser behavior |

## Success Criteria Verification

All success criteria from spec.md are achievable with this architecture:

- **SC-001**: Users can complete signup in under 2 minutes - Simple form with email/password, minimal friction
- **SC-002**: Sign in and view todos within 5 seconds - Optimized API queries and frontend performance
- **SC-003**: CRUD actions in 3 interactions or less - Direct UI controls (checkbox, edit button, delete button)
- **SC-004**: 95% signup success rate - Clear validation, error messages, and simple flow
- **SC-005**: Responsive on desktop/mobile - Tailwind CSS responsive design
- **SC-006**: API responses < 2 seconds - Indexed queries, efficient data layer
- **SC-007**: 100% data isolation - user_id filtering enforced at service layer
- **SC-008**: Automatic auth redirects - Middleware or route-level checks

## Next Steps

After completing Phase 0 research and Phase 1 design:

1. **Phase 0**: Generate `research.md` to confirm technology choices (especially Better Auth Python availability)
2. **Phase 1**: Generate `data-model.md`, `contracts/openapi.yaml`, and `quickstart.md`
3. **Phase 2**: Run `/sp.tasks` to generate implementation tasks
4. **Phase 3**: Execute `/sp.implement` to build the feature

## Architectural Decision Suggestions

📋 Architectural decision detected: **Authentication library selection for Python backend**
   Document reasoning and tradeoffs? Run `/sp.adr authentication-library-choice`

*Rationale*: Better Auth is specified by user but Python SDK availability needs confirmation. If unavailable, alternative (FastAPI Users, Authlib) will be required with documented tradeoffs.
