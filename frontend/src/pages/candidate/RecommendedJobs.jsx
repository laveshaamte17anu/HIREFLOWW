import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Building2, MapPin, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/users/recommended-jobs');
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

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
          <Sparkles className="w-6 h-6 text-blue-400" />
          <span>Recommended Opportunities</span>
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Jobs matched against your profile skills, experience level, and preferred location.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-slate-900 p-12 text-center rounded-3xl border border-slate-800 space-y-3">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-white font-bold text-base">No Matching Recommendations Found</h3>
          <p className="text-slate-400 text-xs">Add your technical skills and education to your candidate profile to receive personalized job matches!</p>
          <Link
            to="/candidate/profile"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
          >
            Update My Profile
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-blue-500/40 shadow-sm transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <MatchScoreBadge score={job.matchScore} />
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                      {job.jobType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-2">
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h3>

                  <p className="text-xs font-semibold text-slate-400 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>{job.companyName}</span>
                    <span className="text-slate-700">•</span>
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{job.location}</span>
                  </p>
                </div>

                <Link
                  to={`/jobs/${job._id}`}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all text-center flex items-center justify-center space-x-1.5 flex-shrink-0"
                >
                  <span>Review & Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Match Score Reason Breakdown */}
              {job.matchBreakdown && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <p className="font-bold text-slate-300">Match Breakdown:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400">
                    <div>
                      <span className="font-semibold text-emerald-400">Matched Skills: </span>
                      {job.matchBreakdown.matchedSkills?.length > 0
                        ? job.matchBreakdown.matchedSkills.join(', ')
                        : 'General overlap'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-300">Experience Match: </span>
                      {job.matchBreakdown.experienceMatch}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-300">Education Match: </span>
                      {job.matchBreakdown.educationMatch}
                    </div>
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

export default RecommendedJobs;
