from datetime import timedelta, date

from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from django_filters.rest_framework import DjangoFilterBackend

from common.pagination import StandardResultsSetPagination
from common.permissions import IsProjectManager, IsProjectParticipant
from common.mixins import ProjectRelatedQuerySetMixin

from tasks.models import Task, BugReport
from tasks.serializers import TaskSerializer, BugReportSerializer

from .models import Sprint
from .serializers import SprintSerializer


class SprintViewSet(ProjectRelatedQuerySetMixin, viewsets.ModelViewSet):
    """
    API endpoint for managing Sprints.

    Access Control Rules:
    - READ (List/Retrieve): Open to all Project Members (Devs, QA, PMs).
      Filtered by ProjectRelatedQuerySetMixin.
    - WRITE (Create/Update/Delete): Restricted to Project Managers (PM) and Admins.
    """
    queryset = Sprint.objects.all().order_by('-start_date')
    serializer_class = SprintSerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['project', 'is_active']
    ordering_fields = ['start_date', 'end_date']

    def get_permissions(self):
        """
        Differentiate permissions based on the action type.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsProjectManager()]

        return [IsAuthenticated(), IsProjectParticipant()]

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Closing a sprint.
        """
        sprint = self.get_object()

        if not (request.user.role == 'PM' or request.user.role == 'ADMIN'):
            return Response({"detail": "Only PM can complete sprints."}, status=status.HTTP_403_FORBIDDEN)

        unfinished_tasks = sprint.tasks.exclude(status__in=['DONE', 'CLOSED'])
        count = unfinished_tasks.count()

        unfinished_tasks.update(sprint=None)

        sprint.is_active = False
        sprint.save()

        return Response({
            'status': 'Sprint completed',
            'moved_tasks_count': count
        })

    @action(detail=True, methods=['get'])
    def timeline(self, request, pk=None):
        """
        Returns sprint events separated by days.
        """
        sprint = self.get_object()
        start = sprint.start_date
        end = sprint.end_date or date.today()

        timeline_data = []

        delta = end - start
        for i in range(delta.days + 1):
            day = start + timedelta(days=i)

            day_tasks = Task.objects.filter(
                sprint=sprint,
                created_at__date=day
            )

            day_bugs = BugReport.objects.filter(
                project=sprint.project,
                created_at__date=day
            )

            if day_tasks.exists() or day_bugs.exists():
                timeline_data.append({
                    "date": day,
                    "tasks": TaskSerializer(day_tasks, many=True).data,
                    "bugs": BugReportSerializer(day_bugs, many=True).data
                })

        return Response(timeline_data)
