const request = require('supertest');
const mongoose = require('mongoose');
const startServer = require('../index');
const User = require('../models/User');

let server;
const testUserData = {
  username: 'test@test123.com',
  password: 'testpassword',
};

beforeAll(() => {
  server = startServer(8084);
});

afterAll(async () => {
  // Clean up the test user
  await User.deleteOne({ username: testUserData.username });
  await mongoose.disconnect();
  server.close();
});

describe('User Controller', () => {
  test('POST /api/users/register - register a new user', async () => {
    const response = await request(server)
      .post('/api/users/register')
      .send(testUserData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('username', testUserData.username);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /api/users/login - login with valid credentials', async () => {
    const response = await request(server)
      .post('/api/users/login')
      .send(testUserData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('username', testUserData.username);
    expect(response.body).toHaveProperty('votedMovies');
    expect(response.body).toHaveProperty('token');
  });
});