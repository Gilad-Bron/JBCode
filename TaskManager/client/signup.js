const DOM = {};
const keysArray = [
	"signupForm",
	"username",
	"password",
	"signupBtn",
];

keysArray.forEach((key) => {
	DOM[key] = document.querySelector(`.${key}`);
});

const routes = {
    index: "http://localhost:5000/viewtasks", 
	tasks: "http://localhost:5000/tasks",
	finishTask: "http://localhost:5000/finishTask",
	login: "http://localhost:5000/",
    signup: "http://localhost:5000/signup",
};

const signup = () => {
    const username = DOM.username.value;
    const password = DOM.password.value;
    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }
    // POST response in server.js l.129
    fetch(routes.signup, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    }).then((res) => {res.json().then((user) => {
        Swal.fire({
            title: `Welcome to Task Manager, ${user.username}!`,
            text: 'You have successfully signed up! Please login to continue.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = routes.login;
        });
    })});
};

DOM.signupBtn.addEventListener("click", signup);