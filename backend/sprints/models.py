from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from projects.models import Project


class Sprint(models.Model):
    """
    Time-boxed iteration within a specific project.
    """
    name = models.CharField(max_length=100, verbose_name=_("Назва спринта"))
    goal = models.TextField(blank=True, verbose_name=_("Ціль спринта"))

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="sprints",
        verbose_name=_("Проєкт")
    )

    start_date = models.DateField(verbose_name=_("Початок"))
    end_date = models.DateField(verbose_name=_("Кінець"))

    is_active = models.BooleanField(default=False, verbose_name=_("Активний"))

    class Meta:
        verbose_name = _("Спринт")
        verbose_name_plural = _("Спринти")
        ordering = ['-start_date']

    def clean(self):
        """
        Validates logical consistency of sprint dates.
        """
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValidationError(_("Дата завершення не може бути раніше дати початку."))

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} | {self.project.name}"