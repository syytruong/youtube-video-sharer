const asyncHandler = require('express-async-handler');
const Movie = require('../models/Movie');
const User = require('../models/User');

/**
 * getMovies - Fetch the list of movies, excluding the __v field, and populate
 * the user field with the associated username.
 *
 * @function
 * @async
 * @throws {Error} - Will throw an error if there is an issue retrieving movies
 * @returns {void} - Sends a JSON response containing the list of movies
 */
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

/**
 * createMovie - Create a new movie entry with the given youtubeUrl, description,
 * and title. This function also associates the movie with the authenticated user.
 *
 * @function
 * @async
 * @param {Object} req.body - Contains the youtubeUrl, description, and title
 * @throws {Error} - Will throw an error if the user is not found or there is an issue creating the movie
 * @returns {void} - Sends a JSON response containing the created movie
 */
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


/**
 * voteMovie - Allows the authenticated user to vote or un-vote a movie based on the
 * provided vote type (upVotes or downVotes). The user can only vote/un-vote once.
 *
 * @function
 * @async
 * @param {string} req.params.id - The movie's ID to vote/un-vote
 * @param {Object} req.body - Contains the vote type (upVotes or downVotes)
 * @throws {Error} - Will throw an error if the movie is not found, the vote type is invalid, or the user has already voted/unvoted for the movie
 * @returns {void} - Sends a JSON response containing the updated movie, updated vote, and the user's votedMovies
 */
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

    res.status(200).json({ success: true, movie, updatedVote: type, votedMovies: user.votedMovies });
  }
});

module.exports = { getMovies, createMovie, voteMovie };
