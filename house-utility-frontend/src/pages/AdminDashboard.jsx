import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '/services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [deletingId, setDeletingId] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await api.get('/admin/metrics');
      setData(response.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Delete this feedback permanently?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/feedback/${id}`);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          feedbackCount: Math.max(0, prev.feedbackCount - 1),
          recentFeedback: prev.recentFeedback.filter((fb) => fb._id !== id)
        };
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete feedback');
    } finally {
      setDeletingId('');
    }
  };

  const formatPct = (current, previous) => {
    if (!previous) return current ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const lineChartData = useMemo(() => {
    if (!data?.feedbackOverTime) return null;
    const labels = data.feedbackOverTime.map((d) => `${d._id.month}/${d._id.day}`);
    const values = data.feedbackOverTime.map((d) => d.count);
    return {
      labels,
      datasets: [
        {
          label: 'Feedback',
          data: values,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  }, [data]);

  const ratingChartData = useMemo(() => {
    if (!data?.ratingBreakdown) return null;
    const labels = [1, 2, 3, 4, 5].map((r) => `${r}★`);
    const counts = [1, 2, 3, 4, 5].map((r) => {
      const item = data.ratingBreakdown.find((x) => x._id === r);
      return item?.count || 0;
    });
    return {
      labels,
      datasets: [
        {
          label: 'Ratings',
          data: counts,
          backgroundColor: ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#16a34a']
        }
      ]
    };
  }, [data]);

  const countryChartData = useMemo(() => {
    if (!data?.countryBreakdown) return null;
    const top = data.countryBreakdown.slice(0, 6);
    return {
      labels: top.map((c) => c._id),
      datasets: [
        {
          label: 'Countries',
          data: top.map((c) => c.count),
          backgroundColor: ['#0ea5e9', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#64748b']
        }
      ]
    };
  }, [data]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const response = await api.get('/admin/feedback?limit=2000');
      const rows = response.data.data || [];
      const header = ['date', 'rating', 'message', 'name', 'email', 'country'];
      const csv = [
        header.join(','),
        ...rows.map((r) => [
          new Date(r.createdAt).toISOString(),
          r.rating,
          `"${String(r.message || '').replace(/"/g, '""')}"`,
          `"${String(r.user?.name || '').replace(/"/g, '""')}"`,
          `"${String(r.user?.email || '').replace(/"/g, '""')}"`,
          `"${String(r.country || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'feedback-export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  const handleExportUsersCsv = async () => {
    setExporting(true);
    try {
      const response = await api.get('/admin/users?limit=5000');
      const rows = response.data.data || [];
      const header = ['email', 'country'];
      const csv = [
        header.join(','),
        ...rows.map((r) => [
          `"${String(r.email || '').replace(/"/g, '""')}"`,
          `"${String(r.country || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users-export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to export users CSV');
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">App feedback metrics and user insights</p>
        </div>

        {loading && (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading metrics...</div>
        )}
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.usersCount}</p>
                <p className={`text-xs mt-1 ${formatPct(data.usersLast7, data.usersPrev7) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPct(data.usersLast7, data.usersPrev7).toFixed(1)}% last 7 days
                </p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Feedback Count</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.feedbackCount}</p>
                <p className={`text-xs mt-1 ${formatPct(data.feedbackLast7, data.feedbackPrev7) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPct(data.feedbackLast7, data.feedbackPrev7).toFixed(1)}% last 7 days
                </p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.avgRating.toFixed(2)}</p>
                <p className={`text-xs mt-1 ${formatPct(data.avgRatingLast7, data.avgRatingPrev7) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPct(data.avgRatingLast7, data.avgRatingPrev7).toFixed(1)}% last 7 days
                </p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Top Countries</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {data.countryBreakdown.slice(0, 3).map((c) => `${c._id}: ${c.count}`).join(', ') || 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Feedback Over Time</h2>
                {lineChartData && <Line data={lineChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Ratings Distribution</h2>
                {ratingChartData && <Bar data={ratingChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 lg:col-span-1">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Country Distribution</h2>
                {countryChartData && <Doughnut data={countryChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />}
              </div>
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Feedback</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportUsersCsv}
                      disabled={exporting}
                      className="px-3 py-2 text-xs font-semibold rounded-lg text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {exporting ? 'Exporting...' : 'Export Users CSV'}
                    </button>
                    <button
                      onClick={handleExportCsv}
                      disabled={exporting}
                      className="px-3 py-2 text-xs font-semibold rounded-lg text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {exporting ? 'Exporting...' : 'Export Feedback CSV'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {data.recentFeedback.map((fb) => (
                    <div key={fb._id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Rating: {fb.rating}/5</span>
                        <span>|</span>
                        <span>{new Date(fb.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-900 dark:text-white">{fb.message}</p>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {fb.user?.name || 'Unknown'} | {fb.user?.email || 'unknown'} | {fb.country || 'N/A'}
                      </div>
                      <div className="mt-3 flex items-center justify-end">
                        <button
                          onClick={() => handleDeleteFeedback(fb._id)}
                          disabled={deletingId === fb._id}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {deletingId === fb._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {data.recentFeedback.length === 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">No feedback yet.</div>
                  )}
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
