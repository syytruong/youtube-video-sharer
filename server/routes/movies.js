const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, movieController.shareMovie);
router.get('/', movieController.getMovies);

module.exports = router;
