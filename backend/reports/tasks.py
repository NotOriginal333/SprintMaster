from celery import shared_task
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from .models import ProjectReport
from tasks.models import Task, BugReport
from sprints.models import Sprint


@shared_task
def generate_report_task(report_id):
    try:
        report = ProjectReport.objects.get(id=report_id)
        project = report.project

        total_tasks = Task.objects.filter(project=project).count()

        stats = Task.objects.filter(project=project).aggregate(
            completed=Count('id', filter=Q(status='DONE') | Q(status='CLOSED')),
            in_progress=Count('id', filter=Q(status='IN_PROGRESS') | Q(status='REVIEW')),
            total_sp=Sum('story_points'),
            completed_sp=Sum('story_points', filter=Q(status='DONE') | Q(status='CLOSED'))
        )

        active_bugs_count = BugReport.objects.filter(
            project=project
        ).exclude(status__in=['CLOSED', 'FIXED']).count()

        completed_sp = stats['completed_sp'] or 0
        total_sp = stats['total_sp'] or 1
        progress_percent = round((completed_sp / total_sp) * 100, 1) if stats['total_sp'] else 0

        bugs_by_priority = BugReport.objects.filter(project=project).values('priority').annotate(value=Count('id'))
        bugs_breakdown = [
            {'name': item['priority'], 'value': item['value']}
            for item in bugs_by_priority
        ]

        burndown_data = []

        active_sprint = Sprint.objects.filter(project=project, is_active=True).first()
        if not active_sprint:
            active_sprint = Sprint.objects.filter(project=project).last()

        if active_sprint and active_sprint.start_date and active_sprint.end_date:
            sprint_total_sp = Task.objects.filter(sprint=active_sprint).aggregate(s=Sum('story_points'))['s'] or 0

            start_date = active_sprint.start_date
            end_date = active_sprint.end_date
            duration = (end_date - start_date).days + 1

            ideal_burn_rate = sprint_total_sp / duration if duration > 0 else 0
            current_remaining = sprint_total_sp

            for i in range(duration):
                current_date = start_date + timedelta(days=i)
                day_label = f"Day {i + 1}"

                ideal_remaining = max(0, sprint_total_sp - (ideal_burn_rate * (i + 1)))

                completed_on_day = Task.objects.filter(
                    sprint=active_sprint,
                    status__in=['DONE', 'CLOSED'],
                    updated_at__date=current_date
                ).aggregate(s=Sum('story_points'))['s'] or 0

                if current_date <= timezone.now().date():
                    current_remaining -= completed_on_day
                    actual = max(0, current_remaining)
                else:
                    actual = None

                burndown_data.append({
                    "day": day_label,
                    "ideal": round(ideal_remaining, 1),
                    "remaining": actual,
                    "completedToday": completed_on_day
                })

        report.data = {
            "project_name": project.name,
            "tasks": {
                "total": total_tasks,
                "completed": stats['completed'],
                "in_progress": stats['in_progress']
            },
            "story_points": {
                "total": stats['total_sp'] or 0,
                "burned": completed_sp,
                "progress_percent": f"{progress_percent}%"
            },
            "quality": {
                "active_bugs": active_bugs_count,
                "health": "POOR" if active_bugs_count > 5 else "GOOD"
            },
            "bugs_breakdown": bugs_breakdown,
            "burndown": burndown_data
        }

        report.is_ready = True
        report.save()

        return f"Report {report_id} generated for {project.name}"

    except ProjectReport.DoesNotExist:
        return "Report not found"
