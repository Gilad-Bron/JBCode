const DOM = {
    taskTitle: document.querySelector("#title"),
    taskDue: document.querySelector("#due"),
    addTaskBtn: document.querySelector("#addTaskBtn"),
    tasksView: document.querySelector("#tasksView"),
    addTaskForm: document.querySelector("#addTaskForm"),
    deleteBtns: document.querySelectorAll(".deleteBtns"),
}

const routes = {
    index: '/',
    tasks: '/api/tasks',
};

const fetchTasks = () => {
    fetch(routes.tasks).then(res => res.json()).then(tasks => {
        DOM.tasksView.innerHTML = "";
        tasks.forEach(task => {
            DOM.tasksView.innerHTML += `
                <tr>
                    <td>${task.ID}</td>
                    <td>${task.title}</td>
                    <td>${task.due}</td>
                    <td>${task.is_done}</td>
                    <td>
                        <button class="deleteBtns" data-id="${task.ID}">Delete</button>
                    </td>
                </tr>    
            `;
        });
    });
};

fetchTasks();

// Click Handlers

    // Add a task
DOM.addTaskBtn.addEventListener("click", () => {
    fetch(routes.tasks, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: DOM.taskTitle.value,
            due: DOM.taskDue.value,
        })
    }).then(fetchTasks);
});

    // Delete a task
DOM.tasksView.addEventListener('click', (click) => {
    if (click.target.classList.contains("deleteBtns") && confirm("Are you sure you want to delete this task?")) {
        fetch(routes.tasks, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: click.target.dataset.id
            })
        }).then(fetchTasks);
    }
});

// ***same as above but with req.params instead of req.body***
// DOM.tasksView.addEventListener('click', (click) => {
//     if (click.target.classList.contains('deleteBtns') && confirm('Are you sure you want to delete this task?')) {
//         const myId = click.target.dataset.id;
//         const route = `${routes.tasks}/${myId}`;
//         fetch(route, {method: "DELETE"}).then(res => res.json()).then((data) => {
//             click.target.closest("tr").remove();
//         });
//     };
// });