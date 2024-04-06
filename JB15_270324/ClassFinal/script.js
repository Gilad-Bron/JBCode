let tasks = []; // איפוס מערך משימות


const allButtons = document.querySelectorAll(".delete");
allButtons.forEach(function(button) { // אני עובר על כל הכפתורים עם הקלאס
    button.addEventListener("click", function(event) { // עבור כל אחד מהם, מקים האזנה לאירוע
        console.log(event.target.dataset.id);
    });
});


// בעת לחיצה על כפתור ההוספה
document.querySelector("#add").addEventListener("click", function() {
    // נדחוף אובייקט לתוך מערך המשימות
    tasks.push({
        title: document.querySelector("#task").value, // מפתח אחד - הכותרת של המשימה
        isDone: false // מפתח שני - האם המשימה הושלמה
    });

    reload(); // נקרא לרענון הרשימה לאחר הוספת המשימה למערך
});


function reload() { // פונקציה אליה אנחנו קוראים כשרוצים לרענן את הרשימה
    document.querySelector("#tasks").innerHTML = ''; // נאפס את הרשימה לפני הוספת המשימות

    tasks.forEach((element,index) => { // מעבר על כל המערך של המשימות

        //הוספת המבנה של פריט המשימה
        document.querySelector("#tasks").innerHTML += `
            <li>
                <h3>${element.title}</h3>
                <button data-id="${index}" class="complete">Complete</button>
                <button class="delete">Delete</button>
            </li>
        `;
    });
}