import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Bookmark, Calendar, Sparkles, ArrowRight, CheckCircle2, Clock, Search } from 'lucide-react';
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
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-28 bg-slate-900 animate-pulse rounded-3xl border border-slate-800"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-slate-100 font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl border border-blue-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 font-bold text-[11px] rounded-full border border-blue-500/30">
            Candidate Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Track your job applications, scheduled interviews, and personalized job matches.
          </p>
        </div>
        <Link
          to="/jobs"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center space-x-2 flex-shrink-0"
        >
          <span>Browse All Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold">Total Applications</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalApplications || 0}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-indigo-400">{stats?.shortlisted || 0}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold">Interviews</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">{stats?.interviews || 0}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold">Saved Jobs</span>
            <Bookmark className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{stats?.savedJobsCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications Column */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">Recent Applications</h2>
            <Link to="/candidate/applications" className="text-xs font-bold text-blue-400 hover:underline">
              View All
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-xs font-semibold text-slate-300">You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="text-xs text-blue-400 font-bold hover:underline inline-block">
                Start applying for jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div
                  key={app._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950 hover:bg-slate-950/80 rounded-2xl border border-slate-800/80 transition-all gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">
                      {app.jobId?.title || 'Unknown Job'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {app.jobId?.companyName} • Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MatchScoreBadge score={app.matchScore || 50} />
                    <StatusBadge status={app.status} />
                    <Link
                      to={`/candidate/applications/${app._id}`}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300"
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
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Upcoming Interviews</span>
            </h2>

            {interviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No interviews scheduled.</p>
            ) : (
              <div className="space-y-3">
                {interviews.map((item) => (
                  <div key={item._id} className="p-4 bg-slate-950 rounded-2xl border border-amber-500/20 text-xs space-y-1.5">
                    <p className="font-bold text-white">{item.jobId?.title}</p>
                    <p className="text-amber-400 font-semibold">
                      📅 {item.date} at {item.time} ({item.type})
                    </p>
                    {item.meetingLink && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 font-bold underline block truncate"
                      >
                        Join Link: {item.meetingLink}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Recommended Jobs */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Recommended Jobs</span>
              </h2>
              <Link to="/candidate/recommended-jobs" className="text-xs font-bold text-blue-400 hover:underline">
                See All
              </Link>
            </div>

            {recommendedJobs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Update profile skills to get recommendations.</p>
            ) : (
              <div className="space-y-3">
                {recommendedJobs.map((job) => (
                  <div key={job._id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-white">{job.title}</p>
                      <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {job.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-slate-400">{job.companyName} • {job.location}</p>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-block text-blue-400 font-bold hover:underline"
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
