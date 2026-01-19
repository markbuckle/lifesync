from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Base schema
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

# Schema for creating user
class UserCreate(UserBase):
    password: str

# Schema for updating user
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None

# Schema for reading user (response)
class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Schema for login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for token response
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None