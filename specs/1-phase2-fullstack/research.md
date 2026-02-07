# Phase II Research

**Feature**: Phase II - Full-Stack Web Application
**Date**: 2026-01-04
**Purpose**: Research technology choices and best practices for Phase II implementation

## Research Findings

### 1. Authentication Library for Python Backend

**Question**: Does Better Auth have a Python SDK for FastAPI? If not, what are the best alternatives?

**Research Result**:
Better Auth is primarily a JavaScript/TypeScript authentication library designed for Next.js, React, and Node.js applications. It does not have an official Python SDK or native FastAPI integration.

**Recommended Alternatives for FastAPI**:

**Option A: FastAPI Users** (RECOMMENDED)
- Library: `fastapi-users` (https://fastapi-users.github.io/)
- Features:
  - Full authentication flow (signup, signin, signout)
  - Session-based authentication with SQLAlchemy integration
  - Built-in JWT support (optional)
  - Password hashing via passlib/bcrypt
  - User verification and password reset (extensible)
  - Supports async operations
  - Well-documented and actively maintained
- Compatibility: Works seamlessly with SQLModel (built on SQLAlchemy)
- Trade-offs: More feature-rich than needed for Phase II, but stable and mature

**Option B: Authlib + FastAPI** (ALTERNATIVE)
- Libraries: `authlib` (core), `fastapi-security` (FastAPI integration)
- Features:
  - Flexible authentication framework
  - OAuth 2.0 and OpenID Connect support
  - JWT and session-based authentication
  - Manual implementation required for signup/signin flows
- Trade-offs: More manual work, but more flexible

**Option C: Custom Implementation with passlib** (SIMPLEST)
- Libraries: `passlib` (password hashing), `python-jose` (JWT)
- Features:
  - Full control over authentication flow
  - Minimal dependencies
  - Direct integration with FastAPI dependency injection
- Trade-offs: Requires implementing session management, cookie handling manually

**Decision**: Use **FastAPI Users** as the primary authentication solution for Phase II.

**Rationale**:
- Provides out-of-the-box signup, signin, and session management
- Integrates with SQLAlchemy/SQLModel (already chosen ORM)
- Follows FastAPI patterns and best practices
- Reduces implementation complexity and security risks
- Extensible for future phases (password reset, email verification)
- Active community and documentation

**Better Auth Client SDK**:
For the frontend (Next.js), Better Auth client SDK will work seamlessly. The frontend will communicate with the backend's RESTful API using session cookies, regardless of which backend authentication library is chosen.

**Implementation Plan**:
- Backend: Use `fastapi-users` with SQLAlchemy backend
- Frontend: Use Better Auth client SDK or custom API client for session management
- Session storage: Server-side via SQLAlchemy (SQLModel)
- Cookie handling: HTTP-only, secure, SameSite cookies

---

### 2. Neon PostgreSQL Best Practices for FastAPI

**Research Result**:
Neon is a serverless PostgreSQL database that provides auto-scaling compute and storage. It is fully compatible with PostgreSQL 15+ and works transparently with SQLAlchemy/SQLModel.

**Best Practices**:
1. **Connection Pooling**: Use SQLAlchemy's default connection pooling with `pool_size=5` and `max_overflow=10`
2. **Migration Strategy**: Alembic works seamlessly with Neon (same as standard PostgreSQL)
3. **Environment Variables**: Store `DATABASE_URL` with connection parameters:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **SSL Mode**: Always use `sslmode=require` for secure connections
5. **Index Strategy**: Create indexes on frequently queried columns (user_id, created_at)
6. **Transaction Management**: Use SQLAlchemy sessions with `with` context managers for proper cleanup

**Performance Considerations**:
- Neon auto-suspends idle databases after 5 minutes of inactivity
- First query after wake-up may take 1-2 seconds (acceptable for Phase II)
- Consider using Neon's "Serverless Driver" for connectionless queries (future optimization)
- Neon's autoscaling handles up to 1000 concurrent connections (exceeds Phase II requirements)

---

### 3. SQLModel + FastAPI Integration Patterns

**Research Result**:
SQLModel is built on top of SQLAlchemy and Pydantic, providing type-safe database models that automatically generate Pydantic schemas for FastAPI.

**Best Practices**:

**Model Definition**:
```python
from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    completed: bool = False
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

**CRUD Operations with SQLModel**:
```python
from sqlmodel import Session, select

def create_todo(session: Session, todo: TodoCreate, user_id: int) -> Todo:
    db_todo = Todo.model_validate(todo, update={"user_id": user_id})
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo

def get_todos(session: Session, user_id: int) -> list[Todo]:
    return session.exec(select(Todo).where(Todo.user_id == user_id)).all()
```

**FastAPI Integration**:
```python
from fastapi import Depends
from sqlmodel import Session

def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session

@app.post("/api/todos", response_model=TodoRead)
def create_todo(
    todo: TodoCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return todo_service.create_todo(session, todo, current_user.id)
```

**Trade-offs**:
- Simplified development (auto-generated schemas)
- Slightly less control than raw SQLAlchemy (acceptable for Phase II)
- Active development with regular updates

---

### 4. Next.js 14 App Router + TypeScript Best Practices

**Research Result**:
Next.js 14 App Router is the recommended approach for new Next.js applications. It provides server components, improved routing, and better TypeScript support.

**Best Practices**:

**Project Structure**:
```
src/app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page
├── (auth)/             # Auth route group
│   ├── signup/
│   │   └── page.tsx
│   └── signin/
│       └── page.tsx
└── (protected)/         # Protected route group
    └── todos/
        └── page.tsx
```

**Server vs Client Components**:
- Use Server Components by default for performance and security
- Use Client Components (`'use client'`) only when needed (interactivity, hooks)
- Example: Auth forms (Client), Todo list (Server with Client for interactions)

**TypeScript Setup**:
```typescript
// types/index.d.ts
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string;
}
```

**API Client Pattern**:
```typescript
// lib/api/todos.ts
export async function createTodo(todo: TodoCreate): Promise<Todo> {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error('Failed to create todo');
  }

  return response.json();
}
```

---

### 5. Responsive UI Strategy with Tailwind CSS

**Research Result**:
Tailwind CSS is the recommended styling solution for Next.js applications due to its utility-first approach and built-in responsive classes.

**Best Practices**:

**Mobile-First Approach**:
```tsx
<div className="max-w-2xl mx-auto p-4">
  {/* Mobile: single column, Desktop: grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {todos.map(todo => (
      <TodoItem key={todo.id} todo={todo} />
    ))}
  </div>
</div>
```

**Responsive Breakpoints** (Tailwind defaults):
- `sm`: 640px and up (small tablets)
- `md`: 768px and up (tablets)
- `lg`: 1024px and up (desktops)
- `xl`: 1280px and up (large desktops)

**Touch-Friendly Sizing**:
```tsx
<button className="px-4 py-2 text-base md:text-sm">
  {/* Minimum touch target: 44x44px */}
  Click me
