// Select elements
const addTaskForm = document.getElementById("addTaskForm");
const taskNameInput = document.getElementById("taskName");
const taskStatusSelect = document.getElementById("taskStatus");
const tasksTable = document.getElementById("tasksTable").querySelector("tbody");

// Initialize tasks array
let tasks = [];

// Function to render tasks
function renderTasks() {
    tasksTable.innerHTML = ""; // Clear the table body
    tasks.forEach((task, index) => {
        const row = document.createElement("tr");

        // Task Name Column
        const nameCell = document.createElement("td");
        nameCell.textContent = task.name;
        row.appendChild(nameCell);

        // Task Status Column
        const statusCell = document.createElement("td");
        statusCell.textContent = task.status;
        statusCell.className = task.status.toLowerCase().replace(" ", "-");
        row.appendChild(statusCell);

        // Actions Column
        const actionsCell = document.createElement("td");

        // Dropdown for updating status
        const statusDropdown = document.createElement("select");
        ["Pending", "InProgress", "Completed"].forEach((status) => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            option.selected = task.status === status;
            statusDropdown.appendChild(option);
        });
        statusDropdown.addEventListener("change", (e) =>
            updateTaskStatus(index, e.target.value)
        );
        actionsCell.appendChild(statusDropdown);

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.background = "#e74c3c";
        deleteButton.style.color = "white";
        deleteButton.addEventListener("click", () => deleteTask(index));
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        tasksTable.appendChild(row);
    });

    // Save updated tasks to localStorage
    saveTasksToLocalStorage();
}

// Function to add a task
function addTask(name, status) {
    tasks.push({ name, status });
    renderTasks();
}

// Function to update task status
function updateTaskStatus(index, newStatus) {
    tasks[index].status = newStatus;
    renderTasks();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

// Add task form submit handler
addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = taskNameInput.value.trim();
    const status = taskStatusSelect.value;
    if (name) {
        addTask(name, status);
        addTaskForm.reset();
    }
});

// Initial load
loadTasksFromLocalStorage();
