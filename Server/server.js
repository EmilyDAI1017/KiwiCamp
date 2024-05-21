
const express = require('express');
const mysql = require('mysql'); 
const cors = require('cors');
var bodyParser = require('body-parser')
const util = require('util'); // Import the util module
const jwt = require('jsonwebtoken'); // Add the missing import statement for jwt module

const port = process.env.PORT || 3000;

const app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

app.use(cors());
// GET POST PUT DELETE

// Create a connection pool
const pool = mysql.createPool({ /* database configuration */ });

require('dotenv').config();

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (token == null) return res.sendStatus(401); // if there's no token

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) return res.sendStatus(403); // invalid token
                req.user = user;
                next();
        });
};

var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "kiwi_camp"
    });


const passwordResetRoutes = require('./routes/password_reset');

app.use('/api/password_reset', passwordResetRoutes);




const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto = require('crypto');

const generateSalt = () => {
        return crypto.randomBytes(16).toString('hex');
};

async function createAccounts() {
    const password = "123";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Array of user accounts
    const accounts = [
        { username: 'manager1', role: 'Manager', firstName: 'John', lastName: 'Doe', gender: 'Male', email: 'manager1@example.com', phone: '1234567890' },
        { username: 'staff1', role: 'Staff', firstName: 'Jane', lastName: 'Doe', gender: 'Female', email: 'staff1@example.com', phone: '0987654321', emergencyName: 'Emergency', emergencyPhone: '1122334455' },
        { username: 'admin1', role: 'Admin', firstName: 'Jim', lastName: 'Beam', gender: 'Male', email: 'admin1@example.com', phone: '1231231234' }
    ];

    accounts.forEach(account => {
        // Insert into users table
        connection.query('INSERT INTO users SET ?', {
            username: account.username,
            password_hash: hashedPassword,
            role: account.role,
            salt: saltRounds.toString()  // Store salt rounds as salt for simplicity
        }, (err, results) => {
            if (err) throw err;
            const userId = results.insertId;

            // Insert into respective role table
            let roleTableData = {
                user_id: userId,
                first_name: account.firstName,
                last_name: account.lastName,
                gender: account.gender,
                email: account.email,
                phone_num: account.phone
            };

            if (account.role === 'Manager') {
                connection.query('INSERT INTO manager SET ?', roleTableData, logResult);
            } else if (account.role === 'Staff') {
                roleTableData.emergency_contacts_name = account.emergencyName;
                roleTableData.emergency_contacts_phone = account.emergencyPhone;
                connection.query('INSERT INTO staff SET ?', roleTableData, logResult);
            } else if (account.role === 'Admin') {
                connection.query('INSERT INTO admin SET ?', roleTableData, logResult);
            }
        });
    });
}

function logResult(err, results) {
    if (err) throw err;
    console.log('Inserted:', results.insertId);
}

// Export the function
module.exports = {
    createAccounts
};



const usersToCreate = [
    { username: 'manager1', role: 'Manager', firstName: 'John', lastName: 'Doe', gender: 'Male', email: 'manager1@example.com', phone: '1234567890' },
    { username: 'staff1', role: 'Staff', firstName: 'Jane', lastName: 'Doe', gender: 'Female', email: 'staff1@example.com', phone: '0987654321', emergencyName: 'Emergency', emergencyPhone: '1122334455' },
    { username: 'admin1', role: 'Admin', firstName: 'Jim', lastName: 'Beam', gender: 'Male', email: 'admin1@example.com', phone: '1231231234' }
];

// Assuming you want to create these accounts on server start
// createAccounts(usersToCreate);

  // Login route
  app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const getUserQuery = 'SELECT * FROM users WHERE username = ?';

    connection.query(getUserQuery, [username], async (err, result) => {
        console.log('Error:', err);
        console.log('res.status:',res.status);
        if (err) {
            console.error('Error getting user from database: ' + err.stack);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const user = result[0];
        const hashedPassword = user.password_hash;
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordCorrect) {
            res.status(401).json({ message: 'Incorrect password' });
            return;
        }

        // Generate JWT
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token,
            user_id: user.user_id, role: user.role });
        });
    });




