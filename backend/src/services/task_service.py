from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from src.models.task import Task, TaskStatus, ActivityLog
from src.schemas.task import TaskCreate, TaskUpdate

class TaskService:
    @staticmethod
    async def get_tasks(
        db: AsyncSession, project_id: int, status: Optional[TaskStatus] = None
    ) -> List[Task]:
        query = select(Task).where(Task.project_id == project_id)
        if status:
            query = query.where(Task.status == status)
        query = query.order_by(Task.created_at.desc())
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def create_task(db: AsyncSession, task_in: TaskCreate, creator_id: int) -> Task:
        db_task = Task(
            title=task_in.title,
            description=task_in.description,
            status=task_in.status,
            priority=task_in.priority,
            project_id=task_in.project_id,
            assignee_id=task_in.assignee_id,
            creator_id=creator_id,
            estimated_hours=task_in.estimated_hours,
            actual_hours=task_in.actual_hours,
            due_date=task_in.due_date,
        )
        db.add(db_task)
        await db.commit()
        await db.refresh(db_task)

        # Log activity
        log = ActivityLog(task_id=db_task.id, user_id=creator_id, action="Created task")
        db.add(log)
        await db.commit()

        return db_task

    @staticmethod
    async def update_task(
        db: AsyncSession, task_id: int, task_in: TaskUpdate, user_id: int
    ) -> Optional[Task]:
        result = await db.execute(select(Task).where(Task.id == task_id))
        task = result.scalars().first()
        if not task:
            return None

        update_data = task_in.model_dump(exclude_unset=True)
        for field, val in update_data.items():
            setattr(task, field, val)

        db.add(task)
        log = ActivityLog(task_id=task.id, user_id=user_id, action=f"Updated fields: {list(update_data.keys())}")
        db.add(log)
        await db.commit()
        await db.refresh(task)
        return task

    @staticmethod
    async def delete_task(db: AsyncSession, task_id: int) -> bool:
        result = await db.execute(select(Task).where(Task.id == task_id))
        task = result.scalars().first()
        if not task:
            return False
        await db.delete(task)
        await db.commit()
        return True
