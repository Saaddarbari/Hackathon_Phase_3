from sqlmodel import SQLModel, Field, Relationship, Column, JSON
from datetime import datetime
from typing import Optional, Any, TYPE_CHECKING
from uuid import UUID, uuid4

if TYPE_CHECKING:
    from .conversation import Conversation


class Message(SQLModel, table=True):
    """
    Message model representing a single message in a conversation.

    Constitutional Compliance:
    - Every user and assistant message stored in database
    - Tool calls optionally stored for observability
    - No in-memory message state
    """
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id", index=True)
    role: str = Field(description="Message role: 'user' or 'assistant'")
    content: str = Field(description="Message content")
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    tool_calls: Optional[dict[str, Any]] = Field(default=None, sa_column=Column(JSON), description="Optional tool call metadata for observability")

    # Relationships
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174002",
                "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
                "role": "user",
                "content": "Add buy groceries to my list",
                "timestamp": "2026-02-08T12:00:00Z",
                "tool_calls": None
            }
        }
