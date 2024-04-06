// שלב 1 - הגדרת האלמנטים
let tasks = [];
if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
}

// שלב 2 - הגדרת פונקציות לחיצה על כפתורים
$("#insert").on("click", function() {
    tasks.push({
        title: $("#task").val(),
        due: $("#due").val(),
        completed: false
    });

    reload_tasks(); 
});

$("#tasks").on("click", ".delete", function() {
    const myId = $(this).data('id');
    tasks.splice(myId, 1);
    reload_tasks();
});



$("#tasks").on("click", ".complete", function() {
    const myId = $(this).data('id');
    if (tasks[myId].completed) {
        tasks[myId].completed = false;
    } else {
        tasks[myId].completed = true;
    }

    reload_tasks();
});

// שלב 3 - שיקוף המערך למנגנון האחסון המקומי ולעמוד עצמו
function reload_tasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));

    $("#tasks").html('');

    $.each(tasks, function(index,task) {
        let completed = '';
        if (task.completed) {
            completed = 'class="completed"';
        }
        $("#tasks").append(`
        <li ${completed}>
            <span>${task.title}</span>
            <span>${task.due}</span>
            <button class="delete pleaseDelete delForSure" data-id="${index}">DELETE</button>
            <button class="complete" data-id="${index}">COMPLETE</button>
        </li>
    `)

    });
}

reload_tasks();

flatpickr("#due", {
    dateFormat: "d/m/Y",
});