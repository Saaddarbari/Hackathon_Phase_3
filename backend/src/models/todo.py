from sqlmodel import SQLModel, Field, Relationship, ForeignKey
from typing import Optional
from datetime import datetime
import uuid
from .user import User


class Todo(SQLModel, table=True):
    """Todo model representing a task for a user."""

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        description="Unique identifier for todo"
    )
    user_id: uuid.UUID = Field(
        foreign_key="user.id",
        index=True,
        description="Foreign key to the owning user"
    )
    title: str = Field(
        max_length=255,
        description="Title of the todo (required)"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Optional detailed description of the todo"
    )
    completed: bool = Field(
        default=False,
        index=True,
        description="Whether the todo is completed"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
        description="Timestamp when todo was created"
    )
    updated_at: Optional[datetime] = Field(
        default=None,
        description="Timestamp when todo was last updated"
    )

    # Relationship to user (many-to-one)
    user: User = Relationship(back_populates="todos")

    class Config:
        indexes = [
            ("user_id", "created_at"),
            ("user_id", "completed"),
        ]
