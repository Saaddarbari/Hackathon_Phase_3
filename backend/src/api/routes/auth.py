from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from src.api.dependencies import get_db, get_current_user
from src.api.schemas.user import SignupRequest, SigninRequest, AuthResponse, UserResponse
from src.services.auth_service import register_user, authenticate_user, create_access_token
from src.models.user import User

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=201)
async def signup(
    user_data: SignupRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user.

    Creates a user account with email and password.
    Validates email format and enforces password requirements.
    """
    try:
        # Truncate password to 72 characters for bcrypt
        truncated_password = user_data.password[:72]

        user = await register_user(db, user_data.email, truncated_password)

        # Create JWT token with user_id as subject
        token = create_access_token(data={"sub": str(user.id)})

        return AuthResponse(
            access_token=token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                created_at=user.created_at
            )
        )

    except ValueError as e:
        # Handle duplicate email or other validation errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )


@router.post("/signin", response_model=AuthResponse)
async def signin(
    credentials: SigninRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate an existing user.

    Validates email and password, returns JWT token on success.
    """
    # Truncate password to 72 characters for bcrypt
    truncated_password = credentials.password[:72]

    user = await authenticate_user(db, credentials.email, truncated_password)

    if not user:
        # Invalid credentials (email not found or wrong password)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create JWT token
    token = create_access_token(data={"sub": str(user.id)})

    return AuthResponse(
        access_token=token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            created_at=user.created_at
        )
    )


@router.post("/signout")
async def signout(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Sign out the current user.

    In a JWT-based system, signout is handled on the client side
    by discarding the token. This endpoint validates the token exists.
    """
    return {"message": "Successfully signed out"}
