from sqlmodel import Session, select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from typing import Optional, List
import uuid

from src.models.todo import Todo
from src.models.user import User
from src.api.schemas.todo import TodoCreate, TodoUpdate


async def create_todo(session: AsyncSession, user: User, todo_data: TodoCreate) -> Todo:
    """Create a new todo for the authenticated user."""
    todo = Todo(
        title=todo_data.title,
        description=todo_data.description,
        user_id=user.id  # T054: Associate todo with user
    )
    session.add(todo)
    await session.commit()
    await session.refresh(todo)
    return todo


async def get_todos(session: AsyncSession, user: User) -> List[Todo]:
    """Get all todos for the authenticated user.

    T064: Filter by user_id for data isolation
    """
    result = await session.execute(
        select(Todo).where(Todo.user_id == user.id).order_by(Todo.created_at.desc())
    )
    return list(result.scalars().all())


async def get_todo_by_id(session: AsyncSession, todo_id: uuid.UUID, user: User) -> Optional[Todo]:
    """Get a specific todo by ID for the authenticated user."""
    result = await session.execute(
        select(Todo).where(Todo.id == todo_id).where(Todo.user_id == user.id)
    )
    return result.scalars().one_or_none()


async def update_todo(
    session: AsyncSession,
    todo_id: uuid.UUID,
    user: User,
    todo_data: TodoUpdate
) -> Optional[Todo]:
    """Update a todo for the authenticated user.

    T085: Verify user ownership before updating
    """
    todo = await get_todo_by_id(session, todo_id, user)

    if not todo:
        return None

    if todo_data.title is not None:
        todo.title = todo_data.title
    if todo_data.description is not None:
        todo.description = todo_data.description

    await session.commit()
    await session.refresh(todo)
    return todo


async def delete_todo(session: AsyncSession, todo_id: uuid.UUID, user: User) -> bool:
    """Delete a todo for the authenticated user.

    T095: Verify user ownership before deleting
    """
    todo = await get_todo_by_id(session, todo_id, user)

    if not todo:
        return False

    await session.delete(todo)
    await session.commit()
    return True


async def toggle_todo_complete(
    session: AsyncSession,
    todo_id: uuid.UUID,
    user: User
) -> Optional[Todo]:
    """Toggle todo completion status for the authenticated user.

    T076: Verify user ownership before toggling
    """
    todo = await get_todo_by_id(session, todo_id, user)

    if not todo:
        return None

    todo.completed = not todo.completed
    await session.commit()
    await session.refresh(todo)
    return todo
