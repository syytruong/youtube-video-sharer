require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

const startServer = (customPort) => {
  const serverPort = customPort || PORT;
  const server = app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`);
  });
  return server;
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = startServer;