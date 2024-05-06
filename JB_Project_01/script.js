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

const showElements = (...elements) => {
	elements.forEach(element => {
		element.style.display = "inline";
	});
}
const hideElements = (...elements) => {
	elements.forEach(element => {
		element.style.display = "none";
	})
}

if (completedTasks.length > 0) {
	showElements(DOM.showCompletedTasksBtn);
}

const formatDateTime = (unixTimestamp) => {
	const date = new Date(unixTimestamp);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

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
}

const toProperUnix = (date) => (+date) * 1000;

const displayTasks = (isNewTask) => {
	DOM.taskList.innerHTML = "";
	tasks.forEach((task, i) => {
		const shouldFade = (isNewTask && i === tasks.length - 1) || firstRun;
		DOM.taskList.innerHTML += getTaskHTML(task, i, shouldFade, false);
	});
	firstRun = false;
};

const displayCompletedTasks = () => {
	DOM.completedTaskList.innerHTML = "";
	completedTasks.forEach((task, i) => {
		DOM.completedTaskList.innerHTML += getTaskHTML(task, i, false, true);
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
		// if (toProperUnix(DOM.taskDateTime.value) < Date.now()) {
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
			taskDateTime: toProperUnix(DOM.taskDateTime.value),
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
			hideElements(DOM.addTaskBtn);
			showElements(DOM.saveChangesBtn, DOM.cancelChangesBtn);
			DOM.taskTitle.value = tasks[i].taskTitle;
			DOM.taskDesc.value = tasks[i].taskDesc;
			picker.setDate(new Date(tasks[i].taskDateTime))
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
				tasks[i].taskDateTime = toProperUnix(DOM.taskDateTime.value);
				localStorage.setItem("tasks", JSON.stringify(tasks));
				displayTasks();
				DOM.addTaskForm.reset();
				showElements(DOM.addTaskBtn);
				hideElements(DOM.saveChangesBtn, DOM.cancelChangesBtn);
			});
		};

		//Mark task as complete
		if (classList.contains("completeBtn")) {
			tasks[i].completedOn = Date.now();
			completedTasks.push(tasks[i]);
			tasks.splice(i, 1);
			localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
			localStorage.setItem("tasks", JSON.stringify(tasks));
			showElements(DOM.showCompletedTasksBtn);
			displayTasks();
		}

		//Cancel changes
		DOM.cancelChangesBtn.addEventListener("click", () => {
			DOM.addTaskForm.reset();
			showElements(DOM.addTaskBtn);
			hideElements(DOM.saveChangesBtn, DOM.cancelChangesBtn);
		});
	});

	DOM.clearFormBtn.addEventListener("click", () => {
		DOM.addTaskForm.reset();
	});

	DOM.showCompletedTasksBtn.addEventListener("click", () => {
		displayCompletedTasks();
		showElements(DOM.completedTaskList, DOM.hideCompletedTasksBtn);
		hideElements(DOM.showCompletedTasksBtn);
	});
	DOM.hideCompletedTasksBtn.addEventListener("click", () => {
			showElements(DOM.showCompletedTasksBtn);
			hideElements(DOM.completedTaskList, DOM.hideCompletedTasksBtn);
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
				if (completedTasks.length === 0) {
					hideElements(DOM.showCompletedTasksBtn, DOM.hideCompletedTasksBtn);
				};
			}
		//Disply Show and hide completed tasklist buttons

		});
	});	
};

// Run on page load

const picker = flatpickr(".taskDateTime", {
	enableTime: true,
	altInput: true,
	altFormat: "d/m/Y H:i",
	dateFormat: "U",
	time_24hr: true,
	minDate: Date.now()
});

clickHandlers();

displayTasks();


// Todo: Fix the CSS (new date field isn't wide enough, completed list is always one column)
// Todo: Reuse code for edit and delete and add buttons AKA avoid code duplication
// Todo: Duplicate Task