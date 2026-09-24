import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  Sparkles,
  User,
  Bell,
  Calendar,
  LogOut,
  Briefcase,
  Search,
  Menu,
  X,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CandidateLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const res = await api.get('/notifications');
        setUnreadNotifications(res.data.unreadCount || 0);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };
    fetchNotificationCount();
  }, [location.pathname]);

  const navItems = [
    { label: 'Overview', path: '/candidate/dashboard', icon: LayoutDashboard },
    { label: 'My Applications', path: '/candidate/applications', icon: FileText },
    { label: 'Saved Jobs', path: '/candidate/saved-jobs', icon: Bookmark },
    { label: 'Recommended', path: '/candidate/recommended-jobs', icon: Sparkles },
    { label: 'Interviews', path: '/candidate/interviews', icon: Calendar },
    { label: 'Notifications', path: '/candidate/notifications', icon: Bell, badge: unreadNotifications },
    { label: 'My Profile', path: '/candidate/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-slate-900 border-b border-slate-800 h-16 px-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            HIREFLOWW <span className="text-[10px] font-semibold text-blue-400">Candidate</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Candidate Sidebar */}
      <aside
        className={`w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col fixed inset-y-0 z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-none">
                HIREFLOWW
              </span>
              <span className="text-[10px] font-semibold text-blue-400 mt-1">Candidate Portal</span>
            </div>
          </Link>
        </div>

        <div className="p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-extrabold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Candidate'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3.5 py-2.5 text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-all mb-4 border border-blue-500/20"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>Search Jobs Portal</span>
          </Link>

          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Navigation Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      isActive ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
              navigate('/');
            }}
            className="flex items-center space-x-3 w-full px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Candidate Workspace Content */}
      <div className="lg:pl-64 flex-grow flex flex-col min-h-screen">
        <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
