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

// Create MySQL connection
var con = mysql.createConnection({
    host: "localhost",
    user: "note_user",
    password: "noteuser123",
    database: "note_app"
});


// Connect to database
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

// "/allNotes" route
app.get('/allNotes', (req, res) => {
    res.sendFile('templates/allNotes.html', {root: __dirname });
})

// "/editNotes" route
app.get('/editNote', (req, res) => {
    res.sendFile('templates/editNote.html', {root: __dirname });
})

// "/newNote" route
app.get('/newNote', (req, res) => {
    res.sendFile('templates/newNote.html', {root: __dirname });
});


//
// All Web API routes Below
//

// Get all notes from database
app.get('/api/getAllNotes', (req, res) => {
    con.query("SELECT * FROM note", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
});

// Create new note with title and body
app.post('/api/createNote', (req, res) => {
    var sql = "INSERT INTO note (title, body, created_date, modified_date) VALUES (?, ?, curdate(), curdate())";
    con.query(sql, [req.body.title, req.body.body], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.json({})
});

// Get note with note_id
app.get('/api/getNote', (req, res) => {
    con.query("SELECT * FROM note WHERE note_id = ?", [req.query.id], function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// Update a note's title and body with note_id
app.post('/api/updateNote', (req, res) => {
    con.query("UPDATE note SET title = ?, body = ?, modified_date=curdate() WHERE note_id = ?",
        [req.body.title, req.body.body, req.query.id], function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// Delete a note with note_id
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