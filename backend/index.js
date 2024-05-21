// Add required packages
const express = require("express");
const app = express();
const sqlite = require("sqlite3").verbose();
const bodyParser = require('body-parser');

const port = 8000;
const db = require("./database").createDatabase(sqlite);

app.use(bodyParser.urlencoded({extended: false}))
app.use(require("cors")());
app.use(require('helmet')());

// Add routes
require('./routes').createRoutes(app, db);

// Start server
app.listen(port, () => console.log("Server started on port " + port + "."));