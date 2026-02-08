"""
MCP (Model Context Protocol) Server Package

This package contains the MCP server implementation and tool definitions
for the Phase III agent-first architecture.

Constitutional Compliance:
- MCP tools are the ONLY mutation layer for tasks
- All tools are stateless
- All tools persist to database
- All tools return structured outputs
"""

from .server import MCPServer
from .tools import ToolRegistry

__all__ = ["MCPServer", "ToolRegistry"]
