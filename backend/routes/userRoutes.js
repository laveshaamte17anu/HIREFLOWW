const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getRecommendedJobs,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('resume'), updateUserProfile);
router.get('/recommended-jobs', protect, getRecommendedJobs);

module.exports = router;
