import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import CandidateLayout from './layouts/CandidateLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import JobListings from './pages/public/JobListings';
import JobDetail from './pages/public/JobDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import MyApplications from './pages/candidate/MyApplications';
import ApplicationDetail from './pages/candidate/ApplicationDetail';
import SavedJobs from './pages/candidate/SavedJobs';
import RecommendedJobs from './pages/candidate/RecommendedJobs';
import CandidateInterviews from './pages/candidate/CandidateInterviews';
import CandidateNotifications from './pages/candidate/CandidateNotifications';
import CandidateProfile from './pages/candidate/CandidateProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobList from './pages/admin/AdminJobList';
import JobCreate from './pages/admin/JobCreate';
import JobEdit from './pages/admin/JobEdit';
import AdminApplications from './pages/admin/AdminApplications';
import AdminCandidateDetail from './pages/admin/AdminCandidateDetail';
import AdminInterviews from './pages/admin/AdminInterviews';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminProfile from './pages/admin/AdminProfile';

// Route Guard Component for Private Routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-xs font-semibold text-slate-500">Restoring session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/candidate/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Route Guard for Public Auth Routes (/login, /register)
const PublicAuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    const target = user.role === 'admin' ? '/admin/dashboard' : '/candidate/dashboard';
    return <Navigate to={target} replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes with Header/Footer */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<JobListings />} />
        <Route path="jobs/:id" element={<JobDetail />} />
      </Route>

      {/* Standalone Authentication Routes (No Navbar / No Footer) */}
      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <Login />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicAuthRoute>
            <Register />
          </PublicAuthRoute>
        }
      />

      {/* Candidate Protected Routes */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="applications/:id" element={<ApplicationDetail />} />
        <Route path="saved-jobs" element={<SavedJobs />} />
        <Route path="recommended-jobs" element={<RecommendedJobs />} />
        <Route path="interviews" element={<CandidateInterviews />} />
        <Route path="notifications" element={<CandidateNotifications />} />
        <Route path="profile" element={<CandidateProfile />} />
      </Route>

      {/* Admin Recruiter Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="jobs" element={<AdminJobList />} />
        <Route path="jobs/create" element={<JobCreate />} />
        <Route path="jobs/:id/edit" element={<JobEdit />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="applications/:id" element={<AdminCandidateDetail />} />
        <Route path="interviews" element={<AdminInterviews />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
