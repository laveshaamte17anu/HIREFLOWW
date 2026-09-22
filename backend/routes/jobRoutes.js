const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  getAdminJobs,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getJobs);
router.get('/admin/my-jobs', protect, adminOnly, getAdminJobs);
router.get('/:id', getJobById);

router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);
router.patch('/:id/status', protect, adminOnly, updateJobStatus);

module.exports = router;
