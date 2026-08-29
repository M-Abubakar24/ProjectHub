from django.urls import path

from .views import (
    RegisterView,
    ProfileView,
    AdminTestView,
    ProjectManagerTestView,
    EmployeeTestView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),

    path("admin-test/", AdminTestView.as_view(), name="admin-test"),
    path("manager-test/", ProjectManagerTestView.as_view(), name="manager-test"),
    path("employee-test/", EmployeeTestView.as_view(), name="employee-test"),
]