const Job = require('../models/Job');
const Application = require('../models/Application');

// Helper to auto-update expired jobs
const updateExpiredJobs = async () => {
  const now = new Date();
  await Job.updateMany(
    { deadline: { $lt: now }, status: 'Published' },
    { status: 'Expired' }
  );
};

// @desc    Get all published jobs with search & filter
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    await updateExpiredJobs();

    const {
      keyword,
      location,
      company,
      jobType,
      experience,
      skill,
      education,
      minSalary,
      maxSalary,
      sort,
    } = req.query;

    let query = { status: 'Published' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { companyName: { $regex: keyword, $options: 'i' } },
        { skills: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (company) {
      query.companyName = { $regex: company, $options: 'i' };
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (experience && experience !== 'All') {
      query.experience = { $regex: experience, $options: 'i' };
    }

    if (skill) {
      query.skills = { $regex: skill, $options: 'i' };
    }

    if (education && education !== 'All') {
      query.education = { $regex: education, $options: 'i' };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'deadline') {
      sortOptions = { deadline: 1 };
    }

    const jobs = await Job.find(query).populate('createdBy', 'name email companyName').sort(sortOptions);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    await updateExpiredJobs();

    const job = await Job.findById(req.params.id).populate('createdBy', 'name email location');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Include application count
    const applicationCount = await Application.countDocuments({ jobId: job._id });

    res.json({
      ...job.toObject(),
      applicationCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new job (Admin only)
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
  try {
    const {
      title,
      companyName,
      description,
      location,
      salary,
      experience,
      jobType,
      skills,
      education,
      vacancies,
      deadline,
      status,
    } = req.body;

    if (!title || !companyName || !description || !location || !salary || !deadline) {
      return res.status(400).json({ message: 'Missing required job fields' });
    }

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      title,
      companyName,
      description,
      location,
      salary,
      experience: experience || 'Entry Level',
      jobType: jobType || 'Full-time',
      skills: parsedSkills,
      education: education || "Bachelor's Degree",
      vacancies: vacancies ? parseInt(vacancies, 10) : 1,
      deadline,
      createdBy: req.user._id,
      status: status || 'Published',
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job (Admin only - Own jobs only)
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ownership check
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this job' });
    }

    const {
      title,
      companyName,
      description,
      location,
      salary,
      experience,
      jobType,
      skills,
      education,
      vacancies,
      deadline,
      status,
    } = req.body;

    job.title = title || job.title;
    job.companyName = companyName || job.companyName;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.experience = experience || job.experience;
    job.jobType = jobType || job.jobType;
    if (skills !== undefined) {
      job.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : job.skills;
    }
    job.education = education || job.education;
    job.vacancies = vacancies !== undefined ? parseInt(vacancies, 10) : job.vacancies;
    job.deadline = deadline || job.deadline;
    job.status = status || job.status;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job (Admin only - Own jobs only)
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ownership check
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    await Application.deleteMany({ jobId: job._id });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job status (Admin only)
// @route   PATCH /api/jobs/:id/status
// @access  Private/Admin
const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Draft', 'Published', 'Closed', 'Expired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this job' });
    }

    job.status = status;
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs created by logged-in admin
// @route   GET /api/jobs/admin/my-jobs
// @access  Private/Admin
const getAdminJobs = async (req, res) => {
  try {
    await updateExpiredJobs();

    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

    // Attach application counts
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationsCount = await Application.countDocuments({ jobId: job._id });
        return {
          ...job.toObject(),
          applicationsCount,
        };
      })
    );

    res.json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  getAdminJobs,
};
