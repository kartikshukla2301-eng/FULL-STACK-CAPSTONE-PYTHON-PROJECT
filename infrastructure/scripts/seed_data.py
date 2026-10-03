import asyncio
import sys
import os

# Add backend src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from src.core.db import Base
from src.core.security import get_password_hash
from src.models.user import User, UserRole
from src.models.project import Project
from src.models.task import Task, TaskStatus, TaskPriority

DB_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///../../backend/taskflow.db")
if DB_URL.startswith("postgresql://"):
    DB_URL = DB_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

async def seed():
    engine = create_async_engine(DB_URL, echo=True)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        # Create Demo User
        demo_user = User(
            email="demo@taskflow.com",
            full_name="Demo Manager",
            hashed_password=get_password_hash("demo123!"),
            role=UserRole.MANAGER,
        )
        session.add(demo_user)
        await session.commit()
        await session.refresh(demo_user)

        # Create Demo Project
        project = Project(
            name="TaskFlow Pro Launch",
            description="Production deployment & architecture migration sprint",
            key="TFP",
            owner_id=demo_user.id,
        )
        session.add(project)
        await session.commit()
        await session.refresh(project)

        # Create Initial Tasks
        tasks = [
            Task(
                title="Design Async Database Schema & Alembic Migrations",
                description="Set up SQLAlchemy 2.0 models with indexes and foreign keys",
                status=TaskStatus.DONE,
                priority=TaskPriority.HIGH,
                project_id=project.id,
                creator_id=demo_user.id,
                estimated_hours=8.0,
                actual_hours=6.5,
            ),
            Task(
                title="Implement Real-time WebSocket Broadcast Rooms",
                description="Enable instant task board updates across active clients",
                status=TaskStatus.IN_PROGRESS,
                priority=TaskPriority.URGENT,
                project_id=project.id,
                creator_id=demo_user.id,
                estimated_hours=12.0,
                actual_hours=4.0,
            ),
            Task(
                title="Set Up Multi-Stage Docker & Kubernetes Manifests",
                description="Configure Helm / K8s ingress and automated TLS cert-manager",
                status=TaskStatus.TODO,
                priority=TaskPriority.MEDIUM,
                project_id=project.id,
                creator_id=demo_user.id,
                estimated_hours=10.0,
                actual_hours=0.0,
            ),
        ]
        session.add_all(tasks)
        await session.commit()

        print("Database seeded successfully with demo user: demo@taskflow.com / demo123!")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed())
