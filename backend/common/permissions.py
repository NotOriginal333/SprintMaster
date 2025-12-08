from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsProjectManager(BasePermission):
    """
    Allows access only to Project Managers (PM), Admins, or Superusers.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
                request.user.role == 'PM' or request.user.role == 'ADMIN' or request.user.is_superuser
        )


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `assignee` or `reporter` attribute.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        # Check ownership based on available fields
        user = getattr(obj, 'assignee', getattr(obj, 'reporter', None))
        return user == request.user


class IsProjectParticipant(BasePermission):
    """
    Object-level permission to restrict access to project members only.

    Logic:
    1. Admins/Superusers have full access.
    2. For Project instances: checks if user is manager or in members list.
    3. For related objects (Task, Sprint, Report): checks the parent project's permissions.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or getattr(request.user, 'role', '') == 'ADMIN':
            return True

        project = None

        if hasattr(obj, 'members') and hasattr(obj, 'manager'):
            project = obj

        elif hasattr(obj, 'project'):
            project = obj.project

        if not project:
            return False

        is_manager = project.manager == request.user
        is_member = project.members.filter(id=request.user.id).exists()

        return is_manager or is_member
