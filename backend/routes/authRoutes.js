const express = require('express');
const router = express.Router();
const { registerCandidate, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerCandidate);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
