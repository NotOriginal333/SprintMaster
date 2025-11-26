from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for full user management.
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserShortSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for embedding user info in other entities (Tasks, Projects).
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'role', 'first_name', 'last_name')