const selectedId = Number(localStorage.getItem("selectedProject"));

const projects = JSON.parse(localStorage.getItem("projects")) || [];

const project = projects.find(p => p.id === selectedId);

if(project){

document.getElementById("projectTitle").textContent = project.title;

document.getElementById("studentName").textContent = project.studentName;

document.getElementById("matricNumber").textContent = project.matricNumber || "Not Available";

document.getElementById("faculty").textContent = project.faculty;

document.getElementById("department").textContent = project.department;

document.getElementById("supervisor").textContent = project.supervisor || "Not Available";

document.getElementById("session").textContent = project.session;

document.getElementById("status").textContent = project.status;

document.getElementById("downloads").textContent = project.downloads || 0;

document.getElementById("keywords").textContent = project.keywords;

document.getElementById("abstract").textContent = project.abstract;

}

function downloadCurrentProject(){

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if(!loggedInUser){

alert("You must login to download projects.");

window.location.href="login.html";

return;

}

current.downloads = (current.downloads || 0)+1;

localStorage.setItem(

"projects",

JSON.stringify(projects)

);

let downloads = Number(

localStorage.getItem("downloads")

)||0;

downloads++;

localStorage.setItem(

"downloads",

downloads

);

/* Save Download History */

let history = JSON.parse(

localStorage.getItem("downloadHistory")

)||[];

history.push({

title:current.title,

student:current.studentName,

date:new Date().toLocaleString()

});

localStorage.setItem(

"downloadHistory",

JSON.stringify(history)

);

/* Activity Log */

addActivity(

"Project downloaded: " + current.title,

"bi bi-download"

);

alert(

"In the Django version, the PDF will download automatically."

);

location.reload();

}