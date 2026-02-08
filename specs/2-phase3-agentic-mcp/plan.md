# Implementation Plan: Phase III - Todo AI Chatbot (Agentic + MCP)

**Branch**: `2-phase3-agentic-mcp` | **Date**: 2026-02-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/2-phase3-agentic-mcp/spec.md`

## Summary

Phase III transforms the Phase II REST API todo application into an agent-first conversational system. All user interactions flow through a single chat endpoint (`POST /api/{user_id}/chat`), where an OpenAI Agent interprets natural language and executes task operations exclusively via MCP (Model Context Protocol) tools. The FastAPI backend becomes stateless, reconstructing conversation context from Neon PostgreSQL on every request. The frontend migrates from form-based UI to OpenAI ChatKit for natural language interaction.

**Key Architectural Shift**: REST CRUD endpoints → Single chat endpoint + Agent + MCP tools

## Technical Context

**Language/Version**:
- Backend: Python 3.11+ (unchanged from Phase II)
- Frontend: TypeScript 5.0+ (unchanged from Phase II)

**Primary Dependencies**:
- Backend: FastAPI, OpenAI Agents SDK (NEW), MCP SDK (NEW), SQLModel, Pydantic
- Frontend: Next.js (App Router), React 18+, OpenAI ChatKit (NEW - replaces form UI)
- Database: Neon Serverless PostgreSQL (unchanged)
- Authentication: Better Auth (unchanged from Phase II)

**Storage**: Neon Serverless PostgreSQL with new tables:
- `conversations` - Chat sessions
- `messages` - User and assistant messages
- `tasks` - Existing table (schema unchanged)
- `users` - Existing table (schema unchanged)

**Testing**:
- Backend: pytest with httpx for API testing, MCP tool unit tests
- Frontend: Vitest with React Testing Library
- Agent testing: Conversation flow tests with mock OpenAI responses

**Target Platform**:
- Backend: Linux server (containerized)
- Frontend: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)

**Project Type**: web (full-stack application with separate frontend and backend)

**Performance Goals**:
- Chat response time: p95 < 3 seconds (including OpenAI API latency)
- Conversation history reconstruction: < 500ms for 100 messages
- MCP tool execution: < 100ms per tool call
- Support up to 1000 concurrent users

**Constraints** (from Constitution):
- Server MUST be stateless (no in-memory state)
- Database is the ONLY source of truth
- Single chat endpoint only (no REST CRUD for tasks)
- All task mutations via MCP tools only
- Agent decides all actions (no direct business logic in API layer)

**Scale/Scope**:
- User accounts: up to 10,000
- Conversations per user: unlimited
- Messages per conversation: up to 1,000 (with truncation strategy)
- Tasks per user: up to 1,000
- MCP tools: 5 (add_task, list_tasks, complete_task, update_task, delete_task)
- API endpoints: 1 chat endpoint + existing auth endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Compliance Assessment**:

✅ **Stateless Server Rule (2.1)**: Plan enforces no in-memory state; conversation reconstruction from database on every request

✅ **Database as Source of Truth (2.2)**: All state (tasks, conversations, messages) stored in Neon PostgreSQL

✅ **Single Chat Entry Point (2.3)**: Plan defines exactly ONE endpoint: `POST /api/{user_id}/chat`

✅ **No Direct Business Logic in API Layer (3.1)**: FastAPI endpoint only orchestrates; agent decides actions

✅ **AI Agent as Decision Maker (3.2)**: OpenAI Agents SDK interprets natural language and sequences tool calls

✅ **MCP as Only Mutation Layer (4.1)**: Task operations exposed ONLY as MCP tools; REST CRUD endpoints removed

✅ **MCP Tool Constraints (4.2)**: Tools are stateless, accept parameters, persist to database, return structured outputs

✅ **Required MCP Tools (4.3)**: Plan includes all 5 required tools

✅ **Stateless Conversation Cycle (5.1)**: Plan follows exact cycle: receive → fetch history → append → run agent → persist → return

✅ **Conversation Persistence (5.2)**: Every user and assistant message stored

✅ **Technology Lock (8)**: FastAPI, OpenAI Agents SDK, MCP SDK, SQLModel, Neon PostgreSQL, Better Auth

**Gate Status**: **PASS** - Plan fully complies with Phase III constitution

## Project Structure

### Documentation (this feature)

```text
specs/2-phase3-agentic-mcp/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file (IN PROGRESS)
├── research.md          # Phase 0 output (PENDING)
├── data-model.md        # Phase 1 output (PENDING)
├── quickstart.md        # Phase 1 output (PENDING)
├── contracts/           # Phase 1 output (PENDING)
│   ├── chat-api.yaml    # Chat endpoint OpenAPI spec
│   └── mcp-tools.yaml   # MCP tool definitions
└── tasks.md             # Phase 2 output (PENDING - created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── user.py              # Existing (unchanged)
│   │   ├── task.py              # Existing (unchanged)
│   │   ├── conversation.py      # NEW - Conversation model
│   │   └── message.py           # NEW - Message model
│   ├── services/
│   │   ├── auth.py              # Existing (unchanged)
│   │   └── agent.py             # NEW - Agent orchestration
│   ├── mcp/
│   │   ├── __init__.py          # NEW - MCP server setup
│   │   ├── server.py            # NEW - MCP server implementation
│   │   └── tools/               # NEW - MCP tool implementations
│   │       ├── add_task.py
│   │       ├── list_tasks.py
│   │       ├── complete_task.py
│   │       ├── update_task.py
│   │       └── delete_task.py
│   └── api/
│       ├── main.py              # Modified - remove task CRUD routes
│       ├── auth.py              # Existing (unchanged)
│       └── chat.py              # NEW - Single chat endpoint
└── tests/
    ├── unit/
    │   ├── test_mcp_tools.py    # NEW - MCP tool tests
    │   └── test_agent.py        # NEW - Agent logic tests
    ├── integration/
    │   └── test_chat_flow.py    # NEW - End-to-end chat tests
    └── contract/
        └── test_mcp_contract.py # NEW - MCP tool contract tests

