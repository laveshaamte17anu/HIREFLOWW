const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { calculateMatchScore } = require('../utils/matchScore');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      name,
      phone,
      location,
      education,
      college,
      degree,
      graduationYear,
      experience,
      bio,
      skills,
      linkedin,
      github,
      portfolio,
    } = req.body;

    user.name = name || user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    user.location = location !== undefined ? location : user.location;
    user.education = education !== undefined ? education : user.education;
    user.college = college !== undefined ? college : user.college;
    user.degree = degree !== undefined ? degree : user.degree;
    user.graduationYear = graduationYear !== undefined ? graduationYear : user.graduationYear;
    user.experience = experience !== undefined ? experience : user.experience;
    user.bio = bio !== undefined ? bio : user.bio;
    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : user.skills;
    }
    user.linkedin = linkedin !== undefined ? linkedin : user.linkedin;
    user.github = github !== undefined ? github : user.github;
    user.portfolio = portfolio !== undefined ? portfolio : user.portfolio;

    if (req.file) {
      user.resume = `/uploads/${req.file.filename}`;
    }

    // Do NOT allow updating role or email directly here
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended jobs for candidate based on profile match score
// @route   GET /api/users/recommended-jobs
// @access  Private/Candidate
const getRecommendedJobs = async (req, res) => {
  try {
    const candidate = await User.findById(req.user._id);
    const publishedJobs = await Job.find({ status: 'Published' }).populate('createdBy', 'name email companyName');

    // Fetch jobs already applied to by candidate
    const myApplications = await Application.find({ candidateId: req.user._id }).select('jobId');
    const appliedJobIds = new Set(myApplications.map((a) => a.jobId.toString()));

    const scoredJobs = publishedJobs
      .filter((job) => !appliedJobIds.has(job._id.toString()))
      .map((job) => {
        const matchObj = calculateMatchScore(candidate, job);
        return {
          ...job.toObject(),
          matchScore: matchObj.matchScore,
          matchBreakdown: matchObj.breakdown,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(scoredJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getRecommendedJobs,
};
