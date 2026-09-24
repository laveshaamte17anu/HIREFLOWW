const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  createEmployerRequest,
  getEmployerRequests,
  updateEmployerRequestStatus,
  addEmployerRequestNote,
  deleteEmployerRequest,
} = require('../controllers/employerRequestController');

// Public route for submitting hiring requests
router.post('/', createEmployerRequest);

// Protected Admin routes
router.get('/', protect, adminOnly, getEmployerRequests);
router.patch('/:id/status', protect, adminOnly, updateEmployerRequestStatus);
router.post('/:id/notes', protect, adminOnly, addEmployerRequestNote);
router.delete('/:id', protect, adminOnly, deleteEmployerRequest);

module.exports = router;
