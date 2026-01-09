"""
Pydantic schemas for request/response validation
User schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models.user import UserRole


# Base schema
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.STAFF


# Create request
class UserCreate(UserBase):
    password: str


# Update request
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


# Response
class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True  # Enable ORM mode


# Login
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Token
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