</button>
```

---

### 6. Testing Strategies for Full-Stack Applications

**Backend Testing (pytest)**:
```python
# tests/integration/test_todos.py
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session

def test_create_todo(client: TestClient, session: Session):
    # Create test user
    user = create_test_user(session)

    # Create todo
    response = client.post(
        "/api/todos",
        json={"title": "Test todo"},
        cookies={"session": user.session_token}
    )

    assert response.status_code == 201
    assert response.json()["title"] == "Test todo"
```

**Frontend Testing (Vitest + React Testing Library)**:
```typescript
// tests/unit/TodoList.test.tsx
import { render, screen } from '@testing-library/react';
import TodoList from '@/app/todos/components/TodoList';

test('displays todos', () => {
  const todos = [
    { id: '1', title: 'Test', completed: false }
  ];

  render(<TodoList todos={todos} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

**Integration Testing (End-to-End)**:
- Consider Playwright or Cypress for e2e testing (Phase III)
- For Phase II, manual testing or simple integration tests sufficient

---

### 7. Error Handling Patterns

**Backend Error Handling**:
```python
from fastapi import HTTPException, status

def get_todo(todo_id: int, user_id: int, session: Session) -> Todo:
    todo = session.get(Todo, todo_id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    if todo.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own todos"
        )

    return todo
```

**Frontend Error Handling**:
```typescript
export async function getTodos(): Promise<Todo[]> {
  try {
    const response = await fetch('/api/todos');

    if (!response.ok) {
      if (response.status === 401) {
        // Redirect to signin
        window.location.href = '/signin';
        return [];
      }
      throw new Error('Failed to fetch todos');
    }

    return response.json();
  } catch (error) {
    // Display error to user
    console.error('Error fetching todos:', error);
    return [];
  }
}
```

---

## Summary of Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend Auth Library | FastAPI Users | Mature, integrates with SQLAlchemy, provides complete auth flow |
| Backend Framework | FastAPI | Automatic docs, async support, type hints |
| ORM/Data Layer | SQLModel | Type-safe, reduces boilerplate, built on SQLAlchemy |
| Database | Neon Serverless PostgreSQL | Auto-scaling, managed service, PostgreSQL compatible |
| Frontend Framework | Next.js 14 (App Router) | Server-side rendering, built-in routing, great DX |
| Frontend Language | TypeScript 5.0+ | Type safety, better IDE support |
| CSS Framework | Tailwind CSS | Utility-first, responsive utilities, fast development |
| Testing Backend | pytest + httpx | Python standard, async support |
| Testing Frontend | Vitest + React Testing Library | Fast, Vite-native, component testing |
| Migration Tool | Alembic | Standard for SQLAlchemy, reliable |
| Session Management | Server-side (SQLAlchemy) | Better security, easier invalidation |

---

## Open Issues / Follow-Up

None. All technology choices confirmed and documented.

---

## References

- FastAPI Users Documentation: https://fastapi-users.github.io/
- SQLModel Documentation: https://sqlmodel.tiangolo.com/
- Next.js 14 Documentation: https://nextjs.org/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Neon PostgreSQL: https://neon.tech/docs
- Alembic Documentation: https://alembic.sqlalchemy.org/
