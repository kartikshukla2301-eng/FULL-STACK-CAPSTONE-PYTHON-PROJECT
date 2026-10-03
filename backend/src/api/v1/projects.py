from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.core.db import get_db
from src.models.project import Project
from src.models.user import User
from src.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from src.services.auth_service import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectRead])
async def list_projects(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Project).where(Project.owner_id == current_user.id))
    return list(result.scalars().all())

@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = await db.execute(select(Project).where(Project.key == project_in.key))
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Project key already exists")

    project = Project(
        name=project_in.name,
        description=project_in.description,
        key=project_in.key.upper(),
        owner_id=current_user.id,
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project

@router.get("/{project_id}", response_model=ProjectRead)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
