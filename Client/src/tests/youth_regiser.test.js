const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const app = express();

jest.mock('mysql');
jest.mock('bcrypt');

app.use(bodyParser.json());

const connection = {
  query: jest.fn(),
};


app.post('/register/youth_camper', async (req, res) => {
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, 10);
  const salt = 'randomSalt'; // Mocked salt
  
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
    };

    const insertUserQuery = 'INSERT INTO users SET ?';
    connection.query(insertUserQuery, userData, (err, result) => {
      if (err) {
        console.error('Error inserting user into database: ' + err.stack);
        return res.status(500).json({ message: 'Internal server error' });
      }

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
      };

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

        let health_record_info = {
          user_id: result.insertId,
          medical_condition: req.body.medical_condition,
          allergies_information: req.body.allergies_information,
          dietary_requirement: req.body.dietary_requirement,
          last_updated_date: currentDate
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

describe('POST /register/youth_camper', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    bcrypt.hash.mockResolvedValue('hashedPassword');
    connection.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT')) {
        callback(null, []);
      } else if (query.includes('INSERT')) {
        callback(null, { insertId: 1 });
      } else {
        callback(null);
      }
    });
  });

  it('should register a new youth camper successfully', async () => {
    const response = await request(app)
      .post('/register/youth_camper')
      .send({
        username: 'testuser',
        password: 'testpass',
        role: 'camper',
        email: 'testuser@example.com',
        first_name: 'Test',
        last_name: 'User',
        phone_num: '1234567890',
        gender: 'M',
        dob: '2000-01-01',
        parent_guardian_name: 'Parent',
        parent_guardian_phone: '0987654321',
        parent_guardian_email: 'parent@example.com',
        relationship_to_camper: 'Parent',
        activity_preferences: 'Swimming',
        medical_condition: 'None',
        allergies_information: 'None',
        dietary_requirement: 'None'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });

  

});