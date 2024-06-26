// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 1000;
const sqlPort = 3306;

// Middleware

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true })); //***bodyParser.urlencoded({ extended: true }) is used to parse the incoming request bodies in a middleware before you handle it, otherwise req.body will be undefined.
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

// MySQL Connection

const mysqlConnection = mysql.createConnection({ // ***Create a connection to the MySQL database
    host: 'localhost',
    user: 'root',
    port: sqlPort,
    password: '',
    database: 'todo'
});

mysqlConnection.connect((err) => { // ***Connect to the MySQL database
    if (err) {
        console.log(err);
    } else {
        console.log(`---Server is connected to the MySQL database on port ${sqlPort}---`);
    }
});

// Routes

const routes = {
    index: '/',
    projects: '/projects',
    tasksByProjectID: '/tasks/project',
    tasks: '/tasks'
}

// Request Handlers

app.get(routes.tasks, (req, res) => {
    res.sendFile(__dirname + '/tasks.html');
});

app.get(routes.projects, (req,res) => {
    const sql = 'SELECT * FROM projects';
    mysqlConnection.query(sql, (error, result) => {
        res.send(result);
    });
});

app.get(routes.tasksByProjectID + '/:id', (req, res) =>  {
    const sql = `SELECT * FROM tasks WHERE project_id = ${req.params.id}`
    mysqlConnection.query(sql, (error, result) => {
        res.send(result);
    });
});

app.post(routes.projects, (req, res) => {
    console.log('---POST request to /projects---')
    console.log(req.body);
    const sql = `INSERT INTO projects (title, date) VALUES ('${req.body.title}', '${req.body.date}')`;
    mysqlConnection.query(sql, (error, result) => {
    res.send(result);
    });

});

app.delete(routes.projects + '/:id', (req, res) => {
    const sql = `DELETE FROM projects WHERE id = ${req.params.id}`;
    mysqlConnection.query(sql, (error, result) => {
        res.send(result);   
    });
});

// Server

app.listen(port, () => {
    console.log(`---Server is running on http://localhost:${port}---`);
});