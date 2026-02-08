# Feature Specification: Phase III - Todo AI Chatbot (Agentic + MCP)

**Feature Branch**: `2-phase3-agentic-mcp`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "Evolve the Phase II Todo app into a Phase III agent-first system where all user intent is handled via a single chat endpoint and all state changes occur exclusively through MCP tools."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Task via Natural Language (Priority: P1)

As an authenticated user, I want to create tasks by chatting naturally so that I can quickly capture todos without navigating forms or UI elements.

**Why this priority**: This is the foundational capability that proves the agent-first architecture works. Without natural language task creation, the entire Phase III value proposition fails.

**Independent Test**: Can be fully tested by sending a chat message like "Add buy groceries to my list" and verifying the task appears in the database and the assistant confirms creation.

**Acceptance Scenarios**:

1. **Given** I am authenticated and send "Add buy groceries", **When** the agent processes my message, **Then** a new task is created via MCP tool and I receive confirmation
2. **Given** I send "Remind me to call mom tomorrow", **When** the agent interprets this, **Then** a task "call mom tomorrow" is created and confirmed
3. **Given** I send a vague message like "groceries", **When** the agent is uncertain, **Then** it asks clarifying questions before creating the task
4. **Given** I send multiple tasks in one message "Add buy milk and eggs", **When** the agent processes this, **Then** two separate tasks are created and confirmed

---

### User Story 2 - List Tasks via Chat (Priority: P1)

As an authenticated user, I want to view my tasks by asking in natural language so that I can quickly check what needs to be done.

**Why this priority**: Users need to see their tasks to understand what the system has stored. This validates that task creation worked and provides context for other operations.

**Independent Test**: Can be fully tested by sending "Show me my tasks" or "What do I need to do?" and verifying the assistant returns the current task list from the database.

**Acceptance Scenarios**:

1. **Given** I have 3 tasks in my list, **When** I send "Show my tasks", **Then** the agent calls list_tasks MCP tool and displays all 3 tasks
2. **Given** I have no tasks, **When** I send "What's on my list?", **Then** the agent responds with a friendly message indicating the list is empty
3. **Given** I have completed and incomplete tasks, **When** I ask "What do I need to do?", **Then** the agent shows all tasks with their completion status
4. **Given** I ask "Do I have any tasks?", **When** the agent processes this, **Then** it provides a summary count and optionally lists them

---

### User Story 3 - Complete Task via Chat (Priority: P2)

As an authenticated user, I want to mark tasks complete by chatting so that I can update my progress naturally.

**Why this priority**: Completing tasks is a core workflow. This demonstrates the agent can handle state mutations beyond creation.

**Independent Test**: Can be fully tested by creating a task, then sending "Mark buy groceries as done" and verifying the task status updates in the database.

**Acceptance Scenarios**:

1. **Given** I have a task "buy groceries", **When** I send "Mark buy groceries as complete", **Then** the agent calls complete_task MCP tool and confirms the update
2. **Given** I have multiple tasks, **When** I send "Done with the first one", **Then** the agent asks for clarification or completes the most recent task
3. **Given** I reference a non-existent task, **When** I try to complete it, **Then** the agent responds with a friendly error and suggests listing tasks
4. **Given** I send "I finished buying groceries", **When** the agent interprets this, **Then** it finds the matching task and marks it complete

---

### User Story 4 - Update Task via Chat (Priority: P3)

As an authenticated user, I want to modify task details by chatting so that I can correct or refine my todos.

**Why this priority**: Users need flexibility to change task descriptions. This is less critical than creation and completion but important for usability.

**Independent Test**: Can be fully tested by creating a task, then sending "Change buy groceries to buy organic groceries" and verifying the update in the database.

**Acceptance Scenarios**:

1. **Given** I have a task "buy groceries", **When** I send "Change buy groceries to buy organic groceries", **Then** the agent calls update_task MCP tool and confirms the change
2. **Given** I send "Update the first task to include milk", **When** the agent processes this, **Then** it updates the task description appropriately
3. **Given** I reference a task ambiguously, **When** I try to update it, **Then** the agent asks which task I mean
4. **Given** I try to update a non-existent task, **When** the agent processes this, **Then** it responds with a helpful error message

---

### User Story 5 - Delete Task via Chat (Priority: P3)

As an authenticated user, I want to remove tasks by chatting so that I can clean up my list naturally.

**Why this priority**: Task deletion is necessary for list maintenance but less critical than creation and completion. Users can work around missing deletion temporarily.

**Independent Test**: Can be fully tested by creating a task, then sending "Delete buy groceries" and verifying the task is removed from the database.

