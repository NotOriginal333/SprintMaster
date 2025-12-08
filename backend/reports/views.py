from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated

from common.pagination import StandardResultsSetPagination
from common.permissions import IsProjectParticipant
from common.mixins import ProjectRelatedQuerySetMixin

from .models import ProjectReport
from .serializers import ProjectReportSerializer
from .tasks import generate_report_task


class ReportViewSet(ProjectRelatedQuerySetMixin,
                    mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    """
    Read-only view for reports (creation triggers async task).
    queryset is handled by ProjectRelatedQuerySetMixin.
    """
    queryset = ProjectReport.objects.all().order_by('-created_at')
    serializer_class = ProjectReportSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated, IsProjectParticipant]

    def perform_create(self, serializer):
        report = serializer.save(generated_by=self.request.user)
        generate_report_task.delay(report.id)
