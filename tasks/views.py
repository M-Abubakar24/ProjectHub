from rest_framework import generics

from .models import Task
from .serializers import TaskSerializer
from accounts.permissions import (
    IsProjectManager,
    IsEmployee,
    IsTaskOwnerOrManager,
)


class TaskListCreateView(generics.ListCreateAPIView):

    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role in ["ADMIN", "PROJECT_MANAGER"]:
            return Task.objects.all()

        return Task.objects.filter(assigned_to=user)

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsProjectManager()]

        return [IsEmployee()]


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role in ["ADMIN", "PROJECT_MANAGER"]:
            return Task.objects.all()

        return Task.objects.filter(assigned_to=user)

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsTaskOwnerOrManager()]

        return [IsEmployee()]