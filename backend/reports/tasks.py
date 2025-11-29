from celery import shared_task
from django.db.models import Count, Sum, Q
from .models import ProjectReport
from tasks.models import Task, BugReport


@shared_task
def generate_report_task(report_id):
    try:
        report = ProjectReport.objects.get(id=report_id)
        project = report.project

        total_tasks = Task.objects.filter(project=project).count()

        stats = Task.objects.filter(project=project).aggregate(
            completed=Count('id', filter=Q(status='DONE') | Q(status='CLOSED')),
            in_progress=Count('id', filter=Q(status='IN_PROGRESS')),
            total_sp=Sum('story_points'),
            completed_sp=Sum('story_points', filter=Q(status='DONE') | Q(status='CLOSED'))
        )

        bugs_count = BugReport.objects.filter(project=project, is_resolved=False).count()

        completed_sp = stats['completed_sp'] or 0
        total_sp = stats['total_sp'] or 1
        progress_percent = round((completed_sp / total_sp) * 100, 1)

        report.data = {
            "project_name": project.name,
            "tasks": {
                "total": total_tasks,
                "completed": stats['completed'],
                "in_progress": stats['in_progress']
            },
            "story_points": {
                "total": total_sp,
                "burned": completed_sp,
                "progress_percent": f"{progress_percent}%"
            },
            "quality": {
                "active_bugs": bugs_count,
                "health": "POOR" if bugs_count > 5 else "GOOD"
            }
        }

        report.is_ready = True
        report.save()

        return f"Report {report_id} generated for {project.name}"

    except ProjectReport.DoesNotExist:
        return "Report not found"
