// DOM elements and constants
const DOM = {
    addTaskForm: document.querySelector("#addTaskForm"),
    taskTitle: document.querySelector("#taskTitle"),
    taskDesc: document.querySelector("#taskDesc"),
    taskDateTime: document.querySelector("#taskDateTime"),
    addTaskBtn: document.querySelector("#addTaskBtn"),
    clearFormBtn: document.querySelector("#clearFormBtn"),
    saveChangesBtn: document.querySelector("#saveChangesBtn"),
    cancelChangesBtn: document.querySelector("#cancelChangesBtn"),
    taskList: document.querySelector("#taskList"),
    cardBtns: document.querySelector(".cardBtns"),
    editBtns: document.querySelector(".editBtns"),
    deleteBtns: document.querySelector(".deleteBtns"),   
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display tasks 

const displayTasks = () => {
    DOM.taskList.innerHTML = "";
    tasks.forEach((e, i) => {
      DOM.taskList.innerHTML += `
      <div class="col-sm-12 col-md-6 col-xl-3 taskCard">
          <div id="taskCard" class="animate-fade-in card bg-transparent border-0 text-black" style="width: 20rem;">
              <img src="images/notebg.png" class="card-img">
              <div class="card-img-overlay">
                <div class="cardBtns">
                  <i class="fa-solid fa-pen-to-square fa-lg editBtns" data-id="${i}"></i>
                  <i class="fa-solid fa-square-xmark fa-lg deleteBtns" data-id="${i}"></i>
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
}

// Add task

const addTask = () => {
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
      taskDateTime: DOM.taskDateTime.value,
  };
  tasks.push(task);
  console.log(tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
  DOM.addTaskForm.reset();
};
DOM.addTaskBtn.addEventListener("click", addTask);

// Edit and Delete task

//Attention: The function below is not working properly. 
//const deleteEditTask = () => {
  DOM.taskList.addEventListener("click", (event) => {
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
      DOM.addTaskBtn.style.display = "none";
      DOM.saveChangesBtn.style.display = "inline";
      DOM.cancelChangesBtn.style.display = "inline";
      DOM.taskTitle.value = tasks[i].taskTitle;
      DOM.taskDesc.value = tasks[i].taskDesc;
      DOM.taskDateTime.value = tasks[i].taskDateTime;
      DOM.saveChangesBtn.addEventListener("click", () => {
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
      //Cancel changes
      DOM.cancelChangesBtn.addEventListener("click", () => {
        DOM.addTaskForm.reset();
        DOM.addTaskBtn.style.display = "inline";
        DOM.saveChangesBtn.style.display = "none";
        DOM.cancelChangesBtn.style.display = "none";
      });
    }
  });
//};

// Other Components

flatpickr("#taskDateTime", {
    enableTime: true,
    dateFormat: "d/m/Y H:i",
    time_24hr: true,
});

// הגדרות עבור בחירת הצבעים - לא פעיל בשלב זה
// Coloris({
//     // The default behavior is to append the color picker's dialog to the end of the document's
//     // body. but it is possible to append it to a custom parent instead. This is especially useful
//     // when the color fields are in a scrollable container and you want the color picker's dialog
//     // to remain anchored to them. You will need to set the CSS position of the desired container
//     // to "relative" or "absolute".
//     // Note: This should be a scrollable container with enough space to display the picker.
//     parent: '',
  
//     // A custom selector to bind the color picker to. This must point to HTML input fields.
//     el: '',
  
//     // The bound input fields are wrapped in a div that adds a thumbnail showing the current color
//     // and a button to open the color picker (for accessibility only). If you wish to keep your
//     // fields unaltered, set this to false, in which case you will lose the color thumbnail and
//     // the accessible button (not recommended).
//     // Note: This only works if you specify a custom selector to bind the picker (option above),
//     // it doesn't work on the default [data-coloris] attribute selector.
//     wrap: true,
  
//     // Set to true to activate basic right-to-left support.
//     rtl: false,
  
//     // Available themes: default, large, polaroid, pill (horizontal).
//     // More themes might be added in the future.
//     theme: 'pill',
  
//     // Set the theme to light or dark mode:
//     // * light: light mode (default).
//     // * dark: dark mode.
//     // * auto: automatically enables dark mode when the user prefers a dark color scheme.
//     themeMode: 'light',
  
//     // The margin in pixels between the input fields and the color picker's dialog.
//     margin: 4,
  
//     // Set the preferred color string format:
//     // * hex: outputs #RRGGBB or #RRGGBBAA (default).
//     // * rgb: outputs rgb(R, G, B) or rgba(R, G, B, A).
//     // * hsl: outputs hsl(H, S, L) or hsla(H, S, L, A).
//     // * auto: guesses the format from the active input field. Defaults to hex if it fails.
//     // * mixed: outputs #RRGGBB when alpha is 1; otherwise rgba(R, G, B, A).
//     format: 'hex',
  
//     // Set to true to enable format toggle buttons in the color picker dialog.
//     // This will also force the format option (above) to auto.
//     formatToggle: false,
  
//     // Enable or disable alpha support.
//     // When disabled, it will strip the alpha value from the existing color string in all formats.
//     alpha: false,
  
//     // Set to true to always include the alpha value in the color value even if the opacity is 100%.
//     forceAlpha: false,
  
//     // Set to true to hide all the color picker widgets (spectrum, hue, ...) except the swatches.
//     swatchesOnly: true,
  
//     // Focus the color value input when the color picker dialog is opened.
//     focusInput: true,
  
//     // Select and focus the color value input when the color picker dialog is opened.
//     selectInput: false,
  
//     // Show an optional clear button
//     clearButton: false,
  
//     // Set the label of the clear button
//     clearLabel: 'Clear',
  
//     // Show an optional close button
//     closeButton: false,
  
//     // Set the label of the close button
//     closeLabel: 'Close',
  
//     // An array of the desired color swatches to display. If omitted or the array is empty,
//     // the color swatches will be disabled.
//     swatches: [
//       'red', 'yellow', 'blue', 'green', , 'gray', 'black'
//     ],
  
//     // Set to true to use the color picker as an inline widget. In this mode the color picker is
//     // always visible and positioned statically within its container, which is by default the body
//     // of the document. Use the "parent" option to set a custom container.
//     // Note: In this mode, the best way to get the picked color, is listening to the "coloris:pick"
//     // event and reading the value from the event detail (See example in the Events section). The
//     // other way is to read the value of the input field with the id "clr-color-value".
//     inline: false,
  
//     // In inline mode, this is the default color that is set when the picker is initialized.
//     defaultColor: '#000000',
  
//     // A function that is called whenever a new color is picked. This defaults to an empty function,
//     // but can be set to a custom one. The selected color is passed to the function as an argument.
//     // Use in instances (described below) to perform a custom action for each instance. 
//     onChange: (color) => {
//       console.log(color);
//     }
//   });

  // Run on page load

  //Attntion: The function below is not working properly.
  //deleteEditTask();

  displayTasks();

  DOM.clearFormBtn.addEventListener("click", () => {
    DOM.addTaskForm.reset();
  });