const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser')

const app = express();
const port = 5000;
const dbFilePath = './data.base';
const routes = {tasks: '/tasks'};
const readTasksFromFile = () => JSON.parse(fs.readFileSync(dbFilePath, 'utf8'))

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cors({
	origin: 'http://localhost:63342' // To enable CORS from a specific client
}))

app.get(routes.tasks, (req, res) => {
	res.json(readTasksFromFile())
})

app.post(routes.tasks, (req, res) => {
	const newTask = req.body;
	const tasks = readTasksFromFile();
	tasks.push(newTask);
	fs.writeFileSync(dbFilePath, JSON.stringify(tasks));
	res.send();
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
})