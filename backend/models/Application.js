const mongoose = require('mongoose');

const statusTimelineSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: '',
  },
});

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    education: {
      type: String,
      required: [true, 'Education is required'],
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
    },
    skills: {
      type: [String],
      default: [],
    },
    resume: {
      type: String,
      required: [true, 'Resume file path is required'],
    },
    location: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    portfolio: {
      type: String,
      default: '',
    },
    expectedSalary: {
      type: String,
      default: '',
    },
    noticePeriod: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    statusTimeline: [statusTimelineSchema],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate application for same candidate + same job
applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
