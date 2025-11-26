from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from common.permissions import IsProjectManager
from .models import Sprint
from .serializers import SprintSerializer

class SprintViewSet(viewsets.ModelViewSet):
    queryset = Sprint.objects.all()
    serializer_class = SprintSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'is_active']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsProjectManager()]
        return [IsAuthenticated()]