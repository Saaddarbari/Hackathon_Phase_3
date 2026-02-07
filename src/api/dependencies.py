from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlmodel import Session, select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Generator
import uuid

from src.config.database import get_session
from src.config.settings import settings
from src.models.user import User
from src.services.auth_service import decode_token

# Security scheme for JWT tokens in Authorization header
security = HTTPBearer()


async def get_db() -> AsyncSession:
    """Dependency to get database session."""
    async for session in get_session():
        yield session


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Dependency to get current authenticated user from JWT token.

    Raises:
        HTTPException: 401 if token is invalid or missing
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    if not credentials or not credentials.credentials:
        raise credentials_exception

    try:
        token = credentials.credentials
        payload = decode_token(token)
        user_id: str = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except (JWTError, ValueError) as e:
        raise credentials_exception

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise credentials_exception

    result = await db.execute(
        select(User).where(User.id == user_uuid)
    )
    user = result.scalars().one_or_none()

    if not user:
        raise credentials_exception

    return user
