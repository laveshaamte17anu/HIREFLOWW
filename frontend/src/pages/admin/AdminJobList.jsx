import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Eye, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const AdminJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { addToast } = useToast();

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/jobs/admin/my-jobs');
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching admin jobs:', error);
      addToast('Failed to load job listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleStatusToggle = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Closed' : 'Published';
    try {
      await api.patch(`/jobs/${jobId}/status`, { status: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
      );
      addToast(`Job status updated to ${newStatus}`, 'success');
    } catch (error) {
      addToast('Failed to update job status', 'error');
    }
  };

  const confirmDeleteJob = (jobId) => {
    setDeleteJobId(jobId);
    setShowDeleteModal(true);
  };

  const handleDeleteExecute = async () => {
    if (!deleteJobId) return;
    try {
      await api.delete(`/jobs/${deleteJobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== deleteJobId));
      addToast('Job posting deleted successfully', 'success');
    } catch (error) {
      addToast('Failed to delete job posting', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeleteJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Created Job Postings</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage job status, edit specifications, and inspect applicants.</p>
        </div>

        <Link
          to="/admin/jobs/create"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Job</span>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <p className="text-slate-700 font-bold text-base">No Job Postings Found</p>
          <p className="text-slate-400 text-xs mt-1">You haven't posted any jobs yet under this recruiter admin account.</p>
          <Link
            to="/admin/jobs/create"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            Post First Job
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Job Title</th>
                  <th className="p-4">Company & Location</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applicants</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <Link to={`/jobs/${job._id}`} className="font-bold text-slate-900 hover:text-blue-600 text-sm">
                        {job.title}
                      </Link>
                      <p className="text-[10px] text-slate-400">Created: {new Date(job.createdAt).toLocaleDateString()}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">{job.companyName}</p>
                      <p className="text-slate-500">{job.location}</p>
                    </td>

                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold">
                        {job.jobType}
                      </span>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/admin/applications?jobId=${job._id}`}
                        className="inline-flex items-center space-x-1 font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicationsCount || 0}</span>
                      </Link>
                    </td>

                    <td className="p-4 text-slate-600">
                      {new Date(job.deadline).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                          title="View Public Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/jobs/${job._id}/edit`}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleStatusToggle(job._id, job.status)}
                          className="px-2.5 py-1 text-[11px] font-bold border rounded-lg transition-colors bg-slate-50 hover:bg-slate-100"
                          title="Toggle Status"
                        >
                          {job.status === 'Published' ? 'Close' : 'Publish'}
                        </button>
                        <button
                          onClick={() => confirmDeleteJob(job._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Job Posting?"
        message="Are you sure you want to permanently delete this job posting? All associated applications will also be removed."
        onConfirm={handleDeleteExecute}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete Job"
        confirmVariant="danger"
      />
    </div>
  );
};

export default AdminJobList;
