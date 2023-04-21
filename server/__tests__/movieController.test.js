process.env.NODE_ENV = 'test';
const request = require('supertest');
const startServer = require('../index');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

let mongoServer;
let testUser;
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
  server = startServer(8083);
});

afterAll(async () => {
  // Remove the test user
  await User.findByIdAndDelete(testUserId);
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Movie Controller', () => {
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
    expect(response.body.user).toHaveProperty('username', testUser.username);

  });

  test('POST /api/movies/:id/vote without token', async () => {
    
    const movie = await Movie.create({
      youtubeUrl: 'https://www.youtube.com/watch?v=test',
      user: testUser._id,
      description: 'Test description',
      title: 'Test title',
    });

    const response = await request(server).post(`/api/movies/${movie._id}/vote`);
    expect(response.status).toBe(401);
  });

  test('POST /api/movies/:id/vote with token', async () => {
    const movie = await Movie.create({
      youtubeUrl: 'https://www.youtube.com/watch?v=test',
      user: testUser._id,
      description: 'Test description',
      title: 'Test title',
    });

    const response = await request(server)
      .post(`/api/movies/${movie._id}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'upVotes',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('updatedVote', 'upVotes');
      expect(response.body.votedMovies).toHaveProperty(movie._id.toString(), 'upVotes');
      expect(response.body.movie).toHaveProperty('_id', movie._id.toString());
      expect(response.body.movie).toHaveProperty('upVotes', 1);
    });
  
  test('POST /api/movies/:id/vote with invalid vote type', async () => {
    const movie = await Movie.create({
      youtubeUrl: 'https://www.youtube.com/watch?v=test',
      user: testUser._id,
      description: 'Test description',
      title: 'Test title',
    });

    const response = await request(server)
      .post(`/api/movies/${movie._id}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'invalidVoteType',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid vote type');
  });
  
  test('POST /api/movies/:id/vote user already voted', async () => {
    const movie = await Movie.create({
      youtubeUrl: 'https://www.youtube.com/watch?v=test',
      user: testUser._id,
      description: 'Test description',
      title: 'Test title',
    });

    await request(server)
      .post(`/api/movies/${movie._id}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'upVotes',
      });

    const response = await request(server)
      .post(`/api/movies/${movie._id}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'downVotes',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User has already voted/unvoted for this movie');
  });
});
