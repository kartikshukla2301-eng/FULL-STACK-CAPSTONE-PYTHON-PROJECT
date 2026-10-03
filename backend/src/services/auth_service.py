from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status, Depends
from src.core.db import get_db
from src.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, oauth2_scheme, decode_token
from src.models.user import User
from src.schemas.user import UserCreate

class AuthService:
    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    @staticmethod
    async def register_user(db: AsyncSession, user_in: UserCreate) -> User:
        existing = await AuthService.get_user_by_email(db, user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )
        hashed_pw = get_password_hash(user_in.password)
        db_user = User(
            email=user_in.email,
            full_name=user_in.full_name,
            hashed_password=hashed_pw,
            role=user_in.role,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
        user = await AuthService.get_user_by_email(db, email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    payload = decode_token(token)
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = await AuthService.get_user_by_id(db, int(user_id_str))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user
