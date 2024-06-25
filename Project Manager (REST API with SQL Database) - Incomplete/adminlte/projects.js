const DOM = {
    viewBtns: document.querySelectorAll('viewBtns'),
    editBtns: document.querySelectorAll('editBtns'),
    deleteBtns: document.querySelectorAll('deleteBtns'),
    projects: document.querySelector('#projectTable'),
    showAddProjectFormBtn: document.querySelector('#showAddProjectFormBtn'),
    addProjectForm: document.querySelector('#addProjectForm'),
    addProjectBtn: document.querySelector('#addProjectBtn'),
    newProjectTitle: document.querySelector('#newProjectTitle'),
    newProjectDate: document.querySelector('#newProjectDate'),
    tasks: document.querySelectorAll('taskView'),
    showAddTaskFormBtn: document.querySelector('#showAddTaskFormBtn'),
    addTaskForm: document.querySelector('#addTaskForm'),
    addTaskBtn: document.querySelector('#addTaskBtn'),
    newTaskTitle: document.querySelector('#newTaskTitle'),
    newTaskDate: document.querySelector('#newTaskDue'),
} 

const routes = {
    index: '/',
    projects: '/projects',
    tasksByProjectID: '/tasks/project',
    tasks: '/tasks'
}

const getTasksByProjectID = (id) => {
    $.ajax({
        url: `${routes.tasksByProjectID}/${id}`,
        success: (result) => {
            console.log('---getTasksByProjectID result---');
            console.log(result);
            Swal.fire({
                title: 'Tasks',
                html: result.map((task) => {
                    return `<p><strong>ID: ${task.ID}</strong> | Title: ${task.title} | Due Date: ${String(task.due).slice(0, 10)}</p>`;
                }),
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: 'Close'
            });
                 
            // FIX - Cannot get the tasks to display in the taskView DOM element. Console returns error - "TypeError: Cannot set properties of undefined (setting 'display')"
            // $(`taskView[data-id="${id}"]`).style.display = 'block';
            // $(`taskView[data-id="${id}"]`).innerHTML = "";
            // result.forEach((task) => {
            //     $(`taskView[data-id="${id}"]`).append(`
            //             <td>
            //                 <a>
            //                     ${task.ID}
            //                 </a>
            //             </td>
            //             <td>
            //                 <a>
            //                     ${task.title}
            //                 </a>
            //                 <br />
            //                 <small>
            //                     ${[task.due].toLocaleString().slice(0, 10)}
            //                 </small>
            //             </td>
            //             <td>
            //                 <ul class="list-inline">
            //                     <li class="list-inline-item">
            //                         <img alt="Avatar" class="table-avatar" src="dist/img/avatar.png">
            //                     </li>
            //                     <li class="list-inline-item">
            //                         <img alt="Avatar" class="table-avatar" src="dist/img/avatar2.png">
            //                     </li>
            //                     <li class="list-inline-item">
            //                         <img alt="Avatar" class="table-avatar" src="dist/img/avatar3.png">
            //                     </li>
            //                     <li class="list-inline-item">
            //                         <img alt="Avatar" class="table-avatar" src="dist/img/avatar4.png">
            //                     </li>
            //                 </ul>
            //             </td>
            //             <td class="project_progress">
            //                 <div class="progress progress-sm">
            //                     <div class="progress-bar bg-green" role="progressbar" aria-valuenow="57" aria-valuemin="0" aria-valuemax="100" style="width: 57%">
            //                     </div>
            //                 </div>
            //                 <small>
            //                     15% Complete
            //                 </small>
            //             </td>
            //             <td class="project-state">
            //                 ${task.is_done===1 ? 
            //                     `<span class="badge badge-success">Done</span>`
            //                         : 
            //                     `<span class="badge badge-warning">Ongoing</span>`
            //                 }
            //             </td>
            //             <td class="project-actions text-right">
            //                 <a class="btn btn-primary btn-sm viewBtns" href="#" data-id="${task.ID}">
            //                     <i class="fas fa-folder"></i>
            //                     View
            //                 </a>
            //                 <a class="btn btn-info btn-sm editBtns" href="#" data-id="${task.ID}">
            //                     <i class="fas fa-pencil-alt"></i>
            //                     Edit
            //                 </a>
            //                 <a class="btn btn-danger btn-sm deleteBtns" href="#" data-id="${task.ID}">
            //                     <i class="fas fa-trash"></i>
            //                     Delete
            //                 </a>
            //             </td>
            //         `);
            // });
        }
    });
};

