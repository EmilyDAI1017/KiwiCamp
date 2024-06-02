const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

jest.mock('mysql');

app.use(bodyParser.json());

const connection = {
    query: jest.fn(),
};

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

describe('GET /admin/camps', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should fetch all camps successfully', async () => {
        const mockResults = [
            { camp_id: 1, camp_name: 'Summer Camp', location: 'Mountain View', start_date: '2024-06-01', end_date: '2024-06-10', description: 'A fun summer camp for youth', schedule: '9 AM - 5 PM' },
            { camp_id: 2, camp_name: 'Winter Camp', location: 'Snowy Peaks', start_date: '2024-12-15', end_date: '2024-12-22', description: 'A winter wonderland adventure', schedule: '10 AM - 4 PM' },
        ];

        connection.query.mockImplementation((query, callback) => {
            callback(null, mockResults);
        });

        const response = await request(app).get('/admin/camps');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockResults);
    });

    it('should return 500 if there is an error fetching camps', async () => {
        connection.query.mockImplementation((query, callback) => {
            callback(new Error('Database error'));
        });

        const response = await request(app).get('/admin/camps');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error fetching camps');
    });
});
