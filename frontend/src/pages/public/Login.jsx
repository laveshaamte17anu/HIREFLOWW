import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (error) {
      let errorMessage = 'Invalid email or password';
      if (!error.response) {
        errorMessage = 'Unable to connect to the backend server. Please check your network connection.';
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      addToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="bg-slate-900/90 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full space-y-6 relative z-10 backdrop-blur-md">
        {/* Brand & Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center space-x-2.5 justify-center mb-1 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-indigo-200" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">HIREFLOWW</span>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Sign In</h1>
            <p className="text-xs text-slate-400 mt-1">Sign in to track your job applications or manage hiring pipelines</p>
          </div>
        </div>

        {/* Unified Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-xs text-white placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300 focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Registration Prompt & Home Link */}
        <div className="space-y-3 pt-4 border-t border-slate-800 text-center text-xs">
          <p className="text-slate-400">
            Don't have a candidate account yet?{' '}
            <Link to="/register" className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline">
              Create Candidate Account
            </Link>
          </p>

          <div>
            <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors">
              ← Return to HIREFLOWW Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
