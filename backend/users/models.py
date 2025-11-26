from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Extended user model to support role-based access control (RBAC).
    """

    class Role(models.TextChoices):
        ADMIN = "ADMIN", _("Адміністратор")
        MANAGER = "PM", _("Менеджер проєкту")
        DEVELOPER = "DEV", _("Розробник")
        TESTER = "QA", _("Тестувальник")

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.DEVELOPER,
        verbose_name=_("Роль")
    )

    class Meta:
        verbose_name = _("Користувач")
        verbose_name_plural = _("Користувачі")

    def __str__(self):
        return f"{self.username} ({self.role})"