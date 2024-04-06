// קריאה כללית
$("selector").method();

// בעת לחיצת עכבר - לבצע משהו
$("selector").on("click", function() {

});

// לקבל ערך משדה טקסט
$("selector").val();

// בחירה באלמנט שנוצר דינאמית
$("parentSelector").on("click", "selector", function() {

});

// הוספת ילד בתגית אם
$("#list").append(`<li>${element}</li>`);











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
        due: document.querySelector("#due").value,
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
                <span>${task.title}</span>
                <span>${task.due}</span>
                <button class="delete pleaseDelete delForSure" data-id="${index}">DELETE</button>
                <button class="complete" data-id="${index}">COMPLETE</button>
            </li>
        `)
    })
}

reload_tasks();

flatpickr("#due", {
    dateFormat: "d/m/Y",
});






fetch();