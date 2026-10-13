let activities = JSON.parse(localStorage.getItem("activities")) || [];

const container = document.getElementById("activityContainer");

function loadActivities(){

container.innerHTML="";

if(activities.length===0){

container.innerHTML="<p>No activities recorded.</p>";

return;

}

activities.reverse().forEach(activity=>{

container.innerHTML+=`

<div class="activity-card">

<i class="${activity.icon}"></i>

<div>

<h4>${activity.message}</h4>

<small>${activity.time}</small>

</div>

</div>

`;

});

}

loadActivities();
