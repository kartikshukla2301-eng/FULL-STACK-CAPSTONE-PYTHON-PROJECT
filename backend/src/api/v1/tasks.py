from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.db import get_db
from src.models.user import User
from src.models.task import TaskStatus
from src.schemas.task import TaskCreate, TaskRead, TaskUpdate
from src.services.task_service import TaskService
from src.services.export_service import ExportService
from src.services.auth_service import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=List[TaskRead])
async def list_tasks(
    project_id: int,
    status: Optional[TaskStatus] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await TaskService.get_tasks(db, project_id=project_id, status=status)

@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await TaskService.create_task(db, task_in=task_in, creator_id=current_user.id)

@router.patch("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = await TaskService.update_task(db, task_id=task_id, task_in=task_in, user_id=current_user.id)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = await TaskService.delete_task(db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")

@router.get("/export/csv")
async def export_tasks_csv(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tasks = await TaskService.get_tasks(db, project_id=project_id)
    csv_data = ExportService.export_tasks_to_csv(tasks)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=project_{project_id}_tasks.csv"},
    )
