const projectId = Number(localStorage.getItem("editProject"));

let projects = JSON.parse(localStorage.getItem("projects")) || [];

const project = projects.find(p => p.id === projectId);

if(project){

title.value = project.title;

studentName.value = project.studentName;

supervisor.value = project.supervisor;

session.value = project.session;

keywords.value = project.keywords;

abstract.value = project.abstract;

}

document.getElementById("editProjectForm")

.addEventListener("submit", function(e){

e.preventDefault();

project.title = title.value;

project.studentName = studentName.value;

project.supervisor = supervisor.value;

project.session = session.value;

project.keywords = keywords.value;

project.abstract = abstract.value;

localStorage.setItem(

"projects",

JSON.stringify(projects)

);

addActivity(

"Administrator edited project: " +

project.title,

"bi bi-pencil-square"

);

alert("Project updated successfully.");

window.location.href="manage-repository.html";

});