from rest_framework import generics

from .models import Project
from .serializers import ProjectSerializer
from accounts.permissions import IsProjectManager


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsProjectManager]


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsProjectManager]