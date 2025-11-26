from django.db import models
from django.conf import settings
from projects.models import Project


class ProjectReport(models.Model):
    class Type(models.TextChoices):
        SPRINT_SUMMARY = "SPRINT", "Підсумок спринта"
        PROJECT_STATUS = "PROJECT", "Статус проєкту"
        BUG_STATISTICS = "BUGS", "Статистика помилок"

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="reports")
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    report_type = models.CharField(max_length=20, choices=Type.choices, default=Type.PROJECT_STATUS)

    # Store result data as JSON to avoid recalculation
    data = models.JSONField(default=dict, verbose_name="Дані звіту")

    created_at = models.DateTimeField(auto_now_add=True)
    is_ready = models.BooleanField(default=False, verbose_name="Готовий")

    def __str__(self):
        return f"{self.get_report_type_display()} - {self.project.name}"