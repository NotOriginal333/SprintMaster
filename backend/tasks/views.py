from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated

from django_filters.rest_framework import DjangoFilterBackend

from common.pagination import StandardResultsSetPagination
from common.permissions import IsProjectParticipant
from common.mixins import ProjectRelatedQuerySetMixin

from .models import Task, BugReport
from .serializers import TaskSerializer, BugReportSerializer


class TaskViewSet(ProjectRelatedQuerySetMixin, viewsets.ModelViewSet):
    """
    Main endpoint for task management.
    Supports filtering by project/sprint for Kanban boards.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    pagination_class = StandardResultsSetPagination

    permission_classes = [IsAuthenticated, IsProjectParticipant]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'sprint', 'status', 'priority', 'assignee']
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'created_at']


class BugReportViewSet(ProjectRelatedQuerySetMixin, viewsets.ModelViewSet):
    """
    Endpoint for managing QA Bug Reports.
    Bugs are linked to a project and optionally to a task.
    """
    queryset = BugReport.objects.all().order_by('-created_at')
    serializer_class = BugReportSerializer
    pagination_class = StandardResultsSetPagination

    permission_classes = [IsAuthenticated, IsProjectParticipant]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'status', 'priority', 'reporter', 'is_resolved']
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'created_at']

    def perform_create(self, serializer):
        """
        Automatically assign the current user as the reporter of the bug.
        """
        serializer.save(reporter=self.request.user)
