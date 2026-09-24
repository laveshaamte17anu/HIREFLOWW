const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const candidateLeadSchema = new mongoose.Schema(
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
    location: {
      type: String,
      default: '',
      trim: true,
    },
    preferredRole: {
      type: String,
      required: [true, 'Preferred role is required'],
      trim: true,
    },
    experience: {
      type: String,
      default: '',
      trim: true,
    },
    education: {
      type: String,
      default: '',
      trim: true,
    },
    currentCompany: {
      type: String,
      default: '',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    linkedin: {
      type: String,
      default: '',
      trim: true,
    },
    github: {
      type: String,
      default: '',
      trim: true,
    },
    portfolio: {
      type: String,
      default: '',
      trim: true,
    },
    resume: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Reviewing', 'Contacted', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'New',
    },
    adminNotes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

candidateLeadSchema.index({ email: 1 });
candidateLeadSchema.index({ status: 1 });

const CandidateLead = mongoose.model('CandidateLead', candidateLeadSchema);

module.exports = CandidateLead;
