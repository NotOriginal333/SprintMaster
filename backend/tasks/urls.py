from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, BugReportViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'bugs', BugReportViewSet, basename='bug')

urlpatterns = [
    path('', include(router.urls)),
]