app.post('/register/youth_camper', async (req, res) => {
  const password = req.body.password;    
  const encryptedPassword = await bcrypt.hash(password, saltRounds)
  const salt = generateSalt();

  connection.query('SELECT * FROM users WHERE username = ?', [req.body.username], (err, result) => {
    if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error during username check' });
    }
    
    if (result.length > 0) {
        return res.status(409).json({ message: 'User already exists' });
    }
  
    let userData = {
      username: req.body.username,
      password_hash: encryptedPassword,
      role: req.body.role,
      salt: salt,
      email: req.body.email
  }
  
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
          relationship_to_camper: req.body.relationship_to_camper,
          activity_preferences: req.body.activity_preferences
      }

      const id = result.insertId;

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
          // Insert health record for the youth
          let health_record_info = {
              user_id: id,
              medical_condition: req.body.medical_condition,
              allergies_information: req.body.allergies_information,
              dietary_requirement: req.body.dietary_requirement,
              last_updated_date: currentDate // Get today's date in DD-MM-YYY format
          };


          const insert_health_record_query = 'INSERT INTO health_record SET ?';
          connection.query(insert_health_record_query, health_record_info, (err, result) => {
              if (err) {
                  console.error('Error inserting health record into database: ' + err.stack);
                  return res.status(500).json({ message: 'Internal server error' });
              }

              res.status(200).json({ status: true });
          });
      });
  });
});
});



app.post('/register/adult_leader', async (req, res) => {
  const password = req.body.password;    
  const encryptedPassword = await bcrypt.hash(password, saltRounds)
  const salt = generateSalt();
  connection.query('SELECT * FROM users WHERE username = ?', [req.body.username], (err, result) => {
    if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error during username check' });
    }
    
    if (result.length > 0) {
        return res.status(409).json({ message: 'User already exists' });
    }
  
    let userData = {
      username: req.body.username,
      password_hash: encryptedPassword,
      role: req.body.role,
      salt: salt,
      email: req.body.email
  }

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
      const id = result.insertId;
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

          // Insert health record for the adult_leader
          let health_record_info = {
              user_id: id,
              medical_condition: req.body.medical_condition,
              allergies_information: req.body.allergies_information,
              dietary_requirement: req.body.dietary_requirement,
              last_updated_date: currentDate // Get today's date in YYYY-MM-DD format
          };


          const insert_health_record_query = 'INSERT INTO health_record SET ?';
          connection.query(insert_health_record_query, health_record_info, (err, result) => {
              if (err) {
                  console.error('Error inserting health record into database: ' + err.stack);
                  return res.status(500).json({ message: 'Internal server error' });
              }

              res.status(200).json({ status: true });
          });
      });
  });
});
});

