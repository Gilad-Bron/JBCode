// Dependencies

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 3030;

// Middleware

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(express.json());

// MySQL Connection

const mysqlConnection = mysql.createConnection({ // ***Create a connection to the MySQL database
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'todo'
});

mysqlConnection.connect((err) => { // ***Connect to the MySQL database
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to MySQL");
    }
});

// Routes

const routes = {
    index: '/',
    tasks: '/api/tasks'

}

// Request Hnadlers

app.get(routes.index, (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get(routes.tasks, (req,res) => {
    const sql = 'SELECT * FROM tasks';
    mysqlConnection.query(sql, (error, result) => {
        res.send(result);
    })
});

app.post(routes.tasks, (req,res) => {

    const taskTitle = req.body.title;
    const taskDue = req.body.due;
    const sql = `INSERT INTO tasks (title, due) VALUES (${taskTitle}, ${taskDue})`;

    mysqlConnection.query(sql, (error, result) => {
        res.send(result);
    })
});

app.delete(routes.tasks, (req,res) => {
    
    const taskID = req.body.id;
    const sql = `DELETE FROM tasks WHERE id = ${taskID}`;

    mysqlConnection.query(sql, (error, result) => {
        res.send(result);
    })
});

// Server

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});