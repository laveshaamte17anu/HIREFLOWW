const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Interview = require('../models/Interview');
const { calculateMatchScore } = require('../utils/matchScore');

// @desc    Submit job application (Candidate)
// @route   POST /api/applications
// @access  Private/Candidate
const submitApplication = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot apply for jobs' });
    }

    const {
      jobId,
      fullName,
      email,
      phone,
      education,
      experience,
      skills,
      location,
      linkedin,
      github,
      portfolio,
      expectedSalary,
      noticePeriod,
    } = req.body;

    if (!jobId || !fullName || !email || !phone || !education || !experience) {
      return res.status(400).json({ message: 'Missing required application fields' });
    }

    let resumePath = '';
    if (req.file) {
      resumePath = `/uploads/${req.file.filename}`;
      // Sync candidate profile resume in MongoDB
      await User.findByIdAndUpdate(req.user._id, { resume: resumePath });
    } else if (req.body.resumePath || req.user.resume) {
      resumePath = req.body.resumePath || req.user.resume;
    } else {
      return res.status(400).json({ message: 'Resume file is required (PDF, DOC, DOCX up to 5MB)' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'Published') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({ message: 'Job application deadline has passed' });
    }

    // Check duplicate application
    const existingApp = await Application.findOne({
      candidateId: req.user._id,
      jobId,
    });

    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const application = await Application.create({
      candidateId: req.user._id,
      jobId,
      fullName,
      email,
      phone,
      education,
      experience,
      skills: parsedSkills,
      resume: resumePath,
      location: location || '',
      linkedin: linkedin || '',
      github: github || '',
      portfolio: portfolio || '',
      expectedSalary: expectedSalary || '',
      noticePeriod: noticePeriod || '',
      status: 'Applied',
      statusTimeline: [
        {
          status: 'Applied',
          timestamp: new Date(),
          note: 'Application successfully submitted',
        },
      ],
    });

    // Notify Candidate
    await Notification.create({
      userId: req.user._id,
      type: 'application_submitted',
      title: 'Application Submitted',
      message: `Your application for "${job.title}" at ${job.companyName} has been received.`,
      relatedId: application._id,
    });

    // Notify Job Owner Admin
    await Notification.create({
      userId: job.createdBy,
      type: 'new_applicant',
      title: 'New Candidate Application',
      message: `${fullName} applied for your job posting: "${job.title}".`,
      relatedId: application._id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get candidate's own applications
// @route   GET /api/applications/my
// @access  Private/Candidate
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate({
        path: 'jobId',
        select: 'title companyName location salary jobType experience deadline status createdBy',
      })
      .sort({ createdAt: -1 });

    const candidate = await User.findById(req.user._id);

    const appsWithDetails = applications.map((app) => {
      const match = app.jobId ? calculateMatchScore(candidate, app.jobId) : { matchScore: 0 };
      return {
        ...app.toObject(),
        matchScore: match.matchScore,
      };
    });

    res.json(appsWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin applications (ONLY for jobs created by logged-in admin)
// @route   GET /api/applications/admin
// @access  Private/Admin
const getAdminApplications = async (req, res) => {
  try {
    // 1. Find all jobs created by this admin
    const adminJobs = await Job.find({ createdBy: req.user._id }).select('_id');
    const jobIds = adminJobs.map((j) => j._id);

    // 2. Fetch applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId', 'title companyName location skills education experience jobType')
      .populate('candidateId', 'name email phone location skills education experience')
      .sort({ createdAt: -1 });

    // 3. Attach rule-based match score for each applicant
    const applicationsWithScore = applications.map((app) => {
      let scoreObj = { matchScore: 50, breakdown: {} };
      if (app.candidateId && app.jobId) {
        scoreObj = calculateMatchScore(app.candidateId, app.jobId);
      }
      return {
        ...app.toObject(),
        matchScore: scoreObj.matchScore,
        matchBreakdown: scoreObj.breakdown,
      };
    });

    res.json(applicationsWithScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single application by ID (Strict ownership control)
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('candidateId', 'name email phone location skills education experience linkedin github portfolio');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.jobId._id || application.jobId);

    // Access control:
    // Candidate can view only their own application
    // Admin can view only applications for jobs created by them
    const isCandidateOwner = application.candidateId._id.toString() === req.user._id.toString();
    const isAdminJobOwner = job && job.createdBy.toString() === req.user._id.toString();

    if (!isCandidateOwner && !isAdminJobOwner) {
      return res.status(403).json({ message: 'Access denied: You do not have permission to view this application' });
    }

    // Calculate match score
    const scoreObj = calculateMatchScore(application.candidateId || application, job);

    // Get any scheduled interview
    const interview = await Interview.findOne({ applicationId: application._id });

    res.json({
      ...application.toObject(),
      matchScore: scoreObj.matchScore,
      matchBreakdown: scoreObj.breakdown,
      interview: interview || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applications for a specific job (Admin only - Own job)
// @route   GET /api/applications/job/:jobId
// @access  Private/Admin
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('candidateId', 'name email phone location skills education experience')
      .sort({ createdAt: -1 });

    const scoredApps = applications.map((app) => {
      const scoreObj = calculateMatchScore(app.candidateId || app, job);
      return {
        ...app.toObject(),
        matchScore: scoreObj.matchScore,
        matchBreakdown: scoreObj.breakdown,
      };
    });

    res.json(scoredApps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (Admin only - Own job)
// @route   PATCH /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const allowedStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.jobId._id || application.jobId);
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update status for this applicant' });
    }

    application.status = status;
    application.statusTimeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });

    await application.save();

    // Create Notification for candidate
    await Notification.create({
      userId: application.candidateId,
      type: 'status_updated',
      title: `Application Status Updated: ${status}`,
      message: `Your application for "${job.title}" status has changed to "${status}".`,
      relatedId: application._id,
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitApplication,
  getMyApplications,
  getAdminApplications,
  getApplicationById,
  getJobApplications,
  updateApplicationStatus,
};
