const ConsultancyBooking = require('../models/ConsultancyBooking');

// @desc    Submit Weekend Career Consultancy Booking (Public)
// @route   POST /api/consultancy-bookings
// @access  Public
const createConsultancyBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      education,
      currentStatus,
      consultationReason,
      careerGoal,
      preferredDay,
      preferredTime,
    } = req.body;

    if (!fullName || !email || !phone || !consultationReason) {
      return res.status(400).json({
        message: 'Please fill out required fields: Full Name, Email, Phone, and Reason for Consultation.',
      });
    }

    let resumePath = '';
    if (req.file) {
      resumePath = `/uploads/${req.file.filename}`;
    }

    const booking = await ConsultancyBooking.create({
      fullName,
      email,
      phone,
      education: education || '',
      currentStatus: currentStatus || '',
      consultationReason,
      careerGoal: careerGoal || '',
      preferredDay: preferredDay || 'Saturday',
      preferredTime: preferredTime || '11:00 AM - 12:00 PM',
      resume: resumePath,
      status: 'Booked',
    });

    res.status(201).json({
      success: true,
      message: 'Weekend Career Consultancy session booked successfully! Our team will send Google Meet details to your email.',
      data: booking,
    });
  } catch (error) {
    console.error('Error in createConsultancyBooking:', error);
    res.status(500).json({ message: error.message || 'Server error booking consultancy session' });
  }
};

// @desc    Get all consultancy bookings for Admin
// @route   GET /api/consultancy-bookings
// @access  Private/Admin
const getConsultancyBookings = async (req, res) => {
  try {
    const { search, status, preferredDay } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (preferredDay && preferredDay !== 'All') {
      query.preferredDay = preferredDay;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { fullName: regex },
        { email: regex },
        { phone: regex },
        { consultationReason: regex },
        { careerGoal: regex },
      ];
    }

    const bookings = await ConsultancyBooking.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error in getConsultancyBookings:', error);
    res.status(500).json({ message: 'Server error fetching consultancy bookings' });
  }
};

// @desc    Update consultancy booking status / meet link
// @route   PATCH /api/consultancy-bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status, meetLink } = req.body;
    const booking = await ConsultancyBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Consultancy booking not found' });
    }

    if (status) {
      const validStatuses = ['Booked', 'Confirmed', 'Completed', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      booking.status = status;
    }

    if (meetLink !== undefined) {
      booking.meetLink = meetLink;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking details updated successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
};

// @desc    Add private note to consultancy booking
// @route   POST /api/consultancy-bookings/:id/notes
// @access  Private/Admin
const addBookingNote = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Note text cannot be empty' });
    }

    const booking = await ConsultancyBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.adminNotes.unshift({ text: text.trim(), createdAt: new Date() });
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Error in addBookingNote:', error);
    res.status(500).json({ message: 'Server error adding note' });
  }
};

// @desc    Delete consultancy booking
// @route   DELETE /api/consultancy-bookings/:id
// @access  Private/Admin
const deleteConsultancyBooking = async (req, res) => {
  try {
    const booking = await ConsultancyBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    console.error('Error in deleteConsultancyBooking:', error);
    res.status(500).json({ message: 'Server error deleting booking' });
  }
};

module.exports = {
  createConsultancyBooking,
  getConsultancyBookings,
  updateBookingStatus,
  addBookingNote,
  deleteConsultancyBooking,
};