frontend/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx    # NEW - ChatKit integration
│   │   └── MessageList.tsx      # NEW - Message display
│   ├── pages/
│   │   ├── auth/                # Existing (unchanged)
│   │   └── chat.tsx             # NEW - Main chat page
│   └── services/
│       ├── auth.ts              # Existing (unchanged)
│       └── chat.ts              # NEW - Chat API client
└── tests/
    └── chat.test.tsx            # NEW - Chat UI tests

alembic/
└── versions/
    └── xxx_add_conversations_messages.py  # NEW - Migration script
```

**Structure Decision**: Maintaining Phase II web application structure (separate backend/frontend). Adding new `mcp/` module in backend for MCP server and tools. Removing task CRUD routes from `api/main.py`. Frontend migrates from form-based pages to chat interface using OpenAI ChatKit.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. Plan fully complies with constitution.

## Phase 0: Research & Discovery

### 0.1 OpenAI Agents SDK Research

**Objective**: Understand how to integrate OpenAI Agents SDK with FastAPI

**Research Questions**:
1. How does OpenAI Agents SDK handle tool calling?
2. What's the recommended pattern for stateless agent execution?
3. How do we pass conversation history to the agent?
4. What's the error handling strategy for agent failures?
5. How do we stream responses vs. wait for completion?

**Deliverable**: `research.md` section on OpenAI Agents SDK integration patterns

### 0.2 MCP SDK Research

**Objective**: Understand MCP server implementation in Python

**Research Questions**:
1. How do we define MCP tools with input/output schemas?
2. What's the lifecycle of an MCP server in a FastAPI app?
3. How does the agent discover and call MCP tools?
4. What's the error propagation model from MCP tools to agent?
5. Can MCP tools access database connections safely?

**Deliverable**: `research.md` section on MCP SDK patterns and tool definition

### 0.3 OpenAI ChatKit Research

**Objective**: Understand ChatKit integration with Next.js

**Research Questions**:
1. How do we integrate ChatKit with Next.js App Router?
2. What's the authentication flow with Better Auth?
3. How do we customize ChatKit UI for our branding?
4. What's the message format expected by ChatKit?
5. How do we handle loading states and errors?

**Deliverable**: `research.md` section on ChatKit integration

### 0.4 Conversation Reconstruction Strategy

**Objective**: Design efficient conversation history loading

**Research Questions**:
1. What's the optimal message limit for context window?
2. Should we truncate old messages or summarize them?
3. How do we handle very long conversations (1000+ messages)?
4. What indexes do we need for fast conversation queries?
5. Should we cache conversation history (violates stateless rule)?

**Deliverable**: `research.md` section on conversation reconstruction patterns

### 0.5 Migration Strategy from Phase II

**Objective**: Plan the transition from REST to Agent architecture

**Research Questions**:
1. Can we run Phase II and Phase III endpoints simultaneously?
2. How do we migrate existing tasks to the new system?
3. Should we deprecate REST endpoints or remove them entirely?
4. How do we handle users mid-transition?
5. What's the rollback strategy if Phase III fails?

**Deliverable**: `research.md` section on migration approach

## Phase 1: Design & Contracts

### 1.1 Database Schema Design

**Objective**: Define new tables for conversations and messages

**Deliverable**: `data-model.md` with:
- `conversations` table schema (id, user_id, created_at, updated_at)
- `messages` table schema (id, conversation_id, role, content, timestamp, tool_calls)
- Relationships and foreign keys
- Indexes for performance (user_id, conversation_id, timestamp)
- Migration script outline

### 1.2 MCP Tool Contracts

**Objective**: Define input/output schemas for all 5 MCP tools

**Deliverable**: `contracts/mcp-tools.yaml` with:
- `add_task`: Input (user_id, title), Output (task_id, title, created_at)
- `list_tasks`: Input (user_id, filter?), Output (tasks[])
- `complete_task`: Input (user_id, task_id), Output (task_id, completed, updated_at)
- `update_task`: Input (user_id, task_id, new_title), Output (task_id, title, updated_at)
- `delete_task`: Input (user_id, task_id), Output (success, task_id)

### 1.3 Chat API Contract

**Objective**: Define the single chat endpoint specification

**Deliverable**: `contracts/chat-api.yaml` with:
- Endpoint: `POST /api/{user_id}/chat`
- Request: `{ message: string, conversation_id?: string }`
- Response: `{ response: string, conversation_id: string, timestamp: string }`
- Error responses: 401 (unauthorized), 400 (bad request), 500 (server error)

### 1.4 Agent Prompt Design

**Objective**: Define the system prompt for the OpenAI Agent

**Deliverable**: `contracts/agent-prompt.md` with:
- System role definition ("You are a helpful todo assistant...")
- Tool usage guidelines (when to call which tool)
- Clarification strategies (how to handle ambiguity)
- Error handling instructions (user-friendly messages)
- Conversation style guidelines (friendly, concise)

### 1.5 Quickstart Guide

**Objective**: Document setup and usage for Phase III

**Deliverable**: `quickstart.md` with:
- Prerequisites (OpenAI API key, Neon database)
- Backend setup (install dependencies, run migrations, start server)
- Frontend setup (install dependencies, configure ChatKit, start dev server)
- Testing the chat interface
- Example conversations

## Phase 2: Implementation Breakdown

*Note: Detailed tasks will be generated by `/sp.tasks` command*

**Implementation Objective**: Implement the Phase III Todo AI Chatbot using an agent-first, MCP-driven architecture that fully complies with sp.constitution and sp.specify.

### Phase 1 – Foundation Setup (Priority: P1)

**Goal**: Establish stateless backend infrastructure with database persistence

- Initialize FastAPI backend (ensure stateless configuration)
- Configure Neon PostgreSQL connection (reuse Phase II connection)
- Setup SQLModel entities:
  - User (existing, unchanged)
  - Task (existing, unchanged)
  - Conversation (NEW)
  - Message (NEW)
- Create Alembic migration for conversations and messages tables
- Add database indexes for performance (user_id, conversation_id, timestamp)
- Apply database migrations
- Test migration on development database
- Document rollback procedure

**Acceptance Criteria**:
- Database schema includes conversations and messages tables
- All models use SQLModel with proper relationships
- Migrations run successfully without errors
- Backend starts without maintaining any in-memory state

---

### Phase 2 – MCP Server (Priority: P1)

**Goal**: Implement MCP server with 5 stateless, database-persistent tools

- Initialize MCP server using official MCP SDK in `backend/src/mcp/server.py`
- Define MCP tools with input/output schemas:
  - `add_task` - Create new task for user
  - `list_tasks` - Retrieve all tasks for user
  - `update_task` - Modify task title
  - `complete_task` - Toggle task completion status
  - `delete_task` - Remove task from database
- Implement each tool in `backend/src/mcp/tools/` directory
- Ensure tools are stateless (no shared state between calls)
- Ensure tools persist all changes to database immediately
- Add input validation for all tool parameters
- Write unit tests for each tool
- Test tool execution independently (without agent)

**Acceptance Criteria**:
- All 5 MCP tools implemented and registered
- Tools accept parameters, persist to DB, return structured outputs
- Tools have no side effects beyond database writes
- Unit tests pass for all tools
- Tools can be called independently for testing

---

### Phase 3 – Agent Layer (Priority: P1)

**Goal**: Integrate OpenAI Agents SDK with MCP tools

- Create `backend/src/services/agent.py`
- Configure OpenAI Agents SDK
- Define system prompt enforcing constitution rules:
  - Agent role as todo assistant
  - Tool usage guidelines
  - Clarification strategies for ambiguous commands
  - User-friendly error messaging
- Register MCP tools with the agent
- Enable intent parsing and tool sequencing
- Implement conversation history loading from database
- Implement agent execution with MCP tools
- Add error handling and retry logic for OpenAI API failures
- Write unit tests for agent service

**Acceptance Criteria**:
- Agent correctly interprets natural language commands
- Agent calls appropriate MCP tools based on user intent
- Agent asks clarifying questions for ambiguous commands
- Agent handles errors gracefully with user-friendly messages
- Unit tests pass for agent service

---

### Phase 4 – Chat Orchestration API (Priority: P1)

**Goal**: Implement single stateless chat endpoint

- Create `backend/src/api/chat.py`
- Implement single endpoint: `POST /api/{user_id}/chat`
- Add authentication middleware (reuse Better Auth from Phase II)
- Implement stateless conversation cycle:
  1. Receive user message
  2. Load conversation history from database
  3. Append new user message to history
  4. Execute agent with MCP tools
  5. Persist assistant response to database
  6. Return response to client
- Add request/response logging for observability
- Persist user messages, agent responses, and tool calls to database
- Write integration tests for chat endpoint
- Remove Phase II REST CRUD endpoints from `backend/src/api/main.py`
- Update API documentation
- Test that only chat endpoint remains for task operations

**Acceptance Criteria**:
- Single chat endpoint handles all user interactions
- Server remains stateless (no in-memory conversation state)
- Conversation history reconstructed from database on every request
- All messages and tool calls persisted to database
- Authentication enforced on chat endpoint
- No REST CRUD endpoints for tasks remain
- Integration tests pass

---

### Phase 5 – Frontend (ChatKit) (Priority: P2)

**Goal**: Replace form-based UI with conversational chat interface

- Install OpenAI ChatKit dependencies
- Create `frontend/src/components/ChatInterface.tsx`
- Integrate OpenAI ChatKit UI
- Connect to chat endpoint (`POST /api/{user_id}/chat`)
- Integrate with Better Auth (reuse Phase II authentication)
- Implement chat API client in `frontend/src/services/chat.ts`
- Display assistant responses and confirmations
- Add loading and error states
- Create main chat page at `frontend/src/pages/chat.tsx`
- Write component tests for chat interface
- Remove or deprecate Phase II form-based task pages

**Acceptance Criteria**:
- ChatKit UI renders correctly
- Users can send messages and receive responses
- Authentication works with Better Auth
- Loading states display during API calls
- Errors display user-friendly messages
- Component tests pass

---

### Phase 6 – Validation & Hardening (Priority: P3)

**Goal**: Verify constitutional compliance and system correctness

- Verify no REST CRUD endpoints exist for tasks
- Confirm all mutations occur via MCP tools only
- Test statelessness via request replay (same input = same output)
- Validate user data isolation (users can only access their own data)
- Write conversation flow tests (end-to-end)
- Test all 5 task operations via chat:
  - Create task via natural language
  - List tasks via natural language
  - Complete task via natural language
  - Update task via natural language
  - Delete task via natural language
- Test ambiguous command handling (agent asks clarifying questions)
- Test error scenarios (invalid inputs, API failures)
- Test conversation context awareness (multi-turn conversations)
- Performance testing (conversation reconstruction < 500ms for 100 messages)
- Update README with Phase III architecture explanation
- Document MCP tools and agent prompt
- Create deployment guide
- Update environment variables documentation

**Acceptance Criteria**:
- All constitutional requirements verified
- Users can manage todos entirely through chat
- All state changes executed via MCP tools
- Zero server-side memory between requests
- All tests pass (unit, integration, end-to-end)
- Performance goals met
- Documentation complete

---

**Success Gate**: The implementation is complete when users can manage todos entirely through chat, with all state changes executed via MCP tools and zero server-side memory between requests.

## Architectural Decisions Requiring ADRs

📋 **Architectural decision detected: Stateless conversation reconstruction strategy**
   - Decision: Reconstruct full conversation history from database on every request
   - Alternatives: In-memory caching, Redis session store, conversation summarization
   - Tradeoffs: Simplicity and constitutional compliance vs. potential performance impact
   - Document reasoning and tradeoffs? Run `/sp.adr stateless-conversation-reconstruction`

📋 **Architectural decision detected: MCP tool error handling strategy**
   - Decision: MCP tools return structured errors; agent translates to user-friendly messages
   - Alternatives: Tools throw exceptions, tools return success/failure booleans
   - Tradeoffs: Clear error propagation vs. additional agent complexity
   - Document reasoning and tradeoffs? Run `/sp.adr mcp-error-handling`

📋 **Architectural decision detected: Single chat endpoint vs. separate conversation management**
   - Decision: Single endpoint handles both new and existing conversations
   - Alternatives: Separate endpoints for create/continue conversation
   - Tradeoffs: Simplicity and constitutional compliance vs. REST conventions
   - Document reasoning and tradeoffs? Run `/sp.adr single-chat-endpoint`

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| OpenAI API rate limits | High | Medium | Implement exponential backoff, user-friendly error messages, consider fallback responses |
| Agent misinterprets commands | Medium | High | Comprehensive prompt engineering, clarification questions, extensive testing with example phrases |
| Conversation reconstruction performance | Medium | Medium | Database indexes, query optimization, message truncation for very long conversations |
| MCP tool failures | High | Low | Comprehensive error handling, transaction rollbacks, detailed logging |
| Frontend ChatKit integration issues | Medium | Low | Follow ChatKit documentation, use official examples, test thoroughly |
| Migration from Phase II breaks existing users | High | Low | Maintain Phase II endpoints temporarily, gradual migration, rollback plan |

## Success Metrics

- [ ] All 5 MCP tools implemented and tested
- [ ] Single chat endpoint handles all task operations
- [ ] Server remains stateless (verified by load testing)
- [ ] Conversation context reconstructed correctly (verified by multi-turn tests)
- [ ] Agent interprets 90%+ of common commands correctly (verified by test suite)
- [ ] No REST CRUD endpoints for tasks remain
- [ ] Frontend uses ChatKit for all interactions
- [ ] All tests pass (unit, integration, end-to-end)
- [ ] Performance goals met (< 3s response time, < 500ms history reconstruction)
- [ ] Documentation complete and accurate

## Dependencies & Prerequisites

**External Dependencies**:
- OpenAI API account and API key
- Neon PostgreSQL database (existing from Phase II)
- OpenAI Agents SDK (pip install)
- MCP SDK (pip install)
- OpenAI ChatKit (npm install)

**Internal Dependencies**:
- Phase II completion (user authentication, database schema)
- Better Auth integration (existing)
- SQLModel setup (existing)

**Team Dependencies**:
- None (single developer project)

## Timeline Estimate

*Note: Estimates provided for planning only, not commitments*

- Phase 0 (Research): 2-3 days
- Phase 1 (Design): 2-3 days
- Phase 2 (Implementation): 7-10 days
- Testing & Documentation: 2-3 days

**Total**: 13-19 days (approximately 3-4 weeks)

## Next Steps

1. ✅ Specification complete (`spec.md`)
2. ✅ Implementation plan complete (`plan.md` - this file)
3. ⏭️ Execute Phase 0 research (manual or via research agent)
4. ⏭️ Execute Phase 1 design (create data-model.md, contracts/, quickstart.md)
5. ⏭️ Generate executable tasks (`/sp.tasks`)
6. ⏭️ Implement Phase III system
7. ⏭️ Test against success criteria
8. ⏭️ Document ADRs as needed
