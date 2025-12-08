from rest_framework import serializers
from .models import Task, BugReport
from users.serializers import UserShortSerializer


class BugReportSerializer(serializers.ModelSerializer):
    reporter_details = UserShortSerializer(source='reporter', read_only=True)

    class Meta:
        model = BugReport
        fields = [
            'id', 'title', 'description', 'project', 'task',
            'reporter', 'reporter_details',
            'status', 'priority', 'is_resolved', 'created_at'
        ]
        read_only_fields = ['created_at', 'reporter']


class TaskSerializer(serializers.ModelSerializer):
    assignee_details = UserShortSerializer(source='assignee', read_only=True)
    bugs = BugReportSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'project', 'sprint',
            'assignee', 'assignee_details', 'bugs', 'due_date',
            'status', 'priority', 'story_points', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
