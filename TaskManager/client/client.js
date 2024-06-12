let tasks = [];
let completedTasks = [];
let firstRun = true;
const routes = {
	tasks: "/tasks",
	finishTask: "/finishTask",
	login: "/login",
};
const DOM = {};
const keysArray = [
	"addTaskForm",
	"taskTitle",
	"taskDesc",
	"taskDateTime",
	"completedOn",
	"addTaskButton",
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
	"loginForm",
	"username",
	"password",
	"loginBtn",
];

keysArray.forEach((key) => {
	DOM[key] = document.querySelector(`.${key}`);
});

const showElements = (...elements) => {
	elements.forEach((element) => {
		element.style.display = "inline";
	});
};

const hideElements = (...elements) => {
	elements.forEach((element) => {
		element.style.display = "none";
	});
};

const picker = flatpickr(".taskDateTime", {
	altInput: true,
	time_24hr: true,
	enableTime: true,
	altFormat: "d/m/Y H:i",
	dateFormat: "U",
	minDate: Date.now(),
});

const toProperUnix = (date) => (+date) * 1000;

const formatDateTime = (unixTimestamp) => {
	const date = new Date(unixTimestamp);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const getTaskHTML = (task, i, shouldFade, isCompleted) => {
	return `
		<div class="col-sm-12 col-md-6 col-xl-3 taskCard">
			<div class="card bg-transparent border-0 text-black ${shouldFade ? "animate-fade-in" : ""}" style="width: 20rem;">
				<img src="images/notebg.png" class="card-img">
					<div class="card-img-overlay">
						<div class="cardBtn">
							${isCompleted ? "" : `
								<i data-id="${i}" class="editBtn fa-solid fa-square-pen fa-lg" title="Edit Task"></i>
								<i data-id="${i}" class="completeBtn fa-solid fa-square-check fa-lg" title="Mark as Complete"></i>
							`}
							<i data-id="${i}" class="${isCompleted ? 'complete' : ''} deleteBtn fa-solid fa-square-xmark fa-lg" title="Delete Task"></i>
						</div>
						<div class="cardTitle">
							<h4>${task.taskTitle}</h4>
						</div>
						<div class="card-scroll-box">
							<p class="card-text">${task.taskDesc}</p>
						</div>
						<p class="card-text taskDateTime">${isCompleted ? 'Completed' : 'Due'} on ${formatDateTime(isCompleted ? task.completedOn : task.taskDateTime)}</p>
					</div>
			</div>
		</div>
	`
};

const displayTasks = (isNewTask) => {
	DOM.taskList.innerHTML = "";
	tasks.forEach((task, i) => {
		const shouldFade = (isNewTask && i === tasks.length - 1) || firstRun;
		DOM.taskList.innerHTML += getTaskHTML(task, i, shouldFade, false);
	});
	firstRun = false;
};

const loadAllTasks = (isNewTask) => {
	// GET response in server.js l.37
	fetch(routes.tasks).then((res) => {
		res.json().then((data) => {
			tasks = data.tasks;
			completedTasks = data.completedTasks;
			displayTasks(isNewTask);
			displayCompletedTasks();
			if (completedTasks.length === 0) {
				hideElements(DOM.showCompletedTasksBtn, DOM.hideCompletedTasksBtn);
			} else {
				showElements(DOM.showCompletedTasksBtn);
			}
		});
	});
};

const displayCompletedTasks = () => {
	DOM.completedTaskList.innerHTML = "";
	completedTasks.forEach((task, i) => {
		DOM.completedTaskList.innerHTML += getTaskHTML(task, i, false, true);
	});
};

const clickHandlers = () => {
	let currentlyEditingIndex = null;

	//Add task
	DOM.addTaskButton.addEventListener("click", () => {
		if (!DOM.taskTitle.value || !DOM.taskDesc.value || !DOM.taskDateTime.value) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Please fill out all fields!",
				confirmButtonColor: "royalblue",
			});
			return;
		}
		const task = {
			taskTitle: DOM.taskTitle.value,
			taskDesc: DOM.taskDesc.value,
			taskDateTime: toProperUnix(DOM.taskDateTime.value),
		};
		// POST response in server.js l.42
		fetch(routes.tasks, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(task),
		}).then(() => {
			loadAllTasks(true);
			DOM.addTaskForm.reset();
		});
	});

	//Changes to task (Edit, Delete, Mark as Complete)
	DOM.taskList.addEventListener("click", (event) => {
		const i = +event.target.dataset.id;
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
					// DELETE response in server.js l.72
					fetch(routes.tasks, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							taskIndex: i,
							isCompleted: false
						}),
					}).then(loadAllTasks);
				}
			});
		}

		//Edit task (requires saveChangesBtn/cancelChangesBtn below to complete editing)
		if (classList.contains("editBtn")) {
			hideElements(DOM.addTaskButton);
			showElements(DOM.saveChangesBtn, DOM.cancelChangesBtn);
			DOM.taskTitle.value = tasks[i].taskTitle;
			DOM.taskDesc.value = tasks[i].taskDesc;
			picker.setDate(new Date(tasks[i].taskDateTime));
			currentlyEditingIndex = i;
		}

		//Mark task as complete
		if (classList.contains("completeBtn")) {
			// POST response in server.js l.51
			fetch(routes.finishTask, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					taskIndex: i,
				}),
			}).then(loadAllTasks);
		}
	});

	//Delete task from completed tasklist 
	DOM.completedTaskList.addEventListener("click", (event) => {
		const i = +event.target.dataset.id;
		Swal.fire({
			title: "Are you sure you want to delete this task?",
			showCancelButton: true,
			confirmButtonText: "Yes",
			confirmButtonColor: "black",
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (result.isConfirmed) {
				// DELETE response in server.js l.72
				fetch(routes.tasks, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						taskIndex: i,
						isCompleted: true
					}),
				}).then(loadAllTasks);
			}
		});
	});

	// Save/Cancel edit changes
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
		tasks[currentlyEditingIndex].taskTitle = DOM.taskTitle.value;
		tasks[currentlyEditingIndex].taskDesc = DOM.taskDesc.value;
		tasks[currentlyEditingIndex].taskDateTime = toProperUnix(DOM.taskDateTime.value);

		const updatedTask = {
			taskTitle: tasks[currentlyEditingIndex].taskTitle,
			taskDesc: tasks[currentlyEditingIndex].taskDesc,
			taskDateTime: tasks[currentlyEditingIndex].taskDateTime,
		};
		// PUT response in server.js l.62
		fetch(routes.tasks, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				updatedTask: updatedTask,
				taskIndex: currentlyEditingIndex,
			}),
		}).then(() => {
			DOM.addTaskForm.reset();
			showElements(DOM.addTaskButton);
			hideElements(DOM.saveChangesBtn, DOM.cancelChangesBtn);
			currentlyEditingIndex = null;
			loadAllTasks();
		});
	});

	DOM.cancelChangesBtn.addEventListener("click", () => {
		DOM.addTaskForm.reset();
		showElements(DOM.addTaskButton);
		hideElements(DOM.saveChangesBtn, DOM.cancelChangesBtn);
	});

	// Show/hide completed tasks buttons 
	DOM.showCompletedTasksBtn.addEventListener("click", () => {
		displayCompletedTasks();
		DOM.completedTaskList.style.display = "flex";
		showElements(DOM.hideCompletedTasksBtn);
		hideElements(DOM.showCompletedTasksBtn);
	});
	DOM.hideCompletedTasksBtn.addEventListener("click", () => {
		showElements(DOM.showCompletedTasksBtn);
		hideElements(DOM.completedTaskList, DOM.hideCompletedTasksBtn);
	});

	// Clear form
	DOM.clearFormBtn.addEventListener("click", () => {
		DOM.addTaskForm.reset();
	});
};

// Run on page load

clickHandlers();
loadAllTasks();
