import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Link as LinkIcon, Building2, User, PlusCircle } from 'lucide-react';
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
          <span>Managed Candidate Interviews</span>
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">Track and update interview schedules for candidates who applied to your jobs.</p>
      </div>

      {interviews.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-900 font-bold text-base">No Scheduled Interviews</h3>
          <p className="text-slate-400 text-xs mt-1">Schedule interviews by viewing candidates in your Applicant Pipeline.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded-full border border-amber-200">
                    Status: {item.status}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">
                    Candidate: {item.candidateId?.name} ({item.candidateId?.email})
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Job Position: <strong className="text-slate-800">{item.jobId?.title}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(item._id, 'Completed')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(item._id, 'Cancelled')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
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
                    <span className="text-slate-400 block font-medium">Format</span>
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
