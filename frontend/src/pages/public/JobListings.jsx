import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Building2, Briefcase, Filter, RefreshCw, ArrowRight, DollarSign, Calendar } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Browse Open Positions</h1>
        <p className="text-slate-600 text-sm mt-1">Discover verified job openings published by recruiter admins.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Search Filters</span>
            </h2>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Keyword / Title</label>
              <input
                type="text"
                placeholder="e.g. React Developer"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. New York or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
              <input
                type="text"
                placeholder="Company name..."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs bg-white"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skill</label>
              <input
                type="text"
                placeholder="e.g. Node.js, Python"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Job Cards Stream */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600">
              Showing <span className="text-blue-600">{jobs.length}</span> published jobs
            </span>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-semibold">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
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
                <div key={n} className="h-36 bg-slate-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-700 font-bold text-lg">No matching jobs found</p>
              <p className="text-slate-400 text-xs mt-1">Try adjusting your filter search criteria or reset filters.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                        {job.jobType}
                      </span>
                      <span className="text-xs text-slate-400">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                    </h3>

                    <p className="text-sm font-semibold text-slate-600 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{job.companyName}</span>
                      <span className="text-slate-300">•</span>
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{job.location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-1">
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-slate-900 font-semibold">{job.salary}</span>
                      </span>
                      <span>Exp: {job.experience}</span>
                      <span>Vacancies: {job.vacancies}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.skills?.map((skill, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 items-stretch md:items-end flex-shrink-0">
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all text-center flex items-center justify-center space-x-1.5"
                    >
                      <span>View Details</span>
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
