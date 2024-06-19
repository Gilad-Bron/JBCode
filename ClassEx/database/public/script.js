const DOM = {
    taskTitle: document.querySelector("#title"),
    taskDue: document.querySelector("#due"),
    addTaskBtn: document.querySelector("#addTaskBtn"),
    tasksView: document.querySelector("#tasks"),
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
    }).then(res => res.json()).then(tasks => {
        tasks.forEach(task => {
            DOM.tasksView.innerHTML = `
                <tr>
                    <td>${task.ID}</td>
                    <td>${task.title}</td>
                    <td>${task.due}</td>
                    <td>${task.is_done}</td>
                    <td>
                        <button class="delete" data-id="${task.ID}">Delete</button>
                    </td>
                </tr>    
            `;
        });
    });
});


    // Delete a task
DOM.deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", () => {
        fetch(routes.tasks, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: deleteBtn.getAttribute("data-id") // ***Get the ID of the task to delete from the data-id attribute***
            })
        }).then(res => res.json()).then(tasks => {
            DOM.tasksView.innerHTML = "";
            tasks.forEach(task => {
                DOM.tasksView.innerHTML = `
                    <tr>
                        <td>${task.ID}</td>
                        <td>${task.title}</td>
                        <td>${task.due}</td>
                        <td>${task.is_done}</td>
                        <td><button class="delete" data-id="${task.ID}">Delete</button></td>
                    </tr>    
                `
            });
         });
    });
 });


