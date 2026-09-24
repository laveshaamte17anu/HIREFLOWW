import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Clock } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      addToast('Failed to mark as read', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      addToast('All admin notifications marked as read', 'success');
    } catch (error) {
      addToast('Failed to mark all as read', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-slate-900 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-slate-900 animate-pulse rounded-3xl border border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Bell className="w-6 h-6 text-blue-400" />
            <span>Admin Recruiter Notifications</span>
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">Recruiter alerts for new candidate applications and activity.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-xs rounded-xl border border-blue-500/20 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-slate-900 p-12 text-center rounded-3xl border border-slate-800 space-y-2">
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <h3 className="text-white font-bold text-base">No Notifications</h3>
          <p className="text-slate-400 text-xs">Notifications will trigger when candidates apply for your job postings.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                item.isRead
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-slate-900 border-blue-500/40 text-white shadow-md'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  )}
                </div>
                <p className="text-xs text-slate-300">{item.message}</p>
                <p className="text-[10px] text-slate-500 flex items-center space-x-1 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </p>
              </div>

              {!item.isRead && (
                <button
                  onClick={() => handleMarkAsRead(item._id)}
                  className="p-2 text-slate-500 hover:text-blue-400 transition-colors cursor-pointer"
                  title="Mark read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
