from django.conf import settings
from django.db import models


class Project(models.Model):

    class Status(models.TextChoices):
        PLANNING = "PLANNING", "Planning"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        ON_HOLD = "ON_HOLD", "On Hold"

    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    name = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    project_manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="managed_projects",
    )

    team_members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name="projects",
    )

    start_date = models.DateField()

    end_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PLANNING,
    )

    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )

    progress = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name