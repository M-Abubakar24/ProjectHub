from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import User
from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsAdmin, IsProjectManager, IsEmployee


class AdminTestView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({
            "message": "Welcome Admin!",
            "user": request.user.username,
            "role": request.user.role,
        })


class ProjectManagerTestView(APIView):
    permission_classes = [IsProjectManager]

    def get(self, request):
        return Response({
            "message": "Welcome Project Manager!",
            "user": request.user.username,
            "role": request.user.role,
        })


class EmployeeTestView(APIView):
    permission_classes = [IsEmployee]

    def get(self, request):
        return Response({
            "message": "Welcome!",
            "user": request.user.username,
            "role": request.user.role,
        })