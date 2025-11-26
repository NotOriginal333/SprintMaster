from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Project(models.Model):
    """
    Core entity representing a managed software project.
    """

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", _("Активний")
        ON_HOLD = "ON_HOLD", _("Призупинено")
        ARCHIVED = "ARCHIVED", _("Архівовано")

    name = models.CharField(max_length=255, verbose_name=_("Назва проєкту"))
    description = models.TextField(verbose_name=_("Опис"))
    start_date = models.DateField(verbose_name=_("Дата початку"))
    end_date = models.DateField(null=True, blank=True, verbose_name=_("Дата завершення"))

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        verbose_name=_("Статус")
    )

    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="managed_projects",
        verbose_name=_("Менеджер")
    )

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="projects",
        verbose_name=_("Команда"),
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Проєкт")
        verbose_name_plural = _("Проєкти")
        ordering = ['-created_at']

    def __str__(self):
        return self.name