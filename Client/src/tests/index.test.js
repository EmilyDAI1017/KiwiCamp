const request = require('supertest');
const express = require('express');

const app = express();
app.get('/api/data', (req, res) => {
  res.status(200).json({ message: 'Hello from Express' });
});

describe('GET /api/data', () => {
  it('should return message from Express', async () => {
    const response = await request(app).get('/api/data');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello from Express');
  });
});
