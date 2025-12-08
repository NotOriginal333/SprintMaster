from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from common.pagination import StandardResultsSetPagination
from common.permissions import IsProjectParticipant, IsProjectManager
from common.mixins import ProjectRelatedQuerySetMixin
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(ProjectRelatedQuerySetMixin, viewsets.ModelViewSet):
    """
    Projects CRUD.

    Permissions:
    - READ: Members and Managers (handled by IsProjectParticipant)
    - WRITE: Managers/Admins only (handled by IsProjectManager)
    """
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'manager']
    search_fields = ['name', 'description']

    def get_permissions(self):
        # Strict permissions for destructive actions
        if self.action in ['create', 'destroy', 'update', 'partial_update']:
            return [IsProjectManager()]

        # Relaxed permissions for reading
        return [IsAuthenticated(), IsProjectParticipant()]