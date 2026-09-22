const express = require('express');
const router = express.Router();
const { saveJob, unsaveJob, getSavedJobs } = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSavedJobs);
router.post('/:jobId', protect, saveJob);
router.delete('/:jobId', protect, unsaveJob);

module.exports = router;
