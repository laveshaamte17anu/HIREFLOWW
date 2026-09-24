import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Building2, Link as LinkIcon } from 'lucide-react';
import api from '../../services/api';

const CandidateInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get('/interviews');
        setInterviews(res.data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-900 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-slate-900 animate-pulse rounded-3xl border border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100 font-sans">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-amber-400" />
          <span>Scheduled Interviews</span>
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">Recruiter interview invitations and video meeting details.</p>
      </div>

      {interviews.length === 0 ? (
        <div className="bg-slate-900 p-12 text-center rounded-3xl border border-slate-800 space-y-2">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <h3 className="text-white font-bold text-base">No Scheduled Interviews</h3>
          <p className="text-slate-400 text-xs">When an admin recruiter shortlists you and schedules an interview, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900 p-6 rounded-3xl border border-amber-500/30 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 font-bold text-xs rounded-full border border-amber-500/20">
                    Status: {item.status}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-2">
                    {item.jobId?.title || 'Job Interview'}
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 flex items-center space-x-2 mt-1">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>{item.adminId?.companyName || item.jobId?.companyName || 'Recruiter'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="text-slate-500 block font-medium">Date</span>
                    <span className="font-bold text-white">{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="text-slate-500 block font-medium">Time</span>
                    <span className="font-bold text-white">{item.time}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-slate-500 block font-medium">Format</span>
                    <span className="font-bold text-white">{item.type}</span>
                  </div>
                </div>
              </div>

              {item.meetingLink && (
                <div className="p-4 bg-blue-950/60 border border-blue-500/30 rounded-2xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 truncate">
                    <LinkIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="font-bold text-white">Meeting Link:</span>
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 font-bold underline truncate"
                    >
                      {item.meetingLink}
                    </a>
                  </div>
                  <a
                    href={item.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex-shrink-0 transition-colors text-center"
                  >
                    Join Meeting
                  </a>
                </div>
              )}

              {item.notes && (
                <div className="text-xs text-slate-300 italic bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <strong className="text-slate-200">Recruiter Note:</strong> "{item.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateInterviews;
