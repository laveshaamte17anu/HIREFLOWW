import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  Target,
  Layers,
  Zap,
  Mail,
  Send,
  UserCheck,
  Award,
  GraduationCap,
  Code,
  FileSearch,
  Search,
  Phone,
  HeartHandshake,
  Lightbulb,
  Linkedin,
  MessageCircle,
  Wallet,
  Building2,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function Home() {
  const [liveJobs, setLiveJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchLiveJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setLiveJobs(res.data || []);
      } catch (error) {
        console.error('Failed to load live jobs on home page:', error);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchLiveJobs();
  }, []);

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit General Contact Form
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setTimeout(() => {
      addToast('Thank you for reaching out! Our recruitment team will respond shortly.', 'success');
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setContactSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-20 pb-20 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* ==========================================
          1. HERO SECTION (#home)
      ========================================== */}
      <section id="home" className="relative isolate overflow-hidden bg-slate-950 pt-28 pb-20 text-white sm:pt-36 sm:pb-28 border-b border-slate-900">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto flex max-w-5xl flex-col items-center text-center px-4 sm:px-6 relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
            Trusted recruitment partner
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Connecting Fresh Talent <br className="hidden sm:block" />
            With <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Growing Companies</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
            We help companies hire skilled freshers, junior IT professionals, and trainers quickly, affordably, and reliably.
          </p>

          <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl h-12 w-full sm:w-auto px-8 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Register Candidate Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center justify-center gap-2 rounded-xl h-12 w-full sm:w-auto px-8 text-sm font-bold text-slate-200 border border-white/20 bg-white/5 backdrop-blur hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer"
            >
              Contact Team
            </button>
          </div>

          {/* Live Platform Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl shadow-2xl">
            <div className="text-center space-y-1">
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">48h</p>
              <p className="text-xs font-semibold text-slate-400">Avg Shortlist Turnaround</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">500+</p>
              <p className="text-xs font-semibold text-slate-400">Vetted Candidates Ready</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">95%</p>
              <p className="text-xs font-semibold text-slate-400">Retention Across Placed Hires</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">100%</p>
              <p className="text-xs font-semibold text-slate-400">Verified Recruiter Jobs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          1.5 LIVE RECRUITER OPENINGS SECTION
      ========================================== */}
      <section className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Live Opportunities
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Real Recruiter Openings
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Explore verified positions posted directly by recruiter admins for candidate discovery.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all w-fit"
          >
            <span>Register & Apply</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-44 bg-slate-900 animate-pulse rounded-3xl border border-slate-800" />
            ))}
          </div>
        ) : liveJobs.length === 0 ? (
          <div className="bg-slate-900 p-8 text-center rounded-3xl border border-slate-800 text-slate-400 text-xs">
            No live openings posted yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveJobs.slice(0, 4).map((job) => (
              <div
                key={job._id}
                className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800/80 hover:border-cyan-500/50 shadow-xl transition-all space-y-4 group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                      {job.jobType || 'Full-time'}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mt-2">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{job.companyName} • {job.location}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {job.skills?.slice(0, 4).map((sk, idx) => (
                    <span key={idx} className="bg-slate-950 text-slate-300 text-[11px] px-2.5 py-0.5 rounded-lg border border-slate-800">
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">💰 {job.salary || 'Competitive'}</span>
                  <Link
                    to="/register"
                    className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Apply Position</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==========================================
          2. ABOUT US SECTION (#about)
      ========================================== */}
      <section id="about" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hiring, simplified for growing teams
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-5 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Hirefloww</strong> is a recruitment agency focused on connecting businesses with talented freshers and junior professionals across multiple industries, with a primary specialization in <span className="text-cyan-400 font-bold">junior IT and software roles</span>.
            </p>
            <p>
              We combine personal screening with a fast, structured recruitment workflow — so startups and growing SMBs get the right hires without traditional delays or inflated agency commissions.
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Our Mission</div>
              <p className="text-white text-sm">Simplify hiring for employers while creating high-impact career opportunities for young professionals.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-1 hover:border-cyan-500/40 transition-all">
              <div className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Speed
              </div>
              <div className="text-xs text-slate-400">Curated candidate shortlists in days, not weeks.</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-1 hover:border-indigo-500/40 transition-all">
              <div className="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Quality
              </div>
              <div className="text-xs text-slate-400">Every profile is pre-screened and skill-checked.</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-1 hover:border-blue-500/40 transition-all">
              <div className="text-sm font-bold text-blue-400 flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Focus
              </div>
              <div className="text-xs text-slate-400">Specialized expertise in junior IT & tech hiring.</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-1 hover:border-emerald-500/40 transition-all">
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4" /> Care
              </div>
              <div className="text-xs text-slate-400">Dedicated human recruiter support at every step.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. SERVICES SECTION (#services)
      ========================================== */}
      <section id="services" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything you need to hire well
          </h2>
          <p className="text-slate-400 text-sm">End-to-end recruitment for entry and junior level roles.</p>
          <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Fresher Recruitment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Source motivated graduates and fresh talent ready to hit the ground running in your team.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-blue-500/40 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Junior IT Hiring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Software engineers, QA testers, support specialists, and data analysts for early-career roles.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Technical Trainer Hiring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trainers and tech mentors for edtech institutes, bootcamps, and corporate upskilling programs.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Bulk Hiring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scale team headcount rapidly with structured, campaign-style batch recruitment.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Resume Screening</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We filter candidate noise and surface only high-probability, qualified job seekers.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-sky-500/40 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Candidate Sourcing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Targeted talent outreach across specialized technical communities, job portals, and referrals.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. WHY HIREFLOWW SECTION (#why-hirefloww)
      ========================================== */}
      <section id="why-hirefloww" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            Why Hirefloww
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for the way modern teams hire
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl hover:border-cyan-500/30 transition-all">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Faster Hiring Process</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">First candidate shortlist delivered in 48 hours for most junior roles.</p>
            </div>
          </div>

          <div className="flex gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl hover:border-indigo-500/30 transition-all">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Quality Candidate Screening</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">Multi-point skills, communication, and culture-fit pre-evaluations.</p>
            </div>
          </div>

          <div className="flex gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl hover:border-blue-500/30 transition-all">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Personalized Support</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">Dedicated recruiter contact throughout every placement stage.</p>
            </div>
          </div>

          <div className="flex gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl hover:border-emerald-500/30 transition-all">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Cost-Effective Recruitment</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">Transparent commercial terms built specifically for growing teams.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. CONTACT SECTION (#contact)
      ========================================== */}
      <section id="contact" className="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Get in touch</h2>
          <p className="text-slate-400 text-sm">We usually respond within a few hours during business days.</p>
          <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
        </div>

        {/* Contact Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="tel:+918679753463"
            className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl hover:border-cyan-500/40 transition-all"
          >
            <div className="w-11 h-11 shrink-0 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</div>
              <div className="truncate text-base font-bold text-white">+91 86797 53463</div>
            </div>
          </a>

          <a
            href="mailto:info@hirefloww.in"
            className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl hover:border-indigo-500/40 transition-all"
          >
            <div className="w-11 h-11 shrink-0 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</div>
              <div className="truncate text-base font-bold text-white">info@hirefloww.in</div>
            </div>
          </a>
        </div>

        {/* General Contact Form */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Subject *</label>
              <input
                type="text"
                required
                placeholder="Inquiry about platform features..."
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Message *</label>
              <textarea
                required
                rows={4}
                placeholder="Write your message details here..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={contactSubmitting}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{contactSubmitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>

          {/* Social Links */}
          <div className="mt-8 flex items-center justify-center gap-3 border-t border-slate-800 pt-6">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-12 h-12 rounded-full border border-slate-800 bg-slate-950 text-slate-300 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-colors shadow-lg"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/918679753463"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-12 h-12 rounded-full border border-slate-800 bg-slate-950 text-slate-300 flex items-center justify-center hover:bg-emerald-500 hover:text-slate-950 transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
