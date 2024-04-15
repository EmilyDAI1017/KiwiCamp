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

      // Insert youth information into 'youth' table
      let youth_info = {
          user_id: result.insertId,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone_num: req.body.phone_num,
          gender: req.body.gender,
          dob: req.body.dob,
          parent_guardian_name: req.body.parent_guardian_name,
          parent_guardian_phone: req.body.parent_guardian_phone,
          parent_guardian_email: req.body.parent_guardian_email,
          activity_preferences: req.body.activity_preferences
      }
      console.log("Youth", youth_info);

      const insert_youth_query = 'INSERT INTO youth SET ?';
      connection.query(insert_youth_query, youth_info, (err, result) => {
          if (err) {
              console.error('Error inserting youth information into database: ' + err.stack);
              return res.status(500).json({ message: 'Internal server error' });
          }
          
          const date = new Date();

          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          let currentDate = `${day}-${month}-${year}`;
          console.log(currentDate)
          // Insert health record for the youth
          let health_record_info = {
              user_id: result.insertId,
              medical_condition: req.body.medical_condition,
              allergies_information: req.body.allergies_information,
              last_updated_date: new Date() // Get today's date in YYYY-MM-DD format
          };
          console.log("Here")
          console.log("Health Record", health_record_info);

          const insert_health_record_query = 'INSERT INTO health_record SET ?';
          connection.query(insert_health_record_query, health_record_info, (err, result) => {
              if (err) {
                  console.error('Error inserting health record into database: ' + err.stack);
                  return res.status(500).json({ message: 'Internal server error' });
              }
              console.log('Health record inserted into database:', result);
              res.status(200).json({ status: true });
          });
      });
  });
});


app.post('/register/adult_leader', async (req, res) => {
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

      // Insert youth information into 'youth' table
      let leader_info = {
          user_id: result.insertId,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone_num: req.body.phone_num,
          gender: req.body.gender,
          dob: req.body.dob,
          emergency_contacts_name: req.body.emergency_contacts_name,
          emergency_contacts_phone: req.body.emergency_contacts_phone,

      }

      const insert_leader_query = 'INSERT INTO adult_leader SET ?';
      connection.query(insert_leader_query, leader_info, (err, result) => {
          if (err) {
              console.error('Error inserting youth information into database: ' + err.stack);
              return res.status(500).json({ message: 'Internal server error' });
          }
          
          const date = new Date();

          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          let currentDate = `${day}-${month}-${year}`;
          console.log(currentDate)
          // Insert health record for the youth
          let health_record_info = {
              user_id: result.insertId,
              medical_condition: req.body.medical_condition,
              allergies_information: req.body.allergies_information,
              last_updated_date: new Date() // Get today's date in YYYY-MM-DD format
          };
          console.log("Health Record", health_record_info);

          const insert_health_record_query = 'INSERT INTO health_record SET ?';
          connection.query(insert_health_record_query, health_record_info, (err, result) => {
              if (err) {
                  console.error('Error inserting health record into database: ' + err.stack);
                  return res.status(500).json({ message: 'Internal server error' });
              }
              console.log('Health record inserted into database:', result);
              res.status(200).json({ status: true });
          });
      });
  });
});

app.post('/register/group_leader', async (req, res) => {
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

      // Insert leader information into 'group leader' table
      let leader_info = {
          user_id: result.insertId,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone_num: req.body.phone_num,
          gender: req.body.gender,
          dob: req.body.dob,
          emergency_contacts_name: req.body.emergency_contacts_name,
          emergency_contacts_phone: req.body.emergency_contacts_phone,

      }

      const insert_leader_query = 'INSERT INTO group_leader SET ?';
      connection.query(insert_leader_query, leader_info, (err, result) => {
          if (err) {
              console.error('Error inserting group leader information into database: ' + err.stack);
              return res.status(500).json({ message: 'Internal server error' });
          }
          
          const date = new Date();

          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          let currentDate = `${day}-${month}-${year}`;
          console.log(currentDate)
          // Insert health record for the youth
          let health_record_info = {
              user_id: result.insertId,
              medical_condition: req.body.medical_condition,
              allergies_information: req.body.allergies_information,
              last_updated_date: new Date() // Get today's date in YYYY-MM-DD format
          };
          console.log("Health Record", health_record_info);

          const insert_health_record_query = 'INSERT INTO health_record SET ?';
          connection.query(insert_health_record_query, health_record_info, (err, result) => {
              if (err) {
                  console.error('Error inserting health record into database: ' + err.stack);
                  return res.status(500).json({ message: 'Internal server error' });
              }
              console.log('Health record inserted into database:', result);
              res.status(200).json({ status: true });
          });
      });
  });
});

app.get('/youth_camper_dashboard/:id', (req, res) => {
  const user_id = req.params.id;
  console.log("user id",user_id)
  const getYouthQuery = 'SELECT * FROM youth WHERE user_id = ?';
  connection.query(getYouthQuery, [user_id], (err, result) => {
      console.log("Result",result)
      if (err) {
          console.error('Error getting youth from database: ' + err.stack);
          return res.status(500).json({ message: 'Internal server error' });
      }
      if (result.length === 0) {
          return res.status(404).json({ message: 'Youth not found' });
      }
      console.log('Youth found:', result[0]);
      res.status(200).json(result[0]);
  });
}
);

  
   
  // Serve static files
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });



