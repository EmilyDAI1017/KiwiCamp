const express = require('express');
var mysql = require('mysql');
const cors = require('cors');
var bodyParser = require('body-parser')

const port = process.env.PORT || 3000;

const app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(cors());
// GET POST PUT DELETE
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "kiwi_camp"
  });

const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto = require('crypto');

const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex');
};


  // Login route
  app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const getUserQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(getUserQuery, [username], async (err, result) => {
        if (err) {
            console.error('Error getting user from database: ' + err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User found:', result[0]);
        const user = result[0];
        const hashedPassword = user.password_hash;
        const salt = user.salt;
        const user_id = user.user_id;
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        res.status(200).json({ message: 'Login successful',
                              role: user.role,
                              user_id: user_id
                            }); 
        
    });

} );

  app.post('/register/youth_camper', async (req, res) => {
    const password = req.body.password;    
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
    const salt = generateSalt();
    let userData = {
        username: req.body.username,
        password_hash: encryptedPassword,
        role: req.body.role,
        salt: salt
    }
    console.log(userData)
    // Insert user data into 'users' table
    const insertUserQuery = 'INSERT INTO users SET ?';
    connection.query(insertUserQuery, userData, (err, result) => {
        if (err) {
            console.error('Error inserting user into database: ' + err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('User inserted into database:', result);
        res.status(200).json({ message: 'Registration successful' });
    });

} );   



  // Serve static files
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });



