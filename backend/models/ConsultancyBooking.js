const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const consultancyBookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    education: {
      type: String,
      default: '',
      trim: true,
    },
    currentStatus: {
      type: String,
      default: '',
      trim: true,
    },
    consultationReason: {
      type: String,
      required: [true, 'Consultation reason is required'],
      trim: true,
    },
    careerGoal: {
      type: String,
      default: '',
      trim: true,
    },
    preferredDay: {
      type: String,
      enum: ['Saturday', 'Sunday'],
      default: 'Saturday',
    },
    preferredTime: {
      type: String,
      default: '11:00 AM - 12:00 PM',
      trim: true,
    },
    resume: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Booked', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Booked',
    },
    meetLink: {
      type: String,
      default: '',
      trim: true,
    },
    adminNotes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

consultancyBookingSchema.index({ status: 1 });
consultancyBookingSchema.index({ email: 1 });

const ConsultancyBooking = mongoose.model('ConsultancyBooking', consultancyBookingSchema);

module.exports = ConsultancyBooking;
