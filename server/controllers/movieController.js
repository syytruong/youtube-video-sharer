const asyncHandler = require('express-async-handler');
const Movie = require('../models/Movie');
const User = require('../models/User');

// Get list of movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}, '-__v')
      .populate('user', 'username -_id')
      .exec();

    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getMovies' });
  }
};

// Create a new movie
const createMovie = async (req, res) => {
  try {
    const { youtubeUrl, description, title } = req.body;
    const { _id } = req.user;

    // Check if the user exists
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const movie = await Movie.create({ youtubeUrl, user: user._id, description, title });

    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error createMovie' });
  }
};


// Vote or un-vote a movie
const voteMovie = asyncHandler(async (req, res) => {
  const movieId = req.params.id;
  const userId = req.user._id;
  const { type } = req.body;

  if (!['upVotes', 'downVotes'].includes(type)) {
    res.status(400);
    throw new Error('Invalid vote type');
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const user = await User.findById(userId);
  const currentVote = user.votedMovies.get(movieId);
  
  if (currentVote) {
    res.status(400);
    throw new Error('User has already voted/unvoted for this movie');
  } else {
    // Add the vote
    user.votedMovies.set(movieId, type);
    movie[type] += 1;
    await user.save();
    await movie.save();

    res.status(200).json({ success: true, movie, updatedVote: type });
  }
});

module.exports = { getMovies, createMovie, voteMovie };
