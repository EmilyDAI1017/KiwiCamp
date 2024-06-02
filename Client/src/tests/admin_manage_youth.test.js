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

app.post('/admin/manage_groups', (req, res) => {
    const { group_leader_id, camp_id, number_of_attendees, group_name, description, group_status, payment_status, registration_fee_youth, registration_fee_adult } = req.body;
    const query = 'INSERT INTO camp_groups (group_leader_id, camp_id, number_of_attendees, group_name, description, group_status,  payment_status, registration_fee_youth, registration_fee_adult) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [group_leader_id, camp_id, number_of_attendees, group_name, description, group_status, payment_status, registration_fee_youth, registration_fee_adult], (err, results) => {
        if (err) {
            console.error('Error adding group:', err);
            res.status(500).send('Error adding group');
        } else {
            res.status(201).send('Group added successfully');
        }
    });
});

app.put('/admin/manage_groups/:id', (req, res) => {
    const { id } = req.params;
    const { group_leader_id, camp_id, number_of_attendees, group_name, description, payment_status, group_status, registration_fee_youth, registration_fee_adult } = req.body;
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

describe('Group Management API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should add a new group', async () => {
        connection.query.mockImplementation((query, values, callback) => {
            callback(null, { insertId: 1 });
        });

        const response = await request(app)
            .post('/admin/manage_groups')
            .send({
                group_leader_id: 1,
                camp_id: 2,
                number_of_attendees: 30,
                group_name: 'Test Group',
                description: 'A test group',
                group_status: 'active',
                payment_status: 'paid',
                registration_fee_youth: 100,
                registration_fee_adult: 200
            });

        expect(response.status).toBe(201);
        expect(response.text).toBe('Group added successfully');
    });

    test('should update a group', async () => {
        connection.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app)
            .put('/admin/manage_groups/1')
            .send({
                group_leader_id: 1,
                camp_id: 2,
                number_of_attendees: 30,
                group_name: 'Updated Group',
                description: 'An updated test group',
                payment_status: 'paid',
                group_status: 'active',
                registration_fee_youth: 150,
                registration_fee_adult: 250
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Group updated successfully');
    });

    test('should delete a group', async () => {
        connection.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app)
            .delete('/admin/manage_groups/1');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Group deleted successfully');
    });

    test('should return error when adding a group fails', async () => {
        connection.query.mockImplementation((query, values, callback) => {
            callback(new Error('DB Error'), null);
        });

        const response = await request(app)
            .post('/admin/manage_groups')
            .send({
                group_leader_id: 1,
                camp_id: 2,
                number_of_attendees: 30,
                group_name: 'Test Group',
                description: 'A test group',
                group_status: 'active',
                payment_status: 'paid',
                registration_fee_youth: 100,
                registration_fee_adult: 200
            });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error adding group');
    });

    test('should return error when updating a group fails', async () => {
        connection.query.mockImplementation((query, values, callback) => {
            callback(new Error('DB Error'), null);
        });

        const response = await request(app)
            .put('/admin/manage_groups/1')
            .send({
                group_leader_id: 1,
                camp_id: 2,
                number_of_attendees: 30,
                group_name: 'Updated Group',
                description: 'An updated test group',
                payment_status: 'paid',
                group_status: 'active',
                registration_fee_youth: 150,
                registration_fee_adult: 250
            });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error updating group');
    });

    test('should return error when deleting a group fails', async () => {
        connection.query.mockImplementation((query, values, callback) => {
            callback(new Error('DB Error'), null);
        });

        const response = await request(app)
            .delete('/admin/manage_groups/1');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error deleting group');
    });
});
