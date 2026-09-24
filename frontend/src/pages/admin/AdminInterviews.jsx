import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Link as LinkIcon } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchInterviews = async () => {
    try {
      const res = await api.get('/interviews');
      setInterviews(res.data);
    } catch (error) {
      console.error('Error fetching admin interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/interviews/${id}/status`, { status });
      setInterviews((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status } : i))
      );
      addToast(`Interview status updated to ${status}`, 'success');
    } catch (error) {
      addToast('Failed to update interview status', 'error');
    }
  };

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
          <span>Managed Candidate Interviews</span>
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">Track and update interview schedules for candidates who applied to your jobs.</p>
      </div>

      {interviews.length === 0 ? (
        <div className="bg-slate-900 p-12 text-center rounded-3xl border border-slate-800 space-y-2">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <h3 className="text-white font-bold text-base">No Scheduled Interviews</h3>
          <p className="text-slate-400 text-xs">Schedule interviews by viewing candidates in your Applicant Pipeline.</p>
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
                  <h2 className="text-lg font-bold text-white mt-2">
                    Candidate: {item.candidateId?.name} ({item.candidateId?.email})
                  </h2>
                  <p className="text-xs font-semibold text-slate-400">
                    Job Position: <strong className="text-white">{item.jobId?.title}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(item._id, 'Completed')}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/20 cursor-pointer"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(item._id, 'Cancelled')}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-xl border border-rose-500/20 cursor-pointer"
                  >
                    Cancel
                  </button>
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
                <div className="p-4 bg-blue-950/60 border border-blue-500/30 rounded-2xl text-xs flex items-center justify-between">
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInterviews;
