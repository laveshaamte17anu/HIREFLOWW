import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Building2, MapPin, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
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
          <Sparkles className="w-6 h-6 text-blue-600" />
          <span>Recommended Opportunities</span>
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Jobs matched against your profile skills, experience level, and preferred location.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-900 font-bold text-base">No Matching Recommendations Found</h3>
          <p className="text-slate-400 text-xs mt-1">Add your technical skills and education to your candidate profile to receive personalized job matches!</p>
          <Link
            to="/candidate/profile"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            Update My Profile
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-blue-300 shadow-xs transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <MatchScoreBadge score={job.matchScore} />
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {job.jobType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h3>

                  <p className="text-xs font-semibold text-slate-600 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{job.companyName}</span>
                    <span className="text-slate-300">•</span>
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{job.location}</span>
                  </p>
                </div>

                <Link
                  to={`/jobs/${job._id}`}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all text-center flex items-center justify-center space-x-1.5 flex-shrink-0"
                >
                  <span>Review & Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Match Score Reason Breakdown */}
              {job.matchBreakdown && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <p className="font-bold text-slate-700">Rule-Based Match Breakdown:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
                    <div>
                      <span className="font-semibold text-emerald-700">Matched Skills: </span>
                      {job.matchBreakdown.matchedSkills?.length > 0
                        ? job.matchBreakdown.matchedSkills.join(', ')
                        : 'General overlap'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Experience Match: </span>
                      {job.matchBreakdown.experienceMatch}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Education Match: </span>
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
