/* ==========================================
   STUDENT DASHBOARD JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       USER DROPDOWN
    ========================== */

    const userBtn = document.querySelector(".user-btn");
    const dropdown = document.querySelector(".dropdown-content");

    if (userBtn && dropdown) {

        userBtn.addEventListener("click", function (e) {

            e.stopPropagation();

            if (dropdown.style.display === "block") {

                dropdown.style.display = "none";

            } else {

                dropdown.style.display = "block";

            }

        });

        document.addEventListener("click", function () {

            dropdown.style.display = "none";

        });

    }

    /* ==========================
       NOTIFICATION BUTTON
    ========================== */

    const notificationBtn = document.querySelector(".notification-btn");

    if (notificationBtn) {

        notificationBtn.addEventListener("click", function () {

            alert("Notifications feature will be implemented in the backend.");

        });

    }

    /* ==========================
       ACTIVE SIDEBAR LINK
    ========================== */

    const currentPage = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll(".sidebar a");

    links.forEach(link => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add("active");

        }

    });

});