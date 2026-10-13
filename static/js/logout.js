function logoutStudent(){

    if(confirm("Are you sure you want to logout?")){

        localStorage.removeItem("loggedInUser");

        window.location.href="../index.html";

    }

}

function logoutAdmin(){

    if(confirm("Logout Administrator?")){

        localStorage.removeItem("loggedInAdmin");

        window.location.href="../index.html";

    }

}