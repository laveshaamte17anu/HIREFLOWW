import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Bookmark, Calendar, Sparkles, ArrowRight, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, appsRes, interviewsRes, recRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/applications/my'),
          api.get('/interviews'),
          api.get('/users/recommended-jobs'),
        ]);

        setStats(statsRes.data);
        setRecentApps(appsRes.data.slice(0, 5));
        setInterviews(interviewsRes.data.filter((i) => i.status === 'Scheduled'));
        setRecommendedJobs(recRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error loading candidate dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Track your job applications, scheduled interviews, and personalized job matches.
          </p>
        </div>
        <Link
          to="/jobs"
          className="px-5 py-2.5 bg-white text-blue-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors flex items-center space-x-1.5 flex-shrink-0"
        >
          <span>Browse All Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Total Applications</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalApplications || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-extrabold text-indigo-600">{stats?.shortlisted || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Interviews</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{stats?.interviews || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Saved Jobs</span>
            <Bookmark className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{stats?.savedJobsCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
            <Link to="/candidate/applications" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No applications submitted yet.</p>
              <Link to="/jobs" className="text-xs text-blue-600 font-bold hover:underline inline-block">
                Start applying for jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div
                  key={app._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-100 transition-all gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {app.jobId?.title || 'Unknown Job'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {app.jobId?.companyName} • Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MatchScoreBadge score={app.matchScore || 50} />
                    <StatusBadge status={app.status} />
                    <Link
                      to={`/candidate/applications/${app._id}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Interviews & Recommendations */}
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
                    <p className="font-bold text-slate-900">{item.jobId?.title}</p>
                    <p className="text-amber-800">
                      📅 {item.date} at {item.time} ({item.type})
                    </p>
                    {item.meetingLink && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-bold underline block truncate"
                      >
                        Join: {item.meetingLink}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Recommended Jobs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Recommended Jobs</span>
              </h2>
              <Link to="/candidate/recommended-jobs" className="text-xs font-bold text-blue-600 hover:underline">
                See All
              </Link>
            </div>

            {recommendedJobs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Update profile skills to get recommendations.</p>
            ) : (
              <div className="space-y-3">
                {recommendedJobs.map((job) => (
                  <div key={job._id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-900">{job.title}</p>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {job.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-slate-500">{job.companyName} • {job.location}</p>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-block text-blue-600 font-bold hover:underline"
                    >
                      Apply Now →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
