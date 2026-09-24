const express = require('express');

const router = express.Router();

const upload = require('../middleware/uploadMiddleware');

const { protect } = require('../middleware/authMiddleware');

const { adminOnly } = require('../middleware/adminMiddleware');

const {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  deleteLead,
} = require('../controllers/candidateLeadController');

// Public route for candidate profile submission
router.post(
  '/',
  upload.single('resume'),
  createLead
);

// Temporary route to view candidate data in browser
// http://localhost:5000/api/candidate-leads/debug
router.get(
  '/debug',
  getLeads
);

// Admin-protected routes
router.get(
  '/',
  protect,
  adminOnly,
  getLeads
);

router.get(
  '/:id',
  protect,
  adminOnly,
  getLeadById
);

router.patch(
  '/:id/status',
  protect,
  adminOnly,
  updateLeadStatus
);

router.post(
  '/:id/notes',
  protect,
  adminOnly,
  addLeadNote
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteLead
);

module.exports = router;