var tasks = [];
var btns = [];

// document.addEventListener("click", function(event) {
//     console.log(event.target.id);
// });

function addTask() {
    const task = {
        title: document.querySelector("#taskTitle").value,
        isCompleted: false,
    }
        tasks.push(task);
}

function ShowTasks() {
    document.querySelector("#toDoList").innerHTML = "";
        tasks.forEach((task, i) => {
            document.querySelector("#toDoList").innerHTML += `
            <li>${task.title}</li>
            <button class="delete" id="del${i}" >DELETE</button>
            <button class="done" id="done${i}">DONE</button>
            `;
        });          
}




//delete task
const allButtons = document.querySelectorAll(".delete");
allButtons.forEach(function(button) { // אני עובר על כל הכפתורים עם הקלאס
    button.addEventListener("click", function(event) { // עבור כל אחד מהם, מקים האזנה לאירוע
        console.log(event.target);
    });
});

function deleteTask(i) {
    tasks.splice(i, 1);
    ShowTasks();
    store();

}



//end

function doneTask(i) {
    tasks[i].isCompleted = true;
    ShowTasks();
    store();
    document.querySelector(tasks[i]).style.backgroundColor = "green"; 
}

function store() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function restore() {
    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks"));
        ShowTasks();
    }
}
restore();

document.querySelector("#addTask").addEventListener("click", function() {
    addTask();
    ShowTasks();
    store();
});

