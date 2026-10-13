from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import StudentProfile
from .forms import StudentRegistrationForm
from django.contrib.auth import authenticate, login, logout
from .forms import LoginForm
from django.contrib.auth.decorators import login_required

def register(request):

    if request.method == "POST":

        form = StudentRegistrationForm(request.POST)

        if form.is_valid():

            if form.cleaned_data["password"] != form.cleaned_data["confirm_password"]:

                return render(request,
                              "register.html",
                              {
                                  "form": form,
                                  "error": "Passwords do not match."
                              })

            if User.objects.filter(email=form.cleaned_data["email"]).exists():

                return render(request,
                              "register.html",
                              {
                                  "form": form,
                                  "error": "Email already exists."
                              })

            if StudentProfile.objects.filter(
                matric_number=form.cleaned_data["matric_number"]
            ).exists():

                return render(request,
                              "register.html",
                              {
                                  "form": form,
                                  "error": "Matric Number already exists."
                              })

            user = User.objects.create_user(

                username=form.cleaned_data["email"],

                email=form.cleaned_data["email"],

                password=form.cleaned_data["password"],

                first_name=form.cleaned_data["first_name"],

                last_name=form.cleaned_data["last_name"]

            )

            StudentProfile.objects.create(

                user=user,

                matric_number=form.cleaned_data["matric_number"],

                phone=form.cleaned_data["phone"],

                faculty=form.cleaned_data["faculty"],

                department=form.cleaned_data["department"]

            )

            return redirect("login")

    else:

        form = StudentRegistrationForm()

    return render(
        request,
        "register.html",
        {
            "form": form
        }
    )

def login_view(request):

    if request.method == "POST":

        form = LoginForm(request.POST)

        if form.is_valid():

            username = request.POST.get("username")

            password = request.POST.get("password")

            user = authenticate(
                request,
                username=username,
                password=password
            )

            if user:

                login(request, user)

                return redirect("student_dashboard")

            return render(
                request,
                "login.html",
                {
                    "form": form,
                    "error": "Invalid Login Details"
                }
            )

    else:

        form = LoginForm()

    return render(
        request,
        "login.html",
        {
            "form": form
        }
    )

def logout_view(request):

    logout(request)

    return redirect("home")

@login_required
def profile(request):

    student_profile = request.user.studentprofile

    if request.method == "POST":

        student_profile.phone = request.POST.get("phone", "")

        if request.FILES.get("profile_picture"):
            student_profile.profile_picture = request.FILES["profile_picture"]

        student_profile.save()

        return redirect("profile")

    context = {
        "student": request.user,
        "profile": student_profile,
    }

    return render(
        request,
        "profile.html",
        context
    )

