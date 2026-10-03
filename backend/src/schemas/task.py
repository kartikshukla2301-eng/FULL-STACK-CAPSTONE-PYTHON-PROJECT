from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from src.models.task import TaskStatus, TaskPriority
from src.schemas.user import UserRead

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    estimated_hours: Optional[float] = 0.0
    actual_hours: Optional[float] = 0.0
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None

class TaskCreate(TaskBase):
    project_id: int

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None

class TaskRead(TaskBase):
    id: int
    project_id: int
    creator_id: int
    created_at: datetime
    updated_at: datetime
    assignee: Optional[UserRead] = None

    model_config = ConfigDict(from_attributes=True)
