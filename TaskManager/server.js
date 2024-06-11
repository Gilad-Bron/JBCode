// Dependencies
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Middleware

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes

const routes = {
	index: '/viewtasks',
	tasks: '/tasks',
	finishTask: '/finishTask',
	login: '/',
	signup: '/signup',   
};

// DB Setup
const allTasksFilePath = './db/allTasks';
const getAllTasks = () => JSON.parse(fs.readFileSync(allTasksFilePath, 'utf8'))
const updateAllTasks = (allTasks) => fs.writeFileSync(allTasksFilePath, JSON.stringify(allTasks));
const usersFilePath = './db/users';
const getUsers = () => JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
const updateUsers = (users) => fs.writeFileSync(usersFilePath, JSON.stringify(users));
let users = getUsers();

// Request handlers

	// Return all tasks (fetch request in client.js l.107)
app.get(routes.tasks, (req, res) => {
	res.json(getAllTasks())
})

	// Create new task (fetch request in client.js l.149)
app.post(routes.tasks, (req, res) => {
	const newTask = req.body;
	const allTasks = getAllTasks(); 
	allTasks.tasks.push(newTask); 
	updateAllTasks(allTasks); 
	res.send();
})

	// Mark as completed (fetch request in client.js l.205)
app.post(routes.finishTask, (req, res) => {
	const taskIndex = req.body.taskIndex;
	const allTasks = getAllTasks();
	const targetTask = allTasks.tasks.splice(taskIndex, 1)[0];
	targetTask.completedOn = Date.now();
	allTasks.completedTasks.push(targetTask);
	updateAllTasks(allTasks);
	res.send();
})

	// Update task (fetch request in client.js l.263)
app.put(routes.tasks, (req, res) => {
	const updatedTask = req.body.updatedTask;
	const taskIndex = req.body.taskIndex;
	const allTasks = getAllTasks();
	allTasks.tasks[taskIndex] = updatedTask;
	updateAllTasks(allTasks);
	res.send();
})

	// Delete task (fetch request in client.js: tasks l.178, completed tasks l.229)
app.delete(routes.tasks, (req, res) => {
	const taskIndex = req.body.taskIndex;
	const isCompleted = req.body.isCompleted;
	const allTasks = getAllTasks();
	if (isCompleted) {
		allTasks.completedTasks.splice(taskIndex, 1);
	} else {
		allTasks.tasks.splice(taskIndex, 1);
	}
	updateAllTasks(allTasks);
	res.send();
})

	// Login POST (fetch request in login.js l.29)
app.post(routes.login, (req, res) => {

	const username = req.body.username;
	const password = req.body.password;
	const auth = {
		success: false,
		role: null,
		msg: 'Invalid credentials. Please try again.',
	};

	users.find((user) => {
		if (user.username === username && user.password === password) {
			auth.success = true;
			auth.role = user.role;
			auth.msg = `Welcome, ${username}! You are logged in as ${user.role}.`;
		}
	});
	console.log(`Authentication is ${auth.success}`);
	console.log(auth.msg);
	res.json(auth);

	// FIX - code below disfunctional, implemented on clientside instead (login.js l.40).
	// if (auth.success) {
	// 	console.log(`Authentication is ${auth.success}`);
	// 	console.log(auth.msg);
	// 	res.redirect(routes.index);
	// } else {
	// 	res.redirect(routes.login);
	// };
});

	// Root URL (no fetch request or link in client)
app.get(routes.login, (req, res) => {
	res.sendFile(__dirname + '/client/login.html');
});

	// Redirect (no fetch request or link in client)
app.get(routes.index, (req, res) => {
	res.sendFile(__dirname + '/client/viewtasks.html');
});

	// Signup POST (fetch request in signup.js l.29)
app.post(routes.signup, (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user = {
		username: username,
		password: password,
		role: 'user',
	};
	const users = getUsers();
	users.push(user);
	updateUsers(users);
	res.send(user);
	// FIX - adds new user to DB but requires server reset for new user to be able to login
});
	// Server

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
})