process.env.NODE_ENV = 'test';
const request = require('supertest');
const startServer = require('../../index');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');

describe('Movies routes', () => {
  let token;
  let server;
  const testUserId = new mongoose.Types.ObjectId();

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user
    testUser = new User({
      _id: testUserId,
      username: 'test@example.com',
      password: 'password123',
    });
    await testUser.save();
    
    token = jwt.sign({ _id: testUserId}, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    server = startServer(8082);
  });

  afterAll(async () => {
    // Remove the test user
    await User.findByIdAndDelete(testUserId);
    await mongoose.disconnect();
    await mongoServer.stop();
    server.close();
  });

  test('GET /api/movies', async () => {
    const response = await request(server).get('/api/movies');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/movies/create without token', async () => {
    const response = await request(server).post('/api/movies/create');
    expect(response.status).toBe(401);
  });

  test('POST /api/movies/create with token', async () => {
    const response = await request(server)
      .post('/api/movies/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        youtubeUrl: 'https://www.youtube.com/watch?v=test',
        description: 'Test description',
        title: 'Test title',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('youtubeUrl', 'https://www.youtube.com/watch?v=test');
    expect(response.body).toHaveProperty('description', 'Test description');
    expect(response.body).toHaveProperty('title', 'Test title');
  });

  test('POST /api/movies/:id/vote without token', async () => {
    const response = await request(server).post('/api/movies/1/vote');
    expect(response.status).toBe(401);
  });
});
