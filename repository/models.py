from django.db import models
from django.contrib.auth.models import User
class Faculty(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name
class Department(models.Model):
    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name
class Project(models.Model):

    title = models.CharField(max_length=300)

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    supervisor = models.CharField(max_length=255)

    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE
    )

    session = models.CharField(max_length=20)

    category = models.CharField(max_length=100, blank=True, default="")

    keywords = models.CharField(max_length=300, blank=True, default="")

    abstract = models.TextField()

    project_file = models.FileField(upload_to="projects/")

    approved = models.BooleanField(default=False)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
class DownloadHistory(models.Model):

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE
    )

    downloaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.project.title}"

class ActivityLog(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    activity = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.activity

