from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsProjectManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["ADMIN", "PROJECT_MANAGER"]
        )


class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "ADMIN",
                "PROJECT_MANAGER",
                "EMPLOYEE",
            ]
        )
class IsTaskOwnerOrManager(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin and Project Manager have full access
        if request.user.role in ["ADMIN", "PROJECT_MANAGER"]:
            return True

        # Employee can only access their own assigned task
        return obj.assigned_to == request.user