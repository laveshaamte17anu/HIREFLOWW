const EmployerRequest = require('../models/EmployerRequest');

// @desc    Submit employer hiring request (Public)
// @route   POST /api/employer-requests
// @access  Public
const createEmployerRequest = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      jobTitle,
      openings,
      location,
      employmentType,
      requiredSkills,
      additionalRequirements,
    } = req.body;

    if (!companyName || !contactPerson || !email || !phone || !jobTitle) {
      return res.status(400).json({
        message: 'Please fill out all required fields: Company Name, Contact Person, Email, Phone, and Job Title.',
      });
    }

    let parsedSkills = [];
    if (typeof requiredSkills === 'string') {
      parsedSkills = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (Array.isArray(requiredSkills)) {
      parsedSkills = requiredSkills;
    }

    const request = await EmployerRequest.create({
      companyName,
      contactPerson,
      email,
      phone,
      jobTitle,
      openings: Number(openings) || 1,
      location: location || '',
      employmentType: employmentType || 'Full-Time',
      requiredSkills: parsedSkills,
      additionalRequirements: additionalRequirements || '',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Hiring request submitted successfully! Our recruitment team will contact you shortly.',
      data: request,
    });
  } catch (error) {
    console.error('Error in createEmployerRequest:', error);
    res.status(500).json({ message: error.message || 'Server error submitting hiring request' });
  }
};

// @desc    Get all employer hiring requests for Admin
// @route   GET /api/employer-requests
// @access  Private/Admin
const getEmployerRequests = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { companyName: regex },
        { contactPerson: regex },
        { email: regex },
        { phone: regex },
        { jobTitle: regex },
        { location: regex },
      ];
    }

    const requests = await EmployerRequest.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Error in getEmployerRequests:', error);
    res.status(500).json({ message: 'Server error fetching employer requests' });
  }
};

// @desc    Update employer request status
// @route   PATCH /api/employer-requests/:id/status
// @access  Private/Admin
const updateEmployerRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Contacted', 'In Progress', 'Fulfilled', 'Closed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    const request = await EmployerRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Employer request not found' });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: request,
    });
  } catch (error) {
    console.error('Error in updateEmployerRequestStatus:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
};

// @desc    Add private note to employer request
// @route   POST /api/employer-requests/:id/notes
// @access  Private/Admin
const addEmployerRequestNote = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Note text cannot be empty' });
    }

    const request = await EmployerRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Employer request not found' });
    }

    request.adminNotes.unshift({ text: text.trim(), createdAt: new Date() });
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: request,
    });
  } catch (error) {
    console.error('Error in addEmployerRequestNote:', error);
    res.status(500).json({ message: 'Server error adding note' });
  }
};

// @desc    Delete employer request
// @route   DELETE /api/employer-requests/:id
// @access  Private/Admin
const deleteEmployerRequest = async (req, res) => {
  try {
    const request = await EmployerRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Employer request not found' });
    }

    await request.deleteOne();
    res.status(200).json({ success: true, message: 'Employer request deleted' });
  } catch (error) {
    console.error('Error in deleteEmployerRequest:', error);
    res.status(500).json({ message: 'Server error deleting request' });
  }
};

module.exports = {
  createEmployerRequest,
  getEmployerRequests,
  updateEmployerRequestStatus,
  addEmployerRequestNote,
  deleteEmployerRequest,
};
