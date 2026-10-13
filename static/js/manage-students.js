let students = JSON.parse(localStorage.getItem("students")) || [];

let projects = JSON.parse(localStorage.getItem("projects")) || [];

const table = document.getElementById("studentsTable");

function loadStudents(){

table.innerHTML="";

if(students.length===0){

table.innerHTML=`

<tr>

<td colspan="7" style="text-align:center;">

No registered students.

</td>

</tr>

`;

return;

}

students.forEach(student=>{

const projectCount = projects.filter(

project => project.studentName === student.fullname

).length;

table.innerHTML += `

<tr>

<td>${student.fullname}</td>

<td>${student.matric}</td>

<td>${student.faculty}</td>

<td>${student.department}</td>

<td>${student.email}</td>

<td>${projectCount}</td>

<td>

<button class="view-btn"

onclick="viewStudent('${student.email}')">

View

</button>

<button class="delete-btn"

onclick="deleteStudent('${student.email}')">

Delete

</button>

</td>

</tr>

`;

});

}

loadStudents();

function viewStudent(email){

const student = students.find(

item=>item.email===email

);

alert(

"Name: "+student.fullname+

"\n\nMatric Number: "+student.matric+

"\n\nFaculty: "+student.faculty+

"\n\nDepartment: "+student.department+

"\n\nEmail: "+student.email

);

}

function deleteStudent(email){

if(confirm("Delete this student account?")){

students = students.filter(

student=>student.email!==email

);

localStorage.setItem(

"students",

JSON.stringify(students)

);

loadStudents();

}

}