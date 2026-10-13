from django import forms
from django.contrib.auth.models import User
from .models import StudentProfile
from repository.models import Faculty, Department


class StudentRegistrationForm(forms.Form):

    first_name = forms.CharField(max_length=100)

    last_name = forms.CharField(max_length=100)

    email = forms.EmailField()

    matric_number = forms.CharField(max_length=30)

    phone = forms.CharField(max_length=20)

    faculty = forms.ModelChoiceField(
    queryset=Faculty.objects.all(),
    empty_label="Select Faculty",
    widget=forms.Select(attrs={"id": "faculty"})
    )

    department = forms.ModelChoiceField(
    queryset=Department.objects.none(),
    empty_label="Select Department",
    widget=forms.Select(attrs={"id": "department"})
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        faculty_id = self.data.get("faculty") or self.initial.get("faculty")

        if faculty_id:
            self.fields["department"].queryset = Department.objects.filter(
            faculty_id=faculty_id
        )

    password = forms.CharField(
        widget=forms.PasswordInput()
    )

    confirm_password = forms.CharField(
        widget=forms.PasswordInput()
    )

class LoginForm(forms.Form):

    username = forms.CharField(
        label="Email or Matric Number"
    )

    password = forms.CharField(
        widget=forms.PasswordInput()
    )