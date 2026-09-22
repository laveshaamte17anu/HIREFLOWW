const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Save/Bookmark job (Candidate)
// @route   POST /api/saved-jobs/:jobId
// @access  Private/Candidate
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingSave = await SavedJob.findOne({
      candidateId: req.user._id,
      jobId,
    });

    if (existingSave) {
      return res.status(400).json({ message: 'Job is already saved' });
    }

    const savedJob = await SavedJob.create({
      candidateId: req.user._id,
      jobId,
    });

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsave/Remove bookmarked job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private/Candidate
const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOneAndDelete({
      candidateId: req.user._id,
      jobId,
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({ message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all saved jobs for logged-in candidate
// @route   GET /api/saved-jobs
// @access  Private/Candidate
const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ candidateId: req.user._id })
      .populate({
        path: 'jobId',
        populate: { path: 'createdBy', select: 'name email companyName' },
      })
      .sort({ createdAt: -1 });

    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs,
};
