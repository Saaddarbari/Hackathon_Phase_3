"""
MCP Server Implementation

This module implements the MCP server using the official MCP SDK.
The server exposes task management tools to the OpenAI Agent.
"""

from typing import Optional
from sqlmodel import Session
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import logging

from ..config.database import get_session
from .tools import ToolRegistry

logger = logging.getLogger(__name__)


class MCPServer:
    """
    MCP Server for task management tools.
    """

    def __init__(self, db_session: Optional[Session] = None):
        self.server = Server("todo-mcp-server")
        self.db_session = db_session
        self.tool_registry = ToolRegistry()

        # Register all tools
        self._register_tools()

        logger.info("MCP Server initialized with 5 task management tools")

    def _register_tools(self) -> None:
        """Register all MCP tools with the server."""
        session = self.get_session()

        from .tools.add_task import AddTaskTool
        from .tools.list_tasks import ListTasksTool
        from .tools.complete_task import CompleteTaskTool
        from .tools.update_task import UpdateTaskTool
        from .tools.delete_task import DeleteTaskTool

        tools = [
            AddTaskTool(db_session=session),
            ListTasksTool(db_session=session),
            CompleteTaskTool(db_session=session),
            UpdateTaskTool(db_session=session),
            DeleteTaskTool(db_session=session)
        ]

        for tool in tools:
            self.tool_registry.register(tool.name, tool)

        logger.info(f"Registered {self.tool_registry.count} MCP tools")

    def get_session(self) -> Session:
        """Get a database session for tool execution."""
        if self.db_session:
            return self.db_session
        return next(get_session())

    async def start(self) -> None:
        """Start the MCP server."""
        logger.info("Starting MCP server...")
        # Server startup logic here
        pass

    async def stop(self) -> None:
        """Stop the MCP server."""
        logger.info("Stopping MCP server...")
        # Server shutdown logic here
        pass