const getProjects = () => {
    $.ajax({
        url: routes.projects,
        success: (result) => {
            console.log('---getProjects result---');
            console.log(result);
            DOM.projects.innerHTML = "";
            result.forEach((project) => {
                $('#projectTable').append(`
                    <tr>
                        <td>
                            <a>
                                ${project.ID}
                            </a>
                        </td>
                        <td>
                            <a>
                                ${project.title}
                            </a>
                            <br />
                            <small>
                                ${String(project.date).slice(0, 10)}
                            </small>
                        </td>
                        <td>
                            <ul class="list-inline">
                                <li class="list-inline-item">
                                    <img alt="Avatar" class="table-avatar" src="dist/img/avatar.png">
                                </li>
                                <li class="list-inline-item">
                                    <img alt="Avatar" class="table-avatar" src="dist/img/avatar2.png">
                                </li>
                                <li class="list-inline-item">
                                    <img alt="Avatar" class="table-avatar" src="dist/img/avatar3.png">
                                </li>
                                <li class="list-inline-item">
                                    <img alt="Avatar" class="table-avatar" src="dist/img/avatar4.png">
                                </li>
                            </ul>
                        </td>
                        <td class="project_progress">
                            <div class="progress progress-sm">
                                <div class="progress-bar bg-green" role="progressbar" aria-valuenow="57" aria-valuemin="0" aria-valuemax="100" style="width: 57%">
                                </div>
                            </div>
                            <small>
                                15% Complete
                            </small>
                        </td>
                        <td class="project-state">
                            <span class="badge badge-warning">Ongoing</span>
                        </td>
                        <td class="project-actions text-right">
                            <a class="btn btn-primary btn-sm viewBtns" href="#" data-id="${project.ID}">
                                <i class="fas fa-folder viewBtns" data-id="${project.ID}"></i>
                                View
                            </a>
                            <a class="btn btn-info btn-sm editBtns" href="#" data-id="${project.ID}">
                                <i class="fas fa-pencil-alt editBtns" data-id="${project.ID}"></i>
                                Edit
                            </a>
                            <a class="btn btn-danger btn-sm deleteBtns" href="#" data-id="${project.ID}">
                                <i class="fas fa-trash deleteBtns" data-id="${project.ID}"></i>
                                Delete
                            </a>
                        </td>
                        <tr class="taskView" data-id="${project.ID}" style="display: none;"></tr>
                    </tr>
                `);

                // Add event listeners to buttons inside forEach loop to avoid missing element error - working but using clickHandlers() instead
                // document.querySelector(`.viewBtns[data-id="${project.ID}"]`).addEventListener('click', () => {
                //     getTasksByProjectID(project.ID);
                // });
                // document.querySelector(`.editBtns[data-id="${project.ID}"]`).addEventListener('click', () => {
                // });
                // document.querySelector(`.deleteBtns[data-id="${project.ID}"]`).addEventListener('click', () => {
                //     deleteProject(project.ID);
                // });

            });
        }
    });
};

const addProject = () => {
    $.ajax({
        url: routes.projects,
        method: 'POST',
        data: JSON.stringify({ 
            title: DOM.newProjectTitle.value, 
            date: DOM.newProjectDate.value 
        }),
        contentType: 'application/json',
        success: () => {
            console.log('---addProject success---');
            DOM.addProjectForm.style.display = 'none';
            DOM.newProjectTitle.value = '';
            DOM.newProjectDate.value = '';
            getProjects();
        }
    });
};

const deleteProject = (id) => {
    $.ajax({
        url: `${routes.projects}/${id}`,
        method: 'DELETE',
        success: (result) => {
            console.log('---deleteProject result---');
            console.log(result);
        }
    });
    getProjects();
};

const clickHandlers = () => {

    DOM.projects.addEventListener('click', (event) => {
        if (event.target.classList.contains('viewBtns')) {
            getTasksByProjectID(event.target.dataset.id);
        }
        if (event.target.classList.contains('editBtns')) {
        }
        if (event.target.classList.contains('deleteBtns')) {
            deleteProject(event.target.dataset.id);
        }
    });
    DOM.showAddProjectFormBtn.addEventListener('click', () => {
        DOM.addProjectForm.style.display = 'block';
        console.log('---showAddProjectFormBtn clicked---');
    });
    DOM.addProjectBtn.addEventListener('click', () => {
        console.log('---addProjectBtn clicked---');
        addProject();
    });
};

// Run on pageload

getProjects();
clickHandlers();