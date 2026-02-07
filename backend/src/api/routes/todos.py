from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Annotated, List

from src.api.dependencies import get_db, get_current_user
from src.api.schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from src.services.todo_service import (
    create_todo,
    get_todos,
    get_todo_by_id,
    update_todo,
    delete_todo,
    toggle_todo_complete
)

router = APIRouter()


@router.post("", response_model=TodoResponse, status_code=201)
async def create(
    todo_data: TodoCreate,
    current_user: Annotated["User", Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new todo (T050).

    Creates a todo with title and optional description
    for the authenticated user. Title is required (T053).
    """
    # T053: Title validation handled by Pydantic schema
    todo = await create_todo(db, current_user, todo_data)
    return TodoResponse(
        id=todo.id,
        user_id=todo.user_id,
        title=todo.title,
        description=todo.description,
        completed=todo.completed,
        created_at=todo.created_at,
        updated_at=todo.updated_at
    )


@router.get("", response_model=List[TodoResponse])
async def get_all(
    current_user: Annotated["User", Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Get all todos for authenticated user (T062).

    Returns todos filtered by user_id (T064)
    sorted by creation date (descending).
    """
    todos = await get_todos(db, current_user)
    return [
        TodoResponse(
            id=todo.id,
            user_id=todo.user_id,
            title=todo.title,
            description=todo.description,
            completed=todo.completed,
            created_at=todo.created_at,
            updated_at=todo.updated_at
        )
        for todo in todos
    ]


@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(
    todo_id: str,
    current_user: Annotated["User", Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific todo by ID (for future use).
    """
    import uuid

    try:
        todo_uuid = uuid.UUID(todo_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid todo ID format"
        )

    todo = await get_todo_by_id(db, todo_uuid, current_user)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return TodoResponse(
        id=todo.id,
        user_id=todo.user_id,
        title=todo.title,
        description=todo.description,
        completed=todo.completed,
        created_at=todo.created_at,
        updated_at=todo.updated_at
    )


@router.put("/{todo_id}", response_model=TodoResponse)
async def update(
    todo_id: str,
    todo_data: TodoUpdate,
    current_user: Annotated["User", Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Update a todo (T082).

    Updates title and/or description.
    Title required in TodoUpdate schema (T084).
    User ownership verified (T085).
    """
    import uuid

    try:
        todo_uuid = uuid.UUID(todo_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid todo ID format"
        )

    todo = await update_todo(db, todo_uuid, current_user, todo_data)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return TodoResponse(
        id=todo.id,
        user_id=todo.user_id,
        title=todo.title,
        description=todo.description,
        completed=todo.completed,
        created_at=todo.created_at,
        updated_at=todo.updated_at
    )


@router.delete("/{todo_id}", status_code=204)
async def delete(
    todo_id: str,
    current_user: Annotated["User", Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a todo (T093).

    User ownership verified (T095).
    Returns 204 No Content on success.
    """
    import uuid

    try:
        todo_uuid = uuid.UUID(todo_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid todo ID format"
        )

    success = await delete_todo(db, todo_uuid, current_user)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )


@router.patch("/{todo_id}/complete", response_model=TodoResponse)
async def toggle_complete(
    todo_id: str,
    current_user: Annotated["User", Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Toggle todo completion status (T074).

    User ownership verified (T076).
    """
    import uuid

    try:
        todo_uuid = uuid.UUID(todo_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid todo ID format"
        )

    todo = await toggle_todo_complete(db, todo_uuid, current_user)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return TodoResponse(
        id=todo.id,
        user_id=todo.user_id,
        title=todo.title,
        description=todo.description,
        completed=todo.completed,
        created_at=todo.created_at,
        updated_at=todo.updated_at
    )
