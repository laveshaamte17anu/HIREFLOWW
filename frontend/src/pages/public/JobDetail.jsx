import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Briefcase,
  Bookmark,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Upload,
  Calendar,
  DollarSign,
  UserCheck,
  Award
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCandidate, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [existingAppStatus, setExistingAppStatus] = useState('');

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Application Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJobAndUserData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);

        if (user && isCandidate) {
          setFullName(user.name || '');
          setEmail(user.email || '');
          setPhone(user.phone || '');
          setEducation(user.education || '');
          setExperience(user.experience || '');
          setSkills(Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '');
          setLocation(user.location || '');
          setLinkedin(user.linkedin || '');
          setGithub(user.github || '');
          setPortfolio(user.portfolio || '');

          try {
            const appsRes = await api.get('/applications/my');
            const match = appsRes.data.find((a) => (a.jobId?._id || a.jobId) === id);
            if (match) {
              setHasApplied(true);
              setExistingAppStatus(match.status);
            }
          } catch (err) {
            console.error('Error fetching candidate applications:', err);
          }

          try {
            const savesRes = await api.get('/saved-jobs');
            const savedMatch = savesRes.data.find((s) => (s.jobId?._id || s.jobId) === id);
            if (savedMatch) {
              setIsSaved(true);
            }
          } catch (err) {
            console.error('Error fetching saved jobs:', err);
          }
        }
      } catch (error) {
        console.error('Error loading job details:', error);
        addToast('Failed to load job details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndUserData();
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isCandidate) {
      addToast('Only candidates can save jobs', 'info');
      return;
    }

    try {
      if (isSaved) {
        await api.delete(`/saved-jobs/${id}`);
        setIsSaved(false);
        addToast('Job removed from saved list', 'info');
      } else {
        await api.post(`/saved-jobs/${id}`);
        setIsSaved(true);
        addToast('Job saved to your bookmarks!', 'success');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isAdmin) {
      addToast('Admins cannot apply for jobs', 'info');
      return;
    }
    if (hasApplied) {
      addToast('You have already applied for this position', 'info');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile && !user?.resume) {
      addToast('Please upload your resume (PDF, DOC, DOCX up to 5MB)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('education', education);
      formData.append('experience', experience);
      formData.append('skills', skills);
      formData.append('location', location);
      formData.append('linkedin', linkedin);
      formData.append('github', github);
      formData.append('portfolio', portfolio);
      formData.append('expectedSalary', expectedSalary);
      formData.append('noticePeriod', noticePeriod);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else if (user?.resume) {
        formData.append('resumePath', user.resume);
      }

      await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      addToast('Application submitted successfully!', 'success');
      setHasApplied(true);
      setExistingAppStatus('Applied');
      setShowApplyModal(false);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <div className="h-8 w-48 bg-slate-900 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-slate-900 animate-pulse rounded-3xl border border-slate-800"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Job Not Found</h2>
        <p className="text-slate-400 text-xs">This listing may have been deleted or closed.</p>
        <Link to="/jobs" className="inline-block text-blue-400 font-bold text-xs hover:underline">
          Return to Jobs Portal
        </Link>
      </div>
    );
  }

  const isClosedOrExpired = job.status === 'Closed' || job.status === 'Expired' || new Date(job.deadline) < new Date();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-100 font-sans">
      {/* Back Link */}
      <Link
        to="/jobs"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Job Listings</span>
      </Link>

      {/* Main Job Detail Card */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-8">
        {/* Job Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-xs">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold rounded-full">
                {job.jobType}
              </span>
              {isClosedOrExpired && (
                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold rounded-full">
                  Applications Closed
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight">{job.title}</h1>

            <p className="text-sm font-bold text-slate-300 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>{job.companyName}</span>
              <span className="text-slate-700">•</span>
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400 font-normal">{job.location}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            {isCandidate && (
              <button
                onClick={handleToggleSave}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
                title={isSaved ? 'Unsave Job' : 'Save Job'}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}

            {hasApplied ? (
              <div className="px-6 py-3 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-2xl border border-emerald-500/20 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Applied ({existingAppStatus})</span>
              </div>
            ) : isClosedOrExpired ? (
              <button
                disabled
                className="px-6 py-3 bg-slate-950 text-slate-600 font-bold text-xs rounded-2xl cursor-not-allowed border border-slate-800"
              >
                Applications Closed
              </button>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Spec Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Offered Salary</p>
            <p className="font-bold text-white text-sm mt-1">💰 {job.salary || 'Competitive'}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Experience Needed</p>
            <p className="font-bold text-white text-sm mt-1">{job.experience || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Required Education</p>
            <p className="font-bold text-white text-sm mt-1">{job.education || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Deadline</p>
            <p className="font-bold text-rose-400 text-sm mt-1">
              {new Date(job.deadline).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Job Description</h2>
          <div className="text-slate-300 leading-relaxed text-xs sm:text-sm whitespace-pre-line bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
            {job.description}
          </div>
        </div>

        {/* Required Skills */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Required Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills?.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-xs px-3 py-1 rounded-xl"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl my-8 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white">Apply for {job.title}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{job.companyName} • {job.location}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-500 hover:text-white font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Current Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Highest Education *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.S. Computer Science"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Years of Experience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Key Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, TypeScript"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">GitHub Profile</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Portfolio Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Expected Salary</label>
                  <input
                    type="text"
                    placeholder="e.g. $95,000/yr"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Notice Period</label>
                  <input
                    type="text"
                    placeholder="e.g. Immediate / 2 Weeks"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
              </div>

              {/* Resume File Upload */}
              <div className="pt-2">
                <label className="block text-slate-300 font-bold mb-1">
                  Upload Resume (PDF, DOC, DOCX up to 5MB) {user?.resume ? '(Optional)' : '*'}
                </label>
                <div className="border-2 border-dashed border-slate-800 hover:border-blue-500 p-4 rounded-2xl text-center bg-slate-950">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="hidden"
                    id="resume-input"
                  />
                  <label htmlFor="resume-input" className="cursor-pointer space-y-1 block">
                    <Upload className="w-7 h-7 text-blue-400 mx-auto" />
                    <p className="text-xs font-bold text-white">
                      {resumeFile
                        ? resumeFile.name
                        : user?.resume
                        ? 'Using profile resume (Click to change file for this application)'
                        : 'Click to upload resume file'}
                    </p>
                    <p className="text-[10px] text-slate-500">PDF, DOC, DOCX allowed</p>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
