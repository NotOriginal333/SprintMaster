from rest_framework import serializers
from .models import Project
from users.serializers import UserShortSerializer


class ProjectSerializer(serializers.ModelSerializer):
    manager_details = UserShortSerializer(source='manager', read_only=True)
    members_details = UserShortSerializer(source='members', many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'start_date', 'end_date', 'members_details',
            'status', 'manager', 'manager_details', 'members', 'created_at'
        ]
        read_only_fields = ['created_at', 'updated_at']