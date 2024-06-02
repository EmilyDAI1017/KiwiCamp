const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('mysql');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.json());

const connection = {
  query: jest.fn(),
};

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
});

describe('GET /youth_camper_dashboard/:id', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return youth and health records for a valid user ID', async () => {
    connection.query.mockImplementation((query, values, callback) => {
      if (query.includes('youth')) {
        callback(null, [{ user_id: values[0], first_name: 'Test', last_name: 'User' }]);
      } else if (query.includes('health_record')) {
        callback(null, [{ user_id: values[0], medical_condition: 'None' }]);
      }
    });

    const response = await request(app).get('/youth_camper_dashboard/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      youth: { user_id: "1", first_name: 'Test', last_name: 'User' },
      health: { user_id: "1", medical_condition: 'None' }
    });
  });

  it('should return 404 if youth not found', async () => {
    connection.query.mockImplementation((query, values, callback) => {
      if (query.includes('youth')) {
        callback(null, []);
      }
    });

    const response = await request(app).get('/youth_camper_dashboard/1');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Youth not found');
  });
});