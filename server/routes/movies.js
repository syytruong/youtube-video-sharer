const express = require('express');
const { getMovies, createMovie, voteMovie } = require('../controllers/movieController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(getMovies).post(protect, createMovie);
router.route('/create').post(protect, createMovie);
router.route('/:id/vote').post(protect, voteMovie);

module.exports = router;
