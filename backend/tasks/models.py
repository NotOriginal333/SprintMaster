from django.core.exceptions import ValidationError
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from projects.models import Project
from sprints.models import Sprint


class Task(models.Model):
    """
    Represents a unit of work.
    Implements Fibonacci story points for complexity estimation.
    """

    class Status(models.TextChoices):
        NEW = "NEW", _("Нова")
        IN_PROGRESS = "IN_PROGRESS", _("В роботі")
        CODE_REVIEW = "REVIEW", _("Перевірка коду")
        TESTING = "TESTING", _("Тестування")
        DONE = "DONE", _("Виконано")
        CLOSED = "CLOSED", _("Закрито")

    class Priority(models.TextChoices):
        LOW = "LOW", _("Низький")
        MEDIUM = "MEDIUM", _("Середній")
        HIGH = "HIGH", _("Високий")
        CRITICAL = "CRITICAL", _("Критичний")

    # Fibonacci sequence for Agile estimation
    STORY_POINTS_CHOICES = (
        (1, '1 SP'), (2, '2 SP'), (3, '3 SP'),
        (5, '5 SP'), (8, '8 SP'), (13, '13 SP'), (21, '21 SP'),
    )

    title = models.CharField(max_length=200, verbose_name=_("Заголовок"))
    description = models.TextField(verbose_name=_("Опис"))

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="tasks",
        verbose_name=_("Проєкт")
    )

    sprint = models.ForeignKey(
        Sprint,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tasks",
        verbose_name=_("Спринт")
    )

    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tasks",
        verbose_name=_("Виконавець")
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        verbose_name=_("Статус")
    )

    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        verbose_name=_("Пріоритет")
    )

    story_points = models.PositiveSmallIntegerField(
        choices=STORY_POINTS_CHOICES,
        default=1,
        verbose_name=_("Оцінка складності (SP)")
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Задача")
        verbose_name_plural = _("Задачі")
        indexes = [
            models.Index(fields=['project', 'status']),
            models.Index(fields=['assignee']),
        ]

    def clean(self):
        """
        Ensure the Task's sprint belongs to the Task's project.
        """
        if self.sprint and self.sprint.project != self.project:
            raise ValidationError(_("Спринт повинен належати тому ж проєкту, що і задача."))

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.project.name}] {self.title}"


class BugReport(models.Model):
    """
    Defects reported by QA.
    Can be standalone within a project or linked to a specific Task.
    """

    class Status(models.TextChoices):
        NEW = "NEW", _("Новий")
        CONFIRMED = "CONFIRMED", _("Підтверджено")
        IN_PROGRESS = "IN_PROGRESS", _("В роботі")
        FIXED = "FIXED", _("Виправлено")
        CLOSED = "CLOSED", _("Закрито")

    class Priority(models.TextChoices):
        LOW = "LOW", _("Низький")
        MEDIUM = "MEDIUM", _("Середній")
        HIGH = "HIGH", _("Високий")
        CRITICAL = "CRITICAL", _("Критичний")

    title = models.CharField(max_length=200, verbose_name=_("Суть помилки"))
    description = models.TextField(verbose_name=_("Детальний опис (Steps to reproduce)"))

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="bugs",
        verbose_name=_("Проєкт")
    )

    task = models.ForeignKey(
        Task,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bugs",
        verbose_name=_("Пов'язана задача")
    )

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="reported_bugs",
        verbose_name=_("Хто знайшов")
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        verbose_name=_("Статус")
    )

    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        verbose_name=_("Пріоритет")
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_resolved = models.BooleanField(default=False, verbose_name=_("Виправлено"))

    class Meta:
        verbose_name = _("Звіт про помилку")
        verbose_name_plural = _("Звіти про помилки")
        ordering = ['-created_at']

    def clean(self):
        """
        Validate cross-reference integrity.
        """
        if self.task and self.task.project != self.project:
            raise ValidationError(_("Пов'язана задача повинна належати тому ж проєкту, що і баг-репорт."))

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"BUG-{self.id}: {self.title}"