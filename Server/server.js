
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
        password: "root",
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
        { username: 'manager1', role: 'Manager', firstName: 'John', lastName: 'Doe', gender: 'Male', email: 'manager1@example.com', phone: '1234567890'},
        { username: 'staff1', role: 'Staff', firstName: 'Jane', lastName: 'Doe', gender: 'Female', email: 'staff1@example.com', phone: '0987654321', emergencyName: 'Emergency', emergencyPhone: '1122334455' },
        { username: 'admin1', role: 'Admin', firstName: 'Jim', lastName: 'Beam', gender: 'Male', email: 'admin1@example.com', phone: '1231231234'}
    ];

    accounts.forEach(account => {
        // Insert into users table
        connection.query('INSERT INTO users SET ?', {
            username: account.username,
            password_hash: hashedPassword,
            role: account.role,
            salt: saltRounds.toString(), // Store salt rounds as salt for simplicity
            email: account.email
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

// Only use when creating team members initial accounts

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
// Get news for youth camper dashboard
app.get('/youth_camper_dashboard/news/:receiver_id', (req, res) => {
    const receiver_id = req.params.receiver_id;
    const query = `
      SELECT * FROM news
      WHERE receiver_id = ? OR to_all = 'Yes' OR to_group = 'Youth Camper'
      ORDER BY publish_date DESC
    `;
    connection.query(query, [receiver_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
    });
  });

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

// Get news for adult leader dashboard
  app.get('/adult_leader_dashboard/news/:receiver_id', (req, res) => {
    const receiver_id = req.params.receiver_id;
    const query = `
      SELECT * FROM news
      WHERE receiver_id = ? OR to_all = 'Yes' OR to_group = 'Adult Leader'
      ORDER BY publish_date DESC
    `;
    connection.query(query, [receiver_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
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

// Get news for group leader dashboard
  app.get('/group_leader_dashboard/news/:receiver_id', (req, res) => {
    const receiver_id = req.params.receiver_id;
    const query = `
      SELECT * FROM news
      WHERE receiver_id = ? OR to_all = 'Yes' OR to_group = 'Group Leader'
      ORDER BY publish_date DESC
    `;
    connection.query(query, [receiver_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
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

//Get youth campers information
app.get('/admin/manage_youth',(req,res) => {
    const sqlQuery = `
        SELECT 
            youth.user_id, youth.first_name, youth.last_name, youth.email, 
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

// Update a camper
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

    const youthQuery = 'UPDATE youth SET ? WHERE user_id = ?';
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
      const userInsert = { username, password_hash, role: "Youth", salt, email };
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
  
          // Insert null for health records
          const healthRecordInsert = {
            user_id: userResults.insertId,
            medical_condition: null,
            allergies_information: null,
            dietary_requirement: null,
            last_updated_date: null
          };
          connection.query('INSERT INTO health_record SET ?', healthRecordInsert, (healthError, healthResults) => {
            if (healthError) {
              console.error('Error adding health record:', healthError);
              // Rollback the camper creation if health record creation fails
              connection.query('DELETE FROM youth WHERE user_id = ?', [userResults.insertId]);
              connection.query('DELETE FROM users WHERE user_id = ?', [userResults.insertId]);
              return res.status(500).json({ error: 'Failed to add health record' });
            }
            res.status(201).json({ message: 'Camper added successfully', camper_id: camperResults.insertId });
          });
        });
      });
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
 // Delete a camper
app.delete('/admin/manage_youth/:id', (req, res) => {
   const { id } = req.params;
 
   // Delete the associated health records first
   connection.query('DELETE FROM health_records WHERE user_id = ?', [id], (healthError, healthResults) => {
     if (healthError) {
       console.error('Error deleting health records:', healthError);
       return res.status(500).json({ error: 'Failed to delete health records' });
     }
 
     // Delete the camper entry
     connection.query('DELETE FROM youth WHERE user_id = ?', [id], (camperError, camperResults) => {
       if (camperError) {
         console.error('Error deleting camper:', camperError);
         return res.status(500).json({ error: 'Failed to delete camper' });
       }
 
       if (camperResults.affectedRows === 0) {
         return res.status(404).json({ error: 'Camper not found' });
       }
 
       // Delete the user entry
       connection.query('DELETE FROM users WHERE user_id = ?', [id], (userError, userResults) => {
         if (userError) {
           console.error('Error deleting user:', userError);
           return res.status(500).json({ error: 'Failed to delete user' });
         }
 
         res.json({ message: 'Camper and user deleted successfully' });
       });
     });
   });
 });

//Get leader's information
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

//Update leader's information
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

//Add a new leader
app.post('/admin/manage_leaders', async (req, res) => {
  const {
    username, password, first_name, last_name, email, phone_num,
    gender, dob, emergency_contacts_name, emergency_contacts_phone, role
  } = req.body;

  try {
    // Determine the table to insert based on role
    const leaderTable = role === 'Adult Leader' ? 'adult_leader' : 'group_leader';

    // Check if the username already exists
    connection.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
      if (error) {
        console.error('Error checking username:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }

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

          // Insert null for health records
          const healthRecordInsert = {
            user_id: userResults.insertId,
            medical_condition: null,
            allergies_information: null,
            dietary_requirement: null,
            last_updated_date: null
          };

          connection.query('INSERT INTO health_record SET ?', healthRecordInsert, (healthError, healthResults) => {
            if (healthError) {
              console.error('Error adding health record:', healthError);
              // Rollback the leader creation if health record creation fails
              connection.query(`DELETE FROM ${leaderTable} WHERE user_id = ?`, [userResults.insertId]);
              connection.query('DELETE FROM users WHERE user_id = ?', [userResults.insertId]);
              return res.status(500).json({ error: 'Failed to add health record' });
            }

            res.status(201).json({ message: 'Leader added successfully', user_id: userResults.insertId });
          });
        });
      });
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Delete a leader
app.delete('/admin/manage_leaders/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT role FROM users WHERE user_id = ?', [id], (userError, userResults) => {
        if (userError || userResults.length === 0) {
            console.error('Error finding user:', userError);
            return res.status(404).json({ error: "User not found" });
        }

        const role = userResults[0].role;
        const leaderTable = role === 'Adult Leader' ? 'adult_leader' : 'group_leader';

        // Delete the associated health records first
        connection.query('DELETE FROM health_record WHERE user_id = ?', [id], (healthError, healthResults) => {
        if (healthError) {
          console.error('Error deleting health records:', healthError);
          return res.status(500).json({ error: "Failed to delete health records" });
        }
  

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

app.post('/send_news', (req, res) => {
  const news = req.body;
  connection.query('INSERT INTO news SET ?', news, (err, results) => {
      if (err) {
          console.error('Error adding news:', err);
          res.status(500).send('Internal server error');
          return;
      }
      res.send('News added successfully');
  });
});
//Update the camp status to pending so the camp is booked
app.put('/admin/camps/:id', (req, res) => {
  const { id } = req.params;
  const { camp_status } = req.body;
  const query = 'UPDATE camps SET status = ? WHERE camp_id = ?';
  connection.query(query, [camp_status, id], (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.json({ message: 'Camp status updated successfully' });
  }
  );
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

// Fetch all groups
app.get('/admin/manage_groups', (req, res) => {
  connection.query('SELECT * FROM camp_groups', (err, results) => {
      if (err) {
          console.error('Error fetching groups:', err);
          res.status(500).send('Error fetching groups');
      } else {
          res.json(results);
      }
  });
});

// Fetch all group leaders
app.get('/admin/group_leaders', (req, res) => {
  connection.query('SELECT * FROM group_leader', (err, results) => {
      if (err) {
          console.error('Error fetching group leaders:', err);
          res.status(500).send('Error fetching group leaders');
      } else {
          res.json(results);
      }
  });
});

// Fetch all camps
app.get('/admin/camps', (req, res) => {
  connection.query('SELECT * FROM camps', (err, results) => {
      if (err) {
          console.error('Error fetching camps:', err);
          res.status(500).send('Error fetching camps');
      } else {
          res.json(results);
      }
  });
});

// Add a new group
app.post('/admin/manage_groups', (req, res) => {
  const { group_leader_id, camp_id, number_of_attendees, group_name, description, group_status, payment_status, registration_fee_youth, registration_fee_adult } = req.body;
  const query = 'INSERT INTO camp_groups (group_leader_id, camp_id, number_of_attendees, group_name, description, group_status,  payment_status, registration_fee_youth, registration_fee_adult) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [group_leader_id, camp_id, number_of_attendees, group_name, description, group_status],  payment_status, registration_fee_youth, registration_fee_adult, (err, results) => {
      if (err) {
          console.error('Error adding group:', err);
          res.status(500).send('Error adding group');
      } else {
          res.status(201).send('Group added successfully');
      }
  });
});

// Update a group
app.put('/admin/manage_groups/:id', (req, res) => {
  const { id } = req.params;
  const { group_leader_id, camp_id, number_of_attendees, group_name, description, payment_status, group_status, registration_fee_youth, registration_fee_adult} = req.body;
  const query = 'UPDATE camp_groups SET group_leader_id = ?, camp_id = ?, number_of_attendees = ?, group_name = ?, description = ?, payment_status=?, group_status = ?, registration_fee_youth = ?, registration_fee_adult = ? WHERE group_id = ?';
  connection.query(query, [group_leader_id, camp_id, number_of_attendees, group_name, description, payment_status, group_status, registration_fee_youth, registration_fee_adult, id], (err, results) => {
      if (err) {
          console.error('Error updating group:', err);
          res.status(500).send('Error updating group');
      } else {
          res.send('Group updated successfully');
      }
  });
});

// Delete a group
app.delete('/admin/manage_groups/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM camp_groups WHERE group_id = ?';
  connection.query(query, [id], (err, results) => {
      if (err) {
          console.error('Error deleting group:', err);
          res.status(500).send('Error deleting group');
      } else {
          res.send('Group deleted successfully');
      }
  });
});


// Fetch all camps
app.get('/admin/manage_camps', (req, res) => {
  connection.query('SELECT * FROM camps', (err, results) => {
      if (err) {
          console.error('Error fetching camps:', err);
          res.status(500).send('Error fetching camps');
      } else {
          res.json(results);
      }
  });
});

// Fetch all camp grounds
app.get('/admin/camp_grounds', (req, res) => {
  connection.query('SELECT * FROM camp_grounds', (err, results) => {
      if (err) {
          console.error('Error fetching camp grounds:', err);
          res.status(500).send('Error fetching camp grounds');
      } else {
          res.json(results);
      }
  });
});

// Add a new camp
app.post('/admin/manage_camps', (req, res) => {
  const { ground_id, camp_name, location, start_date, end_date, capacity, schedule, description, price, status } = req.body;
  const query = 'INSERT INTO camps (ground_id, camp_name, location, start_date, end_date, capacity, schedule, description, price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [ground_id, camp_name, location, start_date, end_date, capacity, schedule, description, price, status], (err, results) => {
      if (err) {
          console.error('Error adding camp:', err);
          res.status(500).send('Error adding camp');
      } else {
          res.status(201).send('Camp added successfully');
      }
  });
});

// Update a camp
app.put('/admin/manage_camps/:id', (req, res) => {
  const { id } = req.params;
  const { ground_id, camp_name, location, start_date, end_date, capacity, schedule, description, price,status } = req.body;
  const query = 'UPDATE camps SET ground_id = ?, camp_name=?, location = ?, start_date = ?, end_date = ?, capacity = ?, schedule = ?, description = ?, price=?, status = ? WHERE camp_id = ?';
  connection.query(query, [ground_id, camp_name, location, start_date, end_date, capacity, schedule, description, price, status, id], (err, results) => {
      if (err) {
          console.error('Error updating camp:', err);
          res.status(500).send('Error updating camp');
      } else {
          res.send('Camp updated successfully');
      }
  });
});

// Delete a camp
app.delete('/admin/manage_camps/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM camps WHERE camp_id = ?';
  connection.query(query, [id], (err, results) => {
      if (err) {
          console.error('Error deleting camp:', err);
          res.status(500).send('Error deleting camp');
      } else {
          res.send('Camp deleted successfully');
      }
  });
});


//Admin manage camp registrations
//Fetch all camp registrations
app.get('/admin/manage_registrations', (req, res) => {
  connection.query('SELECT * FROM camp_registrations', (err, results) => {
      if (err) {
          console.error('Error fetching camp registrations:', err);
          res.status(500).send('Error fetching camp registrations');
      } else {
          res.json(results);
      }
  });
}
);

// Add a new camp registration
app.post('/admin/manage_camp_registrations', (req, res) => {
  const { group_id, camp_id, number_of_attendees, registration_date, payment_status, registration_fee } = req.body;
  const query = 'INSERT INTO camp_registrations (group_id, camp_id, number_of_attendees, registration_date, payment_status, registration_fee) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [group_id, camp_id, number_of_attendees, registration_date, payment_status, registration_fee], (err, results) => {
      if (err) {
          console.error('Error adding camp registration:', err);
          res.status(500).send('Error adding camp registration');
      } else {
          res.status(201).send('Camp registration added');
      }
  });
});

// Update a camp registration
app.put('/admin/manage_camp_registrations/:registration_id', (req, res) => {
  const { registration_id } = req.params;
  const { group_id, camp_id, registration_date, status, camper_type } = req.body;
  const query = 'UPDATE camp_registrations SET group_id = ?, camp_id = ?, registration_date = ?, status = ?, camper_type = ? WHERE registration_id = ?';
  connection.query(query, [group_id, camp_id, registration_date, status, camper_type, registration_id], (err, results) => {
      if (err) {
          console.error('Error updating camp registration:', err);
          res.status(500).send('Error updating camp registration');
      } else {
          res.send('Camp registration updated');
      }
  });
});

//Get groups for add camp registration
app.get('/admin_manage_camp_registrations/groups', (req, res) => {
  connection.query('SELECT * FROM camp_groups', (err, results) => {
      if (err) {
          console.error('Error fetching groups:', err);
          res.status(500).send('Error fetching groups');
      }
      res.json(results);
  });
});

//Get users for adding camp registrations
app.get('/admin_manage_camp_registrations/users', (req, res) => {
  connection.query('SELECT * FROM users WHERE role ="Youth" or role="Adult Leader"', (err, results) => {
      if (err) {
          console.error('Error fetching users:', err);
          res.status(500).send('Error fetching users');
      }
      res.json(results);
 
  });
}
);

app.get(`/admin_manage_camp_registrations/users?search=:term`, (req, res) => {
  const { term } = req.query;
  connection.query('SELECT * FROM users WHERE username = ?', [`%${term}%`], (err, results) => {
      if (err) {
          console.error('Error fetching users:', err);
          res.status(500).send('Error fetching users');
      }
      console.log(results);
      res.json(results);
  });
}
);




// Delete a camp registration
app.delete('/admin/manage_camp_registrations/:registration_id', (req, res) => {
  const { registration_id } = req.params;
  const query = 'DELETE FROM camp_registrations WHERE registration_id = ?';
  connection.query(query, [registration_id], (err, results) => {
      if (err) {
          console.error('Error deleting camp registration:', err);
          res.status(500).send('Error deleting camp registration');
      } else {
          res.send('Camp registration deleted');
      }
  });
});



//Admin manage news
//Fetch all news
app.get('/admin_manage_news', (req, res) => {
  connection.query('SELECT * FROM news', (err, results) => {
      if (err) {
          console.error('Error fetching news:', err);
          res.status(500).send('Error fetching news');
      } else {
          res.json(results);
      }
  }
  );
});

// Add news
app.post('/admin_manage_news', (req, res) => {
  const { receiver_id, title, content, publish_date, to_all, to_group } = req.body;
  const query = 'INSERT INTO news (receiver_id, title, content, publish_date, to_all, to_group) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [to_all === 'Yes' ? null : receiver_id, title, content, publish_date, to_all, to_group], (err, results) => {
      if (err) {
          console.error('Error adding news:', err);
          res.status(500).send('Error adding news');
      } else {
          res.status(201).send('News added');
      }
  });
});

// Update news
app.put('/admin_manage_news/:news_id', (req, res) => {
  const { news_id } = req.params;
  const { receiver_id, title, content, publish_date, to_all, to_group } = req.body;
  const query = 'UPDATE news SET receiver_id = ?, title = ?, content = ?, publish_date = ?, to_all = ?, to_group = ? WHERE news_id = ?';
  connection.query(query, [to_all === 'Yes' ? null : receiver_id, title, content, publish_date, to_all, to_group, news_id], (err, results) => {
      if (err) {
          console.error('Error updating news:', err);
          res.status(500).send('Error updating news');
      } else {
          res.send('News updated');
      }
  });
});

// Delete news
app.delete('/admin_manage_news/:news_id', (req, res) => {
  const { news_id } = req.params;
  const query = 'DELETE FROM news WHERE news_id = ?';
  connection.query(query, [news_id], (err, results) => {
      if (err) {
          console.error('Error deleting news:', err);
          res.status(500).send('Error deleting news');
      } else {
          res.send('News deleted');
      }
  });
});

//Admin manage accommodations


// Fetch all accommodations
app.get('/admin/manage_accommodations', (req, res) => {
  connection.query('SELECT * FROM accommodations', (err, results) => {
    if (err) {
      console.error('Error fetching accommodations:', err);
      res.status(500).send('Error fetching accommodations');
    } else {
      res.json(results);
    }
  });
});

// Add a new accommodation
app.post('/admin/manage_accommodations', (req, res) => {
  const { ground_id, type, capacity, location_description, status, picture } = req.body;
  const query = 'INSERT INTO accommodations (ground_id, type, capacity, location_description, status, picture) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [ground_id, type, capacity, location_description, status, picture], (err, results) => {
    if (err) {
      console.error('Error adding accommodation:', err);
      res.status(500).send('Error adding accommodation');
    } else {
      res.status(201).send('Accommodation added');
    }
  });
});

// Update an accommodation
app.put('/admin/manage_accommodations/:accommodation_id', (req, res) => {
  const { accommodation_id } = req.params;
  const { ground_id, type, capacity, location_description, status, picture } = req.body;
  const query = 'UPDATE accommodations SET ground_id = ?, type = ?, capacity = ?, location_description = ?, status = ?, picture = ? WHERE accommodation_id = ?';
  connection.query(query, [ground_id, type, capacity, location_description, status, picture, accommodation_id], (err, results) => {
    if (err) {
      console.error('Error updating accommodation:', err);
      res.status(500).send('Error updating accommodation');
    } else {
      res.send('Accommodation updated');
    }
  });
});

// Delete an accommodation
app.delete('/admin/manage_accommodations/:accommodation_id', (req, res) => {
  const { accommodation_id } = req.params;
  const query = 'DELETE FROM accommodations WHERE accommodation_id = ?';
  connection.query(query, [accommodation_id], (err, results) => {
    if (err) {
      console.error('Error deleting accommodation:', err);
      res.status(500).send('Error deleting accommodation');
    } else {
      res.send('Accommodation deleted');
    }
  });
});


//Admin manage discounts
app.get('admin/manage_discounts'), (req, res) => {  
  connection.query('SELECT * FROM discounts', (err, results) => {
    if (err) {
      console.error('Error fetching discounts:', err);
      res.status(500).send('Error fetching discounts');
    } else {
      res.json(results);
    }
  });
}


app.get('/admin/camps_for_discounts', (req, res) => {
  const query = 'SELECT * FROM camps';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching camps:', err);
      res.status(500).json({ message: 'Error fetching camps' });
    } else {
      res.json(results);
    }
  });
});

app.get('/admin/manage_discounts', (req, res) => {
  const query = 'SELECT * FROM discount';
  connection.query
  (query, (
    err, results) => {
    if (err) {
      console.error('Error fetching discounts:', err);
      res.status(500).send('Error fetching discounts');
    } else {
      res.json(results);
    }
  });
});


app.post('/admin/manage_discounts', (req, res) => {
  const { camp_id, discount_type, discount_start_date, discount_end_date, discount_percentage} = req.body;
  console.log(camp_id, discount_type, discount_start_date, discount_end_date, discount_percentage);
  const query = 'INSERT INTO discount (camp_id, discount_type,discount_start_date, discount_end_date, discount_percentage) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [camp_id, discount_type,discount_start_date, discount_end_date, discount_percentage], (err, results) => {
    if (err) {
      console.error('Error adding discount:', err);
      res.status(500).send('Error adding discount');
    } else {
      res.status(201).send('Discount added');
    }
  });
});

app.get('/admin/manage_discounts/:camp_id', (req, res) => {
  const { camp_id } = req.params;
  const query = 'SELECT * FROM discount WHERE camp_id = ?';
  connection.query(query, [discount_id], (err, results) => {
    if (err) {
      console.error('Error fetching discount:', err);
      res.status(500).send('Error fetching discount');
    } else {
      if (results.length === 0) {
        res.status(404).send('Discount not found');
      } else {
        res.json(results[0]);
      }
    }
  });
});


app.put('/admin/manage_discounts/:discount_id', (req, res) => {
  const { discount_id } = req.params;
  const { camp_id, discount_type, discount_start_date, discount_end_date, discount_percentage  } = req.body;
  const query = 'UPDATE discount SET camp_id = ?, discount_type= ?, discount_start_date = ?, discount_end_date = ?, discount_percentage= ? WHERE discount_id = ?';
  connection.query(query, [camp_id, discount_type, discount_start_date, discount_end_date, discount_percentage, discount_id], (err, results) => {
    if (err) {
      console.error('Error updating discount:', err);
      res.status(500).send('Error updating discount');
    } else {
      res.send('Discount updated');
    }
  });
});

app.delete('/admin/manage_discounts/:discount_id', (req, res) => {
  const { discount_id } = req.params;
  const query = 'DELETE FROM discount WHERE discount_id = ?';
  connection.query(query, [discount_id], (err, results) => {
    if (err) {
      console.error('Error deleting discount:', err);
      res.status(500).send('Error deleting discount');
    } else {
      res.send('Discount deleted');
    }
  });
});


//Admin manage payments
//Fetch all payments
app.get('/admin/manage_payments', (req, res) => {
  connection.query('SELECT * FROM payment', (err, results) => {
      if (err) {
          console.error('Error fetching payments:', err);
          res.status(500).send('Error fetching payments');
      } else {
        console.log(results);
          res.json(results);

      }
  });
}
);

app.post('/admin/manage_payments', (req, res) => {
  let { user_id, camp_id, amount, request_date, description, payment_status, payment_date, pay_type } = req.body;

  // Handle empty payment_date
  if (payment_date === '') {
    payment_date = null;
  }

  const query = `
      INSERT INTO payment (user_id, camp_id, amount, request_date, description, payment_status, payment_date, pay_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  connection.query(query, [user_id, camp_id, amount, request_date, description, payment_status, payment_date, pay_type], (err, result) => {
      if (err) {
          console.error('Error adding payment:', err);
          return res.status(500).send('Failed to add payment');
      }
      res.status(201).send('Payment added successfully');
  });
});

// Delete a payment
app.delete('/admin/manage_payments/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM payment WHERE payment_id = ?';
  connection.query(query, [id], (err, result) => {
      if (err) {
          console.error('Error deleting payment:', err);
          return res.status(500).send('Failed to delete payment');
      }
      res.status(200).send('Payment deleted successfully');
  });
});

// Update a payment
app.put('/admin/manage_payments/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, camp_id, amount, request_date, description, payment_status, payment_date, pay_type } = req.body;

  // Handle empty payment_date
  if (payment_date === '') {
    payment_date = null;
  }

  const query = `
      UPDATE payment SET 
      user_id = ?, 
      camp_id = ?, 
      amount = ?, 
      request_date = ?, 
      description = ?, 
      payment_status = ?, 
      payment_date = ?, 
      pay_type = ?
      WHERE payment_id = ?
  `;
  connection.query(query, [user_id, camp_id, amount, request_date, description, payment_status, payment_date, pay_type, id], (err, result) => {
      if (err) {
          console.error('Error updating payment:', err);
          return res.status(500).send('Failed to update payment');
      }
      res.status(200).send('Payment updated successfully');
  });
});




//Group Leader Functions

//Group Applications


/// Get all group applications for a specific group leader
app.get('/group_leader/groups_applications/:user_id', (req, res) => {
  const { user_id } = req.params;

  // Retrieve the group_leader_id based on the user_id
  connection.query("SELECT group_leader_id FROM group_leader WHERE user_id = ?", [user_id], (error, results) => {
      if (error) {
          console.error('Error fetching group leader:', error);
          return res.status(500).json({ error: 'Failed to fetch group leader' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Group leader not found' });
      }

      const groupLeaderResult = results[0];
      const group_leader_id = groupLeaderResult.group_leader_id;

      // Fetch group applications by status
      const queries = [
          { status: 'Inactive', key: 'previous' },
          { status: 'Pending', key: 'applied' },
          { status: 'Active', key: 'approved' }
      ];

      const resultsObj = {};

      let completedQueries = 0;

      queries.forEach(query => {
          const sqlQuery = `
              SELECT cg.*, 
                     IFNULL(cg.payment_status, 'Unpaid') AS payment_status,
                     c.camp_name, 
                     c.price
              FROM camp_groups cg 
              LEFT JOIN camps c ON cg.camp_id = c.camp_id
              WHERE cg.group_status = ? 
                AND cg.group_leader_id = ?;
          `;
          connection.query(sqlQuery, [query.status, group_leader_id], (error, results) => {
              if (error) {
                  console.error(`Error fetching ${query.key} groups:`, error);
                  resultsObj[query.key] = [];
              } else {
                  resultsObj[query.key] = results;
              }

              completedQueries += 1;
              if (completedQueries === queries.length) {
                  res.json(resultsObj);
              }
          });
      });
  });
});


app.get('/group_leader/groups_unpaid/:userId', (req, res) => {
  const { userId } = req.params;

  connection.query("SELECT group_leader_id FROM group_leader WHERE user_id = ?", [userId], (error, results) => {
    if (error) {
        console.error('Error fetching group leader:', error);
        return res.status(500).json({ error: 'Failed to fetch group leader' });
    }

    if (results.length === 0) {
        return res.status(404).json({ error: 'Group leader not found' });
    }

    const groupLeaderResult = results[0];
    const group_leader_id = groupLeaderResult.group_leader_id;

    const query = `
      SELECT 
        cg.group_id, 
        cg.group_name, 
        cg.number_of_attendees, 
        cg.description, 
        c.camp_name, 
        c.price, 
        cg.payment_status 
      FROM camp_groups cg
      JOIN camps c ON cg.camp_id = c.camp_id
      WHERE cg.group_leader_id = ?
      AND cg.payment_status = 'Unpaid'
    `;
    connection.query(query, [group_leader_id], (error, results) => {
      if (error) {  
        console.error('Error fetching unpaid groups:', error);
        return res.status(500).send('Error fetching unpaid groups');
      }
      res.json(results);
    });
  });
});



//Apply new group
app.post('/group_leader/groups_apply/:user_id', (req, res) => {
  const { user_id } = req.params; // Get user_id from route params
  console.log(user_id);
  const { group_name, number_of_attendees, description, registration_fee_youth, registration_fee_adult } = req.body;

  // Retrieve the group_leader_id based on the user_id
  connection.query("SELECT group_leader_id FROM group_leader WHERE user_id = ?", [user_id], (error, results) => {
      if (error) {
          console.error('Error fetching group leader:', error);
          return res.status(500).json({ error: 'Failed to fetch group leader' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Group leader not found' });
      }

      const group_leader_id = results[0].group_leader_id;

      // Insert the new group application
      connection.query("INSERT INTO camp_groups (group_name, group_leader_id, number_of_attendees, description, group_status, registration_fee_youth, registration_fee_adult) VALUES (?, ?, ?, ?, 'Pending',?,?)",
          [group_name, group_leader_id, number_of_attendees, description, registration_fee_youth, registration_fee_adult], (error, results) => {
              if (error) {
                  console.error('Error applying for group:', error);
                  return res.status(500).json({ error: 'Failed to apply for group' });
              }

              res.status(200).json({ message: 'Group application submitted successfully' });
          });
  });
});


// Cancel a group application
app.put('/group_leader/groups/cancel/:id', (req, res) => {
  const { id } = req.params;

  // Update the group status to 'Inactive'
  connection.query("UPDATE camp_groups SET group_status = 'Inactive' WHERE group_id = ?", [id], (error, results) => {
      if (error) {
          console.error('Error cancelling application:', error);
          return res.status(500).json({ error: 'Failed to cancel application' });
      }

      res.status(200).json({ message: 'Application cancelled' });
  });
});

app.get('/group_leader/group_apply/get_camps_information', (req, res) => {
  connection.query('SELECT * FROM camps WHERE status="Approved"', (error, results) => {
    if (error) {
          console.error('Error fetching camps:', error);
          return res.status(500).json({ error: 'Failed to fetch camps' });
      }

      res.json(results);
  });
});

app.post('/group_leader/group_apply/:id', (req, res) => {
  const { id } = req.params;

  connection.query("SELECT group_leader_id FROM group_leader WHERE user_id = ?", [id], (error, results) => {
    if (error) {
        console.error('Error fetching group leader:', error);
        return res.status(500).json({ error: 'Failed to fetch group leader' });
    }

    if (results.length === 0) {
        return res.status(404).json({ error: 'Group leader not found' });
    }

    const group_leader_id = results[0].group_leader_id;
    const { group_name, number_of_attendees, description, group_status, camp_id } = req.body;

    const query = `INSERT INTO camp_groups (group_leader_id, camp_id, number_of_attendees, group_name, description, group_status)
                   VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(query, [group_leader_id, camp_id, number_of_attendees, group_name, description, group_status], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating group');
        }
        res.status(201).send({ group_id: results.insertId });
    });
  });
});


app.post('/groups/payments', (req, res) => {
  const { user_id, camp_id, amount, request_date, payment_date, payment_status, description } = req.body;

  const query = `INSERT INTO payment (user_id, camp_id, amount,request_date, payment_date, payment_status, description)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;


  connection.query(query, [user_id, camp_id, amount, request_date, payment_date, payment_status, description], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error creating payment');
      }
      res.status(201).send({ payment_id: results.insertId });
  });
});


  app.get('/group_leader/payments/:user_id', (req, res) => {
    const { user_id } = req.params;
    connection.query(`
    SELECT
    p.payment_id,
    p.amount,
    p.request_date,
    cg.group_name,
    cg.group_id,
    c.camp_id,
    c.camp_name,
    p.payment_status,
    p.description,
    p.pay_type
FROM
    payment p
JOIN
    camps c ON p.camp_id = c.camp_id
LEFT JOIN
    camp_groups cg ON p.camp_id = cg.camp_id
LEFT JOIN
    group_leader gl ON cg.group_leader_id = gl.group_leader_id
WHERE
    p.user_id = ?
GROUP BY
    p.payment_id,
    p.amount,
    p.request_date,
    cg.group_name,
    cg.group_id,
    c.camp_id,
    c.camp_name,
    p.payment_status,
    p.description,
    p.pay_type
ORDER BY
    p.request_date DESC;


      `, [user_id], (error, results) => {
        if (error) {
            console.error('Error fetching unpaid camps:', error);
            return res.status(500).json({ error: 'Failed to fetch unpaid camps' });
        }
        if (results.length === 0) {
          console.log(`No payment found for user_id: ${user_id}`);
        } else {
          console.log(`Fetched ${results.length} payment for user_id: ${user_id}`);
        }
        res.json(results);
    });
  });


app.post('/groups/card_payment', (req, res) => {
  const { user_id, card_number, expiry_date, cvv, cardholder_name, group_id, payment_id} = req.body;

  const insertCardQuery = `INSERT INTO card (user_id, card_number, expiry_date, cvv, cardholder_name)
                           VALUES (?, ?, ?, ?, ?)`;

  connection.query(insertCardQuery, [user_id, card_number, expiry_date, cvv, cardholder_name], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error storing card details');
      }

      // After storing card details, update the group's payment status to 'Paid'
      const updateGroupStatusQuery = `UPDATE camp_groups SET payment_status = 'Paid' WHERE group_id = ?`;
      connection.query(updateGroupStatusQuery, [group_id], (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error updating group payment status');
          }

          // Update payment status only after successful group status update

          const updatePaymentStatusQuery = `UPDATE payment SET payment_status = 'Paid', payment_date = CURDATE(), pay_type = 'Card' WHERE payment_id = ?`;
          connection.query(updatePaymentStatusQuery, [payment_id], (err, results) => {
              console.log('Payment status updated');
            if (err) {
                  console.error(err);
                  return res.status(500).send('Error updating payment status');
              }

              res.status(201).send({ message: 'Payment successful and all statuses updated' });
          });
      });
  });
});
app.put('/groups/bank_info/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  const { pay_type } = req.body;
  const query = 'UPDATE payment SET pay_type = ? WHERE payment_id = ?';
  connection.query(query, [pay_type, paymentId], (err, results) => {
    if (err) {
      console.error('Error updating payment:', err);
      res.status(500).send('Error updating payment');
    } else {
      res.send('Payment updated successfully');
    }
  }
  );
}
);


//admin manage teams
app.get('/group_leader/groups/:group_id', (req, res) => {
  const group_id = req.params.group_id;
  const query = 'SELECT * FROM camp_groups WHERE group_id = ?';
  connection.query(query, [group_id], (err, result) => {
      if (err) throw err;
      res.send(result[0]);
  });
});

// Fetch group members (adult leaders and youth campers) from camp_registrations
app.get('/group_leader/groups/members/:group_id', (req, res) => {
  const group_id = req.params.group_id;

  const queryLeaders = `
      SELECT al.*, cr.camp_id
      FROM adult_leader al
      JOIN camp_registrations cr ON al.user_id = cr.user_id
      LEFT JOIN camp_teams ct ON al.adult_leader_id = ct.adult_leader_id
      WHERE cr.group_id = ? AND cr.camper_type = 'Adult Leader'
      AND ct.adult_leader_id IS NULL
  `;

  const queryCampers = `
      SELECT y.*, cr.camp_id
      FROM youth y
      JOIN camp_registrations cr ON y.user_id = cr.user_id
      LEFT JOIN team_members tm ON y.camper_id = tm.camper_id
      WHERE cr.group_id = ? AND cr.camper_type = 'Youth'
      AND tm.camper_id IS NULL
  `;

  connection.query(queryLeaders, [group_id], (err, leaders) => {
      if (err) {
          console.error('Error fetching group members (leaders):', err);
          return res.status(500).send('Error fetching group members (leaders)');
      }

      connection.query(queryCampers, [group_id], (err, campers) => {
          if (err) {
              console.error('Error fetching group members (campers):', err);
              return res.status(500).send('Error fetching group members (campers)');
          }

          res.send({ adultLeaders: leaders, youthCampers: campers });
      });
  });
});


// Fetch teams and their members
app.get('/group_leader/teams/:group_id', (req, res) => {
  const group_id = req.params.group_id;

  const queryTeams = `
      SELECT t.*, al.first_name AS leader_first_name, al.last_name AS leader_last_name
      FROM camp_teams t
      LEFT JOIN adult_leader al ON t.adult_leader_id = al.adult_leader_id
      WHERE t.group_id = ?
  `;

  const queryMembers = `
      SELECT tm.team_id, y.first_name, y.last_name, y.camper_id
      FROM team_members tm
      JOIN youth y ON tm.camper_id = y.camper_id
      WHERE tm.team_id IN (SELECT team_id FROM camp_teams WHERE group_id = ?)
  `;

  connection.query(queryTeams, [group_id], (err, teams) => {
      if (err) throw err;

      connection.query(queryMembers, [group_id], (err, members) => {
          if (err) throw err;

          const teamMap = {};
          teams.forEach(team => {
              teamMap[team.team_id] = {
                  ...team,
                  members: []
              };
          });

          members.forEach(member => {
              if (teamMap[member.team_id]) {
                  teamMap[member.team_id].members.push(member);
              }
          });

          res.send(Object.values(teamMap));
      });
  });
});

// Create a new team
app.post('/group_leader/teams', (req, res) => {
  const { group_id, team_name, adult_leader_id } = req.body;
  const query = 'INSERT INTO camp_teams (group_id, team_name, adult_leader_id) VALUES (?, ?, ?)';
  connection.query(query, [group_id, team_name, adult_leader_id], (err, result) => {
      if (err) throw err;
      const team_id = result.insertId;

      res.send({ id: team_id, team_name, adult_leader_id });
  });
});

// Add a camper to a specific team
app.post('/group_leader/teams/add_camper', (req, res) => {
  const { team_id, camper_id } = req.body;
  const query = 'INSERT INTO team_members (team_id, camper_id) VALUES (?, ?)';
  connection.query(query, [team_id, camper_id], (err, result) => {
      if (err) throw err;
      res.send('Camper added to team successfully');
  });
});

// Update a leader for a team
app.put('/group_leader/teams/remove_leader/:team_id/:leader_id', (req, res) => {
  const { team_id, leader_id } = req.params;
  
  const updateTeamQuery = 'UPDATE camp_teams SET adult_leader_id = NULL WHERE team_id = ? AND adult_leader_id = ?';
  connection.query(updateTeamQuery, [team_id, leader_id], (err, result) => {
      if (err) {
          console.error('Error removing leader from team:', err);
          return res.status(500).send('Error removing leader from team');
      }
      res.send('Leader removed from team successfully');
  });
});

// Remove a camper from a team
app.delete('/group_leader/teams/remove_camper/:team_id/:camper_id', (req, res) => {
  const { team_id, camper_id } = req.params;
  const query = 'DELETE FROM team_members WHERE team_id = ? AND camper_id = ?';
  connection.query(query, [team_id, camper_id], (err, result) => {
      if (err) {
          console.error('Error removing camper from team:', err);
          return res.status(500).send('Error removing camper from team');
      }
      res.send('Camper removed from team successfully');
  });
});

// Assign accommodation to a leader
app.post('/group_leader/teams/assign_accommodation/leader', (req, res) => {
  const { team_id, leader_id, camp_id } = req.body;

  // Get user_id from leader_id
  const getUserIdQuery = 'SELECT user_id FROM adult_leader WHERE adult_leader_id = ?';

  connection.query(getUserIdQuery, [leader_id], (err, userIdResults) => {
      if (err) throw err;

      const user_id = userIdResults[0].user_id;

      // Check if the leader already has an accommodation assigned
      const checkAssignmentQuery = `
          SELECT * FROM accommodation_assignments 
          WHERE user_id = ? AND camp_id = ?
      `;

      connection.query(checkAssignmentQuery, [user_id, camp_id], (err, checkResults) => {
          if (err) throw err;

          if (checkResults.length > 0) {
              return res.status(400).send('Leader already has an accommodation assigned');
          }

          // Get available cabin for the leader
          const getCabinQuery = `
              SELECT accommodation_id 
              FROM accommodations 
              WHERE type = 'Cabin' AND status = 'Active' AND capacity = 1 
              LIMIT 1
          `;

          connection.query(getCabinQuery, (err, results) => {
              if (err) throw err;

              if (results.length === 0) {
                  return res.status(400).send('No available cabins');
              }

              const accommodation_id = results[0].accommodation_id;

              // Assign cabin to leader
              const assignAccommodationQuery = `
                  INSERT INTO accommodation_assignments (accommodation_id, user_id, camp_id) 
                  VALUES (?, ?, ?)
              `;

              connection.query(assignAccommodationQuery, [accommodation_id, user_id, camp_id], (err, result) => {
                  if (err) throw err;

                  // Update the status of the accommodation to 'Inactive'
                  const updateAccommodationStatusQuery = `
                      UPDATE accommodations 
                      SET status = 'Inactive' 
                      WHERE accommodation_id = ?
                  `;

                  connection.query(updateAccommodationStatusQuery, [accommodation_id], (err, updateResult) => {
                      if (err) throw err;
                      res.send('Leader accommodation assigned successfully');
                  });
              });
          });
      });
  });
});


// Assign accommodation to a camper
app.post('/group_leader/teams/assign_accommodation/camper', (req, res) => {
  const { team_id, camper_id, camp_id } = req.body;

  // Get user_id from camper_id
  const getUserIdQuery = 'SELECT user_id FROM youth WHERE camper_id = ?';

  connection.query(getUserIdQuery, [camper_id], (err, userIdResults) => {
      if (err) throw err;

      const user_id = userIdResults[0].user_id;

      // Check if the camper already has an accommodation assigned
      const checkAssignmentQuery = `
          SELECT * FROM accommodation_assignments 
          WHERE user_id = ? AND camp_id = ?
      `;

      connection.query(checkAssignmentQuery, [user_id, camp_id], (err, checkResults) => {
          if (err) throw err;

          if (checkResults.length > 0) {
              return res.status(400).send('Camper already has an accommodation assigned');
          }

          // Get available tent for the camper with less than 5 occupants
          const getTentQuery = `
              SELECT accommodation_id 
              FROM accommodations 
              WHERE type = 'Tent' AND status = 'Active' AND capacity > current_occupancy
              ORDER BY current_occupancy ASC 
              LIMIT 1
          `;

          connection.query(getTentQuery, (err, results) => {
              if (err) throw err;

              if (results.length === 0) {
                  return res.status(400).send('No available tents');
              }

              const accommodation_id = results[0].accommodation_id;

              // Assign tent to camper and update the current occupancy
              const assignAccommodationQuery = `
                  INSERT INTO accommodation_assignments (accommodation_id, user_id, camp_id) 
                  VALUES (?, ?, ?)
              `;

              connection.query(assignAccommodationQuery, [accommodation_id, user_id, camp_id], (err, result) => {
                  if (err) throw err;

                  const updateOccupancyQuery = `
                      UPDATE accommodations 
                      SET current_occupancy = current_occupancy + 1 
                      WHERE accommodation_id = ?
                  `;

                  connection.query(updateOccupancyQuery, [accommodation_id], (err, updateResult) => {
                      if (err) throw err;
                      res.send('Camper accommodation assigned successfully');
                  });
              });
          });
      });
  });
});








//Youth Camper Functions
//Fetch all camps with active groups
app.get('/youth_register_camps/camps', (req, res) => {
  connection.query(`
    SELECT 
      camps.camp_id,
      camps.camp_name,
      camps.location,
      camps.start_date,
      camps.end_date,
      camps.capacity,
      camps.schedule,
      camps.description AS camp_description,
      camps.status AS camp_status,
      camp_groups.group_id,
      camp_groups.group_leader_id,
      camp_groups.number_of_attendees,
      camp_groups.group_name,
      camp_groups.description AS group_description,
      camp_groups.registration_fee_youth AS price,
      camp_groups.group_status,
      camp_groups.payment_status
    FROM 
      camps
    INNER JOIN 
      camp_groups ON camps.camp_id = camp_groups.camp_id
    WHERE 
      camp_groups.group_status = 'Active';
  `, (error, results) => {
      if (error) {
          console.error('Error fetching camps:', error);
          return res.status(500).json({ error: 'Failed to fetch camps' });
      }

      res.json(results);
  });
});
app.get('/youth_campers/camp_details/:camp_id', (req, res) => {
  const { camp_id } = req.params;
  connection.query(`
  SELECT 
  camps.camp_id,
  camps.camp_name,
  camps.location,
  camps.start_date,
  camps.end_date,
  camps.capacity,
  camps.schedule,
  camps.description AS camp_description,
  camps.status AS camp_status,
  camp_groups.group_id,
  camp_groups.group_leader_id,
  group_leader.first_name AS first_name,
  group_leader.last_name AS last_name,
  camp_groups.number_of_attendees,
  camp_groups.group_name,
  camp_groups.description AS group_description,
  camp_groups.registration_fee_youth AS price,
  camp_groups.group_status,
  camp_groups.payment_status,
  (camp_groups.number_of_attendees - COALESCE((
      SELECT COUNT(camp_registrations.registration_id)
      FROM camp_registrations
      WHERE camp_registrations.group_id = camp_groups.group_id
      AND camp_registrations.status = 'Registered'
  ), 0)) AS available_spots
FROM 
  camps
INNER JOIN 
  camp_groups ON camps.camp_id = camp_groups.camp_id
INNER JOIN
  group_leader ON camp_groups.group_leader_id = group_leader.group_leader_id
WHERE 
  camps.camp_id = ?;

  `, [camp_id], (error, results) => {
      if (error) {
          console.error('Error fetching camp:', error);
          return res.status(500).json({ error: 'Failed to fetch camp' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Camp not found' });
      }

      res.json(results[0]);
  });
}
);


app.get('/adult_register_camps/camps', (req, res) => {
  connection.query(`
    SELECT 
      camps.camp_id,
      camps.camp_name,
      camps.location,
      camps.start_date,
      camps.end_date,
      camps.capacity,
      camps.schedule,
      camps.description AS camp_description,
      camps.status AS camp_status,
      camp_groups.group_id,
      camp_groups.group_leader_id,
      camp_groups.number_of_attendees,
      camp_groups.group_name,
      camp_groups.description AS group_description,
      camp_groups.registration_fee_adult AS price,
      camp_groups.group_status,
      camp_groups.payment_status
    FROM 
      camps
    INNER JOIN 
      camp_groups ON camps.camp_id = camp_groups.camp_id
    WHERE 
      camp_groups.group_status = 'Active';
  `, (error, results) => {
      if (error) {
          console.error('Error fetching camps:', error);
          return res.status(500).json({ error: 'Failed to fetch camps' });
      }

      res.json(results);
  });
});


// app.get('/campers/unpaid_camps/:user_id', (req, res) => {
//   const { user_id } = req.params;
  
//   // Define the SQL query
//   const query = `
//     SELECT camps.camp_name, payment.amount, payment.request_date, payment.payment_id, camp_registrations.registration_id
//     FROM camp_registrations
//     JOIN payment ON camp_registrations.camp_id = payment.camp_id
//       AND camp_registrations.user_id = payment.user_id
//     JOIN camps ON camp_registrations.camp_id = camps.camp_id
//     WHERE camp_registrations.user_id = ?
//       AND camp_registrations.status = 'Unpaid'
//       AND payment.payment_status = 'Unpaid'
//       AND payment.pay_type = 'Card';
//   `;

//   // Execute the query
//   connection.query(query, [user_id], (error, results) => {
//     if (error) {
//       console.error('Error fetching unpaid camps:', error);
//       return res.status(500).json({ error: 'Failed to fetch unpaid camps' });
//     }

//     // Log results and respond
//     if (results.length === 0) {
//       console.log(`No unpaid camps found for user_id: ${user_id}`);
//     } else {
//       console.log(`Fetched ${results.length} unpaid camps for user_id: ${user_id}`);
//     }

//     // Send the results as JSON response
//     res.json(results);
//   });
// });

app.get('/campers/unpaid_camps/:user_id', (req, res) => {
  const { user_id } = req.params;
  
  // Define the SQL query
  const query = `
    SELECT payment.amount, payment.request_date, payment.payment_id, payment.description
    FROM payment
    WHERE payment.user_id = ?
      AND payment.payment_status = 'Unpaid'
      AND payment.pay_type = 'Card';
  `;
  connection.query(query, [user_id], (error, results) => {
        if (error) {
          console.error('Error fetching unpaid camps:', error);
          return res.status(500).json({ error: 'Failed to fetch unpaid camps' });
        }
        // Send the results as JSON response
        res.json(results);
      });
    });


// Fetch unpaid bank transfer camps registration for camper to show on the dashboard
app.get('/campers/unpaid_camps_bank/:user_id', (req, res) => {
  const { user_id } = req.params;
  
  const query = `
  SELECT payment.user_id, payment.amount, payment.request_date, payment.payment_id, payment.description
  FROM payment
  WHERE payment.user_id = ?
    AND payment.payment_status = 'Unpaid'
    AND payment.pay_type = 'Bank';
  `;

  connection.query(query, [user_id], (error, results) => {

    if (error) {
      console.error('Error fetching unpaid camps:', error);
      return res.status(500).json({ error: 'Failed to fetch unpaid camps' });
    }
    res.json(results);
  });
});

//Get all registered camps for a camper
app.get("/campers/registered_camps/:user_id", (req, res) => {
  const { user_id } = req.params;
  connection.query(`
  SELECT camps.camp_name, camps.start_date, camps.end_date, camps.capacity,
  camps.schedule, camps.description, camp_groups.description AS group_description, camp_groups.group_name, camp_registrations.registration_id, camp_registrations.status
  FROM camp_registrations
  JOIN camp_groups ON camp_registrations.group_id = camp_groups.group_id
  JOIN camps ON camp_groups.camp_id = camps.camp_id
  WHERE camp_registrations.user_id = ?
  AND camp_registrations.status = 'Registered';
  `, [user_id], (error, results) => {
    if (error) {
      console.error('Error fetching registered camps:', error);
      return res.status(500).json({ error: 'Failed to fetch registered camps' });
    }
    console.log(`Fetched ${results.length} registered camps for user_id: ${user_id}`);
    res.json(results);
  });
}
);


//Fetch camp details
app.get('/adult_leader/camp_details/:camp_id', (req, res) => {
  const { camp_id } = req.params;
  connection.query(`
  SELECT 
  camps.camp_id,
  camps.camp_name,
  camps.location,
  camps.start_date,
  camps.end_date,
  camps.capacity,
  camps.schedule,
  camps.description AS camp_description,
  camps.status AS camp_status,
  camp_groups.group_id,
  camp_groups.group_leader_id,
  group_leader.first_name AS first_name,
  group_leader.last_name AS last_name,
  camp_groups.number_of_attendees,
  camp_groups.group_name,
  camp_groups.description AS group_description,
  camp_groups.registration_fee_adult AS price,
  camp_groups.group_status,
  camp_groups.payment_status,
  (camp_groups.number_of_attendees - COALESCE((
      SELECT COUNT(camp_registrations.registration_id)
      FROM camp_registrations
      WHERE camp_registrations.group_id = camp_groups.group_id
      AND camp_registrations.status = 'Registered'
  ), 0)) AS available_spots
FROM 
  camps
INNER JOIN 
  camp_groups ON camps.camp_id = camp_groups.camp_id
INNER JOIN
  group_leader ON camp_groups.group_leader_id = group_leader.group_leader_id
WHERE 
  camps.camp_id = ?;

  `, [camp_id], (error, results) => {
      if (error) {
          console.error('Error fetching camp:', error);
          return res.status(500).json({ error: 'Failed to fetch camp' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Camp not found' });
      }

      res.json(results[0]);
  });
}
);

//Register for a camp
app.post('/camper/camp_register/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { group_id, camp_id, camper_type, status } = req.body;
  const registration_date = new Date().toISOString().split('T')[0];

  const checkQuery = `SELECT * FROM camp_registrations WHERE user_id = ? AND camp_id = ?`;
  const insertQuery = `INSERT INTO camp_registrations (user_id, group_id, camp_id, camper_type, registration_date, status)
                       VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(checkQuery, [user_id, camp_id], (error, results) => {
    if (error) {
      console.error('Error checking existing registration:', error);
      return res.status(500).json({ error: 'Failed to check existing registration' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'User is already registered for this camp', alreadyRegistered: true });
    }

    connection.query(insertQuery, [user_id, group_id, camp_id, camper_type, registration_date, status], (error, results) => {
      if (error) {
        console.error('Error registering for camp:', error);
        return res.status(500).json({ error: 'Failed to register for camp' });
      }

      res.status(201).json({ message: 'Registered for camp successfully', registration_id: results.insertId });
    });
  });
});


//Discount
app.get('/camp/discount/:camp_id', (req, res) => {
  const { camp_id } = req.params;
  const query = `
    SELECT discount_percentage 
    FROM discount 
    WHERE camp_id = ? AND discount_type = 'Early bird'
  `;

  connection.query(query, [camp_id], (error, results) => {
      if (error) {
          console.error('Error fetching discount:', error);
          return res.status(500).json({ error: 'Failed to fetch discount' });
      }
      res.json(results[0]);
  });
}
);

//Pay for a camp
app.post('/campers/payment', (req, res) => {
  const { user_id, camp_id, amount, request_date, payment_date, payment_status, pay_type, description } = req.body;
  console.log(user_id, camp_id, amount, request_date, payment_date, payment_status, pay_type, description)
  const query = `INSERT INTO payment (user_id, camp_id, amount,request_date, payment_date, payment_status, pay_type, description)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;


  connection.query(query, [user_id, camp_id, amount, request_date, payment_date, payment_status, pay_type, description], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error creating payment');
      }
      res.status(201).send({ payment_id: results.insertId });
  });
});

app.post('/campers/card_payment', (req, res) => {
  const { user_id, card_number, expiry_date, cvv, cardholder_name,payment_id, group_id, registration_id} = req.body;

  const insertCardQuery = `INSERT INTO card (user_id, card_number, expiry_date, cvv, cardholder_name)
                           VALUES (?, ?, ?, ?, ?)`;

  connection.query(insertCardQuery, [user_id, card_number, expiry_date, cvv, cardholder_name], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error storing card details');
      }

      // After storing card details, update the group's payment status to 'Paid'
      const updateGroupStatusQuery = `UPDATE camp_registrations SET status = 'Registered' WHERE registration_id = ?`;
      connection.query(updateGroupStatusQuery, [registration_id], (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error updating group payment status');
          }

          // Update payment status only after successful group status update
          const updatePaymentStatusQuery = `UPDATE payment SET payment_status = 'Paid', payment_date = CURDATE() WHERE payment_id = ?`;
          connection.query(updatePaymentStatusQuery, [payment_id], (err, results) => {
              if (err) {
                  console.error(err);
                  return res.status(500).send('Error updating payment status');
              }

              res.status(201).send({ message: 'Payment successful and all statuses updated' });
          });
      });
  });
});


  //Fetch card camps registration for camper to show on the dashboard
  app.get('/campers/camp_payments/:user_id', (req, res) => {
    const { user_id } = req.params;
    connection.query(`
    SELECT camps.camp_name, payment.amount, payment.payment_status, payment.pay_type, payment.request_date, payment.payment_id, payment.description, camp_registrations.registration_id, camp_groups.group_id, camp_groups.group_name
    FROM camp_registrations
    JOIN payment ON camp_registrations.camp_id = payment.camp_id
        AND camp_registrations.user_id = payment.user_id
    JOIN camps ON camp_registrations.camp_id = camps.camp_id
    JOIN camp_groups ON camp_registrations.group_id = camp_groups.group_id
    WHERE camp_registrations.user_id = ?
      AND payment.description LIKE '%Camp%';
      `, [user_id], (error, results) => {
        if (error) {
            console.error('Error fetching unpaid camps:', error);
            return res.status(500).json({ error: 'Failed to fetch unpaid camps' });
        }
        if (results.length === 0) {
          console.log(`No payment found for user_id: ${user_id}`);
        } else {
          console.log(`Fetched ${results.length} payment for user_id: ${user_id}`);
        }
        res.json(results);
    });
  });






 
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });




