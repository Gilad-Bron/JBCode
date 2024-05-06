let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
let firstRun = true;
const DOM = {};
const keysArray = [
	"addTaskForm",
	"taskTitle",
	"taskDesc",
	"taskDateTime",
	"completedOn",
	"addTaskBtn",
	"clearFormBtn",
	"saveChangesBtn",
	"cancelChangesBtn",
	"taskList",
	"completedTaskList",
	"cardBtn",
	"editBtn",
	"deleteBtn",
	"completeBtn",
	"showCompletedTasksBtn",
	"hideCompletedTasksBtn",
];
keysArray.forEach((key) => {
	DOM[key] = document.querySelector(`.${key}`);
});

const displayTasks = (isNewTask) => {
	DOM.taskList.innerHTML = "";
	tasks.forEach((task, i) => {
		const shouldFade = (isNewTask && i === tasks.length - 1) || firstRun;
		DOM.taskList.innerHTML += `
			<div class="col-sm-12 col-md-6 col-xl-3 taskCard">
				<div class="card bg-transparent border-0 text-black ${shouldFade ? "animate-fade-in" : ""}" style="width: 20rem;">
					<img src="images/notebg.png" class="card-img">
					<div class="card-img-overlay">
						<div class="cardBtn">
							<i data-id="${i}" class="editBtn fa-solid fa-square-pen fa-lg" title="Edit Task"></i>
							<i data-id="${i}" class="completeBtn fa-solid fa-square-check fa-lg" title="Mark as Complete"></i>
							<i data-id="${i}" class="deleteBtn fa-solid fa-square-xmark fa-lg" title="Delete Task"></i>
						</div>
						<div class="cardTitle">
							<h4>${task.taskTitle}</h4>
						</div>
						<div class="card-scroll-box">
							<p class="card-text">${task.taskDesc}</p>
						</div>
						<p class="card-text taskDateTime">Due on ${task.taskDateTime}</p>
					</div>
				</div>
			</div> 
		`;
	});
	firstRun = false;
};

const displayCompletedTasks = () => {
	DOM.completedTaskList.innerHTML = "";
	completedTasks.forEach((task, i) => {
		DOM.completedTaskList.innerHTML += `
			<div class="col-sm-12 col-md-6 col-xl-3 taskCard">
				<div class="card bg-transparent border-0 text-black" style="width: 20rem;">
					<img src="images/notebg_comp.png" class="card-img">
					<div class="card-img-overlay">
						<div class="cardBtn">
							<i data-id="${i}" class="deleteBtn complete fa-solid fa-square-xmark fa-lg" title="Delete Task"></i>
						</div>
						<div class="cardTitle">
							<h4>${task.taskTitle}</h4>
						</div>
						<div class="card-scroll-box">
							<p class="card-text">${task.taskDesc}</p>
						</div>
						<p class="card-text taskDateTime">Completed on ${task.completedOn}</p>
					</div>
				</div>
			</div> 
		`;
	});
};

