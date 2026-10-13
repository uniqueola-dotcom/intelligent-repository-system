let projects = JSON.parse(localStorage.getItem("projects")) || [];

const tbody = document.getElementById("pendingProjectsBody");

function loadPendingProjects(){

tbody.innerHTML="";

const pendingProjects = projects.filter(

project => project.status === "Pending"

);

if(pendingProjects.length===0){

tbody.innerHTML=

`<tr>

<td colspan="6" style="text-align:center">

No pending submissions.

</td>

</tr>`;

return;

}

pendingProjects.forEach(project=>{

tbody.innerHTML+=`

<tr>

<td>${project.title}</td>

<td>${project.studentName || "Unknown Student"}</td>

<td>${project.department}</td>

<td>${project.date}</td>

<td>

<span class="status-pending">

${project.status}

</span>

</td>

<td>

<button
class="approve-btn"

onclick="approveProject(${project.id})">

Approve

</button>

<button
class="reject-btn"

onclick="rejectProject(${project.id})">

Reject

</button>

</td>

</tr>

`;

});

}

loadPendingProjects();

function approveProject(id){

projects = projects.map(project=>{

if(project.id===id){

project.status="Approved";

addActivity(

"Administrator approved: " + project.title,

"bi bi-check-circle-fill"

);

}

return project;

});

localStorage.setItem("projects",JSON.stringify(projects));

alert("Project approved successfully.");

loadPendingProjects();

}

function rejectProject(id){

projects = projects.map(project=>{

if(project.id===id){

project.status="Rejected";

addActivity(

"Administrator rejected: " + project.title,

"bi bi-x-circle-fill"

);

}

return project;

});

localStorage.setItem("projects",JSON.stringify(projects));

alert("Project rejected.");

loadPendingProjects();

}