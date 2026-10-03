from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from src.schemas.user import UserRead

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    key: str

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectRead(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    owner: Optional[UserRead] = None

    model_config = ConfigDict(from_attributes=True)
