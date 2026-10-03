from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from src.models.task import Task, TaskStatus
from src.models.project import Project
from src.models.user import User

class AnalyticsService:
    @staticmethod
    async def get_project_metrics(db: AsyncSession, project_id: int) -> Dict[str, Any]:
        # Count by status
        result = await db.execute(
            select(Task.status, func.count(Task.id))
            .where(Task.project_id == project_id)
            .group_by(Task.status)
        )
        status_counts = {status.value: count for status, count in result.all()}
        
        total_tasks = sum(status_counts.values())
        done_tasks = status_counts.get("done", 0)
        completion_rate = (done_tasks / total_tasks * 100) if total_tasks > 0 else 0.0

        # Velocity data sample (last 4 sprints/weeks)
        velocity_data = [
            {"sprint": "Sprint 1", "completed_points": 24, "target_points": 25},
            {"sprint": "Sprint 2", "completed_points": 30, "target_points": 28},
            {"sprint": "Sprint 3", "completed_points": 28, "target_points": 30},
            {"sprint": "Sprint 4", "completed_points": 34, "target_points": 32},
        ]

        # Burndown sample
        burndown_data = [
            {"day": "Day 1", "remaining_hours": 120, "ideal_hours": 120},
            {"day": "Day 2", "remaining_hours": 105, "ideal_hours": 100},
            {"day": "Day 3", "remaining_hours": 85, "ideal_hours": 80},
            {"day": "Day 4", "remaining_hours": 60, "ideal_hours": 60},
            {"day": "Day 5", "remaining_hours": 30, "ideal_hours": 40},
            {"day": "Day 6", "remaining_hours": 10, "ideal_hours": 20},
            {"day": "Day 7", "remaining_hours": 0, "ideal_hours": 0},
        ]

        return {
            "total_tasks": total_tasks,
            "completion_rate": round(completion_rate, 2),
            "status_breakdown": status_counts,
            "velocity": velocity_data,
            "burndown": burndown_data,
        }
