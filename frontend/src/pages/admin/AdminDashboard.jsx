import React, { useState, useEffect } from 'react';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import { Link } from 'react-router-dom';
import {
  
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  PlusCircle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  ArrowRight,
  Download,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { downloadApplicantsCSV } from '../../utils/downloadHelpers';
import { useToast } from '../../context/ToastContext';


const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, jobsRes, appsRes, interviewsRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/jobs/admin/my-jobs'),
          api.get('/applications/admin'),
          api.get('/interviews'),
        ]);

        setStats(statsRes.data);
        setRecentJobs(jobsRes.data.slice(0, 4));
        setRecentApps(appsRes.data.slice(0, 5));
        setInterviews(interviewsRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching admin dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-28 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 font-bold text-xs rounded-full border border-blue-500/30 mb-2">
            Recruiter Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Recruiter Admin'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Manage your posted jobs, evaluate rule-based candidate match scores, and schedule interviews.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/jobs/create"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
          <button
            onClick={() => downloadApplicantsCSV(addToast)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Applicants CSV</span>
          </button>
        </div>
      </div>

      {/* Recruiter Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Jobs</span>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.totalJobs || 0}</p>
          <span className="text-[10px] text-emerald-600 font-bold">{stats?.publishedJobs || 0} Published</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 block">Applications</span>
          <p className="text-2xl font-extrabold text-blue-600">{stats?.totalApplications || 0}</p>
          <span className="text-[10px] text-slate-500 font-medium">Received for your jobs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 block">Shortlisted</span>
          <p className="text-2xl font-extrabold text-indigo-600">{stats?.shortlisted || 0}</p>
          <span className="text-[10px] text-indigo-500 font-semibold">Ready for interview</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 block">Interviews</span>
          <p className="text-2xl font-extrabold text-amber-600">{stats?.interviews || 0}</p>
          <span className="text-[10px] text-amber-500 font-semibold">Scheduled</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 block">Selected</span>
          <p className="text-2xl font-extrabold text-emerald-600">{stats?.selected || 0}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Hired Candidates</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 block">Rejected</span>
          <p className="text-2xl font-extrabold text-rose-600">{stats?.rejected || 0}</p>
          <span className="text-[10px] text-rose-500 font-medium">Passed on</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Job Postings & Applicant Pipeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Jobs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Your Active Job Postings</h2>
              <Link to="/admin/jobs" className="text-xs font-bold text-blue-600 hover:underline">
                Manage All Jobs
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Briefcase className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No jobs posted yet.</p>
                <Link to="/admin/jobs/create" className="text-xs text-blue-600 font-bold hover:underline inline-block">
                  Create your first job listing
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-all gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <StatusBadge status={job.status} />
                        <span className="text-slate-400">• Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                      <p className="text-slate-500">{job.location} • {job.jobType} • {job.applicationsCount || 0} applicants</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/jobs/${job._id}/edit`}
                        className="px-3 py-1.5 bg-white border border-slate-200 font-bold text-slate-700 rounded-lg hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/admin/applications?jobId=${job._id}`}
                        className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                      >
                        View Applicants ({job.applicationsCount || 0})
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Candidates */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Recent Candidate Applications</h2>
              <Link to="/admin/applications" className="text-xs font-bold text-blue-600 hover:underline">
                Full Applicant Pipeline
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No applications received yet for your jobs.</p>
            ) : (
              <div className="space-y-3">
                {recentApps.map((app) => (
                  <div
                    key={app._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/40 rounded-2xl border border-slate-100 transition-all gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {app.fullName || app.candidateId?.name}
                        </span>
                        <MatchScoreBadge score={app.matchScore || 50} />
                      </div>
                      <p className="text-slate-500">
                        Applied for <strong className="text-slate-700">{app.jobId?.title}</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <StatusBadge status={app.status} />
                      <Link
                        to={`/admin/applications/${app._id}`}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        Review Candidate →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Recruiter Tools */}
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Upcoming Interviews</span>
            </h2>

            {interviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming interviews scheduled.</p>
            ) : (
              <div className="space-y-3">
                {interviews.map((item) => (
                  <div key={item._id} className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 text-xs space-y-1">
                    <p className="font-bold text-slate-900">Candidate: {item.candidateId?.name}</p>
                    <p className="text-slate-600">Job: {item.jobId?.title}</p>
                    <p className="text-amber-800 font-semibold">
                      📅 {item.date} at {item.time} ({item.type})
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/admin/interviews"
              className="block text-center text-xs font-bold text-blue-600 hover:underline pt-2"
            >
              Manage All Interviews
            </Link>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
