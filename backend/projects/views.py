from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from common.pagination import StandardResultsSetPagination
from common.permissions import IsProjectManager
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Backend filtering configuration
    filterset_fields = ['status', 'manager']
    search_fields = ['name', 'description']
    ordering_fields = ['start_date', 'created_at']

    def get_queryset(self):
        """
        Filter projects visibility:
        - Admins/Staff see all projects.
        - Regular users see only projects they manage or are members of.
        """
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            return Project.objects.all()
        return Project.objects.filter(members=user) | Project.objects.filter(manager=user)

    def get_permissions(self):
        """
        Create/Update/Delete -> Project Managers only.
        Read -> Authenticated users (filtered by queryset).
        """
        if self.action in ['create', 'destroy', 'update', 'partial_update']:
            return [IsProjectManager()]
        return [IsAuthenticated()]