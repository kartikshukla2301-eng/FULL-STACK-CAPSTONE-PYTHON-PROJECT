import csv
import io
from typing import List
from src.models.task import Task

class ExportService:
    @staticmethod
    def export_tasks_to_csv(tasks: List[Task]) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(["ID", "Title", "Status", "Priority", "Estimated Hours", "Actual Hours", "Created At"])
        
        for task in tasks:
            writer.writerow([
                task.id,
                task.title,
                task.status.value,
                task.priority.value,
                task.estimated_hours or 0.0,
                task.actual_hours or 0.0,
                task.created_at.isoformat() if task.created_at else "",
            ])
            
        return output.getvalue()
