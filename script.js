
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks in the browser
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");

    const text = taskInput.value.trim();
    const date = taskDate.value;

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: text,
        date: date,
        completed: false
    });

    saveTasks();

    taskInput.value = "";
    taskDate.value = "";

    displayTasks();
}

// Filter tasks
function setFilter(filter) {
    currentFilter = filter;
    displayTasks();
}

// Display tasks
function displayTasks() {
    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        if (currentFilter === "pending" && task.completed) return;
        if (currentFilter === "completed" && !task.completed) return;

        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const details = document.createElement("div");
        details.className = "task-details";

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.style.textDecoration = "line-through";
        }

        details.appendChild(span);

        if (task.date) {
            const dateText = document.createElement("small");
            dateText.textContent = "Due: " + task.date;
            details.appendChild(dateText);
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(details);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    updateDashboard();
}

// Update dashboard statistics
function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("progressText").textContent = progress + "%";
    document.getElementById("progressFill").style.width = progress + "%";
}

// Show tasks when the page opens
displayTasks();
