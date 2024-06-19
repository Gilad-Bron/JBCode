fetch('http://localhost:3030/api/tasks')
.then(res => res.json())
.then(tasks => {
    tasks.forEach(task => {
        document.querySelector("#tasks").insertAdjacentHTML("beforeend", `
            <tr>
                <td>${task.ID}</td>
                <td>${task.title}</td>
                <td>${task.due}</td>
                <td>${task.is_done}</td>
                <td>
                    <button class="delete" data-id="${task.ID}">DELETE</button>
                </td>
            </tr>    
        `);
    });
});

document.querySelector("#tasks").addEventListener("click", function(e) {
    if (e.target.classList.contains("delete") && confirm("???")) {
        const myId = e.target.dataset.id;
        fetch(`http://localhost:3030/api/task/${myId}`, {method: "DELETE"})
        .then(res => res.json())
        .then(data => {
            e.target.closest("tr").remove();
            console.log(data);
        });
         
    }
});

