"""
List Tasks MCP Tool

This tool retrieves all tasks for a user.

Constitutional Compliance:
- Tool is stateless (no instance variables)
- Accepts all required data as parameters (user_id, optional filter)
- Queries database for current state
- Returns structured output
"""

from typing import Any, Dict, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from sqlmodel import Session, select
import logging

from .base import BaseMCPTool, ToolInput, ToolOutput
from ...models.todo import Todo

logger = logging.getLogger(__name__)


class ListTasksInput(ToolInput):
    """Input schema for list_tasks tool."""
    user_id: str = Field(description="User UUID as string")
    filter: Optional[str] = Field(
        default=None,
        description="Optional filter: 'all', 'completed', or 'incomplete'"
    )


class TaskItem(BaseModel):
    """Individual task item in the list."""
    task_id: str = Field(description="Task UUID as string")
    title: str = Field(description="Task title")
    completed: bool = Field(description="Task completion status")
    created_at: str = Field(description="Task creation timestamp (ISO format)")


class ListTasksOutput(ToolOutput):
    """Output schema for list_tasks tool."""
    tasks: list[TaskItem] = Field(description="List of tasks")
    count: int = Field(description="Total number of tasks returned")


class ListTasksTool(BaseMCPTool):
    """
    MCP tool for listing all tasks for a user.

    This tool:
    1. Validates input (user_id, optional filter)
    2. Queries database for user's tasks
    3. Applies filter if specified (all/completed/incomplete)
    4. Returns structured list of tasks

    Constitutional Compliance:
    - Stateless: No instance state between calls
    - Database-query: Reads current state from database
    - Structured output: Returns validated schema
    """

    @property
    def name(self) -> str:
        return "list_tasks"

    @property
    def description(self) -> str:
        return "Retrieve all tasks for the user. Use this when the user wants to see, view, or check their tasks."

    @property
    def input_schema(self) -> type[ToolInput]:
        return ListTasksInput

    @property
    def output_schema(self) -> type[ToolOutput]:
        return ListTasksOutput

    async def execute(self, user_id: str, filter: Optional[str] = None) -> Dict[str, Any]:
        """
        Execute the list_tasks tool.

        Args:
            user_id: User UUID as string
            filter: Optional filter ('all', 'completed', 'incomplete')

        Returns:
            Dictionary with tasks list and count

        Raises:
            ValueError: If user_id or filter is invalid
            Exception: If database operation fails
        """
        logger.info(f"Listing tasks for user {user_id} with filter: {filter}")

        try:
            # Convert user_id string to UUID
            user_uuid = UUID(user_id)

            # Build query
            statement = select(Todo).where(Todo.user_id == user_uuid)

            # Apply filter if specified
            if filter == "completed":
                statement = statement.where(Todo.completed == True)
            elif filter == "incomplete":
                statement = statement.where(Todo.completed == False)
            elif filter and filter != "all":
                raise ValueError(f"Invalid filter: {filter}. Must be 'all', 'completed', or 'incomplete'")

            # Order by creation date (newest first)
            statement = statement.order_by(Todo.created_at.desc())

            # Execute query
            result = await self.db_session.execute(statement)
            tasks = result.scalars().all()

            logger.info(f"Found {len(tasks)} tasks for user {user_id}")

            # Convert to output format
            task_items = [
                {
                    "task_id": str(task.id),
                    "title": task.title,
                    "completed": task.completed,
                    "created_at": task.created_at.isoformat()
                }
                for task in tasks
            ]

            # Return structured output
            return {
                "tasks": task_items,
                "count": len(task_items)
            }

        except ValueError as e:
            logger.error(f"Invalid input: {e}")
            raise ValueError(f"Invalid input: {e}")
        except Exception as e:
            logger.error(f"Error listing tasks: {e}")
            raise
