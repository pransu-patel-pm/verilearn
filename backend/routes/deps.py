"""
JWT Authentication dependency — extracts and validates the current user from Bearer token.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from config import get_settings
from database.connection import get_db
from models.user_model import User

settings = get_settings()
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    FastAPI dependency — decodes JWT, fetches user from DB.
    Use: current_user: User = Depends(get_current_user)
    """
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID.",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )

    return user


async def require_student(
    current_user: User = Depends(get_current_user),
) -> User:
    """Require the authenticated user to have 'student' role."""
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required.",
        )
    return current_user


async def require_teacher(
    current_user: User = Depends(get_current_user),
) -> User:
    """Require the authenticated user to have 'teacher' role."""
    if current_user.role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher access required.",
        )
    return current_user
