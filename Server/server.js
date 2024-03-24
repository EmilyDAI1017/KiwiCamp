const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "kiwi_camp_database"
  });

connection.connect(function(err) {
    (err)? console.log(err) : console.log(connection);
  });

// Path: routes/html-routes.js
require('./routes/html_routes')(app, connection);

// Serve static files
app.listen(port, () => {
    console.log('Server is running on port ${port}');
});



