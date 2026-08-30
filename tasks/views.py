from rest_framework import generics

from .models import Task
from .serializers import TaskSerializer
from accounts.permissions import IsProjectManager


class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsProjectManager]


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsProjectManager]