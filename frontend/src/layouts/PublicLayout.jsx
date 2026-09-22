import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Briefcase, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = isAdmin ? '/admin/dashboard' : '/candidate/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              HireFlow
            </span>
          </Link>

          {/* Desktop Right Auth / Dashboard Controls */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={dashboardPath}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-blue-600/20 transition-all flex items-center space-x-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isAdmin ? 'Admin Dashboard' : 'Candidate Dashboard'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="px-3.5 py-2 text-slate-600 hover:text-rose-600 font-semibold text-xs rounded-xl hover:bg-rose-50 transition-all flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-700 hover:text-blue-600 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-blue-600/20 transition-all flex items-center space-x-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;

