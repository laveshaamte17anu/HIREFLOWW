const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salary: {
      type: String,
      required: [true, 'Salary range is required'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Experience requirement is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid'],
      default: 'Full-time',
    },
    skills: {
      type: [String],
      required: [true, 'Required skills are required'],
      default: [],
    },
    education: {
      type: String,
      default: 'Bachelor\'s Degree',
    },
    vacancies: {
      type: Number,
      default: 1,
      min: 1,
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Closed', 'Expired'],
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to automatically check if expired
jobSchema.pre('find', function () {
  this.where({});
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
