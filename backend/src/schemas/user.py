from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from src.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[UserRole] = UserRole.DEVELOPER

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    type: Optional[str] = None
