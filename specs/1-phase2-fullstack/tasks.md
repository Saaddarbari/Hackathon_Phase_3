---

description: "Task list for Phase II - Full-Stack Web Application implementation"
---

# Tasks: Phase II - Full-Stack Web Application

**Input**: Design documents from `/specs/1-phase2-fullstack/`
**Prerequisites**: plan.md, spec.md
**Tests**: Not explicitly requested in specification - test tasks omitted

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`
- Full monorepo structure at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend/ and frontend/ directory structure per implementation plan
- [X] T002 [P] Initialize Python 3.11+ backend project with pyproject.toml in backend/
- [X] T003 [P] Initialize Next.js 14+ frontend project with TypeScript in frontend/
- [X] T004 Create backend/src/api/main.py FastAPI application entry point
- [X] T005 Create frontend/src/app/layout.tsx root layout component
- [X] T006 [P] Create .env.example template with DATABASE_URL and API_URL placeholders

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create backend/src/config/settings.py environment configuration loader
- [X] T008 [P] Install backend dependencies (FastAPI, uvicorn, Better Auth, SQLModel, Pydantic, Alembic, psycopg2) in backend/requirements.txt
- [X] T009 [P] Install frontend dependencies (React 18+, TypeScript, Better Auth client SDK) in frontend/package.json
- [X] T010 Create backend/src/models/user.py User data model with UUID, email, password_hash, timestamps
- [X] T011 Create backend/src/models/todo.py Todo data model with UUID, user_id, title, description, completed, timestamps
- [X] T012 Setup Neon PostgreSQL connection in backend/src/config/database.py
- [X] T013 Initialize Alembic migrations in backend/alembic/ directory
- [X] T014 Create initial database migration creating users and todos tables in backend/alembic/versions/
- [X] T015 [P] Configure Better Auth backend integration in backend/src/services/auth_service.py
- [X] T016 [P] Create backend/src/api/dependencies.py for auth context and database sessions dependency injection
- [X] T017 Create backend/src/api/routes/__init__.py and base route structure
- [X] T018 Implement global error handling middleware in backend/src/api/main.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Sign Up (Priority: P1) 🎯 MVP

**Goal**: Enable new users to create accounts via email and password

**Independent Test**: Navigate to signup page, enter valid credentials, verify account creation with successful redirect to signin page

### Backend Implementation for User Story 1

- [X] T019 Create backend/src/api/schemas/user.py with SignupRequest and UserResponse Pydantic schemas
- [X] T020 Create backend/src/api/routes/auth.py route module
- [X] T021 Implement POST /api/signup endpoint in backend/src/api/routes/auth.py
- [X] T022 Implement user registration logic in backend/src/services/auth_service.py (hash password, create user, create session)
- [X] T023 Add email format validation to SignupRequest schema in backend/src/api/schemas/user.py
- [X] T024 Add password requirements validation to user registration service in backend/src/services/auth_service.py
- [X] T025 Add duplicate email validation to user registration service in backend/src/services/auth_service.py

### Frontend Implementation for User Story 1

- [X] T026 Create frontend/src/app/signup/page.tsx signup page component
- [X] T027 Create frontend/src/components/auth/SignupForm.tsx signup form component with email/password fields
- [X] T028 Create frontend/src/lib/api/auth.ts with signup() API function
- [X] T029 Implement signup form validation in frontend/src/components/auth/SignupForm.tsx
- [X] T030 Display signup error messages in frontend/src/components/auth/SignupForm.tsx
- [X] T031 Implement redirect to /signin after successful signup in frontend/src/components/auth/SignupForm.tsx

**Checkpoint**: User Story 1 complete - signup flow functional and testable

---

## Phase 4: User Story 2 - User Sign In (Priority: P1) 🎯 MVP

**Goal**: Enable existing users to authenticate and access their todos

**Independent Test**: Navigate to signin page, enter valid credentials, verify successful authentication with redirect to todos page

### Backend Implementation for User Story 2

- [X] T032 Add SigninRequest Pydantic schema to backend/src/api/schemas/user.py
- [X] T033 Implement POST /api/signin endpoint in backend/src/api/routes/auth.py
- [X] T034 Implement user authentication logic in backend/src/services/auth_service.py (verify password, create session)
- [X] T035 Add invalid credentials error handling in backend/src/services/auth_service.py
- [X] T036 Add non-existent email error handling in backend/src/services/auth_service.py

### Frontend Implementation for User Story 2

- [X] T037 Create frontend/src/app/signin/page.tsx signin page component
- [X] T038 Create frontend/src/components/auth/SigninForm.tsx signin form component with email/password fields
- [X] T039 Add signin() API function to frontend/src/lib/api/auth.ts
- [X] T040 Implement signin form validation in frontend/src/components/auth/SigninForm.tsx
- [X] T041 Display signin error messages in frontend/src/components/auth/SigninForm.tsx
- [X] T042 Set session cookie after successful signin in frontend/src/lib/api/auth.ts
- [X] T043 Implement redirect to /todos after successful signin in frontend/src/components/auth/SigninForm.tsx

### Auth State Management (Supports US2, US3-US7)

- [ ] T044 Create frontend/src/contexts/AuthContext.tsx or Zustand store for auth state
- [ ] T045 Create AuthProvider wrapper in frontend/src/app/layout.tsx
- [ ] T046 Implement auth state persistence check in frontend/src/contexts/AuthContext.tsx
- [ ] T047 Add protected route check logic for redirecting unauthenticated users

**Checkpoint**: User Stories 1 AND 2 complete - signup and signin flows functional

---

## Phase 5: User Story 3 - Create Todo (Priority: P1) 🎯 MVP

**Goal**: Enable authenticated users to create new todos with title and optional description

**Independent Test**: Sign in, create a todo, verify it appears in the todo list

### Backend Implementation for User Story 3

- [X] T048 Create backend/src/api/schemas/todo.py with TodoCreate and TodoResponse Pydantic schemas
- [X] T049 Create backend/src/api/routes/todos.py route module
- [X] T050 Implement POST /api/todos endpoint in backend/src/api/routes/todos.py with auth middleware
- [X] T051 Create backend/src/services/todo_service.py module
- [X] T052 Implement create_todo() business logic in backend/src/services/todo_service.py
- [X] T053 Add title required validation to TodoCreate schema in backend/src/api/schemas/todo.py
- [X] T054 Set user_id on todo creation in backend/src/services/todo_service.py

- [X] T055 Create frontend/src/app/todos/page.tsx todos list page with auth protection
- [X] T056 Create frontend/src/app/todos/components/CreateTodoForm.tsx add todo form
- [X] T057 Create frontend/src/app/todos/hooks/useTodos.ts custom hook for todo API calls
- [X] T058 Create frontend/src/lib/api/todos.ts with createTodo() API function
- [X] T059 Implement createTodo call in useTodos hook in frontend/src/app/todos/hooks/useTodos.ts
- [X] T060 Add todo form validation in frontend/src/app/todos/components/CreateTodoForm.tsx
- [X] T061 Display create todo errors in frontend/src/app/todos/components/CreateTodoForm.tsx

### Frontend Implementation for User Story 4

- [X] T066 Create frontend/src/app/todos/components/TodoList.tsx todo list display component
- [X] T067 Create frontend/src/app/todos/components/TodoItem.tsx single todo display component
- [X] T068 Create frontend/src/app/todos/components/EmptyState.tsx empty state display component
- [X] T069 Add getTodos() API function to frontend/src/lib/api/todos.ts
- [X] T070 Implement getTodos call in useTodos hook in frontend/src/app/todos/hooks/useTodos.ts
- [X] T071 Display todo completion status in frontend/src/app/todos/components/TodoItem.tsx
- [X] T072 Display empty state when no todos in frontend/src/app/todos/components/TodoList.tsx
- [X] T073 Load todos on page mount in frontend/src/app/todos/page.tsx

**Checkpoint**: User Stories 1, 2, AND 3 complete - can signup, signin, and create todos

---

## Phase 6: User Story 4 - View Todos (Priority: P1) 🎯 MVP

**Goal**: Enable authenticated users to view all their todos with completion status

**Independent Test**: Sign in, navigate to todos page, verify all todos display with correct completion status

### Backend Implementation for User Story 4

- [X] T062 Implement GET /api/todos endpoint in backend/src/api/routes/todos.py
- [X] T063 Implement get_todos() business logic in backend/src/services/todo_service.py
- [X] T064 Add user_id filtering to get_todos() in backend/src/services/todo_service.py
- [X] T065 Add auth middleware dependency to GET /api/todos endpoint in backend/src/api/routes/todos.py

### Frontend Implementation for User Story 4

- [ ] T066 Create frontend/src/app/todos/components/TodoList.tsx todo list display component
- [ ] T067 Create frontend/src/app/todos/components/TodoItem.tsx single todo display component
- [ ] T068 Create frontend/src/app/todos/components/EmptyState.tsx empty state display component
- [ ] T069 Add getTodos() API function to frontend/src/lib/api/todos.ts
- [ ] T070 Implement getTodos call in useTodos hook in frontend/src/app/todos/hooks/useTodos.ts
- [ ] T071 Display todo completion status in frontend/src/app/todos/components/TodoItem.tsx
- [ ] T072 Display empty state when no todos in frontend/src/app/todos/components/TodoList.tsx
- [ ] T073 Load todos on page mount in frontend/src/app/todos/page.tsx

**Checkpoint**: All P1 stories complete (US1-US4) - MVP ready for deployment

---

## Phase 7: User Story 5 - Mark Todo Complete/Incomplete (Priority: P2)

**Goal**: Enable authenticated users to toggle todo completion status

**Independent Test**: Create a todo, toggle its status, verify the visual indicator updates and persists after page refresh

### Backend Implementation for User Story 5

- [X] T074 Implement PATCH /api/todos/{id}/complete endpoint in backend/src/api/routes/todos.py
- [X] T075 Implement toggle_complete() business logic in backend/src/services/todo_service.py
- [X] T076 Add user ownership validation in toggle_complete() in backend/src/services/todo_service.py

### Frontend Implementation for User Story 5

- [X] T077 Add toggleTodoComplete() API function to frontend/src/lib/api/todos.ts
- [X] T078 Implement toggle complete action in useTodos hook in frontend/src/app/todos/hooks/useTodos.ts
- [X] T079 Add toggle button/checkbox to frontend/src/app/todos/components/TodoItem.tsx
- [X] T080 Update UI state immediately on toggle in frontend/src/app/todos/components/TodoItem.tsx

**Checkpoint**: User Story 5 complete - todo completion toggling functional

---

## Phase 8: User Story 6 - Edit Todo (Priority: P2)

**Goal**: Enable authenticated users to edit todo title and description

**Independent Test**: Create a todo, edit its title/description, verify the changes persist and display correctly

### Backend Implementation for User Story 6

- [X] T081 Add TodoUpdate Pydantic schema to backend/src/api/schemas/todo.py
- [X] T082 Implement PUT /api/todos/{id} endpoint in backend/src/api/routes/todos.py
- [X] T083 Implement update_todo() business logic in backend/src/services/todo_service.py
- [X] T084 Add title required validation to TodoUpdate schema in backend/src/api/schemas/todo.py
- [X] T085 Add user ownership validation to update_todo() in backend/src/services/todo_service.py

### Frontend Implementation for User Story 6

- [ ] T086 Create frontend/src/app/todos/[id]/edit/page.tsx edit todo page with auth protection
- [ ] T087 Create frontend/src/app/todos/[id]/edit/components/EditTodoForm.tsx edit form component
- [ ] T088 Add updateTodo() API function to frontend/src/lib/api/todos.ts
- [ ] T089 Pre-populate form with existing todo data in frontend/src/app/todos/[id]/edit/components/EditTodoForm.tsx
- [ ] T090 Implement edit form validation in frontend/src/app/todos/[id]/edit/components/EditTodoForm.tsx
- [ ] T091 Display edit todo errors in frontend/src/app/todos/[id]/edit/components/EditTodoForm.tsx
- [ ] T092 Implement redirect to /todos after successful edit in frontend/src/app/todos/[id]/edit/page.tsx

**Checkpoint**: User Story 6 complete - todo editing functional

---

## Phase 9: User Story 7 - Delete Todo (Priority: P2)

**Goal**: Enable authenticated users to delete todos

**Independent Test**: Create a todo, delete it, verify it is removed from the list and remains deleted after page refresh

### Backend Implementation for User Story 7

- [X] T093 Implement DELETE /api/todos/{id} endpoint in backend/src/api/routes/todos.py
- [X] T094 Implement delete_todo() business logic in backend/src/services/todo_service.py
- [X] T095 Add user ownership validation to delete_todo() in backend/src/services/todo_service.py

### Frontend Implementation for User Story 7

- [ ] T096 Add deleteTodo() API function to frontend/src/lib/api/todos.ts
- [ ] T097 Implement delete action in useTodos hook in frontend/src/app/todos/hooks/useTodos.ts
- [ ] T098 Add delete button to frontend/src/app/todos/components/TodoItem.tsx
- [ ] T099 Update UI state immediately on delete in frontend/src/app/todos/components/TodoItem.tsx
- [ ] T100 Add confirmation dialog before delete in frontend/src/app/todos/components/TodoItem.tsx

**Checkpoint**: All user stories complete - full Phase II feature set functional

---

## Phase 10: Responsive Layout & Error States (Cross-Cutting)

**Purpose**: Ensure application works on all devices and handles errors gracefully

- [X] T101 [P] Implement responsive breakpoints in frontend using Tailwind CSS or CSS Modules
- [X] T102 [P] Add mobile navigation (hamburger menu) to frontend/src/components/layout/Header.tsx
- [X] T103 [P] Create frontend/src/components/layout/Header.tsx application header with sign out button
- [X] T104 [P] Create frontend/src/components/ui/Button.tsx reusable button component
- [X] T105 [P] Create frontend/src/components/ui/Input.tsx reusable input component
- [X] T106 [P] Create frontend/src/components/ui/Toast.tsx or similar error message component
- [X] T107 Add network error handling in frontend/src/lib/api/todos.ts
- [X] T108 Add network error handling in frontend/src/lib/api/auth.ts
- [X] T109 Add backend error handling for 404, 401, 403, 500 responses in API client functions
- [X] T110 Display backend error messages in frontend UI via toast/banner
- [X] T111 Handle session expiration by redirecting to /signin in frontend

---

## Phase 11: Integration & Polish

**Purpose**: Final integration, testing, and deployment preparation

- [ ] T112 Create docker-compose.yml for local development orchestration
- [ ] T113 [P] Create backend/Dockerfile for containerization
- [ ] T114 [P] Create frontend/Dockerfile for containerization
- [ ] T115 Configure CORS in backend/src/api/main.py for frontend origin
- [ ] T116 Create backend/README.md with setup and running instructions
- [ ] T117 Create frontend/README.md with setup and running instructions
- [ ] T118 Update root README.md with Phase II architecture overview
- [ ] T119 Test complete signup → signin → create → view → toggle → edit → delete flow end-to-end
- [ ] T120 Verify user data isolation (users cannot access other users' todos)
- [ ] T121 Verify responsive layout on mobile (sm: 640px) and desktop (lg: 1024px+) breakpoints
- [ ] T122 Verify all error states display appropriate messages to users

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can then proceed in sequential priority order (P1 → P2)
  - US1 (Signup) and US2 (Signin) can be partially parallelized
- **Responsive Layout (Phase 10)**: Can start after Phase 3 (US1-US3) - builds on basic pages
- **Integration & Polish (Phase 11)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Sign Up**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1) - Sign In**: Can start after Foundational (Phase 2) - Independent but shares auth infrastructure with US1
- **User Story 3 (P1) - Create Todo**: Can start after Foundational (Phase 2) - Depends on auth from US1/US2
- **User Story 4 (P1) - View Todos**: Can start after Foundational (Phase 2) - Depends on auth from US1/US2 and models from US3
- **User Story 5 (P2) - Toggle Complete**: Depends on US3/US4 (needs todos to exist)
- **User Story 6 (P2) - Edit Todo**: Depends on US3/US4 (needs todos to exist)
- **User Story 7 (P2) - Delete Todo**: Depends on US3/US4 (needs todos to exist)

### Within Each User Story

- Backend schemas before routes
- Backend routes before frontend API calls
- Backend services before endpoints
- Frontend API client before hooks/components
- Components/pages integration at end of story
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] in Phase 1 can run in parallel
- All dependency installation tasks marked [P] in Phase 2 can run in parallel
- US1 and US2 backend API schemas can be worked on in parallel after Phase 2
- US3, US4, US5, US6, US7 frontend components can be sketched in parallel (but not fully functional until backend endpoints exist)
- All UI component creation marked [P] in Phase 10 can run in parallel
- All Dockerfiles marked [P] in Phase 11 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Backend tasks that can run together:
Task T019: "Create backend/src/api/schemas/user.py with SignupRequest and UserResponse Pydantic schemas"

# Frontend tasks that can run together (after backend schema exists):
Task T027: "Create frontend/src/components/auth/SignupForm.tsx signup form component with email/password fields"
Task T028: "Create frontend/src/lib/api/auth.ts with signup() API function"
Task T029: "Implement signup form validation in frontend/src/components/auth/SignupForm.tsx"
```

