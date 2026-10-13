from django.contrib import admin
from .models import (
    Faculty,
    Department,
    Project,
    DownloadHistory,
    ActivityLog,
)

admin.site.register(Faculty)
admin.site.register(Department)
admin.site.register(Project)
admin.site.register(DownloadHistory)
admin.site.register(ActivityLog)