**Acceptance Scenarios**:

1. **Given** I have a task "buy groceries", **When** I send "Delete buy groceries", **Then** the agent calls delete_task MCP tool and confirms removal
2. **Given** I send "Remove all completed tasks", **When** the agent processes this, **Then** it lists completed tasks and asks for confirmation before deletion
3. **Given** I try to delete a non-existent task, **When** the agent processes this, **Then** it responds with a friendly error
4. **Given** I send "Clear my list", **When** the agent interprets this, **Then** it asks for confirmation before deleting all tasks

---

### User Story 6 - Conversation Context Awareness (Priority: P2)

As an authenticated user, I want the chatbot to remember our conversation so that I can have natural, flowing interactions.

**Why this priority**: Context awareness is essential for natural conversation. Without it, every message feels disconnected and the user experience degrades significantly.

**Independent Test**: Can be fully tested by having a multi-turn conversation like "Add buy milk" → "Also add eggs" → "Show me what I added" and verifying the agent understands "also" and "what I added" refer to previous context.

**Acceptance Scenarios**:

1. **Given** I just created a task, **When** I send "Actually, delete that", **Then** the agent understands "that" refers to the just-created task
2. **Given** I asked to list tasks, **When** I send "Complete the first one", **Then** the agent knows which task is "the first one" from the previous list
3. **Given** I'm in a conversation, **When** I send "What did I just ask you?", **Then** the agent can reference previous messages from the conversation history
4. **Given** I start a new session, **When** I send my first message, **Then** the agent treats it as a fresh conversation without prior context

---

### Edge Cases

- **What happens when the user sends an ambiguous command?** The agent asks clarifying questions before taking action (e.g., "Which task did you mean?" when multiple matches exist)
- **How does the system handle empty task lists?** The agent responds with a friendly message like "Your list is empty! Want to add something?"
- **What happens when a user references a non-existent task?** The agent responds with a helpful error and suggests listing current tasks
- **How does the system handle very long conversation histories?** The system reconstructs conversation history from the database on each request, with potential truncation for very old messages
- **What happens when MCP tool calls fail?** The agent catches errors and responds with user-friendly messages without exposing technical details
- **How does the system handle concurrent requests from the same user?** Each request is stateless and independent, so concurrent requests are handled safely by the database
- **What happens when the user sends non-task-related messages?** The agent responds conversationally and gently guides the user back to task management
- **How does the system handle malformed or injection attempts?** Input validation occurs at the MCP tool layer, and the agent sanitizes inputs before tool calls

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose exactly ONE chat endpoint at `POST /api/{user_id}/chat` for all user interactions
- **FR-002**: System MUST remain stateless - no in-memory session, cache, or global variables may store conversation or task state
- **FR-003**: System MUST store all persistent state (tasks, conversations, messages) in Neon PostgreSQL database
- **FR-004**: System MUST reconstruct conversation context from the database on every request
- **FR-005**: System MUST use OpenAI Agents SDK to interpret natural language and decide which actions to take
- **FR-006**: System MUST expose task operations ONLY as MCP tools (add_task, list_tasks, complete_task, update_task, delete_task)
- **FR-007**: System MUST NOT provide REST CRUD endpoints for tasks - all mutations occur via MCP tools
- **FR-008**: System MUST authenticate users and scope all data access to the authenticated user
- **FR-009**: System MUST persist every user message to the database before processing
- **FR-010**: System MUST persist every assistant response to the database after generation
- **FR-011**: System MUST handle ambiguous commands by asking clarifying questions
- **FR-012**: System MUST return user-friendly error messages without exposing stack traces or technical details
- **FR-013**: System MUST validate all inputs at the MCP tool layer before database operations
- **FR-014**: System MUST ensure each request is independently reproducible from database state
- **FR-015**: System MUST use Better Auth for authentication (carried over from Phase II)

### Key Entities

- **User**: Represents an authenticated user account with email and password. Relationships: owns multiple Conversations and Tasks
- **Conversation**: Represents a chat session between a user and the agent. Contains multiple Messages. Attributes: user_id, created_at, updated_at
- **Message**: Represents a single message in a conversation. Attributes: conversation_id, role (user/assistant), content, timestamp, tool_calls (optional)
- **Task**: Represents a todo item. Attributes: user_id, title, completed (boolean), created_at, updated_at. Scoped to the authenticated user

### Non-Functional Requirements

