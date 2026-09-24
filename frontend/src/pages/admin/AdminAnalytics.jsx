import React, { useState, useEffect } from 'react';
import { BarChart3, Download } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { downloadApplicantsCSV } from '../../utils/downloadHelpers';

const AdminAnalytics = () => {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/reports');
        setData(res.data);
      } catch (error) {
        console.error('Error loading recruitment analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-900 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-slate-900 animate-pulse rounded-3xl border border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span>Recruitment Performance Analytics</span>
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">Real-time metrics aggregated directly from your database.</p>
        </div>

        <button
          onClick={() => downloadApplicantsCSV(addToast)}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-800 shadow-md transition-all flex items-center space-x-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Export Full Applicant CSV</span>
        </button>
      </div>

      {/* Metric Rate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Shortlist Conversion Rate</span>
          <p className="text-4xl font-black text-indigo-400">{data?.rates?.shortlistRate || 0}%</p>
          <p className="text-xs text-slate-400">Applicants qualified to Shortlisted stage</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Hiring Selection Rate</span>
          <p className="text-4xl font-black text-emerald-400">{data?.rates?.selectionRate || 0}%</p>
          <p className="text-xs text-slate-400">Candidates selected & hired</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Rejection Rate</span>
          <p className="text-4xl font-black text-rose-400">{data?.rates?.rejectionRate || 0}%</p>
          <p className="text-xs text-slate-400">Candidates passed on</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications per Job Bar Breakdown */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Applications per Job Posting</h2>

          {data?.applicationsPerJob?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No job application data recorded.</p>
          ) : (
            <div className="space-y-3">
              {data?.applicationsPerJob?.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span className="truncate">{item.jobTitle}</span>
                    <span className="text-blue-400">{item.count} applicants</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${data.totalApplications ? Math.min(100, Math.max(8, (item.count / data.totalApplications) * 100)) : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Pipeline Status Breakdown</h2>

          <div className="grid grid-cols-2 gap-3">
            {data?.statusDistribution?.map((item) => (
              <div key={item.status} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold block">{item.status}</span>
                <span className="text-2xl font-black text-white mt-1 block">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
