const repositoryContainer = document.getElementById("repositoryContainer");
const facultyFilter = document.getElementById("facultyFilter");
const departmentFilter = document.getElementById("departmentFilter");
const searchInput = document.getElementById("searchInput");
const sortProjects = document.getElementById("sortProjects");

/* Load Faculties */

Object.keys(facultyDepartments).forEach(faculty => {

    facultyFilter.innerHTML +=
    `<option value="${faculty}">
        ${faculty}
    </option>`;

});

/* Load Departments */

facultyFilter.addEventListener("change", () => {

    departmentFilter.innerHTML =
    `<option value="">All Departments</option>`;

    if (!facultyFilter.value) {

        displayProjects();

        return;

    }

    facultyDepartments[facultyFilter.value].forEach(dep => {

        departmentFilter.innerHTML +=

        `<option value="${dep}">
            ${dep}
        </option>`;

    });

    displayProjects();

});

departmentFilter.addEventListener("change", displayProjects);
searchInput.addEventListener("keyup", displayProjects);
sortProjects.addEventListener("change", displayProjects);

/* Display Repository */

function displayProjects() {

    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    projects = projects.filter(project =>

        project.status === "Approved" ||

        project.status === "Published"

    );

    function viewProject(id){

    localStorage.setItem(

        "selectedProject",

        id

    );

    window.location.href="project-details.html";

}

function downloadProject(id){

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if(!loggedInUser){

alert("Please login to download projects.");

window.location.href="login.html";

return;

}

    project.downloads = (project.downloads || 0) + 1;

    localStorage.setItem(

        "projects",

        JSON.stringify(projects)

    );

    let totalDownloads =

    Number(localStorage.getItem("downloads")) || 0;

    totalDownloads++;

    localStorage.setItem(

        "downloads",

        totalDownloads

    );

    alert(

        "Download started.\n\nIn Django, the PDF will download automatically."

    );

    displayProjects();


loadRecentProjects();

loadPopularProjects();

}

    /* Search */

    const keyword = searchInput.value.toLowerCase();

    if (keyword) {

        projects = projects.filter(project =>

            project.title.toLowerCase().includes(keyword) ||

            project.studentName.toLowerCase().includes(keyword) ||

            project.department.toLowerCase().includes(keyword) ||

            project.keywords.toLowerCase().includes(keyword)

        );

    }

    /* Faculty */

    if (facultyFilter.value) {

        projects = projects.filter(project =>

            project.faculty === facultyFilter.value

        );

    }

    /* Department */

    if (departmentFilter.value) {

        projects = projects.filter(project =>

            project.department === departmentFilter.value

        );

    }

    /* Sorting */

    switch (sortProjects.value) {

        case "az":

            projects.sort((a, b) =>

                a.title.localeCompare(b.title)

            );

            break;

        case "za":

            projects.sort((a, b) =>

                b.title.localeCompare(a.title)

            );

            break;

        case "oldest":

            projects.reverse();

            break;

    }

    repositoryContainer.innerHTML = "";

    if (projects.length === 0) {

        repositoryContainer.innerHTML =

        `<h3>No projects found.</h3>`;

        return;

    }

    projects.forEach(project => {

        repositoryContainer.innerHTML += `

<div class="repository-card">

<div class="pdf-icon">

<i class="bi bi-file-earmark-pdf-fill"></i>

</div>

<h3>${project.title}</h3>

<p>

<strong>Student:</strong>

${project.studentName}

</p>

<p>

<strong>Faculty:</strong>

${project.faculty}

</p>

<p>

<strong>Department:</strong>

${project.department}

</p>

<p>

<strong>Supervisor:</strong>

${project.supervisor || "Not Available"}

</p>

<p>

<strong>Session:</strong>

${project.session}

</p>

<p>

<strong>Status:</strong>

<span class="repository-status">

${project.status}

</span>

</p>

<p>

<strong>Downloads:</strong>

${project.downloads || 0}

</p>

<div class="repository-buttons">

<button
class="view-btn"

onclick="viewProject(${project.id})">

View Details

</button>

<button
class="download-btn"

onclick="downloadProject(${project.id})">

Download

</button>

</div>

</div>

`;

    });

}

displayProjects();

const recentContainer =
document.getElementById("recentProjects");

const popularContainer =
document.getElementById("popularProjects");

function loadRecentProjects(){

const projects =

(JSON.parse(localStorage.getItem("projects")) || [])

.filter(project=>

project.status==="Approved" ||

project.status==="Published"

)

.slice()

.reverse()

.slice(0,4);

recentContainer.innerHTML="";

projects.forEach(project=>{

recentContainer.innerHTML+=`

<div class="repository-card">

<div class="pdf-icon">

<i class="bi bi-file-earmark-pdf-fill"></i>

</div>

<h3>${project.title}</h3>

<p>${project.department}</p>

<p>${project.session}</p>

</div>

`;

});

}

loadRecentProjects();

function loadPopularProjects(){

const projects =

(JSON.parse(localStorage.getItem("projects")) || [])

.filter(project=>

project.status==="Approved" ||

project.status==="Published"

)

.sort(

(a,b)=>

(b.downloads||0)-(a.downloads||0)

)

.slice(0,4);

popularContainer.innerHTML="";

projects.forEach(project=>{

popularContainer.innerHTML+=`

<div class="repository-card">

<div class="pdf-icon">

<i class="bi bi-file-earmark-pdf-fill"></i>

</div>

<h3>${project.title}</h3>

<p>

Downloads:

${project.downloads||0}

</p>

</div>

`;

});

}

loadPopularProjects();

document.addEventListener("DOMContentLoaded", () => {

    const facultySelect = document.querySelector('select[name="faculty"]');
    const departmentSelect = document.querySelector('select[name="department"]');

    if (!facultySelect || !departmentSelect) return;

    const selectedDepartmentEl = document.getElementById("selected-department");
    const initialSelectedDepartment = selectedDepartmentEl
        ? JSON.parse(selectedDepartmentEl.textContent)
        : "";

    facultySelect.addEventListener("change", () => {
        loadDepartments(facultySelect.value, "");
    });

    function loadDepartments(facultyId, preselectId) {

        departmentSelect.innerHTML = '<option value="">Select Department</option>';

        if (!facultyId) {
            return;
        }

        const url = departmentsUrlTemplate.replace("/0/", `/${facultyId}/`);

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("Failed to load departments");
                return response.json();
            })
            .then(departments => {
                departments.forEach(dep => {
                    const option = document.createElement("option");
                    option.value = dep.id;
                    option.textContent = dep.name;
                    if (String(dep.id) === String(preselectId)) {
                        option.selected = true;
                    }
                    departmentSelect.appendChild(option);
                });
            })
            .catch(err => {
                console.error(err);
                departmentSelect.innerHTML = '<option value="">Could not load departments</option>';
            });
    }

    // On page load, if a faculty is already selected (e.g. after a GET
    // request with filters applied), repopulate its departments and
    // re-select whichever department was active.
    if (facultySelect.value) {
        loadDepartments(facultySelect.value, initialSelectedDepartment);
    }

});