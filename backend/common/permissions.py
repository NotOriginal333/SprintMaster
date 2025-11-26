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