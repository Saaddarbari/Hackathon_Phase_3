from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
import uuid


class TodoCreate(BaseModel):
    """Request schema for creating a todo."""
    title: str = Field(..., min_length=1, max_length=255, description="Todo title (required)")
    description: Optional[str] = Field(None, max_length=2000, description="Optional todo description")


class TodoUpdate(BaseModel):
    """Request schema for updating a todo."""
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Todo title")
    description: Optional[str] = Field(None, max_length=2000, description="Todo description")


class TodoResponse(BaseModel):
    """Response schema for todo data."""
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
