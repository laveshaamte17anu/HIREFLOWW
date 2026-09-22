const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getMyApplications,
  getAdminApplications,
  getApplicationById,
  getJobApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('resume'), submitApplication);
router.get('/my', protect, getMyApplications);
router.get('/admin', protect, adminOnly, getAdminApplications);
router.get('/job/:jobId', protect, adminOnly, getJobApplications);
router.get('/:id', protect, getApplicationById);
router.patch('/:id/status', protect, adminOnly, updateApplicationStatus);

module.exports = router;
