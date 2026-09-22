const express = require('express');
const router = express.Router();
const {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  updateInterviewStatus,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', protect, getInterviews);
router.get('/:id', protect, getInterviewById);

router.post('/', protect, adminOnly, scheduleInterview);
router.put('/:id', protect, adminOnly, updateInterview);
router.patch('/:id/status', protect, adminOnly, updateInterviewStatus);

module.exports = router;
