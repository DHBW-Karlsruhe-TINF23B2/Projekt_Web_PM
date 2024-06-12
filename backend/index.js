/*
    TODO-APP Backend:
        -> Routes
        -> Database
 */


// Add required packages
const express = require("express");
const app = express();
const sqlite = require("sqlite3").verbose();

const port = 8000;
const db = require("./database").createDatabase(sqlite);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(require("cors")());

// Add routes
require('./routes').createRoutes(app, db);

// Start server
console.log("Trying to run todo backend server on port " + port + "...");
app.listen(port, () => console.log("Server started on port " + port + "."));


