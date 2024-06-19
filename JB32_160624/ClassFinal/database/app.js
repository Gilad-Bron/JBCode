const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3307, //ONLY IF YOU CHANGED 3306!!!
    password: '',
    database: 'todo'
});

app.use(cors());

conn.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to MySQL");
    }
});

app.get('/api/tasks', (req,res) => {
    const sql = 'SELECT * FROM tasks';
    conn.query(sql, (error, result) => {
        res.send(result);
    })
});

app.delete('/api/task/:id', (req,res) => {
    const sql = `DELETE FROM tasks WHERE ID = ${req.params.id}`;
    conn.query(sql, (error, result) => {
        res.send(result);
    })
});

app.listen(3030, () => {
    console.log("Listening to 3030");
});