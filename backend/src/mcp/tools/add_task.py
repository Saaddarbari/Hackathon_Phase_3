"""
Add Task MCP Tool

This tool creates a new task for a user.

Constitutional Compliance:
- Tool is stateless (no instance variables)
- Accepts all required data as parameters (user_id, title)
- Persists result to database
- Returns structured output
"""

from typing import Any, Dict
from uuid import UUID
from pydantic import BaseModel, Field
from sqlmodel import Session
import logging

from .base import BaseMCPTool, ToolInput, ToolOutput
from ...models.todo import Todo

logger = logging.getLogger(__name__)


class AddTaskInput(ToolInput):
    """Input schema for add_task tool."""
    user_id: str = Field(description="User UUID as string")
    title: str = Field(
        description="Task title",
        min_length=1,
        max_length=500
    )


class AddTaskOutput(ToolOutput):
    """Output schema for add_task tool."""
    task_id: str = Field(description="Created task UUID as string")
    title: str = Field(description="Task title")
    created_at: str = Field(description="Task creation timestamp (ISO format)")


class AddTaskTool(BaseMCPTool):
    """
    MCP tool for creating a new task.

    This tool:
    1. Validates input (user_id, title)
    2. Creates a new task in the database
    3. Returns structured output with task details

    Constitutional Compliance:
    - Stateless: No instance state between calls
    - Database-persistent: All changes saved to database
    - Structured output: Returns validated schema
    """

    @property
    def name(self) -> str:
        return "add_task"

    @property
    def description(self) -> str:
        return "Create a new task for the user. Use this when the user wants to add, create, or remember something."

    @property
    def input_schema(self) -> type[ToolInput]:
        return AddTaskInput

    @property
    def output_schema(self) -> type[ToolOutput]:
        return AddTaskOutput

    async def execute(self, user_id: str, title: str) -> Dict[str, Any]:
        """
        Execute the add_task tool.

        Args:
            user_id: User UUID as string
            title: Task title

        Returns:
            Dictionary with task_id, title, and created_at

        Raises:
            ValueError: If user_id is invalid
            Exception: If database operation fails
        """
        logger.info(f"Creating task for user {user_id}: {title}")

        try:
            # Convert user_id string to UUID
            user_uuid = UUID(user_id)

            # Create new task (using Todo model from Phase II)
            task = Todo(
                user_id=user_uuid,
                title=title,
                completed=False
            )

            # Persist to database
            self.db_session.add(task)
            await self.db_session.commit()
            await self.db_session.refresh(task)

            logger.info(f"Task created successfully: {task.id}")

            # Return structured output
            return {
                "task_id": str(task.id),
                "title": task.title,
                "created_at": task.created_at.isoformat()
            }

        except ValueError as e:
            logger.error(f"Invalid user_id format: {user_id}")
            raise ValueError(f"Invalid user_id: {e}")
        except Exception as e:
            logger.error(f"Error creating task: {e}")
            self.db_session.rollback()
            raise
