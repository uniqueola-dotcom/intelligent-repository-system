/* Load Faculties */

const faculty = document.getElementById("faculty");

const department = document.getElementById("department");

Object.keys(facultyDepartments).forEach(item => {

    faculty.innerHTML +=

    `<option value="${item}">${item}</option>`;

});

/* Departments */

faculty.addEventListener("change", function(){

    department.innerHTML =

    `<option value="">Select Department</option>`;

    facultyDepartments[this.value].forEach(dep=>{

        department.innerHTML +=

        `<option value="${dep}">${dep}</option>`;

    });

});

/* Upload */

const uploadForm = document.getElementById("repositoryUploadForm");

uploadForm.addEventListener("submit",function(e){

    e.preventDefault();

    const projects =

    JSON.parse(localStorage.getItem("projects")) || [];

    const project = {

        id:Date.now(),

        title:projectTitle.value,

        studentName:studentName.value,

        matricNumber:matricNumber.value,

        faculty:faculty.value,

        department:department.value,

        supervisor:supervisor.value,

        session:session.value,

        keywords:keywords.value,

        abstract:abstract.value,

        fileName:projectFile.files[0].name,

        uploadedBy:"Administrator",

        status:"Published",

        date:new Date().toLocaleDateString()

    };

    projects.push(project);

    localStorage.setItem(

        "projects",

        JSON.stringify(projects)

    );

    alert("Project successfully published.");

    uploadForm.reset();

});