from rest_framework import serializers

from .models import Project
from accounts.models import User


class ProjectSerializer(serializers.ModelSerializer):
    project_manager = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(
            role=User.Role.PROJECT_MANAGER
        )
    )

    team_members = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(
            role=User.Role.EMPLOYEE
        ),
        many=True,
        required=False,
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "project_manager",
            "team_members",
            "start_date",
            "end_date",
            "status",
            "priority",
            "progress",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]