from django import forms
from .models import Project, Faculty, Department


class ProjectUploadForm(forms.ModelForm):

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

    class Meta:
        model = Project

        fields = [
            "title",
            "supervisor",
            "faculty",
            "department",
            "session",
            "keywords",
            "abstract",
            "project_file",
        ]

        widgets = {
            "title": forms.TextInput(attrs={
                "placeholder": "Project Title"
            }),

            "supervisor": forms.TextInput(attrs={
                "placeholder": "Supervisor Name"
            }),

            "session": forms.TextInput(attrs={
                "placeholder": "Academic Session e.g. 2025/2026"
            }),

            "keywords": forms.Textarea(attrs={
                "placeholder": "Enter project keywords"
            }),

            "abstract": forms.Textarea(attrs={
                "placeholder": "Enter project abstract"
            }),

            "project_file": forms.ClearableFileInput(attrs={
                "accept": ".pdf,.doc,.docx"
            }),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        faculty_id = (
            self.data.get("faculty")
            or self.initial.get("faculty")
            or getattr(self.instance, "faculty_id", None)
        )

        if faculty_id:
            self.fields["department"].queryset = Department.objects.filter(
                faculty_id=faculty_id
            )
