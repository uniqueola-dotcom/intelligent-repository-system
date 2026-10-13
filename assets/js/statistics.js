const students =
JSON.parse(localStorage.getItem("students")) || [];

const projects =
JSON.parse(localStorage.getItem("projects")) || [];

document.getElementById("studentCount").textContent =
students.length;

document.getElementById("projectCount").textContent =
projects.length;

document.getElementById("approvedCount").textContent =
projects.filter(project =>
project.status==="Approved" ||
project.status==="Published"
).length;

document.getElementById("downloadCount").textContent =
localStorage.getItem("downloads") || 0;


/* STATUS */

const pending =
projects.filter(project=>project.status==="Pending").length;

const approved =
projects.filter(project=>

project.status==="Approved" ||

project.status==="Published"

).length;

const rejected =
projects.filter(project=>project.status==="Rejected").length;

new Chart(

document.getElementById("statusChart"),

{

type:"bar",

data:{

labels:["Pending","Approved","Rejected"],

datasets:[{

label:"Projects",

data:[pending,approved,rejected]

}]

}

}

);


/* FACULTIES */

let facultyCounts={};

projects.forEach(project=>{

facultyCounts[project.faculty]=

(facultyCounts[project.faculty]||0)+1;

});

new Chart(

document.getElementById("facultyChart"),

{

type:"pie",

data:{

labels:Object.keys(facultyCounts),

datasets:[{

data:Object.values(facultyCounts)

}]

}

}

);


/* DEPARTMENTS */

let departmentCounts={};

projects.forEach(project=>{

departmentCounts[project.department]=

(departmentCounts[project.department]||0)+1;

});

new Chart(

document.getElementById("departmentChart"),

{

type:"doughnut",

data:{

labels:Object.keys(departmentCounts),

datasets:[{

data:Object.values(departmentCounts)

}]

}

}

);