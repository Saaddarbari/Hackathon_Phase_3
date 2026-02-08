"""
Chat API Schemas

Pydantic schemas for chat endpoint request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


class ChatRequest(BaseModel):
    """
    Request schema for chat endpoint.

    Constitutional Compliance:
    - Single chat endpoint handles all user interactions
    """
    message: str = Field(
        description="User's natural language message",
        min_length=1,
        max_length=2000
    )
    conversation_id: Optional[UUID] = Field(
        default=None,
        description="Optional conversation ID to continue existing conversation"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Add buy groceries to my list",
                "conversation_id": None
            }
        }


class ChatResponse(BaseModel):
    """
    Response schema for chat endpoint.

    Constitutional Compliance:
    - Returns assistant response and conversation ID for context
    """
    response: str = Field(
        description="Assistant's response to user message"
    )
    conversation_id: UUID = Field(
        description="Conversation ID for this chat session"
    )
    timestamp: datetime = Field(
        description="Timestamp of the response"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "response": "I've added 'buy groceries' to your list!",
                "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
                "timestamp": "2026-02-08T12:00:00Z"
            }
        }
