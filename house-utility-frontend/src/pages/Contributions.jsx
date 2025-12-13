import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/DashboardLayout';
import { usePreferences } from '../context/PreferencesContext';
import axios from 'axios';

const Contributions = () => {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = usePreferences();
  const [contributions, setContributions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'other',
    paymentMethod: 'cash',
    contributionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [error, setError] = useState('');

  const categories = [
    { value: 'rent', label: 'Rent', icon: '🏠' },
    { value: 'utilities', label: 'Utilities', icon: '💡' },
    { value: 'groceries', label: 'Groceries', icon: '🛒' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { value: 'internet', label: 'Internet', icon: '📡' },
    { value: 'other', label: 'Other', icon: '📦' },
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { value: 'mobile_money', label: 'Mobile Money', icon: '📱' },
    { value: 'card', label: 'Card', icon: '💳' },
    { value: 'other', label: 'Other', icon: '💰' },
  ];

  useEffect(() => {
    fetchContributions();
    fetchStats();
  }, []);

  const fetchContributions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/contributions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContributions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      setError('Failed to load contributions');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/contributions/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (editingId) {
        // Update existing contribution
        await axios.put(`/contributions/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new contribution
        await axios.post('/contributions', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Refresh data
      fetchContributions();
      fetchStats();
      
      // Reset form
      setShowModal(false);
      setEditingId(null);
      setFormData({
        amount: '',
        description: '',
        category: 'other',
        paymentMethod: 'cash',
        contributionDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save contribution');
    }
  };

  const handleEdit = (contribution) => {
    setEditingId(contribution._id);
    setFormData({
      amount: contribution.amount,
      description: contribution.description,
      category: contribution.category,
      paymentMethod: contribution.paymentMethod,
      contributionDate: new Date(contribution.contributionDate).toISOString().split('T')[0],
      notes: contribution.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contribution?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/contributions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContributions();
      fetchStats();
    } catch (error) {
      setError('Failed to delete contribution');
    }
  };

  const getCategoryIcon = (category) => {
    return categories.find(c => c.value === category)?.icon || '📦';
  };

  const getPaymentIcon = (method) => {
    return paymentMethods.find(p => p.value === method)?.icon || '💰';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('contributions.title')}</h1>
          <p className="text-gray-600 mt-1">{t('contributions.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>{t('contributions.addNew')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">{t('contributions.totalContributions')}</span>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-indigo-600">{formatCurrency(stats.total)}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.count} {t('contributions.transactions')}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">{t('contributions.thisMonth')}</span>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.thisMonth)}</p>
            <p className="text-xs text-gray-500 mt-1">{t('contributions.currentPeriod')}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">{t('contributions.lastMonth')}</span>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(stats.lastMonth)}</p>
            <p className="text-xs text-gray-500 mt-1">{t('contributions.previousPeriod')}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">{t('contributions.average')}</span>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(stats.count > 0 ? (stats.total / stats.count) : 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{t('contributions.perTransaction')}</p>
          </div>
        </div>
      )}

      {/* Contributions List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{t('contributions.recentContributions')}</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {contributions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('contributions.noContributions')}</h3>
            <p className="text-gray-600 mb-6">{t('contributions.startTracking')}</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all"
            >
              {t('contributions.addFirst')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contributions.map((contribution) => (
                  <tr key={contribution._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(contribution.contributionDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{contribution.description}</div>
                      {contribution.notes && (
                        <div className="text-gray-500 text-xs mt-1">{contribution.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        <span className="mr-1">{getCategoryIcon(contribution.category)}</span>
                        {contribution.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center text-sm text-gray-600">
                        <span className="mr-1">{getPaymentIcon(contribution.paymentMethod)}</span>
                        {contribution.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                      {formatCurrency(contribution.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(contribution)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(contribution._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('common.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? t('contributions.editContribution') : t('contributions.addNew')}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.contributionDate}
                    onChange={(e) => setFormData({ ...formData, contributionDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="e.g., Monthly Rent Payment"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.icon} {method.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Add any additional notes..."
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setError('');
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30"
                >
                  {editingId ? t('common.save') : t('common.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Contributions;