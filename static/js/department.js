document.addEventListener("DOMContentLoaded", function () {
    const facultySelect = document.getElementById("faculty");
    const departmentSelect = document.getElementById("department");

    if (!facultySelect || !departmentSelect) {
        return;
    }

    async function loadDepartments(facultyId, selectedDepartment = "") {
        departmentSelect.innerHTML =
            '<option value="">Select Department</option>';

        departmentSelect.disabled = true;

        if (!facultyId) {
            return;
        }

        departmentSelect.innerHTML =
            '<option value="">Loading departments...</option>';

        try {
            const response = await fetch(
                `/api/departments/${encodeURIComponent(facultyId)}/`
            );

            if (!response.ok) {
                throw new Error("Failed to load departments.");
            }

            const departments = await response.json();

            departmentSelect.innerHTML =
                '<option value="">Select Department</option>';

            departments.forEach(function (department) {
                const option = document.createElement("option");

                option.value = department.id;
                option.textContent = department.name;

                if (String(department.id) === String(selectedDepartment)) {
                    option.selected = true;
                }

                departmentSelect.appendChild(option);
            });

            departmentSelect.disabled = false;

        } catch (error) {
            console.error("Department loading error:", error);

            departmentSelect.innerHTML =
                '<option value="">Unable to load departments</option>';
        }
    }

    facultySelect.addEventListener("change", function () {
        loadDepartments(this.value);
    });

    // Restore departments if Django re-renders the form after a validation error.
    if (facultySelect.value) {
        loadDepartments(
            facultySelect.value,
            departmentSelect.value
        );
    }
});
