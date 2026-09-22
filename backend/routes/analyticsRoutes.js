const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAnalyticsData,
  exportApplicantsCSV,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/dashboard', protect, getDashboardStats);
router.get('/reports', protect, adminOnly, getAnalyticsData);
router.get('/export-csv', protect, adminOnly, exportApplicantsCSV);

module.exports = router;
