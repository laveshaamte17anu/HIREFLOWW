const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @desc    Schedule an interview (Admin only - Own job)
// @route   POST /api/interviews
// @access  Private/Admin
const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, date, time, type, meetingLink, location, notes } = req.body;

    if (!applicationId || !date || !time) {
      return res.status(400).json({ message: 'Application ID, date, and time are required' });
    }

    const application = await Application.findById(applicationId).populate('jobId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.jobId._id || application.jobId);
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to schedule interview for this candidate' });
    }

    // Check if interview already exists for this application
    let interview = await Interview.findOne({ applicationId });

    if (interview) {
      interview.date = date;
      interview.time = time;
      interview.type = type || 'Online';
      interview.meetingLink = meetingLink || '';
      interview.location = location || '';
      interview.notes = notes || '';
      interview.status = 'Scheduled';
      await interview.save();
    } else {
      interview = await Interview.create({
        applicationId,
        candidateId: application.candidateId,
        jobId: job._id,
        adminId: req.user._id,
        date,
        time,
        type: type || 'Online',
        meetingLink: meetingLink || '',
        location: location || '',
        notes: notes || '',
        status: 'Scheduled',
      });
    }

    // Update application status to Interview
    application.status = 'Interview';
    application.statusTimeline.push({
      status: 'Interview',
      timestamp: new Date(),
      note: `Interview scheduled on ${date} at ${time}`,
    });
    await application.save();

    // Create Notification for Candidate
    await Notification.create({
      userId: application.candidateId,
      type: 'interview_scheduled',
      title: 'Interview Scheduled!',
      message: `An interview has been scheduled for "${job.title}" on ${date} at ${time}.`,
      relatedId: interview._id,
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interviews (Candidate sees own interviews; Admin sees own managed interviews)
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      query.adminId = req.user._id;
    } else {
      query.candidateId = req.user._id;
    }

    const interviews = await Interview.find(query)
      .populate('jobId', 'title companyName location')
      .populate('candidateId', 'name email phone')
      .populate('adminId', 'name email companyName')
      .sort({ createdAt: -1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single interview details
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('jobId')
      .populate('candidateId', 'name email phone location skills')
      .populate('applicationId');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Ownership validation
    const isCandidate = interview.candidateId._id.toString() === req.user._id.toString();
    const isAdmin = interview.adminId.toString() === req.user._id.toString();

    if (!isCandidate && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this interview' });
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update interview details
// @route   PUT /api/interviews/:id
// @access  Private/Admin
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this interview' });
    }

    const { date, time, type, meetingLink, location, notes, status } = req.body;

    interview.date = date || interview.date;
    interview.time = time || interview.time;
    interview.type = type || interview.type;
    interview.meetingLink = meetingLink !== undefined ? meetingLink : interview.meetingLink;
    interview.location = location !== undefined ? location : interview.location;
    interview.notes = notes !== undefined ? notes : interview.notes;
    interview.status = status || interview.status;

    await interview.save();

    // Notify Candidate
    await Notification.create({
      userId: interview.candidateId,
      type: 'interview_updated',
      title: 'Interview Details Updated',
      message: `Your interview schedule has been updated to ${interview.date} at ${interview.time}.`,
      relatedId: interview._id,
    });

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update interview status
// @route   PATCH /api/interviews/:id/status
// @access  Private/Admin
const updateInterviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    interview.status = status;
    await interview.save();

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  updateInterviewStatus,
};
