from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid


class User(SQLModel, table=True):
    """User model representing a registered user."""

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        description="Unique identifier for the user"
    )
    email: str = Field(
        unique=True,
        index=True,
        max_length=255,
        description="User's email address (unique)"
    )
    password_hash: str = Field(
        max_length=255,
        description="Hashed password using bcrypt"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Timestamp when user was created"
    )
    updated_at: Optional[datetime] = Field(
        default=None,
        description="Timestamp when user was last updated"
    )

    # Relationships
    todos: list["Todo"] = Relationship(back_populates="user")
    conversations: list["Conversation"] = Relationship(back_populates="user")
