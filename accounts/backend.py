from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from .models import StudentProfile


class EmailOrMatricBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):

        user = None

        # Login with Email
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            pass

        # Login with Matric Number
        if user is None:
            try:
                profile = StudentProfile.objects.get(
                    matric_number=username
                )
                user = profile.user
            except StudentProfile.DoesNotExist:
                return None

        if user.check_password(password):
            return user

        return None