const clickHandlers = () => {
	//Add task
	DOM.addTaskBtn.addEventListener("click", () => {
		if (!DOM.taskTitle.value || !DOM.taskDesc.value || !DOM.taskDateTime.value) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Please fill out all fields!",
				confirmButtonColor: "royalblue",
			});
			return;
		}
		// Always returns error, even when date is in the future
		// if (DOM.taskDateTime.value < new Date().toISOString().slice(0, 16)) {
		// 	Swal.fire({
		// 		icon: "error",
		// 		title: "Oops...",
		// 		text: "Your task due date must be in the future!",
		// 		confirmButtonColor: "royalblue",
		// 	});
		// 	return;
		// }
		const task = {
			taskTitle: DOM.taskTitle.value,
			taskDesc: DOM.taskDesc.value,
			taskDateTime: DOM.taskDateTime.value,
			completedOn: "",
		};
		tasks.push(task);
		localStorage.setItem("tasks", JSON.stringify(tasks));
		displayTasks(true);
		DOM.addTaskForm.reset();
	});

	//Changes to task
	DOM.taskList.addEventListener("click", (event) => {
		const i = event.target.dataset.id;
		const classList = event.target.classList;

		//Delete task
		if (classList.contains("deleteBtn")) {
			Swal.fire({
				title: "Are you sure you want to delete this task?",
				showCancelButton: true,
				confirmButtonText: "Yes",
				confirmButtonColor: "black",
				cancelButtonText: "Cancel",
			}).then((result) => {
				if (result.isConfirmed) {
					tasks.splice(i, 1);
					localStorage.setItem("tasks", JSON.stringify(tasks));
					displayTasks();	
				}
			});
		}

		//Edit task
		if (classList.contains("editBtn")) {
			DOM.addTaskBtn.style.display = "none";
			DOM.saveChangesBtn.style.display = "inline";
			DOM.cancelChangesBtn.style.display = "inline";
			DOM.taskTitle.value = tasks[i].taskTitle;
			DOM.taskDesc.value = tasks[i].taskDesc;
			DOM.taskDateTime.value = tasks[i].taskDateTime;
			DOM.saveChangesBtn.addEventListener("click", () => {
				if (!DOM.taskTitle.value || !DOM.taskDesc.value || !DOM.taskDateTime.value) {
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: "Please fill out all fields!",
						confirmButtonColor: "royalblue",
					});
					return;
				}
				tasks[i].taskTitle = DOM.taskTitle.value;
				tasks[i].taskDesc = DOM.taskDesc.value;
				tasks[i].taskDateTime = DOM.taskDateTime.value;
				localStorage.setItem("tasks", JSON.stringify(tasks));
				displayTasks();
				DOM.addTaskForm.reset();
				DOM.addTaskBtn.style.display = "inline";
				DOM.saveChangesBtn.style.display = "none";
				DOM.cancelChangesBtn.style.display = "none";
			});
		};

		//Mark task as complete
		if (classList.contains("completeBtn")) {
			tasks[i].completedOn = new Date().toLocaleString();
			completedTasks.push(tasks[i]);
			tasks.splice(i, 1);
			localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
			localStorage.setItem("tasks", JSON.stringify(tasks));
			DOM.showCompletedTasksBtn.style.display = "inline";
			displayTasks();
		}

		//Cancel changes
		DOM.cancelChangesBtn.addEventListener("click", () => {
			DOM.addTaskForm.reset();
			DOM.addTaskBtn.style.display = "inline";
			DOM.saveChangesBtn.style.display = "none";
			DOM.cancelChangesBtn.style.display = "none";
		});
	});

	DOM.clearFormBtn.addEventListener("click", () => {
		DOM.addTaskForm.reset();
	});

	DOM.showCompletedTasksBtn.addEventListener("click", () => {
		displayCompletedTasks();
		DOM.completedTaskList.style.display = "inline";
		DOM.showCompletedTasksBtn.style.display = "none";
		DOM.hideCompletedTasksBtn.style.display = "inline";
	});
	DOM.hideCompletedTasksBtn.addEventListener("click", () => {
			DOM.completedTaskList.style.display = "none";
			DOM.showCompletedTasksBtn.style.display = "inline";
			DOM.hideCompletedTasksBtn.style.display = "none";
	});

    //Delete task from completed tasklist
	DOM.completedTaskList.addEventListener("click", (event) => {
		i = event.target.dataset.id;
		Swal.fire({
			title: "Are you sure you want to delete this task?",
			showCancelButton: true,
			confirmButtonText: "Yes",
			confirmButtonColor: "black",
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (result.isConfirmed) {
				completedTasks.splice(i, 1);
				localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
				displayCompletedTasks();
			}
		//Disply Show and hide completed tasklist buttons
			if (completedTasks.length > 0) {
				DOM.showCompletedTasksBtn.style.display = "inline";
				//DOM.showCompletedTasksBtn.focus();
			} else { 
				DOM.showCompletedTasksBtn.style.display = "none";
				DOM.hideCompletedTasksBtn.style.display = "none";
			};
			
		});
	});	
};

// Run on page load

flatpickr(".taskDateTime", {
	enableTime: true,
	dateFormat: "d/m/Y H:i",
	time_24hr: true,
});

clickHandlers();

displayTasks();
