from src.core.celery_app import celery_app
from src.utils.logger import logger

@celery_app.task(name="tasks.send_email_notification")
def send_email_notification(recipient: str, subject: str, body: str):
    logger.info(f"Sending email notification to {recipient} with subject '{subject}'")
    # Simulation of SMTP mail send
    return f"Notification sent to {recipient}"

@celery_app.task(name="tasks.generate_project_report")
def generate_project_report(project_id: int):
    logger.info(f"Generating scheduled PDF summary report for project ID {project_id}")
    return f"Report generated for project {project_id}"
