from .views import student_dashboard
from django.urls import path
from . import views

urlpatterns = [

    path("", views.home, name="home"),

    path(
        "student-dashboard/",
        views.student_dashboard,
        name="student_dashboard"
    ),

    path(
        "admin/dashboard/",
        views.admin_dashboard,
        name="admin_dashboard"
    ),

    path(
        "admin/pending-projects/",
        views.pending_projects,
        name="pending_projects"
    ),

    path(
    "admin/approve-projects/<int:project_id>/",
    views.approve_project,
    name="approve_project"
    ),

     path(
        "admin/repository-upload/",
        views.repository_upload,
        name="repository_upload"
    ),

    # Manage repository
    path(
        "admin/manage-repository/",
        views.manage_repository,
        name="manage_repository"
    ),

    # Manage students
    path(
        "admin/manage-students/",
        views.manage_students,
        name="manage_students"
    ),

    # Statistics
    path(
        "admin/statistics/",
        views.statistics,
        name="statistics"
    ),

    # Activity log
    path(
        "admin/activity-log/",
        views.activity_log,
        name="activity_log"
    )

]