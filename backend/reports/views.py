from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated

from common.pagination import StandardResultsSetPagination
from .models import ProjectReport
from .serializers import ProjectReportSerializer
from .tasks import generate_report_task


class ReportViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    """
    API for requesting and viewing reports.
    Creation triggers an asynchronous Celery task.
    """
    queryset = ProjectReport.objects.all().order_by('-created_at')
    serializer_class = ProjectReportSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def perform_create(self, serializer):
        report = serializer.save(generated_by=self.request.user)
        generate_report_task.delay(report.id)
