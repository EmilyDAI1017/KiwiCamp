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

app.post('/youth/register_activities/:user_id', (req, res) => {
    const { user_id } = req.params;
    const { activity_ids, total_cost } = req.body;
    const registrationDate = new Date().toISOString().split('T')[0];

    const checkQuery = `
        SELECT activity_id FROM activity_registrations
        WHERE user_id = ? AND activity_id IN (?)
    `;

    connection.query(checkQuery, [user_id, activity_ids], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Error checking existing registrations:', checkErr);
            res.status(500).send('Error checking existing registrations');
            return;
        }

        const alreadyRegisteredActivityIds = checkResults.map(result => result.activity_id);
        const newActivityIds = activity_ids.filter(activity_id => !alreadyRegisteredActivityIds.includes(activity_id));

        if (newActivityIds.length === 0) {
            res.status(400).send('All selected activities are already registered');
            return;
        }

        const insertQuery = `
            INSERT INTO activity_registrations (activity_id, user_id, status, registration_date)
            VALUES ?
        `;
        const values = newActivityIds.map(activity_id => [activity_id, user_id, 'Registered', registrationDate]);

        connection.query(insertQuery, [values], (insertErr, insertResults) => {
            if (insertErr) {
                console.error('Error registering activities:', insertErr);
                res.status(500).send('Error registering activities');
                return;
            }

            res.status(201).send('Activities registered successfully');
        });
    });
});

describe('POST /youth/register_activities/:user_id', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should register new activities for the user', async () => {
        connection.query
            .mockImplementationOnce((query, values, callback) => {
                callback(null, []); // No existing registrations
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(null, { affectedRows: 2 }); // Successful insertion
            });

        const response = await request(app)
            .post('/youth/register_activities/1')
            .send({
                activity_ids: [1, 2],
                total_cost: 30
            });

        expect(response.status).toBe(201);
        expect(response.text).toBe('Activities registered successfully');
    });

    it('should return 400 if all selected activities are already registered', async () => {
        connection.query.mockImplementationOnce((query, values, callback) => {
            callback(null, [{ activity_id: 1 }, { activity_id: 2 }]); // All activities already registered
        });

        const response = await request(app)
            .post('/youth/register_activities/1')
            .send({
                activity_ids: [1, 2],
                total_cost: 30
            });

        expect(response.status).toBe(400);
        expect(response.text).toBe('All selected activities are already registered');
    });

    it('should return 500 if there is an error checking existing registrations', async () => {
        connection.query.mockImplementationOnce((query, values, callback) => {
            callback(new Error('Database error'));
        });

        const response = await request(app)
            .post('/youth/register_activities/1')
            .send({
                activity_ids: [1, 2],
                total_cost: 30
            });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error checking existing registrations');
    });

    it('should return 500 if there is an error registering activities', async () => {
        connection.query
            .mockImplementationOnce((query, values, callback) => {
                callback(null, []); // No existing registrations
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(new Error('Database error'));
            });

        const response = await request(app)
            .post('/youth/register_activities/1')
            .send({
                activity_ids: [1, 2],
                total_cost: 30
            });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error registering activities');
    });
});
