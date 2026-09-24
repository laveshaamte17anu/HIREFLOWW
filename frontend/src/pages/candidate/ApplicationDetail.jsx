import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, CheckCircle2, Calendar, FileText, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import { getResumeUrl } from '../../utils/downloadHelpers';

const ApplicationDetail = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/applications/${id}`);
        setApp(res.data);
      } catch (error) {
        console.error('Error fetching application detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-slate-900 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-slate-900 animate-pulse rounded-3xl border border-slate-800"></div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 space-y-3">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Application Not Found</h2>
        <Link to="/candidate/applications" className="text-blue-400 font-bold text-xs hover:underline inline-block">
          Back to Applications
        </Link>
      </div>
    );
  }

  const timelineStages = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];
  const isRejected = app.status === 'Rejected';

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-100 font-sans">
      <Link
        to="/candidate/applications"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Applications</span>
      </Link>

      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <StatusBadge status={app.status} />
              <MatchScoreBadge score={app.matchScore || 50} />
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-2">
              {app.jobId?.title || 'Job Application'}
            </h1>
            <p className="text-xs font-semibold text-slate-400 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>{app.jobId?.companyName}</span>
              <span className="text-slate-700">•</span>
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{app.jobId?.location}</span>
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Submitted: {new Date(app.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Status Timeline Workflow */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Application Progression Timeline</h2>

          {isRejected ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 space-y-1">
              <p className="font-bold flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>Application Status: Rejected</span>
              </p>
              <p className="text-slate-300">Thank you for applying. The recruiter decided not to move forward with this application at this time.</p>
            </div>
          ) : (
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {timelineStages.map((stage, idx) => {
                  const stageIndex = timelineStages.indexOf(app.status);
                  const isPassed = idx <= stageIndex;
                  const isCurrent = app.status === stage;

                  return (
                    <div key={stage} className="flex md:flex-col items-center space-x-3 md:space-x-0 text-center z-10 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCurrent
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20'
                            : isPassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span className={`text-xs font-bold mt-2 ${isCurrent ? 'text-blue-400' : isPassed ? 'text-white' : 'text-slate-500'}`}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Scheduled Interview Card */}
        {app.interview && (
          <div className="p-6 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Interview Scheduled by Recruiter</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <p>📅 <strong className="text-white">Date:</strong> {app.interview.date}</p>
              <p>⏰ <strong className="text-white">Time:</strong> {app.interview.time}</p>
              <p>💻 <strong className="text-white">Type:</strong> {app.interview.type}</p>
            </div>
            {app.interview.meetingLink && (
              <div className="text-xs pt-1">
                <span className="font-bold text-slate-400">Meeting Link: </span>
                <a
                  href={app.interview.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 font-bold underline"
                >
                  {app.interview.meetingLink}
                </a>
              </div>
            )}
            {app.interview.notes && (
              <p className="text-xs text-slate-400 italic">Notes: "{app.interview.notes}"</p>
            )}
          </div>
        )}

        {/* Submitted Information */}
        <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
          <h2 className="text-base font-bold text-white">Submitted Application Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <div>
              <p className="text-slate-500 font-semibold">Full Name</p>
              <p className="font-bold text-white text-sm mt-0.5">{app.fullName}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Email & Phone</p>
              <p className="font-bold text-white text-sm mt-0.5">{app.email} • {app.phone}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Education</p>
              <p className="font-bold text-white text-sm mt-0.5">{app.education}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Experience</p>
              <p className="font-bold text-white text-sm mt-0.5">{app.experience}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Expected Salary / Notice</p>
              <p className="font-bold text-white text-sm mt-0.5">
                {app.expectedSalary || 'N/A'} • {app.noticePeriod || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Submitted Resume</p>
              {app.resume ? (
                <a
                  href={getResumeUrl(app.resume)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-blue-400 font-bold hover:underline mt-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Uploaded Resume</span>
                </a>
              ) : (
                <p className="text-slate-500">No file attached</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
