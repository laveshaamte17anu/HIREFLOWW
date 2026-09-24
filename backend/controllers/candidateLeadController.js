const CandidateLead = require('../models/CandidateLead');

// @desc    Submit candidate profile (Public Lead Capture)
// @route   POST /api/candidate-leads
// @access  Public
const createLead = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      preferredRole,
      experience,
      education,
      currentCompany,
      skills,
      linkedin,
      github,
      portfolio,
    } = req.body;

    if (!fullName || !email || !phone || !preferredRole) {
      return res.status(400).json({
        message: 'Please provide full name, email, phone, and preferred role',
      });
    }

    let parsedSkills = [];
    if (typeof skills === 'string') {
      parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (Array.isArray(skills)) {
      parsedSkills = skills;
    }

    let resumePath = '';
    if (req.file) {
      resumePath = `/uploads/${req.file.filename}`;
    }

    const lead = await CandidateLead.create({
      fullName,
      email,
      phone,
      location: location || '',
      preferredRole,
      experience: experience || '',
      education: education || '',
      currentCompany: currentCompany || '',
      skills: parsedSkills,
      linkedin: linkedin || '',
      github: github || '',
      portfolio: portfolio || '',
      resume: resumePath,
      status: 'New',
    });

    res.status(201).json({
      success: true,
      message: 'Profile submitted successfully! Our recruitment team will review your application.',
      data: lead,
    });
  } catch (error) {
    console.error('Error in createLead:', error);
    res.status(500).json({ message: error.message || 'Server error while submitting profile' });
  }
};

// @desc    Get all candidate leads for Admin Talent Pool with filtering and search
// @route   GET /api/candidate-leads
// @access  Private/Admin
const getLeads = async (req, res) => {
  try {
    const { search, status, role, experience } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (role && role !== 'All') {
      query.preferredRole = { $regex: role, $options: 'i' };
    }

    if (experience && experience !== 'All') {
      query.experience = experience;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { preferredRole: searchRegex },
        { location: searchRegex },
        { skills: { $in: [searchRegex] } },
      ];
    }

    const leads = await CandidateLead.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error('Error in getLeads:', error);
    res.status(500).json({ message: error.message || 'Server error fetching candidate leads' });
  }
};

// @desc    Get candidate lead by ID
// @route   GET /api/candidate-leads/:id
// @access  Private/Admin
const getLeadById = async (req, res) => {
  try {
    const lead = await CandidateLead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Candidate lead not found' });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error in getLeadById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update candidate lead status
// @route   PATCH /api/candidate-leads/:id/status
// @access  Private/Admin
const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Reviewing', 'Contacted', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    const lead = await CandidateLead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Candidate lead not found' });
    }

    lead.status = status;
    await lead.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: lead,
    });
  } catch (error) {
    console.error('Error in updateLeadStatus:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
};

// @desc    Add private admin note to candidate lead
// @route   POST /api/candidate-leads/:id/notes
// @access  Private/Admin
const addLeadNote = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Note text cannot be empty' });
    }

    const lead = await CandidateLead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Candidate lead not found' });
    }

    lead.adminNotes.unshift({ text: text.trim(), createdAt: new Date() });
    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Admin note added successfully',
      data: lead,
    });
  } catch (error) {
    console.error('Error in addLeadNote:', error);
    res.status(500).json({ message: 'Server error adding note' });
  }
};

// @desc    Delete candidate lead
// @route   DELETE /api/candidate-leads/:id
// @access  Private/Admin
const deleteLead = async (req, res) => {
  try {
    const lead = await CandidateLead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Candidate lead not found' });
    }

    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Candidate lead removed' });
  } catch (error) {
    console.error('Error in deleteLead:', error);
    res.status(500).json({ message: 'Server error deleting candidate lead' });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  deleteLead,
};
