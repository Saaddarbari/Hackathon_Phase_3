from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError

from src.models.user import User
from src.config.settings import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)  # Default 24 hour session
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def decode_token(token: str) -> dict:
    """Decode and verify a JWT token."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        raise ValueError("Invalid token")


async def register_user(session: Session, email: str, password: str) -> User:
    """Register a new user.

    Args:
        session: Database session
        email: User email address
        password: User plain text password

    Returns:
        User object

    Raises:
        ValueError: If email is already registered
    """
    # Check if email already exists
    result = await session.execute(
        select(User).where(User.email == email)
    )
    existing_user = result.scalars().one_or_none()

    if existing_user:
        raise ValueError("Email already registered")

    # Create new user with hashed password
    user = User(
        email=email,
        password_hash=get_password_hash(password)
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user with email and password.

    Args:
        session: Database session
        email: User email address
        password: User plain text password

    Returns:
        User object if credentials are valid, None otherwise
    """
    result = await session.execute(
        select(User).where(User.email == email)
    )
    user = result.scalars().one_or_none()

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user
