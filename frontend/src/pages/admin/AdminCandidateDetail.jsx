import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Linkedin,
  Github,
  Globe,
  Sparkles,
  Send,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import { useToast } from '../../context/ToastContext';
import { getResumeUrl } from '../../utils/downloadHelpers';

const AdminCandidateDetail = () => {
  const { id } = useParams();
  const { addToast } = useToast();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interview Schedule Modal state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState('Online');
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const fetchApplication = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/applications/${id}`);
      setApp(res.data);
      if (res.data.interview) {
        setInterviewDate(res.data.interview.date || '');
        setInterviewTime(res.data.interview.time || '');
        setInterviewType(res.data.interview.type || 'Online');
        setMeetingLink(res.data.interview.meetingLink || '');
        setLocation(res.data.interview.location || '');
        setNotes(res.data.interview.notes || '');
      }
    } catch (error) {
      console.error('Error fetching candidate detail:', error);
      addToast('Failed to load candidate application details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      setApp((prev) => ({ ...prev, status: newStatus }));
      addToast(`Status updated to "${newStatus}"`, 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setScheduling(true);
    try {
      const res = await api.post('/interviews', {
        applicationId: id,
        date: interviewDate,
        time: interviewTime,
        type: interviewType,
        meetingLink,
        location,
        notes,
      });

      addToast('Interview scheduled and notification sent to candidate!', 'success');
      setApp((prev) => ({ ...prev, status: 'Interview', interview: res.data }));
      setShowInterviewModal(false);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to schedule interview', 'error');
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-slate-700 font-bold text-base">Application Not Found</p>
        <Link to="/admin/applications" className="text-blue-600 font-bold text-xs mt-2 inline-block">
          Back to Applicant Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        to="/admin/applications"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Applicant Pipeline</span>
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <StatusBadge status={app.status} />
              <MatchScoreBadge score={app.matchScore || 50} />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 mt-2">{app.fullName}</h1>
            <p className="text-xs text-slate-500">
              Applied for <strong className="text-slate-900">{app.jobId?.title}</strong> on{' '}
              {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('Shortlisted')}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl"
            >
              Shortlist Candidate
            </button>

            <button
              onClick={() => setShowInterviewModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>

            <button
              onClick={() => handleStatusChange('Selected')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Select Candidate
            </button>

            <button
              onClick={() => handleStatusChange('Rejected')}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl"
            >
              Reject
            </button>
          </div>
        </div>

        {/* Rule-Based Match Breakdown Box */}
        {app.matchBreakdown && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200/80 space-y-3">
            <h2 className="text-sm font-bold text-blue-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Rule-Based Match Score Breakdown ({app.matchScore}%)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500 block">Matched Skills</span>
                <span className="font-bold text-slate-900">
                  {app.matchBreakdown.matchedSkills?.length > 0
                    ? app.matchBreakdown.matchedSkills.join(', ')
                    : 'General Overlap'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Missing Skills</span>
                <span className="font-bold text-slate-600">
                  {app.matchBreakdown.missingSkills?.length > 0
                    ? app.matchBreakdown.missingSkills.join(', ')
                    : 'None'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Experience Match</span>
                <span className="font-bold text-slate-900">{app.matchBreakdown.experienceMatch}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Education Match</span>
                <span className="font-bold text-slate-900">{app.matchBreakdown.educationMatch}</span>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Interview Banner if present */}
        {app.interview && (
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Scheduled Interview Details</span>
            </h3>
            <p className="text-slate-700">
              📅 Date: <strong>{app.interview.date}</strong> | ⏰ Time: <strong>{app.interview.time}</strong> | Format: <strong>{app.interview.type}</strong>
            </p>
            {app.interview.meetingLink && (
              <p className="text-blue-600 font-bold underline">Link: {app.interview.meetingLink}</p>
            )}
          </div>
        )}

        {/* Candidate Information Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Applicant Dossier & Contact</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Email Address</span>
              <span className="font-bold text-slate-900 text-sm">{app.email}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Phone Number</span>
              <span className="font-bold text-slate-900 text-sm">{app.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Highest Education</span>
              <span className="font-bold text-slate-900 text-sm">{app.education}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Experience Level</span>
              <span className="font-bold text-slate-900 text-sm">{app.experience}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Location</span>
              <span className="font-bold text-slate-900 text-sm">{app.location || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Expected Salary / Notice</span>
              <span className="font-bold text-slate-900 text-sm">
                {app.expectedSalary || 'N/A'} • {app.noticePeriod || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Candidate Skills */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">Candidate Skills</h2>
          <div className="flex flex-wrap gap-2">
            {app.skills?.map((skill, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-800 font-bold text-xs px-3 py-1 rounded-lg">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Links & Resume File */}
        <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
          <h2 className="text-base font-bold text-slate-900">Uploaded Resume & Profiles</h2>
          <div className="flex flex-wrap gap-4 items-center">
            {app.resume && (
              <a
                href={getResumeUrl(app.resume)}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>View / Download Resume PDF</span>
              </a>
            )}

            {app.linkedin && (
              <a
                href={app.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 flex items-center space-x-1.5"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>LinkedIn</span>
              </a>
            )}

            {app.github && (
              <a
                href={app.github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 flex items-center space-x-1.5"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}

            {app.portfolio && (
              <a
                href={app.portfolio}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 flex items-center space-x-1.5"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Schedule Interview</h3>
              <button onClick={() => setShowInterviewModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Interview Date *</label>
                <input
                  type="date"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interview Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10:00 AM EST"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interview Format</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Online">Online Video Call</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Phone">Phone Screen</option>
                </select>
              </div>

              {interviewType === 'Online' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meeting Link (Google Meet / Zoom / Teams)</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {interviewType === 'In-Person' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Office Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Suite 400, Floor 4, HQ Building"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Instructions for Candidate</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Please bring an updated copy of your portfolio..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{scheduling ? 'Scheduling...' : 'Confirm Schedule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCandidateDetail;
