from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, BugReportViewSet

router = DefaultRouter()
# Registering tasks endpoint: /api/tasks/
router.register(r'tasks', TaskViewSet, basename='task')
# Registering bugs endpoint: /api/bugs/
router.register(r'bugs', BugReportViewSet, basename='bug')

urlpatterns = [
    path('', include(router.urls)),
]