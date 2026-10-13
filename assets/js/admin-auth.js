const logout = document.getElementById("adminLogoutBtn");

if(logout){

    logout.addEventListener("click",function(e){

        e.preventDefault();

        localStorage.removeItem("adminLoggedIn");

        window.location.href="admin-login.html";

    });

}