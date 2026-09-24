import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, LogIn, UserPlus, LogOut, LayoutDashboard, Menu, X, ArrowUpRight, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardPath = isAdmin ? '/admin/dashboard' : '/candidate/dashboard';

  const handleNavClick = (anchorId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${anchorId}`);
      return;
    }
    const elem = document.querySelector(anchorId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/70 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-all">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                HIREFLOWW
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">PRO</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <button onClick={() => handleNavClick('#home')} className="hover:text-white transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => handleNavClick('#about')} className="hover:text-white transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => handleNavClick('#services')} className="hover:text-white transition-colors cursor-pointer">
              Services
            </button>
            <button onClick={() => handleNavClick('#why-hirefloww')} className="hover:text-white transition-colors cursor-pointer">
              Why Hirefloww
            </button>
            <button onClick={() => handleNavClick('#contact')} className="hover:text-white transition-colors cursor-pointer">
              Contact
            </button>
          </nav>

          {/* Right Auth / Action CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={dashboardPath}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isAdmin ? 'Admin Dashboard' : 'Candidate Dashboard'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="px-3.5 py-2 text-slate-400 hover:text-rose-400 font-semibold text-xs rounded-xl hover:bg-rose-500/10 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center space-x-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
              <button onClick={() => handleNavClick('#home')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-900">
                Home
              </button>
              <button onClick={() => handleNavClick('#about')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-900">
                About
              </button>
              <button onClick={() => handleNavClick('#services')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-900">
                Services
              </button>
              <button onClick={() => handleNavClick('#why-hirefloww')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-900">
                Why Hirefloww
              </button>
              <button onClick={() => handleNavClick('#contact')} className="text-left px-3 py-2 rounded-lg hover:bg-slate-900">
                Contact
              </button>
            </nav>

            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 bg-blue-600 text-center text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    {isAdmin ? 'Go to Admin Dashboard' : 'Go to Candidate Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full py-2.5 text-center text-rose-400 font-semibold text-xs"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-slate-900 border border-slate-800 text-center text-slate-200 font-bold text-xs rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-blue-600 text-center text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Register Candidate Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">HIREFLOWW</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Connecting talented professionals with meaningful opportunities and empowering employers to build high-performing teams.
            </p>
            <div className="flex items-center space-x-2 text-emerald-400 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">Find Jobs</Link>
              </li>
              <li>
                <button onClick={() => handleNavClick('#employers')} className="hover:text-white transition-colors text-left">For Employers</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-white transition-colors text-left">How It Works</button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => handleNavClick('#about')} className="hover:text-white transition-colors text-left">About HIREFLOWW</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#contact')} className="hover:text-white transition-colors text-left">Contact Us</button>
              </li>
            </ul>
          </div>

          {/* Admin Portal Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Recruiter Portal</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Admin Recruiter Login</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 bg-slate-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <p>© 2026 HIREFLOWW Inc. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Recruitment Technology Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
