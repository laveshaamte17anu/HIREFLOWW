const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  createConsultancyBooking,
  getConsultancyBookings,
  updateBookingStatus,
  addBookingNote,
  deleteConsultancyBooking,
} = require('../controllers/consultancyBookingController');

// Public route for booking weekend consultancy
router.post('/', upload.single('resume'), createConsultancyBooking);

// Protected Admin routes
router.get('/', protect, adminOnly, getConsultancyBookings);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);
router.post('/:id/notes', protect, adminOnly, addBookingNote);
router.delete('/:id', protect, adminOnly, deleteConsultancyBooking);

module.exports = router;
