from celery import shared_task
import time
from .models import ProjectReport


@shared_task
def generate_report_task(report_id):
    """
    Celery task to handle heavy report generation asynchronously.
    """
    try:
        report = ProjectReport.objects.get(id=report_id)

        # Simulate heavy calculation (Logic to be implemented later)
        # e.g., Aggregating task completions, calculating velocity, etc.
        time.sleep(5)

        # Mock Data for now
        report.data = {
            "status": "Success",
            "total_tasks": 100,
            "completed": 85,
            "velocity": 24,
            "bugs_open": 3
        }
        report.is_ready = True
        report.save()

        return f"Report {report_id} generated."
    except ProjectReport.DoesNotExist:
        return "Report not found."