---

## Parallel Example: User Story 3 & 4 (after US1/US2 complete)

```bash
# User Story 3 (Create Todo) backend:
Task T048: "Create backend/src/api/schemas/todo.py with TodoCreate and TodoResponse Pydantic schemas"

# User Story 4 (View Todos) backend (can start in parallel after schema exists):
Task T062: "Implement GET /api/todos endpoint in backend/src/api/routes/todos.py"

# Frontend components (can be sketched together):
Task T056: "Create frontend/src/app/todos/components/CreateTodoForm.tsx add todo form"
Task T066: "Create frontend/src/app/todos/components/TodoList.tsx todo list display component"
Task T067: "Create frontend/src/app/todos/components/TodoItem.tsx single todo display component"
```

---

## Implementation Strategy

### MVP First (User Stories 1-4 - All P1 stories)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T018) - CRITICAL
3. Complete Phase 3: User Story 1 - Sign Up (T019-T031)
4. Complete Phase 4: User Story 2 - Sign In (T032-T047)
5. Complete Phase 5: User Story 3 - Create Todo (T048-T061)
6. Complete Phase 6: User Story 4 - View Todos (T062-T073)
7. **STOP and VALIDATE**: Test complete signup → signin → create → view flow
8. Deploy/demo MVP if ready

### Incremental Delivery (Phase II Complete)

1. Complete MVP (US1-US4) as above
2. Add User Story 5 - Toggle Complete (T074-T080) → Test → Deploy/Demo
3. Add User Story 6 - Edit Todo (T081-T092) → Test → Deploy/Demo
4. Add User Story 7 - Delete Todo (T093-T100) → Test → Deploy/Demo
5. Add Responsive Layout (Phase 10 - T101-T111) → Test → Deploy/Demo
6. Complete Integration & Polish (Phase 11 - T112-T122)
7. Each phase adds value without breaking previous phases

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T018)
2. Once Foundational is done:
   - Developer A: User Story 1 (Sign Up) + User Story 2 (Sign In)
   - Developer B: User Story 3 (Create Todo) + User Story 4 (View Todos)
   - Developer C: User Stories 5, 6, 7 (Toggle, Edit, Delete)
3. Responsive Layout and Polish done in parallel once core stories are functional

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tasks are numbered sequentially (T001-T122) for clear execution order
- All P1 stories (US1-US4) form the MVP - P2 stories (US5-US7) enhance the MVP
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Testing tasks omitted since tests were not explicitly requested in the specification
