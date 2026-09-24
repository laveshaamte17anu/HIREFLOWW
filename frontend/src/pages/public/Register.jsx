import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, UserPlus, Mail, Lock, User, Phone, MapPin, GraduationCap, Code, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { registerCandidate } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registerCandidate({
        name,
        email,
        password,
        phone,
        location,
        education,
        skills,
      });
      addToast('Candidate account created successfully!', 'success');
      navigate('/candidate/dashboard');
    } catch (error) {
      addToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-slate-900/90 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-lg w-full space-y-6 relative z-10 backdrop-blur-md">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2.5 justify-center mb-1 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">HIREFLOWW</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Candidate Account</h1>
          <p className="text-xs text-slate-400">Sign up to apply for jobs and track recruitment status.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="+1 555 0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Highest Education</label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Bachelor's in Computer Science"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Key Skills (comma separated)</label>
            <div className="relative">
              <Code className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="JavaScript, React, Node.js, Python"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Creating Account...' : 'Register Candidate Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
