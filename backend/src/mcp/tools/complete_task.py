"""
Complete Task MCP Tool

This tool toggles the completion status of a task.

Constitutional Compliance:
- Tool is stateless (no instance variables)
- Accepts all required data as parameters (user_id, task_id)
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


class CompleteTaskInput(ToolInput):
    """Input schema for complete_task tool."""
    user_id: str = Field(description="User UUID as string")
    task_id: str = Field(description="Task UUID as string to mark complete/incomplete")


class CompleteTaskOutput(ToolOutput):
    """Output schema for complete_task tool."""
    task_id: str = Field(description="Task UUID as string")
    title: str = Field(description="Task title")
    completed: bool = Field(description="New completion status")
    updated_at: str = Field(description="Task update timestamp (ISO format)")


class CompleteTaskTool(BaseMCPTool):
    """
    MCP tool for toggling task completion status.

    This tool:
    1. Validates input (user_id, task_id)
    2. Finds the task in the database
    3. Toggles the completed status
    4. Updates the updated_at timestamp
    5. Returns structured output with new status

    Constitutional Compliance:
    - Stateless: No instance state between calls
    - Database-persistent: All changes saved to database
    - Structured output: Returns validated schema
    """

    @property
    def name(self) -> str:
        return "complete_task"

    @property
    def description(self) -> str:
        return "Mark a task as complete or incomplete. Use this when the user wants to mark a task as done, finished, or toggle its completion status."

    @property
    def input_schema(self) -> type[ToolInput]:
        return CompleteTaskInput

    @property
    def output_schema(self) -> type[ToolOutput]:
        return CompleteTaskOutput

    async def execute(self, user_id: str, task_id: str) -> Dict[str, Any]:
        """
        Execute the complete_task tool.

        Args:
            user_id: User UUID as string
            task_id: Task UUID as string

        Returns:
            Dictionary with task_id, title, completed status, and updated_at

        Raises:
            ValueError: If user_id or task_id is invalid
            Exception: If task not found or database operation fails
        """
        logger.info(f"Toggling completion for task {task_id} (user {user_id})")

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

            # Toggle completion status
            task.completed = not task.completed
            task.updated_at = datetime.utcnow()

            # Persist to database
            self.db_session.add(task)
            await self.db_session.commit()
            await self.db_session.refresh(task)

            logger.info(f"Task {task_id} completion toggled to {task.completed}")

            # Return structured output
            return {
                "task_id": str(task.id),
                "title": task.title,
                "completed": task.completed,
                "updated_at": task.updated_at.isoformat()
            }

        except ValueError as e:
            logger.error(f"Invalid input or task not found: {e}")
            raise ValueError(str(e))
        except Exception as e:
            logger.error(f"Error completing task: {e}")
            await self.db_session.rollback()
            raise
