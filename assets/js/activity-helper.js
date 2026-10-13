function addActivity(message, icon){

let activities = JSON.parse(localStorage.getItem("activities")) || [];

activities.push({

message,

icon,

time:new Date().toLocaleString()

});

localStorage.setItem(

"activities",

JSON.stringify(activities)

);

}


