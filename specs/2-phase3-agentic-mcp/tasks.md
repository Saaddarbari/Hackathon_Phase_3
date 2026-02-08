---

description: "Task list for Phase III - Todo AI Chatbot (Agentic + MCP) implementation"
---

# Tasks: Phase III - Todo AI Chatbot (Agentic + MCP)

**Input**: Design documents from `/specs/2-phase3-agentic-mcp/`
**Prerequisites**: plan.md, spec.md, constitution.md
**Tests**: Included - comprehensive testing required for agent-driven architecture

**Organization**: Tasks are grouped by implementation phase and user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`
- **MCP**: `backend/src/mcp/`
- Full monorepo structure at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [ ] T001 Install OpenAI Agents SDK in backend/requirements.txt
- [ ] T002 [P] Install MCP SDK (official Python MCP SDK) in backend/requirements.txt
- [ ] T003 [P] Install OpenAI ChatKit dependencies in frontend/package.json
- [ ] T004 Create backend/src/mcp/ directory structure for MCP server
- [ ] T005 Create backend/src/mcp/tools/ directory for MCP tool implementations
- [ ] T006 Update .env.example with OPENAI_API_KEY placeholder

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Schema (Foundation)

- [ ] T007 Create backend/src/models/conversation.py Conversation model with SQLModel (id, user_id, created_at, updated_at)
- [ ] T008 [P] Create backend/src/models/message.py Message model with SQLModel (id, conversation_id, role, content, timestamp, tool_calls)
- [ ] T009 Create Alembic migration for conversations table in backend/alembic/versions/xxx_add_conversations.py
- [ ] T010 Create Alembic migration for messages table in backend/alembic/versions/xxx_add_messages.py
- [ ] T011 Add database indexes for conversations (user_id) and messages (conversation_id, timestamp)
- [ ] T012 Apply database migrations to development database
- [ ] T013 Verify migrations with rollback test

### MCP Server Setup (Foundation)

- [ ] T014 Create backend/src/mcp/__init__.py with MCP server initialization
- [ ] T015 Create backend/src/mcp/server.py with MCP server class using official MCP SDK
- [ ] T016 Configure MCP server to connect to database (SQLModel session)
- [ ] T017 Create backend/src/mcp/tools/__init__.py with tool registry
- [ ] T018 Define MCP tool base class with input validation in backend/src/mcp/tools/base.py

### Agent Service Setup (Foundation)

- [ ] T019 Create backend/src/services/agent.py with Agent service class
- [ ] T020 Configure OpenAI Agents SDK in backend/src/services/agent.py
- [ ] T021 Define base system prompt for todo assistant in backend/src/services/agent.py
- [ ] T022 Implement conversation history loading from database in backend/src/services/agent.py
- [ ] T023 Implement agent execution method with error handling in backend/src/services/agent.py
- [ ] T024 Add OpenAI API retry logic with exponential backoff in backend/src/services/agent.py

### Chat API Setup (Foundation)

- [ ] T025 Create backend/src/api/chat.py with chat route module
- [ ] T026 Implement POST /api/{user_id}/chat endpoint in backend/src/api/chat.py
- [ ] T027 Add authentication middleware to chat endpoint (reuse Better Auth from Phase II)
- [ ] T028 Implement stateless conversation cycle in chat endpoint (receive → fetch → append → execute → persist → return)
- [ ] T029 Add request/response logging for observability in backend/src/api/chat.py
- [ ] T030 Create backend/src/api/schemas/chat.py with ChatRequest and ChatResponse Pydantic schemas

### Remove Phase II REST Endpoints (Foundation)

- [ ] T031 Remove task CRUD routes from backend/src/api/main.py (GET /api/todos, POST /api/todos, etc.)
- [ ] T032 Update backend/src/api/main.py to only include auth and chat routes
- [ ] T033 Verify no REST CRUD endpoints remain for tasks

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Task via Natural Language (Priority: P1) 🎯 MVP

**Goal**: Enable users to create tasks by chatting naturally

**Independent Test**: Send "Add buy groceries" and verify task is created in database and assistant confirms

### MCP Tool Implementation for User Story 1

- [ ] T034 [US1] Create backend/src/mcp/tools/add_task.py with add_task MCP tool
- [ ] T035 [US1] Define add_task input schema (user_id: str, title: str) in backend/src/mcp/tools/add_task.py
- [ ] T036 [US1] Define add_task output schema (task_id: str, title: str, created_at: str) in backend/src/mcp/tools/add_task.py
- [ ] T037 [US1] Implement add_task logic: validate input, create task in database, return structured output
- [ ] T038 [US1] Add input validation for title (non-empty, max length) in add_task tool
- [ ] T039 [US1] Register add_task tool with MCP server in backend/src/mcp/server.py

### Agent Prompt Updates for User Story 1

- [ ] T040 [US1] Update system prompt in backend/src/services/agent.py to include add_task tool usage guidelines
- [ ] T041 [US1] Add examples of task creation commands to system prompt ("Add X", "Create task Y", "Remind me to Z")
- [ ] T042 [US1] Add clarification strategy for vague task creation requests to system prompt

### Tests for User Story 1

- [ ] T043 [P] [US1] Unit test for add_task MCP tool in backend/tests/unit/test_add_task.py
- [ ] T044 [P] [US1] Integration test for task creation via chat in backend/tests/integration/test_chat_create_task.py
- [ ] T045 [P] [US1] Test agent interprets "Add buy groceries" correctly in backend/tests/integration/test_agent_create_task.py
- [ ] T046 [P] [US1] Test agent asks clarification for vague input "groceries" in backend/tests/integration/test_agent_clarification.py

**Checkpoint**: User Story 1 complete - users can create tasks via chat

---

## Phase 4: User Story 2 - List Tasks via Chat (Priority: P1) 🎯 MVP

**Goal**: Enable users to view their tasks by asking in natural language

**Independent Test**: Send "Show me my tasks" and verify assistant returns task list from database

### MCP Tool Implementation for User Story 2

- [ ] T047 [US2] Create backend/src/mcp/tools/list_tasks.py with list_tasks MCP tool
- [ ] T048 [US2] Define list_tasks input schema (user_id: str, filter: Optional[str]) in backend/src/mcp/tools/list_tasks.py
- [ ] T049 [US2] Define list_tasks output schema (tasks: List[Task]) in backend/src/mcp/tools/list_tasks.py
- [ ] T050 [US2] Implement list_tasks logic: query database for user's tasks, return structured list
- [ ] T051 [US2] Add support for filtering (all, completed, incomplete) in list_tasks tool
- [ ] T052 [US2] Register list_tasks tool with MCP server in backend/src/mcp/server.py

### Agent Prompt Updates for User Story 2

- [ ] T053 [US2] Update system prompt to include list_tasks tool usage guidelines
- [ ] T054 [US2] Add examples of list commands ("Show my tasks", "What do I need to do?", "List todos")
- [ ] T055 [US2] Add handling for empty task list (friendly message) to system prompt

### Tests for User Story 2

- [ ] T056 [P] [US2] Unit test for list_tasks MCP tool in backend/tests/unit/test_list_tasks.py
- [ ] T057 [P] [US2] Integration test for listing tasks via chat in backend/tests/integration/test_chat_list_tasks.py
- [ ] T058 [P] [US2] Test agent handles empty task list gracefully in backend/tests/integration/test_agent_empty_list.py

**Checkpoint**: User Stories 1 AND 2 complete - users can create and list tasks via chat

---

## Phase 5: User Story 3 - Complete Task via Chat (Priority: P2)

**Goal**: Enable users to mark tasks complete by chatting

**Independent Test**: Create task, send "Mark buy groceries as done", verify task status updates in database

### MCP Tool Implementation for User Story 3

- [ ] T059 [US3] Create backend/src/mcp/tools/complete_task.py with complete_task MCP tool
- [ ] T060 [US3] Define complete_task input schema (user_id: str, task_id: str) in backend/src/mcp/tools/complete_task.py
- [ ] T061 [US3] Define complete_task output schema (task_id: str, completed: bool, updated_at: str) in backend/src/mcp/tools/complete_task.py
- [ ] T062 [US3] Implement complete_task logic: find task, toggle completion, update database, return result
- [ ] T063 [US3] Add error handling for non-existent task_id in complete_task tool
- [ ] T064 [US3] Register complete_task tool with MCP server in backend/src/mcp/server.py

### Agent Prompt Updates for User Story 3

- [ ] T065 [US3] Update system prompt to include complete_task tool usage guidelines
- [ ] T066 [US3] Add examples of completion commands ("Mark X as done", "Complete Y", "I finished Z")
- [ ] T067 [US3] Add strategy for resolving ambiguous task references (ask for clarification or list tasks first)

### Tests for User Story 3

- [ ] T068 [P] [US3] Unit test for complete_task MCP tool in backend/tests/unit/test_complete_task.py
- [ ] T069 [P] [US3] Integration test for completing task via chat in backend/tests/integration/test_chat_complete_task.py
- [ ] T070 [P] [US3] Test agent handles non-existent task gracefully in backend/tests/integration/test_agent_complete_nonexistent.py

**Checkpoint**: User Stories 1, 2, AND 3 complete - users can create, list, and complete tasks

---

## Phase 6: User Story 4 - Update Task via Chat (Priority: P3)

**Goal**: Enable users to modify task details by chatting

**Independent Test**: Create task, send "Change buy groceries to buy organic groceries", verify update in database

### MCP Tool Implementation for User Story 4

- [ ] T071 [US4] Create backend/src/mcp/tools/update_task.py with update_task MCP tool
- [ ] T072 [US4] Define update_task input schema (user_id: str, task_id: str, new_title: str) in backend/src/mcp/tools/update_task.py
- [ ] T073 [US4] Define update_task output schema (task_id: str, title: str, updated_at: str) in backend/src/mcp/tools/update_task.py
- [ ] T074 [US4] Implement update_task logic: find task, update title, save to database, return result
- [ ] T075 [US4] Add validation for new_title (non-empty, max length) in update_task tool
- [ ] T076 [US4] Register update_task tool with MCP server in backend/src/mcp/server.py

### Agent Prompt Updates for User Story 4

- [ ] T077 [US4] Update system prompt to include update_task tool usage guidelines
- [ ] T078 [US4] Add examples of update commands ("Change X to Y", "Update Z", "Rename A to B")
- [ ] T079 [US4] Add strategy for handling ambiguous task references

### Tests for User Story 4

- [ ] T080 [P] [US4] Unit test for update_task MCP tool in backend/tests/unit/test_update_task.py
- [ ] T081 [P] [US4] Integration test for updating task via chat in backend/tests/integration/test_chat_update_task.py

**Checkpoint**: User Stories 1-4 complete - full task CRUD via chat (except delete)

---

## Phase 7: User Story 5 - Delete Task via Chat (Priority: P3)

**Goal**: Enable users to remove tasks by chatting

**Independent Test**: Create task, send "Delete buy groceries", verify task removed from database

### MCP Tool Implementation for User Story 5

- [ ] T082 [US5] Create backend/src/mcp/tools/delete_task.py with delete_task MCP tool
- [ ] T083 [US5] Define delete_task input schema (user_id: str, task_id: str) in backend/src/mcp/tools/delete_task.py
- [ ] T084 [US5] Define delete_task output schema (success: bool, task_id: str) in backend/src/mcp/tools/delete_task.py
- [ ] T085 [US5] Implement delete_task logic: find task, delete from database, return confirmation
- [ ] T086 [US5] Add confirmation strategy for bulk deletions ("Clear my list") in delete_task tool
- [ ] T087 [US5] Register delete_task tool with MCP server in backend/src/mcp/server.py

### Agent Prompt Updates for User Story 5

- [ ] T088 [US5] Update system prompt to include delete_task tool usage guidelines
- [ ] T089 [US5] Add examples of deletion commands ("Delete X", "Remove Y", "Clear my list")
- [ ] T090 [US5] Add confirmation requirement for bulk deletions to system prompt

### Tests for User Story 5

- [ ] T091 [P] [US5] Unit test for delete_task MCP tool in backend/tests/unit/test_delete_task.py
- [ ] T092 [P] [US5] Integration test for deleting task via chat in backend/tests/integration/test_chat_delete_task.py
- [ ] T093 [P] [US5] Test agent asks confirmation for "Clear my list" in backend/tests/integration/test_agent_delete_confirmation.py

**Checkpoint**: User Stories 1-5 complete - full task CRUD via chat

---

## Phase 8: User Story 6 - Conversation Context Awareness (Priority: P2)

**Goal**: Enable chatbot to remember conversation context for natural interactions

**Independent Test**: Multi-turn conversation: "Add buy milk" → "Also add eggs" → "Show me what I added"

### Implementation for User Story 6

- [ ] T094 [US6] Verify conversation history loading includes all previous messages in backend/src/services/agent.py
- [ ] T095 [US6] Update system prompt to emphasize context awareness ("that", "the first one", "what I just added")
- [ ] T096 [US6] Implement message truncation strategy for very long conversations (>100 messages) in backend/src/services/agent.py
- [ ] T097 [US6] Add conversation context to agent execution in backend/src/services/agent.py

### Tests for User Story 6

- [ ] T098 [P] [US6] Integration test for multi-turn conversation in backend/tests/integration/test_chat_context_awareness.py
- [ ] T099 [P] [US6] Test agent understands "that" refers to previous message in backend/tests/integration/test_agent_reference_resolution.py
- [ ] T100 [P] [US6] Test agent handles "the first one" after listing tasks in backend/tests/integration/test_agent_list_reference.py

**Checkpoint**: All 6 user stories complete - full conversational task management

---

## Phase 9: Frontend (ChatKit Integration)

**Purpose**: Replace Phase II form-based UI with conversational chat interface

### ChatKit Setup

- [ ] T101 Create frontend/src/components/ChatInterface.tsx with OpenAI ChatKit component
- [ ] T102 [P] Create frontend/src/components/MessageList.tsx for displaying messages
- [ ] T103 [P] Create frontend/src/services/chat.ts with chat API client
- [ ] T104 Configure ChatKit with Better Auth integration in frontend/src/components/ChatInterface.tsx
- [ ] T105 Implement message sending to POST /api/{user_id}/chat in frontend/src/services/chat.ts
- [ ] T106 Implement message receiving and display in frontend/src/components/ChatInterface.tsx
- [ ] T107 Add loading state during API calls in frontend/src/components/ChatInterface.tsx
- [ ] T108 Add error handling and display in frontend/src/components/ChatInterface.tsx

### Frontend Pages

- [ ] T109 Create frontend/src/app/chat/page.tsx main chat page
- [ ] T110 Update frontend/src/app/layout.tsx to route authenticated users to /chat
- [ ] T111 Remove or deprecate Phase II task form pages (frontend/src/app/todos/)
- [ ] T112 Update frontend navigation to only show chat page

### Frontend Tests

- [ ] T113 [P] Component test for ChatInterface in frontend/tests/ChatInterface.test.tsx
- [ ] T114 [P] Integration test for chat API client in frontend/tests/chat.test.ts

**Checkpoint**: Frontend complete - users interact via chat interface

---

## Phase 10: Validation & Hardening

**Purpose**: Verify constitutional compliance and system correctness

### Constitutional Compliance Verification

- [ ] T115 Verify no REST CRUD endpoints exist for tasks (only auth and chat endpoints remain)
- [ ] T116 Verify all task mutations occur via MCP tools only (code review of backend/src/api/)
- [ ] T117 Test statelessness via request replay (same input produces same output)
- [ ] T118 Validate user data isolation (users can only access their own tasks and conversations)
- [ ] T119 Verify server has no in-memory state (code review for global variables, caches)
- [ ] T120 Verify conversation history reconstructed from database on every request (add logging to confirm)

### End-to-End Testing

- [ ] T121 [P] E2E test: Create task via chat and verify in database
- [ ] T122 [P] E2E test: List tasks via chat and verify correct tasks returned
- [ ] T123 [P] E2E test: Complete task via chat and verify status updated
- [ ] T124 [P] E2E test: Update task via chat and verify title changed
- [ ] T125 [P] E2E test: Delete task via chat and verify task removed
- [ ] T126 [P] E2E test: Multi-turn conversation with context awareness
- [ ] T127 [P] E2E test: Ambiguous command triggers clarification question
- [ ] T128 [P] E2E test: Error scenario (OpenAI API failure) returns user-friendly message

### Performance Testing

- [ ] T129 Test conversation history reconstruction performance (<500ms for 100 messages)
- [ ] T130 Test chat response time (<3 seconds including OpenAI API latency)
- [ ] T131 Test MCP tool execution performance (<100ms per tool call)
- [ ] T132 Load test with concurrent users (verify stateless architecture handles concurrency)

### Documentation

- [ ] T133 Update README.md with Phase III architecture explanation
- [ ] T134 Document Phase II → Phase III evolution in README.md
- [ ] T135 Create MCP tools documentation in docs/mcp-tools.md
- [ ] T136 Document agent system prompt in docs/agent-prompt.md
- [ ] T137 Create deployment guide in docs/deployment.md
- [ ] T138 Update environment variables documentation in .env.example
- [ ] T139 Create quickstart guide in docs/quickstart.md

**Checkpoint**: Phase III complete and validated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - Can proceed in parallel (if staffed) or sequentially by priority (P1 → P2 → P3)
  - US1 (P1) → US2 (P1) → US3 (P2) → US6 (P2) → US4 (P3) → US5 (P3)
- **Frontend (Phase 9)**: Can start after US1-US5 are complete (needs working chat endpoint)
- **Validation (Phase 10)**: Depends on all user stories and frontend being complete

### User Story Dependencies

- **US1 (P1)**: Create task - No dependencies on other stories
- **US2 (P1)**: List tasks - No dependencies (but more useful after US1)
- **US3 (P2)**: Complete task - Depends on US1 (need tasks to complete) and US2 (to verify completion)
- **US4 (P3)**: Update task - Depends on US1 (need tasks to update)
- **US5 (P3)**: Delete task - Depends on US1 (need tasks to delete)
- **US6 (P2)**: Context awareness - Depends on US1-US5 (needs operations to reference)

### Within Each User Story

- MCP tool implementation before agent prompt updates
- Agent prompt updates before tests
- Unit tests can run in parallel with integration tests
- All tests for a story should pass before moving to next story

### Parallel Opportunities

- All Setup tasks (T001-T006) can run in parallel
- Database models (T007-T008) can run in parallel
- Database migrations (T009-T010) can run in parallel after models
- MCP server setup (T014-T018) can run in parallel with Agent setup (T019-T024)
- Within each user story, unit tests and integration tests marked [P] can run in parallel
- Once Foundational phase completes, US1 and US2 can start in parallel (both P1)
- Frontend tasks (T101-T103, T113-T114) can run in parallel
- Validation tests (T121-T128) can run in parallel
- Documentation tasks (T133-T139) can run in parallel

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: US1 (Create task via chat)
4. Complete Phase 4: US2 (List tasks via chat)
5. **STOP and VALIDATE**: Test US1 and US2 independently
6. Deploy/demo if ready (users can create and view tasks via chat)

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 + US2 → Test independently → Deploy/Demo (MVP!)
3. Add US3 (Complete) → Test independently → Deploy/Demo
4. Add US6 (Context) → Test independently → Deploy/Demo
5. Add US4 (Update) → Test independently → Deploy/Demo
6. Add US5 (Delete) → Test independently → Deploy/Demo
7. Add Frontend (ChatKit) → Test independently → Deploy/Demo
8. Validation & Hardening → Final deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Create task)
   - Developer B: US2 (List tasks)
3. After US1 + US2:
   - Developer A: US3 (Complete task)
   - Developer B: US6 (Context awareness)
4. After US3 + US6:
   - Developer A: US4 (Update task)
   - Developer B: US5 (Delete task)
5. After US4 + US5:
   - Developer A: Frontend (ChatKit)
   - Developer B: Validation & Testing

---

## Success Criteria

- [ ] All 5 MCP tools implemented and tested (add, list, complete, update, delete)
- [ ] Single chat endpoint handles all task operations
- [ ] Server remains stateless (verified by load testing)
- [ ] Conversation context reconstructed correctly (verified by multi-turn tests)
- [ ] Agent interprets 90%+ of common commands correctly (verified by test suite)
- [ ] No REST CRUD endpoints for tasks remain
- [ ] Frontend uses ChatKit for all interactions
- [ ] All tests pass (unit, integration, end-to-end)
- [ ] Performance goals met (<3s response time, <500ms history reconstruction)
- [ ] Documentation complete and accurate
- [ ] Constitutional compliance verified

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution compliance is non-negotiable - any violation requires regeneration
