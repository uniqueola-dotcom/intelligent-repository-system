from django.db import models
from django.contrib.auth.models import User
from repository.models import Faculty, Department


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    matric_number = models.CharField(max_length=30, unique=True)
    phone = models.CharField(max_length=20, blank=True)

    faculty = models.ForeignKey(
        'repository.Faculty',
        on_delete=models.SET_NULL,
        null=True
    )

    department = models.ForeignKey(
        'repository.Department',
        on_delete=models.SET_NULL,
        null=True
    )

    profile_picture = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.matric_number}"