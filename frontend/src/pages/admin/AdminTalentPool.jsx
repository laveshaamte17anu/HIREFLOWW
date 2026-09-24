import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Building,
  Code,
  Link as LinkIcon,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Eye,
  Trash2,
  Calendar,
  Video,
  Layers,
} from 'lucide-react';
import {
  getTalentPoolLeads,
  updateLeadStatus,
  addLeadNote,
  deleteLead,
} from '../../services/candidateLeadService';
import {
  getEmployerRequests,
  updateEmployerRequestStatus,
  addEmployerRequestNote,
  deleteEmployerRequest,
} from '../../services/employerRequestService';
import {
  getConsultancyBookings,
  updateConsultancyBookingStatus,
  addConsultancyBookingNote,
  deleteConsultancyBooking,
} from '../../services/consultancyBookingService';
import { useToast } from '../../context/ToastContext';
import { getResumeUrl } from '../../utils/downloadHelpers';

export default function AdminTalentPool() {
  const [activeTab, setActiveTab] = useState('candidates');

  // Candidate Leads State
  const [leads, setLeads] = useState([]);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateStatusFilter, setCandidateStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);

  // Employer Requests State
  const [employerRequests, setEmployerRequests] = useState([]);
  const [employerSearch, setEmployerSearch] = useState('');
  const [employerStatusFilter, setEmployerStatusFilter] = useState('All');
  const [selectedEmployerReq, setSelectedEmployerReq] = useState(null);

  // Consultancy Bookings State
  const [consultancyBookings, setConsultancyBookings] = useState([]);
  const [consultancySearch, setConsultancySearch] = useState('');
  const [consultancyStatusFilter, setConsultancyStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [meetLinkInput, setMeetLinkInput] = useState('');

  const { addToast } = useToast();

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [leadsRes, empRes, bookingRes] = await Promise.all([
        getTalentPoolLeads({ search: candidateSearch, status: candidateStatusFilter }),
        getEmployerRequests({ search: employerSearch, status: employerStatusFilter }),
        getConsultancyBookings({ search: consultancySearch, status: consultancyStatusFilter }),
      ]);

      setLeads(leadsRes.data || []);
      setEmployerRequests(empRes.data || []);
      setConsultancyBookings(bookingRes.data || []);
    } catch (error) {
      console.error('Failed to fetch admin talent pool data:', error);
      addToast('Failed to load portal submission records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [candidateStatusFilter, employerStatusFilter, consultancyStatusFilter]);

  // --- CANDIDATE LEAD HANDLERS ---
  const handleLeadStatusChange = async (id, status) => {
    setUpdatingStatus(true);
    try {
      const res = await updateLeadStatus(id, status);
      addToast(`Candidate status updated to "${status}"`, 'success');
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      addToast('Error updating status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddLeadNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedLead) return;
    setAddingNote(true);
    try {
      const res = await addLeadNote(selectedLead._id, newNoteText.trim());
      addToast('Private note added', 'success');
      setSelectedLead(res.data);
      setLeads((prev) => prev.map((l) => (l._id === selectedLead._id ? res.data : l)));
      setNewNoteText('');
    } catch (error) {
      addToast('Error adding note', 'error');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete candidate lead?')) return;
    try {
      await deleteLead(id);
      addToast('Lead deleted', 'info');
      setLeads((prev) => prev.filter((l) => l._id !== id));
      if (selectedLead && selectedLead._id === id) setSelectedLead(null);
    } catch (error) {
      addToast('Error deleting lead', 'error');
    }
  };

  // --- EMPLOYER REQUEST HANDLERS ---
  const handleEmpStatusChange = async (id, status) => {
    setUpdatingStatus(true);
    try {
      await updateEmployerRequestStatus(id, status);
      addToast(`Hiring request status updated to "${status}"`, 'success');
      setEmployerRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
      if (selectedEmployerReq && selectedEmployerReq._id === id) {
        setSelectedEmployerReq((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      addToast('Error updating status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddEmpNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedEmployerReq) return;
    setAddingNote(true);
    try {
      const res = await addEmployerRequestNote(selectedEmployerReq._id, newNoteText.trim());
      addToast('Note added', 'success');
      setSelectedEmployerReq(res.data);
      setEmployerRequests((prev) => prev.map((r) => (r._id === selectedEmployerReq._id ? res.data : r)));
      setNewNoteText('');
    } catch (error) {
      addToast('Error adding note', 'error');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteEmployerReq = async (id) => {
    if (!window.confirm('Delete hiring request?')) return;
    try {
      await deleteEmployerRequest(id);
      addToast('Hiring request deleted', 'info');
      setEmployerRequests((prev) => prev.filter((r) => r._id !== id));
      if (selectedEmployerReq && selectedEmployerReq._id === id) setSelectedEmployerReq(null);
    } catch (error) {
      addToast('Error deleting request', 'error');
    }
  };

  // --- CONSULTANCY BOOKING HANDLERS ---
  const handleBookingStatusChange = async (id, status, meetLink) => {
    setUpdatingStatus(true);
    try {
      const res = await updateConsultancyBookingStatus(id, { status, meetLink });
      addToast('Booking status updated', 'success');
      setConsultancyBookings((prev) => prev.map((b) => (b._id === id ? res.data : b)));
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking(res.data);
      }
    } catch (error) {
      addToast('Error updating booking', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddBookingNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedBooking) return;
    setAddingNote(true);
    try {
      const res = await addConsultancyBookingNote(selectedBooking._id, newNoteText.trim());
      addToast('Note added', 'success');
      setSelectedBooking(res.data);
      setConsultancyBookings((prev) => prev.map((b) => (b._id === selectedBooking._id ? res.data : b)));
      setNewNoteText('');
    } catch (error) {
      addToast('Error adding note', 'error');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete consultancy booking?')) return;
    try {
      await deleteConsultancyBooking(id);
      addToast('Booking deleted', 'info');
      setConsultancyBookings((prev) => prev.filter((b) => b._id !== id));
      if (selectedBooking && selectedBooking._id === id) setSelectedBooking(null);
    } catch (error) {
      addToast('Error deleting booking', 'error');
    }
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'New':
      case 'Pending':
      case 'Booked':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Reviewing':
      case 'Contacted':
      case 'Confirmed':
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Shortlisted':
      case 'Interview':
      case 'Fulfilled':
      case 'Completed':
      case 'Selected':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Rejected':
      case 'Closed':
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 pb-12 text-slate-100 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Recruiter Talent Pool & Submissions Hub
            </h1>
            <p className="text-xs text-slate-400">
              Manage candidate leads, employer hiring requests, and weekend consultancy bookings from MongoDB Atlas
            </p>
          </div>
        </div>

        <button
          onClick={fetchAllData}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Records
        </button>
      </div>

      {/* Workspace Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === 'candidates'
              ? 'bg-indigo-950/40 border-indigo-500/50 ring-1 ring-indigo-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <p className="text-xs font-semibold text-indigo-400">Candidate Talent Pool</p>
          <p className="text-2xl font-black text-white mt-1">{leads.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Direct Candidate Applications</p>
        </button>

        <button
          onClick={() => setActiveTab('employers')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === 'employers'
              ? 'bg-indigo-950/40 border-indigo-500/50 ring-1 ring-indigo-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <p className="text-xs font-semibold text-blue-400">Employer Hiring Requests</p>
          <p className="text-2xl font-black text-white mt-1">{employerRequests.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Company Staffing Inquiries</p>
        </button>

        <button
          onClick={() => setActiveTab('consultancy')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === 'consultancy'
              ? 'bg-indigo-950/40 border-indigo-500/50 ring-1 ring-indigo-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <p className="text-xs font-semibold text-purple-400">Weekend Consultancy</p>
          <p className="text-2xl font-black text-white mt-1">{consultancyBookings.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Free Google Meet Bookings</p>
        </button>
      </div>

      {/* Submissions Switcher Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-bold gap-6">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`pb-3 transition-all flex items-center gap-2 ${
            activeTab === 'candidates'
              ? 'border-b-2 border-indigo-500 text-indigo-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Candidate Applications ({leads.length})
        </button>

        <button
          onClick={() => setActiveTab('employers')}
          className={`pb-3 transition-all flex items-center gap-2 ${
            activeTab === 'employers'
              ? 'border-b-2 border-indigo-500 text-indigo-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" /> Employer Requests ({employerRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('consultancy')}
          className={`pb-3 transition-all flex items-center gap-2 ${
            activeTab === 'consultancy'
              ? 'border-b-2 border-indigo-500 text-indigo-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" /> Weekend Consultancy ({consultancyBookings.length})
        </button>
      </div>

      {/* ==================== TAB 1: CANDIDATE TALENT POOL ==================== */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3">
            <div className="flex-grow relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search candidates by name, email, role, skills, location..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={candidateStatusFilter}
              onChange={(e) => setCandidateStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Contacted">Contacted</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-slate-500 text-xs">Loading Candidate Leads...</div>
            ) : leads.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs">No candidate leads found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Candidate</th>
                      <th className="py-3.5 px-4">Target Role</th>
                      <th className="py-3.5 px-4">Experience & Edu</th>
                      <th className="py-3.5 px-4">Skills</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Submitted</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {leads.map((lead) => (
                      <tr
                        key={lead._id}
                        onClick={() => setSelectedLead(lead)}
                        className="hover:bg-slate-800/40 cursor-pointer"
                      >
                        <td className="py-4 px-4 font-bold text-white">{lead.fullName}</td>
                        <td className="py-4 px-4 text-slate-200">{lead.preferredRole}</td>
                        <td className="py-4 px-4">{lead.experience || 'Fresher'}</td>
                        <td className="py-4 px-4 font-mono text-indigo-300">
                          {(lead.skills || []).slice(0, 3).join(', ')}
                        </td>
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.status}
                            onChange={(e) => handleLeadStatusChange(lead._id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${getBadgeStyle(
                              lead.status
                            )}`}
                          >
                            <option value="New" className="bg-slate-900 text-white">New</option>
                            <option value="Reviewing" className="bg-slate-900 text-white">Reviewing</option>
                            <option value="Contacted" className="bg-slate-900 text-white">Contacted</option>
                            <option value="Shortlisted" className="bg-slate-900 text-white">Shortlisted</option>
                            <option value="Interview" className="bg-slate-900 text-white">Interview</option>
                            <option value="Selected" className="bg-slate-900 text-white">Selected</option>
                            <option value="Rejected" className="bg-slate-900 text-white">Rejected</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-[11px] text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setSelectedLead(lead)} className="p-1.5 bg-slate-800 hover:bg-indigo-600 rounded text-slate-300 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteLead(lead._id)} className="p-1.5 bg-slate-800 hover:bg-rose-600 rounded text-slate-400 hover:text-white">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: EMPLOYER HIRING REQUESTS ==================== */}
      {activeTab === 'employers' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3">
            <div className="flex-grow relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search employer requests by company, contact person, job title..."
                value={employerSearch}
                onChange={(e) => setEmployerSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={employerStatusFilter}
              onChange={(e) => setEmployerStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-slate-500 text-xs">Loading Employer Requests...</div>
            ) : employerRequests.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs">No employer hiring requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Company</th>
                      <th className="py-3.5 px-4">Contact Person</th>
                      <th className="py-3.5 px-4">Job Title Required</th>
                      <th className="py-3.5 px-4">Openings & Type</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Submitted</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {employerRequests.map((req) => (
                      <tr
                        key={req._id}
                        onClick={() => setSelectedEmployerReq(req)}
                        className="hover:bg-slate-800/40 cursor-pointer"
                      >
                        <td className="py-4 px-4 font-bold text-white">{req.companyName}</td>
                        <td className="py-4 px-4 text-slate-200">
                          {req.contactPerson}<br />
                          <span className="text-[10px] text-slate-400">{req.email} • {req.phone}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-indigo-300">{req.jobTitle}</td>
                        <td className="py-4 px-4">{req.openings} Openings ({req.employmentType})</td>
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={req.status}
                            onChange={(e) => handleEmpStatusChange(req._id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${getBadgeStyle(
                              req.status
                            )}`}
                          >
                            <option value="Pending" className="bg-slate-900 text-white">Pending</option>
                            <option value="Contacted" className="bg-slate-900 text-white">Contacted</option>
                            <option value="In Progress" className="bg-slate-900 text-white">In Progress</option>
                            <option value="Fulfilled" className="bg-slate-900 text-white">Fulfilled</option>
                            <option value="Closed" className="bg-slate-900 text-white">Closed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-[11px] text-slate-400">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setSelectedEmployerReq(req)} className="p-1.5 bg-slate-800 hover:bg-indigo-600 rounded text-slate-300 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteEmployerReq(req._id)} className="p-1.5 bg-slate-800 hover:bg-rose-600 rounded text-slate-400 hover:text-white">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: WEEKEND CONSULTANCY BOOKINGS ==================== */}
      {activeTab === 'consultancy' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3">
            <div className="flex-grow relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search bookings by candidate name, email, phone..."
                value={consultancySearch}
                onChange={(e) => setConsultancySearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={consultancyStatusFilter}
              onChange={(e) => setConsultancyStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
            >
              <option value="All">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-slate-500 text-xs">Loading Weekend Bookings...</div>
            ) : consultancyBookings.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs">No consultancy bookings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Candidate</th>
                      <th className="py-3.5 px-4">Reason & Goal</th>
                      <th className="py-3.5 px-4">Preferred Slot</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Booked Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {consultancyBookings.map((b) => (
                      <tr
                        key={b._id}
                        onClick={() => setSelectedBooking(b)}
                        className="hover:bg-slate-800/40 cursor-pointer"
                      >
                        <td className="py-4 px-4 font-bold text-white">
                          {b.fullName}<br />
                          <span className="text-[10px] text-slate-400">{b.email} • {b.phone}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-200">
                          {b.consultationReason}
                        </td>
                        <td className="py-4 px-4 font-semibold text-purple-300">
                          📅 {b.preferredDay} ({b.preferredTime})
                        </td>
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={b.status}
                            onChange={(e) => handleBookingStatusChange(b._id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${getBadgeStyle(
                              b.status
                            )}`}
                          >
                            <option value="Booked" className="bg-slate-900 text-white">Booked</option>
                            <option value="Confirmed" className="bg-slate-900 text-white">Confirmed</option>
                            <option value="Completed" className="bg-slate-900 text-white">Completed</option>
                            <option value="Cancelled" className="bg-slate-900 text-white">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-[11px] text-slate-400">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setSelectedBooking(b)} className="p-1.5 bg-slate-800 hover:bg-indigo-600 rounded text-slate-300 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteBooking(b._id)} className="p-1.5 bg-slate-800 hover:bg-rose-600 rounded text-slate-400 hover:text-white">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Candidate Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{selectedLead.fullName} (Candidate Profile)</h3>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>Email:</strong> {selectedLead.email} | <strong>Phone:</strong> {selectedLead.phone}</p>
              <p><strong>Target Role:</strong> {selectedLead.preferredRole} | <strong>Location:</strong> {selectedLead.location || 'N/A'}</p>
              <p><strong>Experience:</strong> {selectedLead.experience} | <strong>Education:</strong> {selectedLead.education}</p>
              <p><strong>Skills:</strong> {(selectedLead.skills || []).join(', ')}</p>
              {selectedLead.linkedin && (
                <p><strong>LinkedIn:</strong> <a href={selectedLead.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{selectedLead.linkedin}</a></p>
              )}
              {selectedLead.resume && (
                <p className="pt-2">
                  <a href={getResumeUrl(selectedLead.resume)} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-indigo-600 text-white rounded font-bold">
                    View Resume
                  </a>
                </p>
              )}
            </div>

            <form onSubmit={handleAddLeadNote} className="pt-4 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Add private admin note..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
              />
              <button type="submit" disabled={addingNote} className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold text-xs">
                Add Note
              </button>
            </form>

            <div className="space-y-1">
              {(selectedLead.adminNotes || []).map((n, i) => (
                <p key={i} className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                  {n.text} <span className="text-slate-600">({new Date(n.createdAt).toLocaleString()})</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Employer Request Detail Modal */}
      {selectedEmployerReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{selectedEmployerReq.companyName} (Hiring Request)</h3>
              <button onClick={() => setSelectedEmployerReq(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>Contact Person:</strong> {selectedEmployerReq.contactPerson} | <strong>Email:</strong> {selectedEmployerReq.email} | <strong>Phone:</strong> {selectedEmployerReq.phone}</p>
              <p><strong>Job Title:</strong> {selectedEmployerReq.jobTitle} | <strong>Openings:</strong> {selectedEmployerReq.openings}</p>
              <p><strong>Employment Type:</strong> {selectedEmployerReq.employmentType} | <strong>Location:</strong> {selectedEmployerReq.location || 'N/A'}</p>
              <p><strong>Required Skills:</strong> {(selectedEmployerReq.requiredSkills || []).join(', ')}</p>
              <p><strong>Additional Requirements:</strong> {selectedEmployerReq.additionalRequirements || 'None'}</p>
            </div>

            <form onSubmit={handleAddEmpNote} className="pt-4 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Add private admin note..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
              />
              <button type="submit" disabled={addingNote} className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold text-xs">
                Add Note
              </button>
            </form>

            <div className="space-y-1">
              {(selectedEmployerReq.adminNotes || []).map((n, i) => (
                <p key={i} className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                  {n.text} <span className="text-slate-600">({new Date(n.createdAt).toLocaleString()})</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Consultancy Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{selectedBooking.fullName} (Weekend Consultancy)</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>Email:</strong> {selectedBooking.email} | <strong>Phone:</strong> {selectedBooking.phone}</p>
              <p><strong>Slot:</strong> {selectedBooking.preferredDay} ({selectedBooking.preferredTime})</p>
              <p><strong>Consultation Reason:</strong> {selectedBooking.consultationReason}</p>
              {selectedBooking.resume && (
                <p className="pt-1">
                  <a href={getResumeUrl(selectedBooking.resume)} target="_blank" rel="noreferrer" className="px-3 py-1 bg-purple-600 text-white rounded font-bold">
                    View Resume
                  </a>
                </p>
              )}
            </div>

            <form onSubmit={handleAddBookingNote} className="pt-4 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Add private admin note..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
              />
              <button type="submit" disabled={addingNote} className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold text-xs">
                Add Note
              </button>
            </form>

            <div className="space-y-1">
              {(selectedBooking.adminNotes || []).map((n, i) => (
                <p key={i} className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                  {n.text} <span className="text-slate-600">({new Date(n.createdAt).toLocaleString()})</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
