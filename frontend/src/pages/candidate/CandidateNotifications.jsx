import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Clock } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const CandidateNotifications = () => {
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
      console.error('Error fetching notifications:', error);
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
      addToast('Failed to mark notification as read', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      addToast('All notifications marked as read', 'success');
    } catch (error) {
      addToast('Failed to mark all as read', 'error');
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <span>Notifications</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Stay updated on your application status changes and recruiter activity.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-900 font-bold text-base">No Notifications</h3>
          <p className="text-slate-400 text-xs mt-1">You're all caught up! Important application updates will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                item.isRead
                  ? 'bg-white border-slate-200/80 text-slate-700'
                  : 'bg-blue-50/60 border-blue-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600">{item.message}</p>
                <p className="text-[10px] text-slate-400 flex items-center space-x-1 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </p>
              </div>

              {!item.isRead && (
                <button
                  onClick={() => handleMarkAsRead(item._id)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
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

export default CandidateNotifications;
