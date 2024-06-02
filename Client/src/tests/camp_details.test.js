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

app.get('/youth/camp_details/:user_id', (req, res) => {
    const { user_id } = req.params;
    const campDetailsQuery = `
        SELECT c.camp_id, c.camp_name, c.location, c.start_date, c.end_date, c.description, c.schedule
        FROM camps c
        JOIN camp_registrations cr ON c.camp_id = cr.camp_id
        WHERE cr.user_id = ? AND cr.status = 'Registered'
    `;
    const activitiesQuery = `
        SELECT a.activity_id, a.name, a.duration, a.description, a.cost, a.capacity
        FROM activity a
        JOIN camp_activities ca ON a.activity_id = ca.activity_id
        WHERE ca.camp_id = ?
    `;

    connection.query(campDetailsQuery, [user_id], (campErr, campResults) => {
        if (campErr) {
            console.error('Error fetching camp details:', campErr);
            res.status(500).send('Error fetching camp details');
            return;
        }

        if (campResults.length === 0) {
            res.status(404).send('No camp registration found for this camper');
            return;
        }

        const campDetails = campResults[0];

        connection.query(activitiesQuery, [campDetails.camp_id], (activityErr, activityResults) => {
            if (activityErr) {
                console.error('Error fetching activities:', activityErr);
                res.status(500).send('Error fetching activities');
                return;
            }

            res.json({ campDetails, activities: activityResults });
        });
    });
});

describe('GET /youth/camp_details/:user_id', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return camp details and activities for a valid user ID', async () => {
        const campDetails = {
            camp_id: 1,
            camp_name: 'Summer Camp',
            location: 'Mountain View',
            start_date: '2024-06-01',
            end_date: '2024-06-10',
            description: 'A fun summer camp for youth',
            schedule: '9 AM - 5 PM'
        };

        const activities = [
            { activity_id: 1, name: 'Hiking', duration: '2 hours', description: 'A scenic hike', cost: 10, capacity: 20 },
            { activity_id: 2, name: 'Swimming', duration: '1 hour', description: 'Swimming in the lake', cost: 5, capacity: 15 }
        ];

        connection.query
            .mockImplementationOnce((query, values, callback) => {
                callback(null, [campDetails]);
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(null, activities);
            });

        const response = await request(app).get('/youth/camp_details/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ campDetails, activities });
    });

    it('should return 404 if no camp registration found for the user', async () => {
        connection.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });

        const response = await request(app).get('/youth/camp_details/1');

        expect(response.status).toBe(404);
        expect(response.text).toBe('No camp registration found for this camper');
    });

    it('should return 500 if there is an error fetching camp details', async () => {
        connection.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'));
        });

        const response = await request(app).get('/youth/camp_details/1');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error fetching camp details');
    });

    it('should return 500 if there is an error fetching activities', async () => {
        const campDetails = {
            camp_id: 1,
            camp_name: 'Summer Camp',
            location: 'Mountain View',
            start_date: '2024-06-01',
            end_date: '2024-06-10',
            description: 'A fun summer camp for youth',
            schedule: '9 AM - 5 PM'
        };

        connection.query
            .mockImplementationOnce((query, values, callback) => {
                callback(null, [campDetails]);
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(new Error('Database error'));
            });

        const response = await request(app).get('/youth/camp_details/1');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error fetching activities');
    });
});
