const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const employerRequestSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
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
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    openings: {
      type: Number,
      default: 1,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    employmentType: {
      type: String,
      default: 'Full-Time',
      trim: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    additionalRequirements: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'In Progress', 'Fulfilled', 'Closed'],
      default: 'Pending',
    },
    adminNotes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

employerRequestSchema.index({ status: 1 });
employerRequestSchema.index({ email: 1 });

const EmployerRequest = mongoose.model('EmployerRequest', employerRequestSchema);

module.exports = EmployerRequest;
