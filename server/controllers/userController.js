const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * registerUser - Registers a new user with the given username and password.
 * 
 * @function
 * @async
 * @param {string} req.body.username - The username provided by the user
 * @param {string} req.body.password - The password provided by the user
 * @throws {Error} - Will throw an error if there's an issue during registration
 * @returns {void} - Sends a JSON response containing the user's ID, username, and JWT token
 */
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(404).json({ message: 'Missing username or password' });
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registerUser' });
  }
};

/**
 * loginUser - Authenticates a user with the given username and password.
 * 
 * @function
 * @async
 * @param {string} req.body.username - The username provided by the user
 * @param {string} req.body.password - The password provided by the user
 * @throws {Error} - Will throw an error if there's an issue during authentication
 * @returns {void} - Sends a JSON response containing the user's ID, username, and JWT token
 */
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(404).json({ message: 'Missing username or password' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      token: jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error loginUser' });
  }
};

/**
 * getCurrentUser - Fetch the current user's information, excluding the password.
 * This function is a protected route that requires the user to be authenticated.
 * 
 * @function
 * @async
 * @throws {Error} - Will throw an error if the user is not found
 * @returns {void} - Sends a JSON response containing the user's information
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getUser' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
