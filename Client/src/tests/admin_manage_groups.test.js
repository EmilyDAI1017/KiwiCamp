const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app= express();

jest.mock('mysql');

app.use(bodyParser.json());

const connection = {
    query: jest.fn(),
};

describe('Group Management API', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should add a new group', async () => {
      connection.query.mockImplementation((query, values, callback) => {
        callback(null, { insertId: 1 });
      });
  
      const res = await request(app)
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
  
      expect(res.statusCode).toBe(201);
      expect(res.text).toBe('Group added successfully');
    }, 15000);
  
    test('should update a group', async () => {
      connection.query.mockImplementation((query, values, callback) => {
        callback(null, { affectedRows: 1 });
      });
  
      const res = await request(app)
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
  
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Group updated successfully');
    }, 15000);
  
    test('should delete a group', async () => {
      connection.query.mockImplementation((query, values, callback) => {
        callback(null, { affectedRows: 1 });
      });
  
      const res = await request(app)
        .delete('/admin/manage_groups/1');
  
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Group deleted successfully');
    }, 15000);
  
    test('should return error when adding a group fails', async () => {
      connection.query.mockImplementation((query, values, callback) => {
        callback(new Error('DB Error'), null);
      });
  
      const res = await request(app)
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
  
      expect(res.statusCode).toBe(500);
      expect(res.text).toBe('Error adding group');
    }, 15000);
  
    test('should return error when updating a group fails', async () => {
      connection.query.mockImplementation((query, values, callback) => {
        callback(new Error('DB Error'), null);
      });
  
      const res = await request(app)
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
  
      expect(res.statusCode).toBe(500);
      expect(res.text).toBe('Error updating group');
    }, 15000);
  
    test('should return error when deleting a group fails', async () => {
      connection.query.mockImplementation((query, values, callback) => {
        callback(new Error('DB Error'), null);
      });
  
      const res = await request(app)
        .delete('/admin/manage_groups/1');
  
      expect(res.statusCode).toBe(500);
      expect(res.text).toBe('Error deleting group');
    }, 15000);
  });