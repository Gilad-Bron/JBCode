// DOM elements and constants

let firstRun = true;

const keysArray = [
	"addTaskForm",
	"taskTitle",
	"taskDesc",
	"taskDateTime",
	"addTaskBtn",
	"clearFormBtn",
	"saveChangesBtn",
	"cancelChangesBtn",
	"taskList",
	"cardBtns",
	"editBtns",
	"deleteBtns",
]

const DOMMap = {};

keysArray.forEach((key) => {
	DOMMap[key] = document.querySelector(`.${key}`);
})

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const displayTasks = (isNewTask) => {
	DOMMap.taskList.innerHTML = "";
	tasks.forEach((e, i) => {
		const shouldFade = (isNewTask && i === tasks.length - 1) || firstRun;
		DOMMap.taskList.innerHTML += `
      <div class="col-sm-12 col-md-6 col-xl-3 taskCard">
          <div class="card bg-transparent border-0 text-black ${shouldFade ? "animate-fade-in" : ""}" style="width: 20rem;">
              <img src="images/notebg.png" class="card-img">
              <div class="card-img-overlay">
                <div class="cardBtns">
                  	<i data-id="${i}" class="editBtns fa-solid fa-pen-to-square fa-lg"></i>
                  	<i data-id="${i}" class="deleteBtns fa-solid fa-square-xmark fa-lg"></i>
                </div>
                  <div class="cardTitle"><h4>${e.taskTitle}</h4></div>
                <div class="card-scroll-box">
                    <p class="card-text ">${e.taskDesc}</p>
                </div>
                <p class="card-text taskDateTime">${e.taskDateTime}</p>
              </div>
          </div>
      </div> 
      `
	});
	firstRun = false;
}

const bindClickHandlers = () => {
	DOMMap.addTaskBtn.addEventListener("click", () => {
		if (!DOMMap.taskTitle.value || !DOMMap.taskDesc.value || !DOMMap.taskDateTime.value) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Please fill out all fields!",
				confirmButtonColor: "royalblue",
			});
			return;
		}
		const task = {
			taskTitle: DOMMap.taskTitle.value,
			taskDesc: DOMMap.taskDesc.value,
			taskDateTime: DOMMap.taskDateTime.value,
		};
		tasks.push(task);
		console.log(tasks);
		localStorage.setItem("tasks", JSON.stringify(tasks));
		displayTasks(true);
		DOMMap.addTaskForm.reset();
	});

	DOMMap.taskList.addEventListener("click", (event) => {
		const i = event.target.dataset.id;
		const classList = event.target.classList;
		//Delete task
		if (classList.contains("deleteBtns")) {
			Swal.fire({
				title: "Are you sure you want to delete this task?",
				showCancelButton: true,
				confirmButtonText: "Yes",
				confirmButtonColor: "darkorange",
				cancelButtonText: "Cancel",
			}).then((result) => {
				if (result.isConfirmed) {
					tasks.splice(i, 1);
					localStorage.setItem("tasks", JSON.stringify(tasks));
					displayTasks();
				}
			});
			//Edit task
		} else if (classList.contains("editBtns")) {
			DOMMap.addTaskBtn.style.display = "none";
			DOMMap.saveChangesBtn.style.display = "inline";
			DOMMap.cancelChangesBtn.style.display = "inline";
			DOMMap.taskTitle.value = tasks[i].taskTitle;
			DOMMap.taskDesc.value = tasks[i].taskDesc;
			DOMMap.taskDateTime.value = tasks[i].taskDateTime;
			DOMMap.saveChangesBtn.addEventListener("click", () => {
				tasks[i].taskTitle = DOMMap.taskTitle.value;
				tasks[i].taskDesc = DOMMap.taskDesc.value;
				tasks[i].taskDateTime = DOMMap.taskDateTime.value;
				localStorage.setItem("tasks", JSON.stringify(tasks));
				displayTasks();
				DOMMap.addTaskForm.reset();
				DOMMap.addTaskBtn.style.display = "inline";
				DOMMap.saveChangesBtn.style.display = "none";
				DOMMap.cancelChangesBtn.style.display = "none";
			});
			//Cancel changes
			DOMMap.cancelChangesBtn.addEventListener("click", () => {
				DOMMap.addTaskForm.reset();
				DOMMap.addTaskBtn.style.display = "inline";
				DOMMap.saveChangesBtn.style.display = "none";
				DOMMap.cancelChangesBtn.style.display = "none";
			});
		}
	});

	DOMMap.clearFormBtn.addEventListener("click", () => {
		DOMMap.addTaskForm.reset();
	});
};

// Other Components

flatpickr(".taskDateTime", {
	enableTime: true,
	dateFormat: "d/m/Y H:i",
	time_24hr: true,
});


// Run on page load

//Attntion: The function below is not working properly.
bindClickHandlers();

displayTasks();
