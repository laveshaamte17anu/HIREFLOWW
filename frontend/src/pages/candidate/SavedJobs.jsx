import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Building2, MapPin, ArrowRight, Briefcase } from 'lucide-react';
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
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved & Bookmarked Jobs</h1>
        <p className="text-slate-500 text-xs mt-0.5">Quick access to positions you saved for later application.</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-900 font-bold text-base">No Saved Jobs</h3>
          <p className="text-slate-400 text-xs mt-1">Bookmark open jobs while browsing the portal to save them here.</p>
          <Link
            to="/jobs"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
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
                className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-blue-300 shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {job.jobType}
                    </span>
                    <button
                      onClick={() => handleUnsave(job._id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h3>

                  <p className="text-xs font-semibold text-slate-600 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{job.companyName}</span>
                    <span className="text-slate-300">•</span>
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{job.location}</span>
                  </p>

                  <p className="text-xs font-bold text-slate-900">💰 {job.salary}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-400">
                    Saved {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1"
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
