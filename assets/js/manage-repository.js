let repository = JSON.parse(localStorage.getItem("projects")) || [];

const table = document.getElementById("repositoryTable");

function loadRepository() {

    table.innerHTML = "";

    const publishedProjects = repository.filter(project =>

        project.status === "Published" ||

        project.status === "Approved"

    );

    if (publishedProjects.length === 0) {

        table.innerHTML = `

        <tr>

        <td colspan="6" style="text-align:center;">

        No published projects available.

        </td>

        </tr>

        `;

        return;

    }

    publishedProjects.forEach(project => {

        table.innerHTML += `

        <tr>

        <td>${project.title}</td>

        <td>${project.studentName}</td>

        <td>${project.department}</td>

        <td>${project.uploadedBy}</td>

        <td>${project.status}</td>

        <td>

        <button class="view-btn"

        onclick="viewProject(${project.id})">

        View

        </button>

        <button class="edit-btn"

        onclick="editProject(${project.id})">

        Edit

        </button>

        <button class="delete-btn"

        onclick="deleteProject(${project.id})">

        Delete

        </button>

        </td>

        </tr>

        `;

    });

}

loadRepository();

function viewProject(id){

const project = repository.find(

item=>item.id===id

);

alert(

"Title: "+project.title+

"\n\nStudent: "+project.studentName+

"\n\nDepartment: "+project.department+

"\n\nSupervisor: "+project.supervisor+

"\n\nSession: "+project.session+

"\n\nKeywords: "+project.keywords+

"\n\nStatus: "+project.status

);

}

function deleteProject(id){

if(confirm("Delete this project?")){

repository=

repository.filter(

project=>project.id!==id

);

localStorage.setItem(

"projects",

JSON.stringify(repository)

);

loadRepository();

addActivity(

"Administrator deleted project.",

"bi bi-trash-fill"

);

}

}

function editProject(id){

localStorage.setItem(

"editProject",

id

);

window.location.href="edit-project.html";

}