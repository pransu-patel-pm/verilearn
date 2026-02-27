"""
User ORM model + Pydantic schemas.
"""

from sqlalchemy import Column, Integer, String, DateTime, func
from pydantic import BaseModel, EmailStr, Field
from typing import Literal
from datetime import datetime

from database.connection import Base


# ==================== ORM Model ====================

class User(Base):
    """users table."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # "student" or "teacher"
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ==================== Request Schemas ====================

class UserRegister(BaseModel):
    """Registration payload."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Literal["student", "teacher"]


class UserLogin(BaseModel):
    """Login payload."""
    email: EmailStr
    password: str


# ==================== Response Schemas ====================

class UserResponse(BaseModel):
    """Public user data returned in responses."""
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
