from rest_framework import generics

from .models import Task
from .serializers import TaskSerializer
from accounts.permissions import IsProjectManager, IsEmployee


class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsProjectManager()]
        return [IsEmployee()]


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsProjectManager()]
        return [IsEmployee()]