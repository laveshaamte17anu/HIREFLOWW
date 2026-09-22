const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Interview = require('../models/Interview');
const { calculateMatchScore } = require('../utils/matchScore');

// @desc    Get dashboard metrics (Admin or Candidate depending on user role)
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const adminId = req.user._id;

      const jobs = await Job.find({ createdBy: adminId });
      const jobIds = jobs.map((j) => j._id);

      const totalJobs = jobs.length;
      const publishedJobs = jobs.filter((j) => j.status === 'Published').length;
      const draftJobs = jobs.filter((j) => j.status === 'Draft').length;
      const closedJobs = jobs.filter((j) => j.status === 'Closed').length;
      const expiredJobs = jobs.filter((j) => j.status === 'Expired').length;

      const applications = await Application.find({ jobId: { $in: jobIds } });
      const totalApplications = applications.length;

      const underReview = applications.filter((a) => a.status === 'Under Review').length;
      const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
      const interviews = applications.filter((a) => a.status === 'Interview').length;
      const selected = applications.filter((a) => a.status === 'Selected').length;
      const rejected = applications.filter((a) => a.status === 'Rejected').length;

      res.json({
        totalJobs,
        publishedJobs,
        draftJobs,
        closedJobs,
        expiredJobs,
        totalApplications,
        underReview,
        shortlisted,
        interviews,
        selected,
        rejected,
      });
    } else {
      const candidateId = req.user._id;

      const applications = await Application.find({ candidateId });
      const savedJobsCount = await SavedJob.countDocuments({ candidateId });
      const upcomingInterviewsCount = await Interview.countDocuments({
        candidateId,
        status: 'Scheduled',
      });

      const totalApplications = applications.length;
      const applied = applications.filter((a) => a.status === 'Applied').length;
      const underReview = applications.filter((a) => a.status === 'Under Review').length;
      const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
      const interviews = applications.filter((a) => a.status === 'Interview').length;
      const selected = applications.filter((a) => a.status === 'Selected').length;
      const rejected = applications.filter((a) => a.status === 'Rejected').length;

      res.json({
        totalApplications,
        applied,
        underReview,
        shortlisted,
        interviews,
        selected,
        rejected,
        savedJobsCount,
        upcomingInterviewsCount,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed recruitment analytics (Admin only)
// @route   GET /api/analytics/reports
// @access  Private/Admin
const getAnalyticsData = async (req, res) => {
  try {
    const adminId = req.user._id;

    const jobs = await Job.find({ createdBy: adminId });
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId', 'title companyName location jobType')
      .populate('candidateId', 'name email skills location education experience');

    // 1. Applications per Job
    const appsPerJobMap = {};
    jobs.forEach((j) => {
      appsPerJobMap[j.title] = 0;
    });
    applications.forEach((app) => {
      if (app.jobId && app.jobId.title) {
        appsPerJobMap[app.jobId.title] = (appsPerJobMap[app.jobId.title] || 0) + 1;
      }
    });

    const applicationsPerJob = Object.keys(appsPerJobMap).map((title) => ({
      jobTitle: title,
      count: appsPerJobMap[title],
    }));

    // 2. Status Distribution
    const statusMap = {
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0,
    };
    applications.forEach((app) => {
      if (statusMap[app.status] !== undefined) {
        statusMap[app.status] += 1;
      }
    });

    const statusDistribution = Object.keys(statusMap).map((status) => ({
      status,
      count: statusMap[status],
    }));

    // 3. Jobs by Location
    const locationMap = {};
    jobs.forEach((j) => {
      locationMap[j.location] = (locationMap[j.location] || 0) + 1;
    });
    const jobsByLocation = Object.keys(locationMap).map((loc) => ({
      location: loc,
      count: locationMap[loc],
    }));

    // 4. Conversion Rates
    const totalApps = applications.length;
    const shortlistRate = totalApps ? Math.round((statusMap['Shortlisted'] / totalApps) * 100) : 0;
    const selectionRate = totalApps ? Math.round((statusMap['Selected'] / totalApps) * 100) : 0;
    const rejectionRate = totalApps ? Math.round((statusMap['Rejected'] / totalApps) * 100) : 0;

    res.json({
      totalJobs: jobs.length,
      totalApplications: totalApps,
      applicationsPerJob,
      statusDistribution,
      jobsByLocation,
      rates: {
        shortlistRate,
        selectionRate,
        rejectionRate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export candidate applicants as CSV (Admin only - Own jobs only)
// @route   GET /api/analytics/export-csv
// @access  Private/Admin
const exportApplicantsCSV = async (req, res) => {
  try {
    const adminId = req.user._id;

    const jobs = await Job.find({ createdBy: adminId }).select('_id title companyName');
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId', 'title companyName')
      .populate('candidateId', 'name email phone skills education experience location');

    // Generate CSV Header
    let csv = 'Candidate Name,Email,Phone,Job Title,Experience,Skills,Status,Applied Date,Match Score\n';

    applications.forEach((app) => {
      const candidateName = app.fullName || (app.candidateId ? app.candidateId.name : 'N/A');
      const email = app.email || (app.candidateId ? app.candidateId.email : 'N/A');
      const phone = app.phone || (app.candidateId ? app.candidateId.phone : 'N/A');
      const jobTitle = app.jobId ? app.jobId.title : 'N/A';
      const experience = app.experience || 'N/A';
      const skills = (app.skills || []).join('; ');
      const status = app.status;
      const appliedDate = new Date(app.createdAt).toISOString().split('T')[0];

      let matchScore = '50%';
      if (app.candidateId && app.jobId) {
        const matchObj = calculateMatchScore(app.candidateId, app.jobId);
        matchScore = `${matchObj.matchScore}%`;
      }

      // Escape quotes and commas
      const row = [
        `"${candidateName.replace(/"/g, '""')}"`,
        `"${email.replace(/"/g, '""')}"`,
        `"${phone.replace(/"/g, '""')}"`,
        `"${jobTitle.replace(/"/g, '""')}"`,
        `"${experience.replace(/"/g, '""')}"`,
        `"${skills.replace(/"/g, '""')}"`,
        `"${status.replace(/"/g, '""')}"`,
        `"${appliedDate}"`,
        `"${matchScore}"`,
      ].join(',');

      csv += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="hireflow_applicants.csv"');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAnalyticsData,
  exportApplicantsCSV,
};
