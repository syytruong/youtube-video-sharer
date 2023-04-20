const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/single').get(protect, getCurrentUser);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;