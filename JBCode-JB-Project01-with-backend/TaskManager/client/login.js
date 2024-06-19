const DOM = {};
const keysArray = [
	"loginForm",
	"username",
	"password",
	"loginBtn",
];

keysArray.forEach((key) => {
	DOM[key] = document.querySelector(`.${key}`);
});

const routes = {
    index: "http://localhost:5000/viewtasks", 
	tasks: "http://localhost:5000/tasks",
	finishTask: "http://localhost:5000/finishTask",
	login: "http://localhost:5000/",
};

const login = () => {
    const username = DOM.username.value;
    const password = DOM.password.value;
    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }
    
    // POST response in server.js l.86
    fetch(routes.login, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    }).then((res) => {res.json().then((auth) => {
            console.log(auth);
            if (auth.success) {
                window.location.href = routes.index;
            } else {
                DOM.loginForm.reset();
                DOM.username.focus();
                const error = document.createElement('div');
                error.id = 'error';
                error.style.color = 'red';
                error.style.textAlign = 'center';
                error.innerHTML = auth.msg;
                if (!document.getElementById('error')) {
                    DOM.loginForm.appendChild(error);
                }
            }
        });
    });
};

DOM.loginBtn.addEventListener("click", login);
	