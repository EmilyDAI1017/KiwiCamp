const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Mock the database connection
const mockConnection = {
  query: jest.fn(),
};

// Mock the bcrypt compare function
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const getUserQuery = 'SELECT * FROM users WHERE username = ?';

  mockConnection.query(getUserQuery, [username], async (err, result) => {
    if (err) {
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

    res.status(200).json({
      message: 'Login successful',
      token,
      user_id: user.user_id,
      role: user.role,
    });
  });
});

describe('POST /login', () => {
  it('should return 404 if user not found', async () => {
    mockConnection.query.mockImplementation((query, values, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'nonexistent', password: 'password123' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should return 401 if password is incorrect', async () => {
    const mockUser = { user_id: 1, username: 'testuser', password_hash: 'hashedpassword' };
    mockConnection.query.mockImplementation((query, values, callback) => {
      callback(null, [mockUser]);
    });

    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect password');
  });

//   it('should return 200 and a token if login is successful', async () => {
//     const mockUser = { user_id: 1, username: 'testuser', password_hash: 'hashedpassword' };
//     mockConnection.query.mockImplementation((query, values, callback) => {
//       callback(null, [mockUser]);
//     });

//     bcrypt.compare.mockResolvedValue(true);

//     const response = await request(app)
//       .post('/login')
//       .send({ username: 'testuser', password: 'password123' });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('token');
//     expect(response.body.message).toBe('Login successful');
//   });

  it('should return 500 if there is a database error', async () => {
    mockConnection.query.mockImplementation((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
