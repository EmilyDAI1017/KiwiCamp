const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
var mysql = require('mysql');


// GET POST PUT DELETE
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "kiwi_camp_database"
  });

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Query the database to find the user with the provided username
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error querying database: ' + err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = results[0];

        // Validate the password
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Authentication successful
        res.status(200).json({ message: 'Login successful', user });
    });
});


// Serve static files
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



