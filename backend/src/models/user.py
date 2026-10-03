from datetime import datetime, timezone
import enum
from sqlalchemy import String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.core.db import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    DEVELOPER = "developer"
    VIEWER = "viewer"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.DEVELOPER, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    
    # Relationships
    owned_projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    assigned_tasks = relationship("Task", back_populates="assignee")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
