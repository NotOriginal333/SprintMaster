from django.db.models import Q


class ProjectRelatedQuerySetMixin:
    """
    Mixin to enforce row-level security for project-related resources.
    Ensures users only retrieve data for projects they are assigned to.
    """

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if not user.is_authenticated:
            return queryset.none()

        if user.is_staff or getattr(user, 'role', '') == 'ADMIN':
            return queryset

        if queryset.model.__name__ == 'Project':
            return queryset.filter(
                Q(manager=user) | Q(members=user)
            ).distinct()

        if hasattr(queryset.model, 'project'):
            return queryset.filter(
                Q(project__manager=user) | Q(project__members=user)
            ).distinct()

        return queryset