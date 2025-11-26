from rest_framework import serializers
from .models import ProjectReport


class ProjectReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectReport
        fields = ['id', 'project', 'report_type', 'data', 'created_at', 'is_ready']
        read_only_fields = ['data', 'created_at', 'is_ready', 'generated_by']
