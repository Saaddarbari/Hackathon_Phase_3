"""
Base MCP Tool

This module defines the base class for all MCP tools.

Constitutional Compliance:
- Tools MUST be stateless
- Tools MUST accept all required data as parameters
- Tools MUST persist results to the database
- Tools MUST return structured outputs
"""

from abc import ABC, abstractmethod
from typing import Any, Dict
from pydantic import BaseModel, ValidationError
from sqlmodel import Session
import logging

logger = logging.getLogger(__name__)


class ToolInput(BaseModel):
    """Base class for tool input schemas."""
    pass


class ToolOutput(BaseModel):
    """Base class for tool output schemas."""
    pass


class BaseMCPTool(ABC):
    """
    Base class for all MCP tools.

    All tools must:
    1. Define input and output schemas
    2. Implement the execute method
    3. Be stateless (no instance variables that persist between calls)
    4. Persist all changes to the database
    5. Return structured outputs
    """

    def __init__(self, db_session: Session):
        """
        Initialize the tool with a database session.

        Args:
            db_session: SQLModel database session for persistence
        """
        self.db_session = db_session

    @property
    @abstractmethod
    def name(self) -> str:
        """Tool name (e.g., 'add_task')."""
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """Tool description for the agent."""
        pass

    @property
    @abstractmethod
    def input_schema(self) -> type[ToolInput]:
        """Pydantic model for input validation."""
        pass

    @property
    @abstractmethod
    def output_schema(self) -> type[ToolOutput]:
        """Pydantic model for output structure."""
        pass

    @abstractmethod
    def execute(self, **kwargs: Any) -> Dict[str, Any]:
        """
        Execute the tool with validated inputs.

        Args:
            **kwargs: Tool parameters (validated against input_schema)

        Returns:
            Structured output (validated against output_schema)

        Raises:
            ValidationError: If inputs or outputs don't match schemas
            Exception: If tool execution fails
        """
        pass

    async def __call__(self, **kwargs: Any) -> Dict[str, Any]:
        """
        Call the tool with input validation.

        Args:
            **kwargs: Tool parameters

        Returns:
            Structured output

        Raises:
            ValidationError: If inputs are invalid
        """
        try:
            # Validate inputs
            validated_input = self.input_schema(**kwargs)
            logger.info(f"Executing tool '{self.name}' with inputs: {validated_input}")

            # Execute tool (async)
            result = await self.execute(**validated_input.model_dump())

            # Validate outputs
            validated_output = self.output_schema(**result)
            logger.info(f"Tool '{self.name}' completed successfully")

            return validated_output.model_dump()

        except ValidationError as e:
            logger.error(f"Validation error in tool '{self.name}': {e}")
            raise
        except Exception as e:
            logger.error(f"Error executing tool '{self.name}': {e}")
            raise
