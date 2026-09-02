from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from projects.models import Project
from tasks.models import Task


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == "ADMIN":
            total_projects = Project.objects.count()
            total_tasks = Task.objects.count()
            completed_tasks = Task.objects.filter(
                status=Task.Status.COMPLETED
            ).count()
            pending_tasks = Task.objects.filter(
                status=Task.Status.TODO
            ).count()
            in_progress_tasks = Task.objects.filter(
                status=Task.Status.IN_PROGRESS
            ).count()

            return Response({
                "role": "ADMIN",
                "total_projects": total_projects,
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "in_progress_tasks": in_progress_tasks,
            })

        elif user.role == "PROJECT_MANAGER":
            projects = Project.objects.filter(
                project_manager=user
            )

            tasks = Task.objects.filter(
                project__project_manager=user
            )

            completed_tasks = tasks.filter(
                status=Task.Status.COMPLETED
            ).count()

            pending_tasks = tasks.filter(
                status=Task.Status.TODO
            ).count()

            in_progress_tasks = tasks.filter(
                status=Task.Status.IN_PROGRESS
            ).count()

            overdue_tasks = tasks.filter(
                due_date__lt=timezone.now().date()
            ).exclude(
                status=Task.Status.COMPLETED
            ).count()

            return Response({
                "role": "PROJECT_MANAGER",
                "my_projects": projects.count(),
                "total_tasks": tasks.count(),
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "in_progress_tasks": in_progress_tasks,
                "overdue_tasks": overdue_tasks,
            })

        else:
            tasks = Task.objects.filter(
                assigned_to=user
            )

            completed_tasks = tasks.filter(
                status=Task.Status.COMPLETED
            ).count()

            pending_tasks = tasks.filter(
                status=Task.Status.TODO
            ).count()

            in_progress_tasks = tasks.filter(
                status=Task.Status.IN_PROGRESS
            ).count()

            overdue_tasks = tasks.filter(
                due_date__lt=timezone.now().date()
            ).exclude(
                status=Task.Status.COMPLETED
            ).count()

            return Response({
                "role": "EMPLOYEE",
                "my_tasks": tasks.count(),
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "in_progress_tasks": in_progress_tasks,
                "overdue_tasks": overdue_tasks,
            })