- **NFR-001**: System MUST handle conversation history reconstruction in under 500ms for conversations with up to 100 messages
- **NFR-002**: System MUST support concurrent requests from different users without state conflicts
- **NFR-003**: System MUST gracefully handle OpenAI API failures with retry logic and fallback responses
- **NFR-004**: System MUST log all MCP tool calls for observability and debugging
- **NFR-005**: System MUST use connection pooling for database access to handle concurrent requests efficiently

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create, list, complete, update, and delete tasks using ONLY natural language chat (no UI forms or buttons for task operations)
- **SC-002**: 100% of task mutations occur through MCP tools - zero direct database writes from API endpoints
- **SC-003**: Server remains stateless - no conversation or task state persists in memory between requests
- **SC-004**: Conversation context is successfully reconstructed from database on every request
- **SC-005**: Agent correctly interprets at least 90% of common task management commands (tested with a suite of example phrases)
- **SC-006**: System handles ambiguous commands by asking clarifying questions in at least 80% of cases (rather than guessing or failing)
- **SC-007**: All errors are user-friendly - zero stack traces or technical jargon exposed to users
- **SC-008**: System responds to chat messages within 3 seconds under normal load (excluding OpenAI API latency)
- **SC-009**: Database correctly isolates user data - users can only access their own tasks and conversations
- **SC-010**: System demonstrates clear architectural evolution from Phase II (REST CRUD) to Phase III (Agent + MCP)

## Out of Scope *(explicit exclusions)*

- **REST CRUD endpoints for tasks** - Phase II endpoints must be removed or deprecated
- **UI-driven task mutation** - Frontend should only send chat messages, not direct API calls for task operations
- **Background jobs or scheduled tasks** - All operations are request-driven
- **Real-time updates or WebSocket connections** - Polling or manual refresh only
- **Analytics, metrics dashboards, or reporting** - Focus is on core functionality
- **Task categories, tags, priorities, or due dates** - Keep tasks simple (title + completed status only)
- **Multi-user collaboration or task sharing** - Each user has their own isolated task list
- **Voice input or speech-to-text** - Text-based chat only
- **Mobile app or native clients** - Web-based chat interface only
- **Advanced NLP features like sentiment analysis or intent classification** - Rely on OpenAI Agents SDK capabilities
- **Undo/redo functionality** - Users can manually reverse actions via chat
- **Bulk operations** - Users can request multiple operations, but each is processed individually

## Technical Constraints *(from Constitution)*

- **Backend**: Python FastAPI (stateless)
- **AI Framework**: OpenAI Agents SDK
- **MCP Server**: Official MCP SDK
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth
- **Frontend**: OpenAI ChatKit (for chat UI)

## Governance

This specification MUST comply with `.specify/memory/constitution.md`. Any conflict between this specification and the constitution requires this specification to be regenerated until compliant.

The constitution establishes the following non-negotiable rules:
- Stateless server (no in-memory state)
- Database as single source of truth
- Single chat endpoint only
- Agent-first design (no direct business logic in API layer)
- MCP as the only mutation layer
- All task operations via MCP tools

## Dependencies

- **Phase II completion**: User authentication system must be functional
- **OpenAI API access**: Valid API key and account
- **MCP SDK**: Official Python MCP SDK must be installed and configured
- **OpenAI Agents SDK**: Must be installed and integrated with FastAPI
- **Neon PostgreSQL**: Database must be provisioned and accessible

## Migration from Phase II

- **Database schema changes**: Add Conversation and Message tables
- **Endpoint deprecation**: Remove or disable REST CRUD endpoints for tasks
- **Frontend changes**: Replace task management UI with chat interface (OpenAI ChatKit)
- **Backend refactoring**: Add agent orchestration layer and MCP server
- **Authentication**: Reuse existing Better Auth implementation

## Risks and Mitigations

- **Risk**: OpenAI API rate limits or downtime
  - **Mitigation**: Implement retry logic, exponential backoff, and user-friendly error messages

- **Risk**: Agent misinterprets user intent
  - **Mitigation**: Ask clarifying questions for ambiguous commands; log all interpretations for debugging

- **Risk**: Conversation history grows too large
  - **Mitigation**: Implement pagination or truncation for very long conversations

- **Risk**: MCP tool failures cause poor user experience
  - **Mitigation**: Comprehensive error handling and fallback responses

- **Risk**: Performance degradation with database reconstruction on every request
  - **Mitigation**: Optimize queries, use connection pooling, add database indexes

## Next Steps

1. Review and approve this specification
2. Generate implementation plan (`/sp.plan`)
3. Break plan into executable tasks (`/sp.tasks`)
4. Implement Phase III system
5. Test against success criteria
6. Document architectural decisions in ADRs as needed
