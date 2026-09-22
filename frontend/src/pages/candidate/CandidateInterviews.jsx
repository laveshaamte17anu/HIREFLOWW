import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, MapPin, Link as LinkIcon, Building2, AlertCircle } from 'lucide-react';
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
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-amber-500" />
          <span>Scheduled Interviews</span>
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">Recruiter interview invitations and video meeting links.</p>
      </div>

      {interviews.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-900 font-bold text-base">No Scheduled Interviews</h3>
          <p className="text-slate-400 text-xs mt-1">When an admin recruiter shortlists you and schedules an interview, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded-full border border-amber-200">
                    Status: {item.status}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">
                    {item.jobId?.title || 'Job Interview'}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{item.adminId?.companyName || item.jobId?.companyName || 'Recruiter'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-slate-400 block font-medium">Date</span>
                    <span className="font-bold text-slate-900">{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-slate-400 block font-medium">Time</span>
                    <span className="font-bold text-slate-900">{item.time}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-slate-400 block font-medium">Interview Format</span>
                    <span className="font-bold text-slate-900">{item.type}</span>
                  </div>
                </div>
              </div>

              {item.meetingLink && (
                <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2 truncate">
                    <LinkIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-bold text-blue-900">Meeting Link:</span>
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-bold underline truncate"
                    >
                      {item.meetingLink}
                    </a>
                  </div>
                  <a
                    href={item.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex-shrink-0 transition-colors"
                  >
                    Join Meeting
                  </a>
                </div>
              )}

              {item.notes && (
                <div className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl">
                  <strong>Recruiter Note:</strong> "{item.notes}"
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
