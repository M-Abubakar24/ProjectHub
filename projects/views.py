from rest_framework import generics

from .models import Project
from .serializers import ProjectSerializer
from accounts.permissions import IsProjectManager, IsEmployee


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsProjectManager()]
        return [IsEmployee()]


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsProjectManager()]
        return [IsEmployee()]