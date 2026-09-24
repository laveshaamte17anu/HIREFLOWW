import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Building2, MapPin, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/saved-jobs');
      setSavedJobs(res.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setSavedJobs((prev) => prev.filter((s) => (s.jobId?._id || s.jobId) !== jobId));
      addToast('Job removed from saved list', 'info');
    } catch (error) {
      addToast('Failed to remove saved job', 'error');
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
        <h1 className="text-2xl font-black text-white tracking-tight">Saved & Bookmarked Jobs</h1>
        <p className="text-slate-400 text-xs mt-0.5">Quick access to positions you saved for later application.</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-slate-900 p-12 text-center rounded-3xl border border-slate-800 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-white font-bold text-base">No Saved Jobs</h3>
          <p className="text-slate-400 text-xs">Bookmark open jobs while browsing the portal to save them here.</p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
          >
            Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((item) => {
            const job = item.jobId;
            if (!job) return null;

            return (
              <div
                key={item._id}
                className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-blue-500/40 shadow-sm transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                      {job.jobType}
                    </span>
                    <button
                      onClick={() => handleUnsave(job._id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h3>

                  <p className="text-xs font-semibold text-slate-400 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>{job.companyName}</span>
                    <span className="text-slate-700">•</span>
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{job.location}</span>
                  </p>

                  <p className="text-xs font-bold text-white">💰 {job.salary || 'Competitive'}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Saved {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
