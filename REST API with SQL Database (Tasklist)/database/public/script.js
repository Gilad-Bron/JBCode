const DOM = {
    taskTitle: document.querySelector("#title"),
    taskDue: document.querySelector("#due"),
    addTaskBtn: document.querySelector("#addTaskBtn"),
    tasksView: document.querySelector("#tasksView"),
    addTaskForm: document.querySelector("#addTaskForm"),
    deleteBtns: document.querySelectorAll(".deleteBtns"),
    editBtns: document.querySelectorAll(".editBtns"),
    saveBtn: document.querySelector(".saveBtn"),
};

const routes = {
    index: '/',
    tasks: '/api/tasks',
};

let currentlyEditingID = null;

const showItem = (...items) => {
    items.forEach(item => {item.style.display = "block";});    
};

const hideItem = (...items) => { 
    items.forEach(item => {item.style.display = "none";});
}

const clearForm = () => {
    DOM.taskTitle.value = "";
    DOM.taskDue.value = "";
};

const fetchTasks = () => {
    fetch(routes.tasks).then(res => res.json()).then(tasks => {
        DOM.tasksView.innerHTML = "";
        tasks.forEach(task => {
            DOM.tasksView.innerHTML += `
                <tr>
                    <td>${task.ID}</td>
                    <td class="title_clm">${task.title}</td>
                    <td class="due_clm">${(task.due)}</td>
                    <td>${task.is_done}</td>
                    <td>
                        <button class="deleteBtns" data-id="${task.ID}" data-title="${task.title}" data-due="${task.due}" data-is_done="${task.is_done}">Delete</button>
                        <button class="editBtns" data-id="${task.ID}" data-title="${task.title}" data-due="${task.due}" data-is_done="${task.is_done}">Edit</button>
                </tr>    
            `;
        });
    });
};

// Click Handlers

    // Add task
DOM.addTaskBtn.addEventListener("click", () => {
    if (DOM.taskTitle.value === "" || DOM.taskDue.value === "") {
        alert("Please enter a title and due date for your task.");
        return;
    } else {
        console.log("---Add task: Due date is " + DOM.taskDue.value);
        fetch(routes.tasks, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: DOM.taskTitle.value,
                due: DOM.taskDue.value
            })
        }).then(fetchTasks);
    }
    clearForm();
});

    // Edit task 
DOM.tasksView.addEventListener('click', (click) => {
    if (click.target.classList.contains("editBtns")) {
        currentlyEditingID = click.target.dataset.id;
        const myTitle = click.target.dataset.title;
        const myDue = (click.target.dataset.due).toString().slice(0, 10);
        console.log("Editing task " + currentlyEditingID + " with title " + myTitle + " and due date " + myDue);
        DOM.taskTitle.value = myTitle;
        DOM.taskDue.value = myDue;
        
        DOM.saveBtn.style.display = "block";
        DOM.addTaskBtn.style.display = "none";

        alert("You are now editing task " + currentlyEditingID + ". Please make your changes and click save when you are done.");
    }
});

    // Save edited task
DOM.saveBtn.addEventListener('click', () => {
        console.log("Saving edited task " + currentlyEditingID + " with title " + DOM.taskTitle.value + " and due date " + DOM.taskDue.value);
        fetch(routes.tasks, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: DOM.taskTitle.value,
                due: DOM.taskDue.value,
                id: currentlyEditingID,
            })
        }).then(fetchTasks);

        currentlyEditingID = null;  
        clearForm();
        DOM.saveBtn.style.display = "none";
        DOM.addTaskBtn.style.display = "block";
});

    // Delete task
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

// Initial fetch

fetchTasks();