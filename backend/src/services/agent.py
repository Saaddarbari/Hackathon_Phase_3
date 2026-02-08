"""
Agent Service

This module implements the AI agent orchestration layer using Cohere API.
The agent interprets natural language, decides which MCP tools to call, and
sequences tool calls when necessary.

Constitutional Compliance:
- Agent is the decision maker (no direct business logic in API layer)
- Agent interprets natural language and decides tool usage
- Agent sequences tool calls when necessary
- Conversation history reconstructed from database on every request
"""

from typing import Any, Optional
from uuid import UUID
from sqlmodel import Session, select
import cohere
import logging
import json

from ..models.conversation import Conversation
from ..models.message import Message
from ..mcp.server import MCPServer

logger = logging.getLogger(__name__)


class AgentService:
    """
    AI Agent service for natural language task management.

    This service:
    1. Loads conversation history from database
    2. Interprets user natural language input
    3. Decides which MCP tools to call
    4. Sequences tool calls when necessary
    5. Returns user-friendly responses
    """

    # System prompt enforcing constitutional rules
    SYSTEM_PROMPT = """You are a helpful todo assistant that helps users manage their tasks through natural conversation.

**Your Capabilities:**
You have access to 5 tools for task management:
- add_task: Create a new task for the user
- list_tasks: Show all tasks for the user
- complete_task: Mark a task as complete or incomplete
- update_task: Change the title of a task
- delete_task: Remove a task permanently

**Tool Usage Guidelines:**

**update_task Tool:**
Use this tool when the user wants to:
- Change a task's title (e.g., "Change buy groceries to buy organic groceries")
- Modify a task (e.g., "Update task 1 to include milk")
- Rename a task (e.g., "Rename the first task")

Examples of commands that should trigger update_task:
- "Change buy groceries to buy organic groceries" → update_task(task_id="...", new_title="buy organic groceries")
- "Update task 1 to include milk" → update_task(task_id="...", new_title="buy milk")
- "Rename the first one to call mom tomorrow" → list_tasks() first, then update_task(task_id="...", new_title="call mom tomorrow")

**delete_task Tool:**
Use this tool when the user wants to:
- Delete a task (e.g., "Delete buy groceries")
- Remove a task (e.g., "Remove the first task")
- Clear tasks (e.g., "Clear my list", "Delete all completed tasks")

Examples of commands that should trigger delete_task:
- "Delete buy groceries" → find task, then delete_task(task_id="...")
- "Remove the first one" → list_tasks() first, then delete_task(task_id="...")
- "Clear my list" → list_tasks() first, then ask for confirmation before deleting all
- "Delete all completed tasks" → list_tasks(filter="completed"), then ask for confirmation before deleting

**Confirmation for Bulk Deletions:**
If the user wants to delete multiple tasks or "clear my list":
- First call list_tasks() to see what will be deleted
- Ask: "This will delete [N] tasks: [list]. Are you sure?"
- Wait for confirmation before proceeding

**complete_task Tool:**
Use this tool when the user wants to:
- Mark a task as done (e.g., "Mark buy groceries as done", "Complete the first task")
- Mark a task as complete (e.g., "I finished buying groceries")
- Toggle completion status (e.g., "Mark task 1 as incomplete")

Examples of commands that should trigger complete_task:
- "Mark buy groceries as done" → complete_task(task_id="...")
- "Complete the first one" → list_tasks() first, then complete_task(task_id="...")
- "I finished buying groceries" → find matching task, then complete_task(task_id="...")
- "Done with task 2" → complete_task(task_id="...")

**Handling Task References:**
If the user references a task ambiguously:
- "the first one" → Call list_tasks() first to identify which task is first
- "buy groceries" → Search recent list_tasks results or call list_tasks() to find matching task
- If multiple matches, ask: "I found 2 tasks with 'groceries'. Which one? 1. Buy groceries 2. Buy organic groceries"

**list_tasks Tool:**
Use this tool when the user wants to:
- See their tasks (e.g., "Show my tasks", "What do I need to do?")
- View their todo list (e.g., "List my todos", "What's on my list?")
- Check what they have (e.g., "Do I have any tasks?")
- Filter tasks (e.g., "Show completed tasks", "What's left to do?")

Examples of commands that should trigger list_tasks:
- "Show my tasks" → list_tasks()
- "What do I need to do?" → list_tasks()
- "List my todos" → list_tasks()
- "Show completed tasks" → list_tasks(filter="completed")
- "What's left to do?" → list_tasks(filter="incomplete")

**Handling Empty Lists:**
If list_tasks returns no tasks:
- Respond with: "Your task list is empty! Want to add something?"
- Be encouraging and friendly

**add_task Tool:**
Use this tool when the user wants to:
- Add a new task (e.g., "Add buy groceries")
- Create a reminder (e.g., "Remind me to call mom")
- Remember something (e.g., "I need to finish the report")
- Track a todo (e.g., "Todo: review pull request")

Examples of commands that should trigger add_task:
- "Add [task]" → add_task(title="[task]")
- "Create task [task]" → add_task(title="[task]")
- "Remind me to [task]" → add_task(title="[task]")
- "I need to [task]" → add_task(title="[task]")
- "Todo: [task]" → add_task(title="[task]")

**Clarification Strategy for Task Creation:**
If the user's request is vague or ambiguous:
- Ask: "Would you like me to add '[interpreted task]' to your list?"
- For very vague input like just "groceries", ask: "Would you like me to add 'groceries' as a task?"
- If multiple tasks mentioned, confirm: "I can add these tasks: 1. [task1] 2. [task2]. Should I add them all?"

**Guidelines:**
1. **Be conversational and friendly** - Use natural language, not robotic responses
2. **Confirm actions** - Always confirm what you did (e.g., "I've added 'buy groceries' to your list!")
3. **Ask for clarification** - If the user's request is ambiguous, ask clarifying questions
4. **Handle errors gracefully** - If something goes wrong, explain it in user-friendly terms
5. **Use context** - Remember what was discussed earlier in the conversation
6. **Be concise** - Keep responses short and to the point

**Examples of Good Responses:**
- User: "Add buy groceries"
  You: "I've added 'buy groceries' to your list!"

- User: "Remind me to call mom tomorrow"
  You: "I've added 'call mom tomorrow' to your list!"

- User: "I need to finish the report and review the code"
  You: "I've added two tasks: 'finish the report' and 'review the code'!"

- User: "groceries"
  You: "Would you like me to add 'groceries' as a task to your list?"

- User: "What do I need to do?"
  You: "Here's your task list: 1. Buy groceries 2. Call mom"

- User: "Mark the first one as done"
  You: "Great! I've marked 'buy groceries' as complete."

**Important:**
- Never expose technical errors or stack traces
- Always be helpful and encouraging
- If you're unsure, ask rather than guess
- Extract clear task titles from natural language (e.g., "I should buy milk" → "buy milk")
"""

    def __init__(self, cohere_api_key: str, mcp_server: MCPServer, db_session: Session):
        """
        Initialize the Agent service.

        Args:
            cohere_api_key: Cohere API key
            mcp_server: MCP server instance with registered tools
            db_session: Database session for conversation history
        """
        self.client = cohere.Client(api_key=cohere_api_key)
        self.mcp_server = mcp_server
        self.db_session = db_session
        logger.info("Agent service initialized with Cohere")

    async def load_conversation_history(
        self,
        conversation_id: UUID,
        limit: int = 100
    ) -> list[dict[str, Any]]:
        """
        Load conversation history from database.

        Constitutional Compliance:
        - Conversation context reconstructed from database on every request
        - No in-memory conversation state

        Args:
            conversation_id: Conversation UUID
            limit: Maximum number of messages to load (default 100)

        Returns:
            List of messages in Cohere format [{"role": "USER", "message": "..."}]
        """
        logger.info(f"Loading conversation history for conversation {conversation_id}")

        # Query messages ordered by timestamp
        statement = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.timestamp)
            .limit(limit)
        )
        result = await self.db_session.execute(statement)
        messages = result.scalars().all()

        # Convert to Cohere format
        history = []
        for msg in messages:
            if msg.role == "user":
                history.append({"role": "USER", "message": msg.content})
            elif msg.role == "assistant":
                history.append({"role": "CHATBOT", "message": msg.content})

        logger.info(f"Loaded {len(history)} messages from conversation history")
        return history

    async def execute_agent(
        self,
        user_message: str,
        conversation_history: list[dict[str, Any]],
        user_id: UUID
    ) -> str:
        """
        Execute the agent with user message and conversation history.

        This method:
        1. Prepares the message list with system prompt and history
        2. Calls Cohere API with tool definitions
        3. Handles tool calls if the agent decides to use them
        4. Returns the agent's response

        Args:
            user_message: User's natural language input
            conversation_history: Previous messages in the conversation
            user_id: User UUID for tool execution

        Returns:
            Agent's response text

        Raises:
            Exception: If Cohere API call fails
        """
        logger.info(f"Executing agent for user {user_id}")

        try:
            # Define available tools for Cohere
            tools = [
                {
                    "name": "add_task",
                    "description": "Create a new task for the user. Use this when the user wants to add, create, or remember something.",
                    "parameter_definitions": {
                        "title": {
                            "description": "The task title extracted from user's natural language",
                            "type": "str",
                            "required": True
                        }
                    }
                },
                {
                    "name": "list_tasks",
                    "description": "Retrieve all tasks for the user. Use this when the user wants to see, view, or check their tasks.",
                    "parameter_definitions": {
                        "filter": {
                            "description": "Optional filter for tasks: 'all' (default), 'completed', or 'incomplete'",
                            "type": "str",
                            "required": False
                        }
                    }
                },
                {
                    "name": "complete_task",
                    "description": "Mark a task as complete or incomplete. Use this when the user wants to mark a task as done, finished, or toggle its completion status.",
                    "parameter_definitions": {
                        "task_id": {
                            "description": "The UUID of the task to mark complete/incomplete",
                            "type": "str",
                            "required": True
                        }
                    }
                },
                {
                    "name": "update_task",
                    "description": "Update the title of an existing task. Use this when the user wants to change, modify, or rename a task.",
                    "parameter_definitions": {
                        "task_id": {
                            "description": "The UUID of the task to update",
                            "type": "str",
                            "required": True
                        },
                        "new_title": {
                            "description": "The new title for the task",
                            "type": "str",
                            "required": True
                        }
                    }
                },
                {
                    "name": "delete_task",
                    "description": "Permanently delete a task. Use this when the user wants to remove, delete, or clear a task from their list.",
                    "parameter_definitions": {
                        "task_id": {
                            "description": "The UUID of the task to delete",
                            "type": "str",
                            "required": True
                        }
                    }
                }
            ]

            # Call Cohere API with tools
            response = self.client.chat(
                message=user_message,
                chat_history=conversation_history,
                preamble=self.SYSTEM_PROMPT,
                tools=tools,
                model="command-nightly"
            )

            # Check if the agent wants to call a tool
            if response.tool_calls:
                logger.info(f"Agent requested {len(response.tool_calls)} tool call(s)")

                # Handle each tool call
                tool_results = []
                for tool_call in response.tool_calls:
                    tool_name = tool_call.name
                    tool_arguments = tool_call.parameters

                    logger.info(f"Calling tool: {tool_name} with args: {tool_arguments}")

                    # Execute the tool (async)
                    result = await self.handle_tool_call(
                        tool_name=tool_name,
                        tool_arguments=tool_arguments,
                        user_id=user_id
                    )

                    tool_results.append({
                        "call": tool_call,
                        "outputs": [{"result": json.dumps(result)}]
                    })

                # Call Cohere again with tool results to get final response
                # Note: When providing tool_results, we should NOT include the message parameter
                final_response = self.client.chat(
                    chat_history=conversation_history,
                    preamble=self.SYSTEM_PROMPT,
                    tools=tools,
                    tool_results=tool_results,
                    model="command-nightly"
                )

                response_text = final_response.text
            else:
                # No tool calls, just return the response
                response_text = response.text

            logger.info("Agent execution completed")
            return response_text

        except Exception as e:
            logger.error(f"Error executing agent: {e}", exc_info=True)
            # Return user-friendly error message
            return "I'm having trouble processing your request right now. Please try again in a moment."

    async def handle_tool_call(
        self,
        tool_name: str,
        tool_arguments: dict[str, Any],
        user_id: UUID
    ) -> dict[str, Any]:
        """
        Handle a tool call from the agent.

        Args:
            tool_name: Name of the MCP tool to call
            tool_arguments: Arguments for the tool
            user_id: User UUID (injected into tool arguments)

        Returns:
            Tool execution result

        Raises:
            Exception: If tool execution fails
        """
        logger.info(f"Handling tool call: {tool_name}")

        try:
            # Inject user_id into tool arguments
            tool_arguments["user_id"] = str(user_id)

            # Get tool from registry and execute (async)
            tool = self.mcp_server.tool_registry.get(tool_name)
            result = await tool(**tool_arguments)

            logger.info(f"Tool {tool_name} executed successfully")
            return result

        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            raise
