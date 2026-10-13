from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from repository.models import Project, DownloadHistory
from django.contrib.admin.views.decorators import staff_member_required
from repository.forms import ProjectUploadForm
from django.contrib.auth.models import User
from repository.models import Project, Faculty, Department
from django.db.models import Count


def home(request):
    approved_projects = Project.objects.filter(approved=True)

    total_projects = approved_projects.count()

    total_faculties = Faculty.objects.count()

    total_departments = Department.objects.count()

    total_categories = (
        approved_projects
        .exclude(category__isnull=True)
        .exclude(category__exact="")
        .values("category")
        .distinct()
        .count()
    )

    recent_projects = (
        approved_projects
        .select_related("faculty", "department", "author")
        .order_by("-uploaded_at")[:3]
    )

    popular_categories = (
        approved_projects
        .exclude(category__isnull=True)
        .exclude(category__exact="")
        .values("category")
        .annotate(total=Count("id"))
        .order_by("-total", "category")[:6]
    )

    context = {
        "total_projects": total_projects,
        "total_faculties": total_faculties,
        "total_departments": total_departments,
        "total_categories": total_categories,
        "recent_projects": recent_projects,
        "popular_categories": popular_categories,
    }

    return render(request, "index.html", context)

@login_required
def student_dashboard(request):

    uploaded = Project.objects.filter(
        author=request.user
    ).count()

    approved = Project.objects.filter(
        author=request.user,
        approved=True
    ).count()

    pending = Project.objects.filter(
        author=request.user,
        approved=False
    ).count()

    downloads = DownloadHistory.objects.filter(
        student=request.user
    ).count()

    context = {

        "uploaded": uploaded,

        "approved": approved,

        "pending": pending,

        "downloads": downloads,

    }

    return render(
        request,
        "student-dashboard.html",
        context
    )

@staff_member_required
def approve_project(request, project_id):

    if request.method == "POST":

        project = get_object_or_404(
            Project,
            id=project_id
        )

        project.approved = True
        project.save()

    return redirect("pending_projects")

@staff_member_required
def pending_projects(request):

    projects = Project.objects.filter(
        approved=False
    ).order_by("-uploaded_at")

    return render(
        request,
        "pending-projects.html",
        {
            "projects": projects
        }
    )

@staff_member_required
def admin_dashboard(request):

    total_projects = Project.objects.count()

    pending_projects = Project.objects.filter(
        approved=False
    ).count()

    approved_projects = Project.objects.filter(
        approved=True
    ).count()

    total_students = User.objects.filter(
        is_staff=False,
        is_superuser=False
    ).count()

    recent_projects = Project.objects.select_related(
        "author",
        "faculty",
        "department"
    ).order_by(
        "-uploaded_at"
    )[:5]

    context = {
        "total_projects": total_projects,
        "pending_projects": pending_projects,
        "approved_projects": approved_projects,
        "total_students": total_students,
        "recent_projects": recent_projects,
    }

    return render(
        request,
        "admin-dashboard.html",
        context
    )



@staff_member_required
def manage_repository(request):
    return render(
        request,
        "manage-repository.html"
    )


@staff_member_required
def manage_students(request):
    return render(
        request,
        "manage-students.html"
    )



@staff_member_required
def activity_log(request):
    return render(
        request,
        "activity-log.html"
    )

@staff_member_required
def repository_upload(request):

    if request.method == "POST":

        form = ProjectUploadForm(
            request.POST,
            request.FILES
        )

        if form.is_valid():

            project = form.save(commit=False)

            project.author = request.user

            # Admin uploads are automatically approved
            project.approved = True

            project.save()

            return redirect("admin_dashboard")

    else:

        form = ProjectUploadForm()

    return render(
        request,
        "repository-upload.html",
        {
            "form": form
        }
    )

@staff_member_required
def statistics(request):

    total_projects = Project.objects.count()

    approved_projects = Project.objects.filter(
        approved=True
    ).count()

    pending_projects = Project.objects.filter(
        approved=False
    ).count()

    total_students = User.objects.filter(
        is_staff=False,
        is_superuser=False
    ).count()

    total_downloads = DownloadHistory.objects.count()

    projects_by_faculty = Project.objects.values(
        "faculty__name"
    ).annotate(
        total=Count("id")
    ).order_by("-total")

    projects_by_department = Project.objects.values(
        "department__name"
    ).annotate(
        total=Count("id")
    ).order_by("-total")

    context = {
        "total_projects": total_projects,
        "approved_projects": approved_projects,
        "pending_projects": pending_projects,
        "total_students": total_students,
        "total_downloads": total_downloads,
        "projects_by_faculty": projects_by_faculty,
        "projects_by_department": projects_by_department,
    }

    return render(
        request,
        "statistics.html",
        context
    )

