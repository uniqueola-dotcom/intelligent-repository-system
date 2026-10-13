/* ===================================
   LOAD FACULTIES & DEPARTMENTS
=================================== */

const facultySelect = document.getElementById("faculty");
const departmentSelect = document.getElementById("department");

if (facultySelect && departmentSelect) {

    // Load faculties
    Object.keys(facultyDepartments).forEach(function (faculty) {

        const option = document.createElement("option");

        option.value = faculty;
        option.textContent = faculty;

        facultySelect.appendChild(option);

    });

    // Load departments when faculty changes
    facultySelect.addEventListener("change", function () {

        departmentSelect.innerHTML =
            '<option value="">Select Department</option>';

        const selectedFaculty = this.value;

        if (facultyDepartments[selectedFaculty]) {

            facultyDepartments[selectedFaculty].forEach(function (department) {

                const option = document.createElement("option");

                option.value = department;
                option.textContent = department;

                departmentSelect.appendChild(option);

            });

        }

    });

}

// =========================
// Dynamic Department
// =========================

const faculty = document.getElementById("faculty");
const department = document.getElementById("department");

if (faculty && department) {

    faculty.addEventListener("change", function () {

        department.innerHTML =
            '<option value="">Select Department</option>';

        const selected = departments[this.value];

        if (selected) {

            selected.forEach(function (dept) {

                const option = document.createElement("option");

                option.value = dept;

                option.textContent = dept;

                department.appendChild(option);

            });

        }

    });

}

// =========================
// Password Toggle
// =========================

document.querySelectorAll(".toggle-password").forEach(toggle => {

    toggle.addEventListener("click", () => {

        const input =
            document.getElementById(toggle.dataset.target);

        if (input.type === "password") {

            input.type = "text";

        } else {

            input.type = "password";

        }

    });

});

/* ===================================
   AUTHENTICATION
=================================== */

// Register

const user = {

    fullname,

    matric,

    email,

    faculty,

    department,

    password

};

// Get existing students
let students = JSON.parse(localStorage.getItem("students")) || [];

// Check if email already exists
const emailExists = students.some(student => student.email === email);

if (emailExists) {

    alert("Email already exists.");

    return;

}

// Check if matric number already exists
const matricExists = students.some(student => student.matric === matric);

if (matricExists) {

    alert("Matric number already exists.");

    return;

}

// Add new student
students.push(user);

// Save updated array
localStorage.setItem("students", JSON.stringify(students));

addActivity(

"New student registered: " + fullname,

"bi bi-person-plus-fill"

);

alert("Registration Successful!");

window.location.href = "login.html";



// Login

const loginForm = document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit", function(e){

        e.preventDefault();

        const username=document.getElementById("username").value;

        const password=document.getElementById("password").value;

        const student=JSON.parse(localStorage.getItem("student"));

        if(student){

            if(

                (username===student.email ||

                 username===student.matric)

                &&

                password===student.password

            ){

                localStorage.setItem("loggedInUser", JSON.stringify(student));

                window.location.href="student-dashboard.html";

            }

            else{

                alert("Incorrect login details.");

            }

        }

        else{

            alert("No account found.");

        }

    });

}



// Logout

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener("click",function(e){

        e.preventDefault();

        localStorage.removeItem("loggedIn");

        window.location.href="../index.html";

    });

}

/* ===================================
   PAGE PROTECTION
=================================== */

const protectedPages = [

    "student-dashboard.html",

    "upload-project.html",

    "my-submissions.html",

    "download-history.html",

    "profile.html"

];

const currentPage = window.location.pathname.split("/").pop();

if(protectedPages.includes(currentPage)){

    if(localStorage.getItem("loggedIn")!=="true"){

        window.location.href="login.html";

    }

}

/* ===========================
   STUDENT AUTHENTICATION
=========================== */

function requireStudentLogin() {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {

        alert("Please login first.");

        window.location.href = "login.html";

    }

}


/* ===========================
   ADMIN AUTHENTICATION
=========================== */

function requireAdminLogin() {

    const loggedInAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));

    if (!loggedInAdmin) {

        alert("Administrator login required.");

        window.location.href = "../index.html";

    }

}