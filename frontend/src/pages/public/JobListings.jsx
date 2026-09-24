import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Building2, Briefcase, Filter, RefreshCw, ArrowRight, DollarSign, Calendar, ChevronRight, Layers } from 'lucide-react';
import api from '../../services/api';

const JobListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [company, setCompany] = useState('');
  const [jobType, setJobType] = useState('All');
  const [experience, setExperience] = useState('All');
  const [education, setEducation] = useState('All');
  const [skill, setSkill] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (keyword) query.append('keyword', keyword);
      if (location) query.append('location', location);
      if (company) query.append('company', company);
      if (jobType && jobType !== 'All') query.append('jobType', jobType);
      if (experience && experience !== 'All') query.append('experience', experience);
      if (education && education !== 'All') query.append('education', education);
      if (skill) query.append('skill', skill);
      if (sort) query.append('sort', sort);

      const res = await api.get(`/jobs?${query.toString()}`);
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching job listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearFilters = () => {
    setKeyword('');
    setLocation('');
    setCompany('');
    setJobType('All');
    setExperience('All');
    setEducation('All');
    setSkill('');
    setSort('newest');
    setSearchParams({});
    fetchJobs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-100 font-sans">
      {/* Page Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Careers Portal</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Browse Open Positions</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Discover verified job openings published by recruiter admins across top technology roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="font-bold text-white text-sm flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-400" />
              <span>Search Filters</span>
            </h2>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-300 mb-1">Keyword / Title</label>
              <input
                type="text"
                placeholder="e.g. React Developer"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Remote or New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Company</label>
              <input
                type="text"
                placeholder="Company name..."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Required Skill</label>
              <input
                type="text"
                placeholder="e.g. Node.js, Python"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Job Cards Stream */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-300">
              Showing <span className="text-blue-400 font-extrabold">{jobs.length}</span> published opportunities
            </span>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-semibold">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl outline-none font-semibold text-white text-xs"
              >
                <option value="newest">Recently Posted</option>
                <option value="oldest">Oldest First</option>
                <option value="deadline">Approaching Deadline</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-40 bg-slate-900 animate-pulse rounded-3xl border border-slate-800" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-slate-900 p-12 text-center rounded-3xl border border-slate-800 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-white font-bold text-lg">No opportunities available right now.</h3>
              <p className="text-slate-400 text-xs">Try adjusting your filter search criteria or reset filters.</p>
              <button
                onClick={handleClearFilters}
                className="mt-2 px-5 py-2.5 bg-blue-600/20 text-blue-400 font-bold text-xs rounded-xl hover:bg-blue-600/30 transition-colors border border-blue-500/30"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-blue-500/40 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-2.5 max-w-xl">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                        {job.jobType}
                      </span>
                      <span className="text-slate-500">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                    </h3>

                    <p className="text-xs font-semibold text-slate-400 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <span>{job.companyName}</span>
                      <span className="text-slate-700">•</span>
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>{job.location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-1">
                      <span>💰 Salary: {job.salary || 'Competitive'}</span>
                      <span>Exp: {job.experience || 'Not specified'}</span>
                      <span>Vacancies: {job.vacancies || 1}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills?.map((sk, idx) => (
                        <span key={idx} className="bg-slate-950 text-slate-300 text-[11px] px-2.5 py-0.5 rounded-lg border border-slate-800 font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 items-stretch md:items-end flex-shrink-0">
                    <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all text-center flex items-center justify-center space-x-1.5"
                    >
                      <span>View Job</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;
