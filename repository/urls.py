from django.urls import path
from . import views

urlpatterns = [
    path("repository/", views.repository, name="repository"),
    path("project/<int:project_id>/", views.project_detail, name="project_detail"),
    path("upload-project/", views.upload_project, name="upload_project"),
    path("admin/pending-projects/", views.pending_projects, name="pending_projects"),
    path("admin/approve-projects/<int:project_id>/", views.approve_project,name="approve_project"),
    path("project/<int:project_id>/download/", views.download_project, name="download_project"),
    path("download-history/", views.download_history, name="download_history"),
    path("api/departments/<int:faculty_id>/", views.get_departments, name="get_departments"),
    path("check-originality/",views.originality_checker,name="originality_checker"),
]