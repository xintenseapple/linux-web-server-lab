/* This file is the file containing all of our server-side javascript code.
** It includes all of the application's web endpoints and API endpoints
** The web endpoints serve HTML files to clients, some of which are dynamically generated
** The API endpoints serve JSON formatted responses and act as the servers "backend"
*/

const express = require('express')      // Import Express
var bodyParser = require('body-parser') // Import body-parser
var mysql = require('mysql');           // Import mysql

const app = express()   // Create Express app
const port = 5000       // Port to run on

app.use(bodyParser.json())  // Parse JSON request bodies

var con = mysql.createConnection({
    host: "localhost",
    user: "note_user",
    password: "noteuser123",
    database: "note_app"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

//
// All Web App Routes Below
//

// "/" route is index
app.get('/', (req, res) => {
    res.sendFile('templates/index.html', {root: __dirname });
})

// "/allNotes" route gets all notes from db and sends them
app.get('/allNotes', (req, res) => {
    res.sendFile('templates/allNotes.html', {root: __dirname });
})

app.get('/editNote', (req, res) => {
    res.sendFile('templates/editNote.html', {root: __dirname });
})

app.get('/newNote', (req, res) => {
    res.sendFile('templates/newNote.html', {root: __dirname });
});


//
// All Web API routes Below
//

app.get('/api/getAllNotes', (req, res) => {
    con.query("SELECT * FROM note", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
});

app.post('/api/createNote', (req, res) => {
    var sql = "INSERT INTO note (title, body, created_date, modified_date) VALUES (?, ?, curdate(), curdate())";
    con.query(sql, [req.body.title, req.body.body], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.json({})
});

app.get('/api/getNote', (req, res) => {
    con.query("SELECT * FROM note WHERE note_id = ?", [req.query.id], function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/api/updateNote', (req, res) => {
    con.query("UPDATE note SET title = ?, body = ?, modified_date=curdate() WHERE note_id = ?",
        [req.body.title, req.body.body, req.query.id], function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/api/deleteNote', (req, res) => {
    con.query("DELETE FROM note WHERE note_id = ?", [req.query.id], function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// Set app to listen on designated port
app.listen(port, () => {
  console.log('Web app listening at http://localhost:' + port + '\n')
})