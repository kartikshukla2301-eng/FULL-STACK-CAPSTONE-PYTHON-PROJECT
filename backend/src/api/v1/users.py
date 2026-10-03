from fastapi import APIRouter, Depends
from src.models.user import User
from src.schemas.user import UserRead
from src.services.auth_service import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserRead)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user
