
class Task {
	constructor(id, taskTitle, taskDesc, taskDateTime, isDone) {
		this.id = id;
		this.taskTitle = taskTitle;
		this.taskDesc = taskDesc;
		this.taskDateTime = taskDateTime;
		this.isDone = isDone
	}

	render(shouldFade) {
		return `
      <div class="col-sm-12 col-md-6 col-xl-3 taskCard ${this.isDone ? "doneTask": ""}">
          <div class="card bg-transparent border-0 text-black ${shouldFade ? "animate-fade-in" : ""}" style="width: 20rem;">
              <img src="images/notebg.png" class="card-img">
              <div class="card-img-overlay">
                <div class="cardBtns">
                  	<i data-id="${this.id}" class="editBtns fa-solid fa-pen-to-square fa-lg"></i>
                  	<i data-id="${this.id}" class="deleteBtns fa-solid fa-square-xmark fa-lg"></i>
                </div>
                  <div class="cardTitle"><h4>${this.taskTitle}</h4></div>
                <div class="card-scroll-box">
                    <p class="card-text ">${this.taskDesc}</p>
                </div>
                <p class="card-text taskDateTime">${this.taskDateTime}</p>
              </div>
          </div>
      </div> 
      `
	}

	markAsDone() {
		this.isDone = true;
	}
}

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

const tasksArray = JSON.parse(localStorage.getItem("tasks")) || [];

let taskInstances = tasksArray.map((task, i) => new Task(i, task.taskTitle, task.taskDesc, task.taskDateTime));

const displayTasks = (isNewTask) => {
	DOMMap.taskList.innerHTML = "";
	taskInstances.forEach((task, i) => {
		const shouldFade = (isNewTask && i === taskInstances.length - 1) || firstRun;
		DOMMap.taskList.innerHTML += task.render(shouldFade)
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
		const task = new Task(taskInstances.length, DOMMap.taskTitle.value, DOMMap.taskDesc.value, DOMMap.taskDateTime.value);
		taskInstances.push(task);
		console.log(taskInstances);
		localStorage.setItem("tasks", JSON.stringify(taskInstances));
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
					taskInstances.splice(i, 1);
					localStorage.setItem("tasks", JSON.stringify(taskInstances));
					displayTasks();
				}
			});
			//Edit task
		} else if (classList.contains("editBtns")) {
			DOMMap.addTaskBtn.style.display = "none";
			DOMMap.saveChangesBtn.style.display = "inline";
			DOMMap.cancelChangesBtn.style.display = "inline";
			DOMMap.taskTitle.value = taskInstances[i].taskTitle;
			DOMMap.taskDesc.value = taskInstances[i].taskDesc;
			DOMMap.taskDateTime.value = taskInstances[i].taskDateTime;
			DOMMap.saveChangesBtn.addEventListener("click", () => {
				taskInstances[i].taskTitle = DOMMap.taskTitle.value;
				taskInstances[i].taskDesc = DOMMap.taskDesc.value;
				taskInstances[i].taskDateTime = DOMMap.taskDateTime.value;
				localStorage.setItem("tasks", JSON.stringify(taskInstances));
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
