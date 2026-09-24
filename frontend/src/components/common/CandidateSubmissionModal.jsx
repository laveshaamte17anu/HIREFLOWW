import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Building,
  Code,
  Link,
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  FileText,
} from 'lucide-react';
import { submitCandidateLead } from '../../services/candidateLeadService';

export default function CandidateSubmissionModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    preferredRole: '',
    experience: '1-3 years',
    education: 'Bachelor Degree',
    currentCompany: '',
    skills: '',
    linkedin: '',
    github: '',
    portfolio: '',
  });

  const [resumeFile, setResumeFile] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be under 5MB');
        return;
      }
      const allowed = ['pdf', 'doc', 'docx'];
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowed.includes(ext)) {
        setError('Only PDF, DOC, and DOCX files are allowed');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  };

  const validateStep = (currentStep) => {
    setError('');
    if (currentStep === 1) {
      if (!formData.fullName.trim()) return 'Full Name is required';
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
        return 'A valid email address is required';
      if (!formData.phone.trim()) return 'Phone number is required';
    }
    if (currentStep === 2) {
      if (!formData.preferredRole.trim()) return 'Preferred Target Role is required';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      await submitCandidateLead(data);
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to submit candidate lead:', err);
      setError(
        err.response?.data?.message || 'Failed to submit profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setIsSuccess(false);
    setError('');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      preferredRole: '',
      experience: '1-3 years',
      education: 'Bachelor Degree',
      currentCompany: '',
      skills: '',
      linkedin: '',
      github: '',
      portfolio: '',
    });
    setResumeFile(null);
    onClose();
  };

  const steps = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Professional' },
    { num: 3, label: 'Skills & Links' },
    { num: 4, label: 'Resume' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Submit Your Talent Profile
              </h3>
              <p className="text-xs text-slate-400">
                Join our elite candidate pool for direct recruiter matching
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Stepper Progress Bar */}
        {!isSuccess && (
          <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800/80">
            <div className="flex items-center justify-between relative max-w-md mx-auto">
              {steps.map((s, idx) => (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      step === s.num
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-600/30'
                        : step > s.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] mt-1 font-medium ${
                      step === s.num ? 'text-indigo-400' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
              {/* Connecting line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 -z-0">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-160px)]">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Profile Submitted!</h4>
              <p className="text-slate-300 max-w-md text-sm mb-6 leading-relaxed">
                Thank you for registering with <span className="text-indigo-400 font-semibold">HIREFLOWW</span>. Our executive recruiting team will review your profile and contact you as soon as matching opportunities open up.
              </p>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left w-full max-w-md text-xs text-slate-400 space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="text-slate-200 font-medium">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Role:</span>
                  <span className="text-indigo-300 font-medium">{formData.preferredRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-slate-200">{formData.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                    Step 1: Contact Details
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="alex@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Current City / Preferred Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Bangalore, Remote, Mumbai"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Professional Profile */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                    Step 2: Professional Background
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Target Role / Domain <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="text"
                        name="preferredRole"
                        value={formData.preferredRole}
                        onChange={handleChange}
                        placeholder="e.g. Senior Frontend Developer, Product Manager, DevOps"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Total Experience
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      >
                        <option value="Fresher / 0 years">Fresher / 0 years</option>
                        <option value="0-1 years">0 - 1 years</option>
                        <option value="1-3 years">1 - 3 years</option>
                        <option value="3-5 years">3 - 5 years</option>
                        <option value="5-8 years">5 - 8 years</option>
                        <option value="8+ years">8+ years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Education Level
                      </label>
                      <div className="relative">
                        <GraduationCap className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                        <select
                          name="education"
                          value={formData.education}
                          onChange={handleChange}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        >
                          <option value="Bachelor Degree">Bachelor's Degree (B.Tech, B.E, B.Sc, BCA)</option>
                          <option value="Master Degree">Master's Degree (M.Tech, M.Sc, MCA, MBA)</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Doctorate / PhD">Doctorate / PhD</option>
                          <option value="Self-Taught">Self-Taught / Bootcamp</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Current / Previous Company
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="text"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        placeholder="e.g. Acme Corp (Optional)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Skills & Online Profiles */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                    Step 3: Skills & Social Profiles
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Primary Technical & Professional Skills
                    </label>
                    <div className="relative">
                      <Code className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="e.g. React, Node.js, MongoDB, TypeScript, AWS (comma-separated)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Separate skills with commas</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      LinkedIn Profile URL
                    </label>
                    <div className="relative">
                      <Link className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        GitHub Profile URL
                      </label>
                      <div className="relative">
                        <Link className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          placeholder="https://github.com/username"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Portfolio / Website URL
                      </label>
                      <div className="relative">
                        <Link className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleChange}
                          placeholder="https://myportfolio.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Resume Upload */}
              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                    Step 4: Resume / CV Upload
                  </h4>

                  <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center bg-slate-950/50 transition-all group">
                    <input
                      type="file"
                      id="lead-resume-upload"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <label
                      htmlFor="lead-resume-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Click to upload or drag & drop resume
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Supported formats: PDF, DOC, DOCX (Max 5MB)
                        </p>
                      </div>
                    </label>

                    {resumeFile && (
                      <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-left">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-medium text-white truncate">
                              {resumeFile.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setResumeFile(null)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-300">Privacy & Confidentiality:</p>
                    <p>
                      Your information is securely shared only with authorized HIREFLOWW recruitment consultants and employer client hiring managers.
                    </p>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {!isSuccess && (
          <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Profile <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
