
document.addEventListener("DOMContentLoaded", function () {
    const facultySelect = document.querySelector(
        'select[name="faculty"]'
    );

    const departmentSelect = document.querySelector(
        'select[name="department"]'
    );

    const selectedDepartmentElement = document.getElementById(
        "selected-department"
    );

    const departmentsUrlTemplate =
        typeof window.departmentsUrlTemplate !== "undefined"
            ? window.departmentsUrlTemplate
            : null;

    if (!facultySelect || !departmentSelect) {
        console.error("Repository faculty or department dropdown not found.");
        return;
    }

    function loadDepartments(facultyId, selectedDepartment = "") {
        departmentSelect.innerHTML =
            '<option value="">Select Department</option>';

        if (!facultyId) {
            return;
        }

        if (!departmentsUrlTemplate) {
            console.error("Departments API URL is missing.");
            return;
        }

        departmentSelect.innerHTML =
            '<option value="">Loading departments...</option>';
        departmentSelect.disabled = true;

        const url = departmentsUrlTemplate.replace(
            /\/0\/$/,
            `/${facultyId}/`
        );

        fetch(url)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Could not load departments.");
                }
                return response.json();
            })
            .then(function (departments) {
                departmentSelect.innerHTML =
                    '<option value="">Select Department</option>';

                departments.forEach(function (department) {
                    const option = document.createElement("option");
                    option.value = department.id;
                    option.textContent = department.name;

                    if (
                        String(department.id) ===
                        String(selectedDepartment)
                    ) {
                        option.selected = true;
                    }

                    departmentSelect.appendChild(option);
                });
            })
            .catch(function (error) {
                console.error(error);
                departmentSelect.innerHTML =
                    '<option value="">Unable to load departments</option>';
            })
            .finally(function () {
                departmentSelect.disabled = false;
            });
    }

    facultySelect.addEventListener("change", function () {
        loadDepartments(this.value);
    });

    let selectedDepartment = "";

    if (selectedDepartmentElement) {
        try {
            selectedDepartment = JSON.parse(
                selectedDepartmentElement.textContent
            );
        } catch (error) {
            console.error("Could not read selected department.", error);
        }
    }

    if (facultySelect.value) {
        loadDepartments(facultySelect.value, selectedDepartment);
    }
});
