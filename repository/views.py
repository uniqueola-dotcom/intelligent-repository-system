from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import ProjectUploadForm
from .models import Project, DownloadHistory, Faculty, Department
from django.db.models import Q
from django.contrib.admin.views.decorators import staff_member_required
from django.http import FileResponse, Http404, JsonResponse
from django.core.paginator import Paginator
from .intelligence.similarity import build_project_text, calculate_similarity

def repository(request):
    query = request.GET.get("q", "").strip()
    faculty_id = request.GET.get("faculty", "")
    department_id = request.GET.get("department", "")
    session = request.GET.get("session", "")

    projects = Project.objects.filter(approved=True)

    if query:
        projects = projects.filter(
            Q(title__icontains=query) |
            Q(keywords__icontains=query) |
            Q(abstract__icontains=query) |
            Q(supervisor__icontains=query)
        )

    if faculty_id:
        projects = projects.filter(faculty_id=faculty_id)
    if department_id:
        projects = projects.filter(department_id=department_id)
    if session:
        projects = projects.filter(session=session)

    projects = projects.select_related("faculty", "department").order_by("-uploaded_at")

    paginator = Paginator(projects, 10)  # 10 projects per page
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    context = {
        "page_obj": page_obj,
        "projects": page_obj,  # template can keep using {% for project in projects %}
        "total_projects": paginator.count,
        "query": query,
        "faculties": Faculty.objects.all(),
        "departments": (
            Department.objects.filter(faculty_id=faculty_id)
            if faculty_id else Department.objects.all()
        ),
        "sessions": Project.objects.values_list("session", flat=True).distinct(),
        "selected_faculty": faculty_id,
        "selected_department": department_id,
        "selected_session": session,
    }
    return render(request, "repository.html", context)



def project_detail(request, project_id):
    project = get_object_or_404(
        Project.objects.select_related("faculty", "department", "author"),
        id=project_id,
        approved=True
    )

    others = Project.objects.filter(approved=True).exclude(id=project.id)
    results = calculate_similarity(build_project_text(project), others)
    similar_projects = [r for r in results if r["similarity"] > 0][:3]

    return render(
        request,
        "project-details.html",
        {
            "project": project, "similar_projects": similar_projects
        }
    )

@login_required
def upload_project(request):

    if request.method == "POST":

        form = ProjectUploadForm(
            request.POST,
            request.FILES
        )

        if form.is_valid():

            project = form.save(commit=False)

            project.author = request.user

            project.approved = False

            project.save()

            return redirect("student_dashboard")

    else:

        form = ProjectUploadForm()

    return render(
        request,
        "upload-project.html",
        {
            "form": form
        }
    )

def is_admin(user):
    return user.is_authenticated and user.is_staff


@user_passes_test(is_admin)
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
def approve_project(request, project_id):

    if request.method == "POST":

        project = get_object_or_404(
            Project,
            id=project_id
        )

        project.approved = True
        project.save()

    return redirect("pending_projects")

@login_required
def download_project(request, project_id):

    project = get_object_or_404(
        Project,
        id=project_id,
        approved=True
    )

    if not project.project_file:
        raise Http404("Project file not found.")

    # Record the download
    DownloadHistory.objects.create(
        student=request.user,
        project=project
    )

    # Send the file to the user
    response = FileResponse(
        project.project_file.open("rb"),
        as_attachment=True,
        filename=project.project_file.name.split("/")[-1]
    )

    return response

@login_required
def download_history(request):
    downloads = DownloadHistory.objects.filter(
        student=request.user
    ).select_related(
        "project"
    ).order_by(
        "-downloaded_at"
    )
    context = {
        "downloads": downloads
    }
    return render(
        request,
        "download-history.html",
        context
    )

def get_departments(request, faculty_id):
    departments = Department.objects.filter(
        faculty_id=faculty_id
    ).values(
        "id",
        "name"
    )

    return JsonResponse(
        list(departments),
        safe=False
    )

from .intelligence.similarity import (
    calculate_similarity,
    calculate_component_similarity,
    calculate_weighted_similarity,
    generate_similarity_explanation,
    assess_originality
)

def originality_checker(request):

    if request.method == "POST":

        title = request.POST.get("title", "")
        keywords = request.POST.get("keywords", "")
        abstract = request.POST.get("abstract", "")

        proposed_text = f"""
        {title}
        {keywords}
        {abstract}
        """

        approved_projects = Project.objects.filter(
            approved=True
        )

        similarity_results = calculate_similarity(
            proposed_text,
            approved_projects
        )

        # Calculate component-level and weighted similarity
        # for every existing project.
        for result in similarity_results:

            component_scores = calculate_component_similarity(
                title=title,

                keywords=keywords,
                abstract=abstract,
                project=result["project"]
            )

            result["components"] = component_scores

            result["weighted_similarity"] = (
                calculate_weighted_similarity(
                    component_scores
                )
            )

            result["explanation"] = (
                generate_similarity_explanation(
                    component_scores
                )
            )

        # Re-rank projects using the weighted score.
        similarity_results.sort(
            key=lambda x: x["weighted_similarity"],
            reverse=True
        )

        # Update the overall assessment using the
        # highest weighted similarity.
        assessment = assess_originality(
            [
                {
                    "project": result["project"],
                    "similarity": result["weighted_similarity"]
                }
                for result in similarity_results
            ]
        )

        return render(
            request,
            "originality-results.html",
            {
                "title": title,
                "assessment": assessment,
                "results": similarity_results,
                "projects_compared": approved_projects.count(),
            }
        )

    return render(
        request,
        "originality-checker.html"
    )

