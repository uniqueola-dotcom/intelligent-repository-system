/* ============================
   FACULTY & DEPARTMENT DATA
============================ */


/* ============================
   LOAD DEPARTMENTS
============================ */

const facultySelect = document.getElementById("faculty");
const departmentSelect = document.getElementById("department");

if (facultySelect && departmentSelect) {

    facultySelect.innerHTML = '<option value="">Select Faculty</option>';

    Object.keys(facultyDepartments).forEach(function(faculty){

        const option = document.createElement("option");

        option.value = faculty;

        option.textContent = faculty;

        facultySelect.appendChild(option);

    });

    facultySelect.addEventListener("change", function(){

        const selectedFaculty = this.value;

        departmentSelect.innerHTML =
            '<option value="">Select Department</option>';

        if(facultyDepartments[selectedFaculty]){

            facultyDepartments[selectedFaculty].forEach(function(department){

                const option = document.createElement("option");

                option.value = department;

                option.textContent = department;

                departmentSelect.appendChild(option);

            });

        }

    });

}

const uploadForm = document.getElementById("uploadForm");

if(uploadForm){

    uploadForm.addEventListener("submit",function(e){

        e.preventDefault();

        const project={

            id:Date.now(),

            title:document.getElementById("projectTitle").value,

            faculty:document.getElementById("faculty").value,

            department:document.getElementById("department").value,

            session:document.getElementById("session").value,

            category:document.getElementById("category").value,

            keywords:document.getElementById("keywords").value,

            abstract:document.getElementById("abstract").value,

            filename:document.getElementById("projectFile").files[0].name,

            status:"Pending",

            date:new Date().toLocaleDateString()

        };

        let projects=JSON.parse(localStorage.getItem("projects")) || [];

        projects.push(project);

        localStorage.setItem("projects",JSON.stringify(projects));

        addActivity(

studentName + " uploaded a project.",

"bi bi-upload"

);

        alert("Project submitted successfully.\nAwaiting administrator approval.");

        uploadForm.reset();

        window.location.href="my-submissions.html";

    });

}