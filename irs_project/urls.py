from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from repository import views as repository_views


urlpatterns = [
    path("admin/pending-projects/", repository_views.pending_projects, name="pending_projects"),

    path("admin/approve-projects/<int:project_id>/", repository_views.approve_project, name="approve_project"),

    path("", include("dashboard.urls")),

    path("", include("accounts.urls")),

    path("", include("repository.urls")),

    path("admin/", admin.site.urls),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )