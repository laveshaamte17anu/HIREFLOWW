import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, Filter, ArrowUpDown, Calendar, CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import { useToast } from '../../context/ToastContext';
import { downloadApplicantsCSV } from '../../utils/downloadHelpers';

const AdminApplications = () => {
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get('jobId');

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('matchScore');
  const { addToast } = useToast();

  const fetchApplications = async () => {
    try {
      const endpoint = jobIdParam
        ? `/applications/job/${jobIdParam}`
        : '/applications/admin';
      const res = await api.get(endpoint);
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching admin applications:', error);
      addToast('Failed to load candidate applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobIdParam]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
      addToast(`Applicant status updated to ${newStatus}`, 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  // Filter & Sort applicants
  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === 'matchScore') {
      return (b.matchScore || 0) - (a.matchScore || 0);
    } else if (sortBy === 'dateNewest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'dateOldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Applicant Pipeline & Match Ranking</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Evaluate candidate match scores, update recruitment stages, and export candidate data.
          </p>
        </div>

        <button
          onClick={() => downloadApplicantsCSV(addToast)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Control Bar: Filter & Sort */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white outline-none font-bold text-slate-800"
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

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white outline-none font-bold text-slate-800"
          >
            <option value="matchScore">Highest Match Score</option>
            <option value="dateNewest">Newest Application</option>
            <option value="dateOldest">Oldest Application</option>
          </select>
        </div>
      </div>

      {sortedApps.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-900 font-bold text-base">No Applicants Found</h3>
          <p className="text-slate-400 text-xs mt-1">No candidate applications match your current status filters for your jobs.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Rank & Candidate</th>
                  <th className="p-4">Applied Job</th>
                  <th className="p-4">Match Score</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 text-right">Quick Pipeline Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {sortedApps.map((app, index) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-slate-600 flex items-center justify-center text-[10px]">
                          #{index + 1}
                        </span>
                        <div>
                          <Link
                            to={`/admin/applications/${app._id}`}
                            className="font-bold text-slate-900 text-sm hover:text-blue-600"
                          >
                            {app.fullName || app.candidateId?.name}
                          </Link>
                          <p className="text-slate-400 text-[11px]">{app.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">{app.jobId?.title || 'Unknown Job'}</p>
                      <p className="text-slate-400 text-[10px]">{app.jobId?.companyName}</p>
                    </td>

                    <td className="p-4">
                      <MatchScoreBadge score={app.matchScore || 50} />
                    </td>

                    <td className="p-4 text-slate-800 font-semibold">
                      {app.experience}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="p-4 text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {app.status === 'Applied' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'Under Review')}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg"
                          >
                            Review
                          </button>
                        )}

                        {app.status !== 'Shortlisted' && app.status !== 'Selected' && app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg"
                          >
                            Shortlist
                          </button>
                        )}

                        {app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'Rejected')}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg"
                          >
                            Reject
                          </button>
                        )}

                        <Link
                          to={`/admin/applications/${app._id}`}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
                        >
                          Review & Schedule
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
