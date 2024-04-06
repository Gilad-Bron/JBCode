// fetch("https://jsonplaceholder.typicode.com/todos")
//     .then(response => response.json())
//     .then(data => {
//         data.forEach(element => {
//             document.querySelector("#todo").insertAdjacentHTML("beforeend",
//                 `<li>Title: ${element.title} | Completed: ${element.completed}</li>`);
//         });
//     });


fetch("https://jsonplaceholder.typicode.com/todos")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            let isCompleted = 'Incomplete';

            if (element.completed) {
                isCompleted = "Completed";
            }
            document.querySelector("#todo").innerHTML += `
                <li>${element.title} - ${isCompleted} - <button class="delete">DELETE</button></li>
            `;
        });
    });


document.querySelector("#todo").addEventListener("click", function (event) {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
    }
});
