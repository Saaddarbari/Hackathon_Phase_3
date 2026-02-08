"""
Update Task MCP Tool

This tool modifies the title of an existing task.

Constitutional Compliance:
- Tool is stateless (no instance variables)
- Accepts all required data as parameters (user_id, task_id, new_title)
- Persists changes to database
- Returns structured output
"""

from typing import Any, Dict
from uuid import UUID
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from datetime import datetime
import logging

from .base import BaseMCPTool, ToolInput, ToolOutput
from ...models.todo import Todo

logger = logging.getLogger(__name__)


class UpdateTaskInput(ToolInput):
    """Input schema for update_task tool."""
    user_id: str = Field(description="User UUID as string")
    task_id: str = Field(description="Task UUID as string to update")
    new_title: str = Field(
        description="New task title",
        min_length=1,
        max_length=500
    )


class UpdateTaskOutput(ToolOutput):
    """Output schema for update_task tool."""
    task_id: str = Field(description="Task UUID as string")
    title: str = Field(description="Updated task title")
    updated_at: str = Field(description="Task update timestamp (ISO format)")


class UpdateTaskTool(BaseMCPTool):
    """
    MCP tool for updating a task's title.

    This tool:
    1. Validates input (user_id, task_id, new_title)
    2. Finds the task in the database
    3. Updates the title
    4. Updates the updated_at timestamp
    5. Returns structured output with new title

    Constitutional Compliance:
    - Stateless: No instance state between calls
    - Database-persistent: All changes saved to database
    - Structured output: Returns validated schema
    """

    @property
    def name(self) -> str:
        return "update_task"

    @property
    def description(self) -> str:
        return "Update the title of an existing task. Use this when the user wants to change, modify, or rename a task."

    @property
    def input_schema(self) -> type[ToolInput]:
        return UpdateTaskInput

    @property
    def output_schema(self) -> type[ToolOutput]:
        return UpdateTaskOutput

    async def execute(self, user_id: str, task_id: str, new_title: str) -> Dict[str, Any]:
        """
        Execute the update_task tool.

        Args:
            user_id: User UUID as string
            task_id: Task UUID as string
            new_title: New task title

        Returns:
            Dictionary with task_id, updated title, and updated_at

        Raises:
            ValueError: If user_id, task_id, or new_title is invalid
            Exception: If task not found or database operation fails
        """
        logger.info(f"Updating task {task_id} for user {user_id}: {new_title}")

        try:
            # Convert strings to UUIDs
            user_uuid = UUID(user_id)
            task_uuid = UUID(task_id)

            # Find the task
            statement = select(Todo).where(
                Todo.id == task_uuid,
                Todo.user_id == user_uuid
            )
            result = await self.db_session.execute(statement)
            task = result.scalars().first()

            if not task:
                raise ValueError(f"Task {task_id} not found for user {user_id}")

            # Update title and timestamp
            task.title = new_title
            task.updated_at = datetime.utcnow()

            # Persist to database
            self.db_session.add(task)
            await self.db_session.commit()
            await self.db_session.refresh(task)

            logger.info(f"Task {task_id} updated successfully")

            # Return structured output
            return {
                "task_id": str(task.id),
                "title": task.title,
                "updated_at": task.updated_at.isoformat()
            }

        except ValueError as e:
            logger.error(f"Invalid input or task not found: {e}")
            raise ValueError(str(e))
        except Exception as e:
            logger.error(f"Error updating task: {e}")
            await self.db_session.rollback()
            raise
