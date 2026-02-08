"""
Delete Task MCP Tool

This tool permanently removes a task from the database.

Constitutional Compliance:
- Tool is stateless (no instance variables)
- Accepts all required data as parameters (user_id, task_id)
- Persists changes to database (deletion)
- Returns structured output
"""

from typing import Any, Dict
from uuid import UUID
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from .base import BaseMCPTool, ToolInput, ToolOutput
from ...models.todo import Todo

logger = logging.getLogger(__name__)


class DeleteTaskInput(ToolInput):
    """Input schema for delete_task tool."""
    user_id: str = Field(description="User UUID as string")
    task_id: str = Field(description="Task UUID as string to delete")


class DeleteTaskOutput(ToolOutput):
    """Output schema for delete_task tool."""
    success: bool = Field(description="Whether deletion was successful")
    task_id: str = Field(description="Deleted task UUID as string")
    title: str = Field(description="Title of the deleted task")


class DeleteTaskTool(BaseMCPTool):
    """
    MCP tool for deleting a task.

    This tool:
    1. Validates input (user_id, task_id)
    2. Finds the task in the database
    3. Deletes the task permanently
    4. Returns structured output confirming deletion

    Constitutional Compliance:
    - Stateless: No instance state between calls
    - Database-persistent: Deletion saved to database
    - Structured output: Returns validated schema
    """

    @property
    def name(self) -> str:
        return "delete_task"

    @property
    def description(self) -> str:
        return "Permanently delete a task. Use this when the user wants to remove, delete, or clear a task from their list."

    @property
    def input_schema(self) -> type[ToolInput]:
        return DeleteTaskInput

    @property
    def output_schema(self) -> type[ToolOutput]:
        return DeleteTaskOutput

    async def execute(self, user_id: str, task_id: str) -> Dict[str, Any]:
        """
        Execute the delete_task tool.

        Args:
            user_id: User UUID as string
            task_id: Task UUID as string

        Returns:
            Dictionary with success status, task_id, and title

        Raises:
            ValueError: If user_id or task_id is invalid
            Exception: If task not found or database operation fails
        """
        logger.info(f"Deleting task {task_id} for user {user_id}")

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

            # Store title before deletion for confirmation
            task_title = task.title

            # Delete from database
            await self.db_session.delete(task)
            await self.db_session.commit()

            logger.info(f"Task {task_id} deleted successfully")

            # Return structured output
            return {
                "success": True,
                "task_id": str(task_uuid),
                "title": task_title
            }

        except ValueError as e:
            logger.error(f"Invalid input or task not found: {e}")
            raise ValueError(str(e))
        except Exception as e:
            logger.error(f"Error deleting task: {e}")
            await self.db_session.rollback()
            raise
