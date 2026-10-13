
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-password").forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            const input = document.getElementById(this.dataset.target);

            if (!input) {
                return;
            }

            input.type = input.type === "password" ? "text" : "password";
        });
    });
});
