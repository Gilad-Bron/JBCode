var tasks = [];

function addTask() {
    const task = {
        title: document.querySelector("#taskTitle").value,
        isCompleted: false,
        dueDate: document.querySelector("#dueDate").value,
    };
    tasks.push(task);
}

function showTasks() {
    document.querySelector("#toDoList").innerHTML = "";
    tasks.forEach((task, i) => {
        console.log(task.title)
        document.querySelector("#toDoList").innerHTML += `
            <li><h4 style="color: ${task.isCompleted ? 'lime' : 'red'}">${task.title} </br> Due Date: ${task.dueDate} </h4></li>
            <button class="delete" data-del="${i}">Delete</button>
            <button class="done" data-done="${i}">${task.isCompleted ? 'Undone' : 'Done'}</button>
            `;
    });
    bindDeleteBtns();
    bindDoneBtns();
}


function store() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function restore() {
    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks"));
        showTasks();
    }
}
restore();

function bindDeleteBtns() {
    document.querySelectorAll(".delete").forEach(function (button) {
        button.addEventListener("click", function (event) {
            deleteTask(+event.target.dataset.del);
            console.log("del index is: " + event.target.dataset.del);
        });
    });
}

function bindDoneBtns() {
    document.querySelectorAll(".done").forEach(function (button) {
        button.addEventListener("click", function (event) {
            toggleTaskCompletion(+event.target.dataset.done);
            console.log("done index is: " + event.target.dataset.done);

        });
    });
}

function toggleTaskCompletion(i) {
    tasks[i].isCompleted = !tasks[i].isCompleted
    showTasks();
    store();
}

function deleteTask(i) {
    tasks.splice(i, 1);
    showTasks();
    store();
}

document.querySelector("#addTask").addEventListener("click", function () {
    addTask();
    showTasks();
    store();
});

document.querySelector("#taskTitle").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
        showTasks();
        store();
    }
});

flatpickr("#dueDate", {
    dateFormat: "d/m/Y",
});