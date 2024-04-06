// שלב 1 - הגדרת האלמנטים
let tasks = [];
if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
}

const insertButton = document.querySelector("#insert");
const tasksList = document.querySelector("#tasks");

// שלב 2 - הגדרת פונקציות לחיצה על כפתורים
insertButton.addEventListener("click", function() {
    tasks.push({
        title: document.querySelector("#task").value,
        completed: false
    });

    reload_tasks(); 
});

tasksList.addEventListener("click", function(event) {
    const classes = event.target.classList;
    const thisId = event.target.dataset.id;

    if (classes.contains("delete")) {
        tasks.splice(thisId, 1);
    } else if (classes.contains("complete")) {

        if (tasks[thisId].completed) {
            tasks[thisId].completed = false;
        } else {
            tasks[thisId].completed = true;
        }

    }

    reload_tasks();
});

// שלב 3 - שיקוף המערך למנגנון האחסון המקומי ולעמוד עצמו
function reload_tasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));

    tasksList.innerHTML = '';
    tasks.forEach((task,index) => {
        let completed = '';

        if (task.completed) {
            completed = 'class="completed"';
        }

        tasksList.insertAdjacentHTML("beforeend", `
            <li ${completed}>
                ${task.title}
                <button class="delete pleaseDelete delForSure" data-id="${index}">DELETE</button>
                <button class="complete" data-id="${index}">COMPLETE</button>
            </li>
        `)
    })
}

reload_tasks();