app.post('/register/group_leader', async (req, res) => {
  const password = req.body.password;    
  const encryptedPassword = await bcrypt.hash(password, saltRounds)
  const salt = generateSalt();
  connection.query('SELECT * FROM users WHERE username = ?', [req.body.username], (err, result) => {
    if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error during username check' });
    }
    
    if (result.length > 0) {
        return res.status(409).json({ message: 'User already exists' });
    }
  
    let userData = {
      username: req.body.username,
      password_hash: encryptedPassword,
      role: req.body.role,
      salt: salt,
      email: req.body.email
  }

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
      const id = result.insertId;
      console.log("id:",id)
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

          // Insert health record for the group leader
          let health_record_info = {
              user_id: id,
              medical_condition: req.body.medical_condition,
              allergies_information: req.body.allergies_information,
              dietary_requirement: req.body.dietary_requirement,
              last_updated_date: currentDate // Get today's date in YYYY-MM-DD format
          };


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
});

app.get('/youth_camper_dashboard/:id', (req, res) => {
    const user_id = req.params.id;

    const getYouthQuery = 'SELECT * FROM youth WHERE user_id = ?';
    const getHealthQuery = 'SELECT * FROM health_record WHERE user_id = ?';
    connection.query(getYouthQuery, [user_id], (err, youthResult) => {
        if (err) {
            console.error('Error getting youth from database: ' + err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (youthResult.length === 0) {
            return res.status(404).json({ message: 'Youth not found' });
        }


        connection.query(getHealthQuery, [user_id], (err, healthResult) => {
            if (err) {
                console.error('Error getting health record from database: ' + err.stack);
                return res.status(500).json({ message: 'Internal server error' });
            }


            res.status(200).json({ youth: youthResult[0], health: healthResult[0] });
        });
    });
  }
  );


app.put('/youth_profile/:id', (req, res) => {
    const user_id = req.params.id;
    const { youth, health } = req.body; // Extract both youth and health data from the request body
    const{updatedHealthData} = health;

    const updateYouthQuery = 'UPDATE youth SET ? WHERE user_id = ?';
    const updateHealthQuery = 'UPDATE health_record SET ? WHERE user_id = ?';

    connection.query(updateYouthQuery, [youth, user_id], (err, result) => {
        if (err) {
            console.error('Error updating youth data:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        connection.query(updateHealthQuery, [health, user_id], (err, result) => {
            if (err) {
                console.error('Error updating health data:', err);
                return res.status(500).json({ message: 'Internal server error updating health data' });
            }
            res.status(200).json({ message: 'Data updated successfully' });
        });
    });
});

app.get('/adult_leader_dashboard/:id', (req, res) => {
    const user_id = req.params.id;

    const getLeaderQuery = 'SELECT * FROM adult_leader WHERE user_id = ?';
    const getHealthQuery = 'SELECT * FROM health_record WHERE user_id = ?';
    
    connection.query(getLeaderQuery, [user_id], (err, leaderResult) => {
        if (err) {
            console.error('Error getting leader from database: ' + err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (leaderResult.length === 0) {
            return res.status(404).json({ message: 'Leader not found' });
        }


        connection.query(getHealthQuery, [user_id], (err, healthResult) => {
            if (err) {
                console.error('Error getting health record from database: ' + err.stack);
                return res.status(500).json({ message: 'Internal server error' });
            }


            res.status(200).json({ leader: leaderResult[0], health: healthResult[0] });
        });
    });
  });

app.put('/adult_leader_profile/:id', (req, res) => {
    const user_id = req.params.id;
    const { leader, health } = req.body;

    // Exclude 'health_record_id' from the update if it should not be modified
    const { health_record_id, ...updateableHealthData } = health;

    const updateLeaderQuery = 'UPDATE adult_leader SET ? WHERE user_id = ?';
    const updateHealthQuery = 'UPDATE health_record SET ? WHERE health_record_id = ?';

    connection.query(updateLeaderQuery, [leader, user_id], (err, result) => {
        if (err) {
            console.error('Error updating leader data:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        connection.query(updateHealthQuery, [updateableHealthData, health_record_id], (err, result) => {
            if (err) {
                console.error('Error updating health data:', err);
                return res.status(500).json({ message: 'Internal server error updating health data' });
            }
            res.status(200).json({ message: 'Data updated successfully' });
        });
    });
});

app.get('/group_leader_dashboard/:id', (req, res) => {
    const user_id = req.params.id;

    const getLeaderQuery = 'SELECT * FROM group_leader WHERE user_id = ?';
    const getHealthQuery = 'SELECT * FROM health_record WHERE user_id = ?';
    connection.query(getLeaderQuery, [user_id], (err, leaderResult) => {
        if (err) {
            console.error('Error getting leader from database: ' + err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (leaderResult.length === 0) {
            return res.status(404).json({ message: 'Leader not found' });
        }
        // console.log('Leader found:', leaderResult[0]);
        connection.query(getHealthQuery, [user_id], (err, healthResult) => {
            if (err) {
                console.error('Error getting health record from database: ' + err.stack);
                return res.status(500).json({ message: 'Internal server error' });
            }
            // console.log('Health record found:', healthResult[0]);

            res.status(200).json({ leader: leaderResult[0], health: healthResult[0] });
        });
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  });

app.put('/group_leader_profile/:id', (req, res) => {
    const user_id = req.params.id;
    const { leader, health } = req.body;

    // Exclude 'health_record_id' from the update if it should not be modified
    const { health_record_id, ...updateableHealthData } = health;

    const updateLeaderQuery = 'UPDATE group_leader SET ? WHERE user_id = ?';
    const updateHealthQuery = 'UPDATE health_record SET ? WHERE health_record_id = ?';

    connection.query(updateLeaderQuery, [leader, user_id], (err, result) => {
        if (err) {
            console.error('Error updating leader data:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        connection.query(updateHealthQuery, [updateableHealthData, health_record_id], (err, result) => {
            if (err) {
                console.error('Error updating health data:', err);
                return res.status(500).json({ message: 'Internal server error updating health data' });
            }
            res.status(200).json({ message: 'Data updated successfully' });
        });
    });
});

app.get('/admin_dashboard/:id', (req, res) => {
    const user_id = req.params.id;

    const getAdminQuery = 'SELECT * FROM admin WHERE user_id = ?';
    connection.query(getAdminQuery, [user_id], (err, adminResult) => {
        if (err) {
            console.error('Error getting admin from database: ' + err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (adminResult.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ admin: adminResult[0] });
    });
  }
    );

app.put('/admin_profile/:id', (req, res) => {
    const user_id = req.params.id;
    const adminData = req.body;

    const updateAdminQuery = 'UPDATE admin SET ? WHERE user_id = ?';
    connection.query(updateAdminQuery, [adminData, user_id], (err, result) => {
        if (err) {
            console.error('Error updating admin data:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.status(200).json({ message: 'Data updated successfully' });
    });
});

app.post('/admin/create-initial-users', (req, res) => {
    if (!req.isAdmin) {  // Ensure the user is authorized
        return res.status(403).send('Unauthorized');
    }

    const connection = connectDatabase();
    createAccounts(connection)
        .then(() => res.send('Accounts created successfully'))
        .catch(err => {
            console.error('Error creating accounts:', err);
            res.status(500).send('Failed to create accounts');
        });
});

app.get('/staff_dashboard/:id', (req, res) => {
    const user_id = req.params.id;

    const getStaffQuery = 'SELECT * FROM staff WHERE user_id = ?';
    connection.query(getStaffQuery, [user_id], (err, staffResult) => {
        if (err) {
            console.error('Error getting staff from database: ' + err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (staffResult.length === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        res.status(200).json({ staff: staffResult[0] });
    });
  }
    );

app.put('/staff_profile/:id', (req, res) => {
    const user_id = req.params.id;
    const staffData = req.body;

    const updateStaffQuery = 'UPDATE staff SET ? WHERE user_id = ?';
    connection.query(updateStaffQuery, [staffData, user_id], (err, result) => {
        if (err) {
            console.error('Error updating staff data:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.status(200).json({ message: 'Data updated successfully' });
    });
}
);

app.get('/manager_dashboard/:id', (req, res) => {
    const user_id = req.params.id;

    const getManagerQuery = 'SELECT * FROM manager WHERE user_id = ?';
    connection.query(getManagerQuery, [user_id], (err, managerResult) => {
        if (err) {
            console.error('Error getting manager from database: ' + err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (managerResult.length === 0) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        res.status(200).json({ manager: managerResult[0] });
    });
  }
    );

app.put('/manager_profile/:id', (req, res) => {
    const user_id = req.params.id;
    const managerData = req.body;

    const updateManagerQuery = 'UPDATE manager SET ? WHERE user_id = ?';
    connection.query
    (updateManagerQuery, [managerData, user_id], (err, result) => {
        if (err) {
            console.error('Error updating manager data:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.status(200).json({ message: 'Data updated successfully' });
    });
}
);

app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.json(results);
    });
  });

app.put('/api/users/:id', (req, res) => {
    const { username, role } = req.body;
    const userId = req.params.id;
    connection.query(
      'UPDATE users SET username = ?, role = ? WHERE user_id = ?',
      [username, role, userId],
      (error, result) => {
        if (error) {
          return res.status(500).json({ error });
        }
        res.json({ message: 'User updated successfully!' });
      }
    );
  });


app.get('/admin/manage_youth',(req,res) => {
    const sqlQuery = `
        SELECT 
            youth.camper_id, youth.first_name, youth.last_name, youth.email, 
            youth.phone_num, youth.gender, youth.dob, youth.parent_guardian_name,
            youth.parent_guardian_phone, youth.parent_guardian_email, youth.relationship_to_camper,
            youth.activity_preferences, users.username
        FROM youth
        JOIN users ON youth.user_id = users.user_id;
    `;

    connection.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Error fetching campers:', error);
            return res.status(500).json({ error });
        }
        res.json(results);
    });
});

app.put('/admin/manage_youth/:id', (req, res) => {
    const id = req.params.id;
    const {
        first_name, last_name, email, phone_num, gender, dob,
        parent_guardian_name, parent_guardian_phone, parent_guardian_email,
        relationship_to_camper, activity_preferences,
    } = req.body;
    console.log("dob",dob)
    const youthUpdate = {
        first_name, last_name, email, phone_num, gender, dob,
        parent_guardian_name, parent_guardian_phone, parent_guardian_email,
        relationship_to_camper, activity_preferences
    };

    const youthQuery = 'UPDATE youth SET ? WHERE camper_id = ?';
    connection.query(youthQuery, [youthUpdate, id], (error) => {
        if (error) {
            console.error('Error updating youth:', error);
            return res.status(500).json({ error: "Failed to update youth" });
        }
    });
});

// Add a new camper
app.post('/admin/manage_youth', async (req, res) => {
    const {
      username, password, first_name, last_name, email, phone_num, gender, dob,
      parent_guardian_name, parent_guardian_phone, parent_guardian_email,
      relationship_to_camper, activity_preferences, role
    } = req.body;
  
    try {
      // Generate salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
  
      // Insert into users table
      const userInsert = { username, password_hash, role:"Youth", salt };
      console.log(userInsert);
      connection.query('INSERT INTO users SET ?', userInsert, (userError, userResults) => {
        if (userError) {
          console.error('Error creating user:', userError);
          return res.status(500).json({ error: "Failed to create user" });
        }
  
        const newCamper = {
          user_id: userResults.insertId, // Use the inserted user's ID
          first_name, last_name, email, phone_num, gender, dob,
          parent_guardian_name, parent_guardian_phone, parent_guardian_email,
          relationship_to_camper, activity_preferences
        };
  
        connection.query('INSERT INTO youth SET ?', newCamper, (camperError, camperResults) => {
          if (camperError) {
            console.error('Error adding camper:', camperError);
            // Rollback the user creation if camper creation fails
            connection.query('DELETE FROM users WHERE user_id = ?', [userResults.insertId]);
            return res.status(500).json({ error: 'Failed to add camper' });
          }
          res.status(201).json({ message: 'Camper added successfully', camper_id: camperResults.insertId });
        });
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Failed to add camper' });
    }
  });
  
  // Delete a camper
  app.delete('/admin/manage_youth/:id', (req, res) => {
    const { id } = req.params;
  
    const sqlQuery = 'DELETE FROM youth WHERE camper_id = ?';
  
    connection.query(sqlQuery, [id], (error, results) => {
      if (error) {
        console.error('Error deleting camper:', error);
        return res.status(500).json({ error: 'Failed to delete camper' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Camper not found' });
      }
      res.json({ message: 'Camper deleted successfully' });
    });
  });
  

app.get('/admin/manage_leaders', (req, res) => {
    const sqlQuery = `
        SELECT 
            al.adult_leader_id AS leader_id,
            al.first_name,
            al.last_name,
            al.email,
            al.phone_num,
            al.gender,
            al.dob,
            al.emergency_contacts_name,
            al.emergency_contacts_phone,
            u.username,
            u.user_id,
            u.role
        FROM adult_leader al
        JOIN users u ON al.user_id = u.user_id
        UNION ALL
        SELECT 
            gl.group_leader_id AS leader_id,
            gl.first_name,
            gl.last_name,
            gl.email,
            gl.phone_num,
            gl.gender,
            gl.dob,
            gl.emergency_contacts_name,
            gl.emergency_contacts_phone,
            u.username,
            u.user_id,
            u.role
        FROM group_leader gl
        JOIN users u ON gl.user_id = u.user_id;
    `;

    connection.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Error fetching leaders:', error);
            return res.status(500).json({ error });
        }
        res.json(results);
    });
});


app.put('/admin/manage_leaders/:id', (req, res) => {
    const { id } = req.params;
    const {
        first_name, last_name, email, phone_num, gender, dob,
        emergency_contacts_name, emergency_contacts_phone, role
    } = req.body;

    // Determine the table to update based on role
    const leaderTable = role === 'Adult Leader' ? 'adult_leader' : 'group_leader';

    const leaderUpdate = {
        first_name, last_name, email, phone_num, gender, dob,
        emergency_contacts_name, emergency_contacts_phone
    };

    console.log(role);
    console.log(leaderUpdate);  
    console.log(leaderTable);
    console.log(id);

    // Update the leader details
    const leaderSqlQuery = `UPDATE ${leaderTable} SET ? WHERE user_id = ?`;

    connection.query(leaderSqlQuery, [leaderUpdate, id], (error, leaderResults) => {
        if (error) {
            console.error('Error updating leader:', error);
            return res.status(500).json({ error: "Failed to update leader" });
        }
        if (leaderResults.affectedRows === 0) {
            return res.status(404).json({ error: "Leader not found" });
        }

    });
});

app.post('/admin/manage_leaders', async (req, res) => {
    const {
        username, password, first_name, last_name, email, phone_num,
        gender, dob, emergency_contacts_name, emergency_contacts_phone, role
    } = req.body;

    // Determine the table to insert based on role
    const leaderTable = role === 'Adult Leader' ? 'adult_leader' : 'group_leader';

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userInsert = {
        username, password_hash, role, salt
    };

    connection.query('INSERT INTO users SET ?', userInsert, (userError, userResults) => {
        if (userError) {
            console.error('Error creating user:', userError);
            return res.status(500).json({ error: "Failed to create user" });
        }

        const leaderInsert = {
            user_id: userResults.insertId, first_name, last_name, email, phone_num, gender, dob,
            emergency_contacts_name, emergency_contacts_phone
        };

        connection.query(`INSERT INTO ${leaderTable} SET ?`, leaderInsert, (leaderError, leaderResults) => {
            if (leaderError) {
                console.error('Error creating leader:', leaderError);
                // Rollback the user creation if leader creation fails
                connection.query('DELETE FROM users WHERE user_id = ?', [userResults.insertId]);
                return res.status(500).json({ error: "Failed to create leader" });
            }

            res.json({ message: "Leader created successfully" });
        });
    });
});

app.delete('/admin/manage_leaders/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT role FROM users WHERE user_id = ?', [id], (userError, userResults) => {
        if (userError || userResults.length === 0) {
            console.error('Error finding user:', userError);
            return res.status(404).json({ error: "User not found" });
        }

        const role = userResults[0].role;
        const leaderTable = role === 'Adult Leader' ? 'adult_leader' : 'group_leader';

        connection.query(`DELETE FROM ${leaderTable} WHERE user_id = ?`, [id], (leaderError, leaderResults) => {
            if (leaderError) {
                console.error('Error deleting leader:', leaderError);
                return res.status(500).json({ error: "Failed to delete leader" });
            }

            connection.query('DELETE FROM users WHERE user_id = ?', [id], (userDeleteError, userDeleteResults) => {
                if (userDeleteError) {
                    console.error('Error deleting user:', userDeleteError);
                    return res.status(500).json({ error: "Failed to delete user" });
                }

                res.json({ message: "Leader and user deleted successfully" });
            });
        });
    });
});

// Manage staff account information
app.get('/admin/manage_staff', (req, res) => {
    const sqlQuery = `
      SELECT staff.staff_id, staff.first_name, staff.last_name, staff.email, staff.phone_num, staff.gender,
             staff.emergency_contacts_name, staff.emergency_contacts_phone, users.username, users.user_id
      FROM staff 
      JOIN users ON staff.user_id = users.user_id;
    `;
    connection.query(sqlQuery, (error, results) => {
      if (error) {
        console.error('Error fetching staff:', error);
        return res.status(500).json({ error: 'Failed to fetch staff' });
      }
      res.json(results);
    });
  });
  
app.post('/admin/manage_staff', async (req, res) => {
    const {
      username, first_name, last_name, email, phone_num, gender,
      emergency_contacts_name, emergency_contacts_phone, password
    } = req.body;
  
    const role = 'Staff'; // Set the role for the user table
  
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
  
    const userInsert = {
      username, password_hash, role, salt, email
    };
  
    connection.query('INSERT INTO users SET ?', userInsert, (userError, userResults) => {
      if (userError) {
        console.error('Error creating user:', userError);
        return res.status(500).json({ error: "Failed to create user" });
      }
  
      const staffInsert = {
        user_id: userResults.insertId, first_name, last_name, email, phone_num, gender,
        emergency_contacts_name, emergency_contacts_phone
      };
  
      connection.query('INSERT INTO staff SET ?', staffInsert, (staffError, staffResults) => {
        if (staffError) {
          console.error('Error creating staff:', staffError);
          // Rollback the user creation if staff creation fails
          connection.query('DELETE FROM users WHERE user_id = ?', [userResults.insertId]);
          return res.status(500).json({ error: "Failed to create staff" });
        }
        res.status(201).json({ message: 'Staff added successfully', user_id: staffResults.insertId });
      });
    });
  });
  
app.put('/admin/manage_staff/:id', (req, res) => {
    const { id } = req.params;
    console.log("update staff ID", id); // Log the ID to ensure it's being received

    const {
      first_name, last_name, email, phone_num, gender,
      emergency_contacts_name, emergency_contacts_phone
    } = req.body;
  
    const staffUpdate = {
      first_name, last_name, email, phone_num, gender,
      emergency_contacts_name, emergency_contacts_phone
    };
  
    const sqlQuery = 'UPDATE staff SET ? WHERE user_id = ?';
  
    connection.query(sqlQuery, [staffUpdate, id], (error, results) => {
      if (error) {
        console.error('Error updating staff:', error);
        return res.status(500).json({ error: "Failed to update staff" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Staff not found" });
      }
      res.json({ message: "Staff updated successfully" });
    });
  });
  
app.delete('/admin/manage_staff/:id', (req, res) => {
    const { id } = req.params;
    console.log("Delete staff ID:", id); // Log the ID to ensure it's being received

    connection.query('DELETE FROM staff WHERE user_id = ?', [id], (staffError, staffResults) => {
      if (staffError) {
        console.error('Error deleting staff:', staffError);
        return res.status(500).json({ error: "Failed to delete staff" });
      }
      if (staffResults.affectedRows === 0) {
        return res.status(404).json({ error: "Staff not found" });
      }
  
      connection.query('DELETE FROM users WHERE user_id = ?', [id], (userError, userResults) => {
        if (userError) {
          console.error('Error deleting user:', userError);
          return res.status(500).json({ error: "Failed to delete user" });
        }
        res.json({ message: "Staff deleted successfully" });
      });
    });
  });
  
  
  // Manage Managers
  app.get('/admin/manage_managers', (req, res) => {
    const sqlQuery = `
      SELECT manager.first_name, manager.last_name, manager.email, manager.phone_num, 
             manager.gender, users.username,users.user_id
      FROM manager 
      JOIN users ON manager.user_id = users.user_id;
    `;
    connection.query(sqlQuery, (error, results) => {
      if (error) {
        console.error('Error fetching managers:', error);
        return res.status(500).json({ error: 'Failed to fetch managers' });
      }
      res.json(results);
    });
  });
  
  app.post('/admin/manage_managers', async (req, res) => {
    const { username, first_name, last_name, email, phone_num, gender, password } = req.body;
  
    const role = 'Manager'; // Set the role for the user table
  
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
  
    const userInsert = {
      username, password_hash, role, salt, email
    };
  
    connection.query('INSERT INTO users SET ?', userInsert, (userError, userResults) => {
      if (userError) {
        console.error('Error creating user:', userError);
        return res.status(500).json({ error: "Failed to create user" });
      }
  
      const managerInsert = {
        user_id: userResults.insertId, first_name, last_name, email, phone_num, gender
      };
  
      connection.query('INSERT INTO manager SET ?', managerInsert, (managerError, managerResults) => {
        if (managerError) {
          console.error('Error creating manager:', managerError);
          // Rollback the user creation if manager creation fails
          connection.query('DELETE FROM users WHERE user_id = ?', [userResults.insertId]);
          return res.status(500).json({ error: "Failed to create manager" });
        }
        res.status(201).json({ message: 'Manager added successfully', user_id: managerResults.insertId });
      });
    });
  });
  
  app.put('/admin/manage_managers/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone_num, gender } = req.body;

    const managerUpdate = {
        first_name, last_name, email, phone_num, gender
    };

    const sqlQuery = 'UPDATE manager SET ? WHERE user_id = ?';

    connection.query(sqlQuery, [managerUpdate, id], (error, results) => {
        if (error) {
            console.error('Error updating manager:', error);
            return res.status(500).json({ error: "Failed to update manager" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Manager not found" });
        }
        res.json({ message: "Manager updated successfully" });
    });
});
  
  app.delete('/admin/manage_managers/:id', (req, res) => {
    const { id } = req.params;
  
    connection.query('DELETE FROM manager WHERE user_id = ?', [id], (managerError, managerResults) => {
      if (managerError) {
        console.error('Error deleting manager:', managerError);
        return res.status(500).json({ error: "Failed to delete manager" });
      }
      if (managerResults.affectedRows === 0) {
        return res.status(404).json({ error: "Manager not found" });
      }
  
      connection.query('DELETE FROM users WHERE user_id = ?', [id], (userError, userResults) => {
        if (userError) {
          console.error('Error deleting user:', userError);
          return res.status(500).json({ error: "Failed to delete user" });
        }
        res.json({ message: "Manager deleted successfully" });
      });
    });
  });
  
// Fetch all grounds
app.get('/admin/manage_grounds', (req, res) => {
    connection.query('SELECT * FROM camp_grounds', (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.json(results);
    });
});

// Add a new ground
app.post('/admin/manage_grounds', (req, res) => {
    const { name, capacity, description, location, status, picture } = req.body;
    const query = 'INSERT INTO camp_grounds (name, capacity, description, location, status, picture) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [name, capacity, description, location, status, picture], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(201).json({ message: 'Ground added successfully', ground_id: results.insertId });
    });
});

// Update a ground
app.put('/admin/manage_grounds/:id', (req, res) => {
    const { name, capacity, description, location, status, picture } = req.body;
    const { id } = req.params;
    console.log(name, capacity, description, location, status, picture, id )
    const query = 'UPDATE camp_grounds SET name = ?, capacity = ?, description = ?, location = ?, status = ?, picture = ? WHERE ground_id = ?';
    connection.query(query, [name, capacity, description, location, status, picture, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(201).json({ message: 'Ground added successfully', ground_id: results.insertId });
    });
});

// Delete a ground
app.delete('/admin/manage_grounds/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM camp_grounds WHERE ground_id = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.json({ message: 'Ground deleted successfully' });
    });

}); 




  // Serve static files
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });





