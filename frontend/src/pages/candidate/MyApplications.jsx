import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Building2, MapPin, Calendar, Search } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my');
        setApplications(res.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApps = statusFilter === 'All'
    ? applications
    : applications.filter((a) => a.status === statusFilter);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Job Applications</h1>
          <p className="text-slate-500 text-xs mt-0.5">Track live progress and interview schedules across your submissions.</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-500">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none font-semibold text-slate-700"
          >
            <option value="All">All Statuses ({applications.length})</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-900 font-bold text-base">No Applications Found</h3>
          <p className="text-slate-400 text-xs mt-1">You haven't submitted any job applications under this status filter.</p>
          <Link
            to="/jobs"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            Browse Open Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app._id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-blue-300 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <StatusBadge status={app.status} />
                  <MatchScoreBadge score={app.matchScore || 50} />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {app.jobId?.title || 'Job Posting'}
                </h2>

                <p className="text-xs font-semibold text-slate-600 flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{app.jobId?.companyName}</span>
                  <span className="text-slate-300">•</span>
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{app.jobId?.location}</span>
                </p>

                <p className="text-xs text-slate-400">
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  to={`/candidate/applications/${app._id}`}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5"
                >
                  <span>View Status Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
