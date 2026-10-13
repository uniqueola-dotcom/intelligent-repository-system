document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Projects by Status
    // =========================

    const statusCanvas = document.getElementById("statusChart");

    if (statusCanvas) {

        new Chart(statusCanvas, {

            type: "doughnut",

            data: {
                labels: [
                    "Approved",
                    "Pending"
                ],

                datasets: [{
                    data: [
                        statisticsData.approved,
                        statisticsData.pending
                    ]
                }]
            },

            options: {
                responsive: true,

                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }

        });
    }


    // =========================
    // Projects by Faculty
    // =========================

    const facultyCanvas = document.getElementById("facultyChart");

    if (facultyCanvas) {

        new Chart(facultyCanvas, {

            type: "bar",

            data: {

                labels: statisticsData.faculty.map(
                    item => item.name
                ),

                datasets: [{
                    label: "Projects",

                    data: statisticsData.faculty.map(
                        item => item.total
                    )
                }]

            },

            options: {

                responsive: true,

                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }

            }

        });
    }


    // =========================
    // Projects by Department
    // =========================

    const departmentCanvas =
        document.getElementById("departmentChart");

    if (departmentCanvas) {

        new Chart(departmentCanvas, {

            type: "bar",

            data: {

                labels: statisticsData.department.map(
                    item => item.name
                ),

                datasets: [{
                    label: "Projects",

                    data: statisticsData.department.map(
                        item => item.total
                    )
                }]

            },

            options: {

                responsive: true,

                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }

            }

        });
    }

});