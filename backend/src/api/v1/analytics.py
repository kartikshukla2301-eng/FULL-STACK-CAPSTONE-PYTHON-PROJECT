from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.db import get_db
from src.models.user import User
from src.services.analytics_service import AnalyticsService
from src.services.auth_service import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/project/{project_id}")
async def get_project_analytics(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await AnalyticsService.get_project_metrics(db, project_id=project_id)
