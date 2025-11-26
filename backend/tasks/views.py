from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from common.pagination import StandardResultsSetPagination
from .models import Task, BugReport
from .serializers import TaskSerializer, BugReportSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Powerful backend filtering for Boards and Lists
    filterset_fields = ['project', 'sprint', 'status', 'priority', 'assignee']
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'created_at', 'story_points']

    permission_classes = [IsAuthenticated]


class BugReportViewSet(viewsets.ModelViewSet):
    queryset = BugReport.objects.all()
    serializer_class = BugReportSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['project', 'status', 'priority', 'reporter', 'is_resolved']

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically assign current user as reporter
        serializer.save(reporter=self.request.user)