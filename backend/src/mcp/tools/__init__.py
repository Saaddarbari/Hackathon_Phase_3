"""
MCP Tool Registry

This module manages the registration and discovery of MCP tools.

Constitutional Compliance:
- All tools are stateless
- All tools accept parameters, persist to DB, return structured outputs
- Tools are the ONLY mutation layer for tasks
"""

from typing import Dict, Any, Callable
import logging

from .add_task import AddTaskTool

logger = logging.getLogger(__name__)


class ToolRegistry:
    """
    Registry for MCP tools.

    Manages the 5 required MCP tools:
    - add_task
    - list_tasks
    - complete_task
    - update_task
    - delete_task
    """

    def __init__(self):
        """Initialize the tool registry."""
        self._tools: Dict[str, Callable] = {}
        logger.info("Tool registry initialized")

    def register(self, name: str, tool: Callable) -> None:
        """
        Register a tool with the registry.

        Args:
            name: Tool name (e.g., "add_task")
            tool: Tool callable
        """
        if name in self._tools:
            logger.warning(f"Tool '{name}' already registered, overwriting")

        self._tools[name] = tool
        logger.info(f"Registered tool: {name}")

    def get(self, name: str) -> Callable:
        """
        Get a tool by name.

        Args:
            name: Tool name

        Returns:
            Tool callable

        Raises:
            KeyError: If tool not found
        """
        if name not in self._tools:
            raise KeyError(f"Tool '{name}' not found in registry")

        return self._tools[name]

    def list_tools(self) -> list[str]:
        """
        List all registered tool names.

        Returns:
            List of tool names
        """
        return list(self._tools.keys())

    @property
    def count(self) -> int:
        """Get the number of registered tools."""
        return len(self._tools)
