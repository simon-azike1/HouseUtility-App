import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/DashboardLayout';
import { usePreferences } from '../context/PreferencesContext';
import axios from 'axios';

const Bills = () => {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = usePreferences();
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'other',
    dueDate: '',
    isRecurring: false,
    recurringInterval: 'monthly',
    vendor: '',
    accountNumber: '',
    description: '',
    reminderDays: 3,
    paymentMethod: 'bank_transfer'
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    { value: 'rent', label: 'Rent', icon: '🏠', color: 'bg-purple-100 text-purple-700' },
    { value: 'electricity', label: 'Electricity', icon: '⚡', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'water', label: 'Water', icon: '💧', color: 'bg-blue-100 text-blue-700' },
    { value: 'gas', label: 'Gas', icon: '🔥', color: 'bg-orange-100 text-orange-700' },
    { value: 'internet', label: 'Internet', icon: '📡', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'phone', label: 'Phone', icon: '📱', color: 'bg-green-100 text-green-700' },
    { value: 'insurance', label: 'Insurance', icon: '🛡️', color: 'bg-cyan-100 text-cyan-700' },
    { value: 'subscription', label: 'Subscription', icon: '📺', color: 'bg-pink-100 text-pink-700' },
    { value: 'other', label: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-700' },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    paid: 'bg-green-100 text-green-700 border-green-300',
    overdue: 'bg-red-100 text-red-700 border-red-300',
    cancelled: 'bg-gray-100 text-gray-700 border-gray-300'
  };

  useEffect(() => {
    fetchBills();
    fetchStats();
  }, [filterStatus]);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filterStatus
        ? `/bills?status=${filterStatus}`
        : '/bills';
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBills(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setError('Failed to load bills');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/bills/stats', {
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

      // Ensure amount is a number before sending to the API
      const payload = { ...formData, amount: Number(formData.amount) };

      if (editingId) {
        await axios.put(`/bills/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage('Bill updated successfully!');
      } else {
        await axios.post('/bills', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage('Bill added successfully!');
      }

      // Show success animation
      setShowSuccess(true);

      // Refresh data
      fetchBills();
      fetchStats();

      // Close modal after animation
      setTimeout(() => {
        setShowModal(false);
        setEditingId(null);
        setShowSuccess(false);
        resetForm();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save bill');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: 'other',
      dueDate: '',
      isRecurring: false,
      recurringInterval: 'monthly',
      vendor: '',
      accountNumber: '',
      description: '',
      reminderDays: 3,
      paymentMethod: 'bank_transfer'
    });
  };

  const handleEdit = (bill) => {
    setEditingId(bill._id);
    setFormData({
      title: bill.title,
      amount: bill.amount,
      category: bill.category,
      dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
      isRecurring: bill.isRecurring,
      recurringInterval: bill.recurringInterval,
      vendor: bill.vendor || '',
      accountNumber: bill.accountNumber || '',
      description: bill.description || '',
      reminderDays: bill.reminderDays,
      paymentMethod: bill.paymentMethod
    });
    setShowModal(true);

  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/bills/${id}` , {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBills();
      fetchStats();
    } catch (err) {
      console.error('Failed to delete bill:', err);
      setError('Failed to delete bill');
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const reference = prompt('Enter payment reference (optional):');

      await axios.post(`/bills/${id}/pay`,
        { paymentReference: reference },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      fetchBills();
      fetchStats();
    } catch (err) {
      console.error('Failed to mark bill as paid:', err);
      setError('Failed to mark bill as paid');
    }
  };

  const getCategoryDetails = (category) => {
    return categories.find(c => c.value === category) || categories[categories.length - 1];
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    if (isNaN(due)) return null;
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('bills.title')}</h1>
          <p className="text-gray-600 mt-1">Manage and track your recurring bills</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>{t('bills.addNew')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Bills</span>
            </div>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.count}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All bills tracked</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(stats.pendingAmount)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.pending} bills</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Overdue</span>
            </div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(stats.overdueAmount)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.overdue} bills</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">This Month</span>
            </div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(stats.thisMonth)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Due this month</p>
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setFilterStatus('')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterStatus === ''
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('common.all')}
          </button>
          {['pending', 'paid', 'overdue', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap capitalize ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t(`common.${status}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Bills List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Your Bills</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {bills.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('bills.noBills')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('bills.createFirst')}</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all"
            >
              {t('bills.addNew')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {bills.map((bill) => {
              const catDetails = getCategoryDetails(bill.category);
              const daysUntil = getDaysUntilDue(bill.dueDate);
              
              return (
                <div
                  key={bill._id}
                  className="border-2 rounded-xl p-5 hover:shadow-lg transition-all relative"
                  style={{ borderColor: bill.status === 'overdue' ? '#ef4444' : '#e5e7eb' }}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[bill.status]}`}>
                    {bill.status}
                  </div>

                  {/* Category & Title */}
                  <div className="flex items-start space-x-3 mb-4 mt-6">
                    <span className="text-3xl">{catDetails.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{bill.title}</h3>
                      {bill.vendor && (
                        <p className="text-sm text-gray-500">{bill.vendor}</p>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <p className="text-3xl font-bold text-indigo-600 mb-3">
                    {formatCurrency(Number(bill.amount ?? 0))}
                  </p>

                  {/* Due Date */}
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Due: {bill.dueDate && !isNaN(new Date(bill.dueDate)) ? formatDate(bill.dueDate) : 'N/A'}
                    </span>
                    {bill.status === 'pending' && daysUntil !== null && daysUntil >= 0 && (
                      <span className={`text-xs font-semibold ${
                        daysUntil <= 3 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        ({daysUntil} days)
                      </span>
                    )}
                  </div>

                  {/* Recurring Badge */}
                  {bill.isRecurring && (
                    <div className="flex items-center space-x-1 mb-3">
                      <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-purple-600 font-medium capitalize">
                        {bill.recurringInterval}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-3 border-t border-gray-100">
                    {bill.status === 'pending' && (
                      <button
                        onClick={() => handleMarkAsPaid(bill._id)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        {t('common.paid')}
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(bill)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(bill._id)}
                      className="px-4 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto relative">
            {/* Success Overlay */}
            {showSuccess && (
              <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center z-10 animate-fadeIn">
                <div className="text-center">
                  <div className="mb-4 animate-scaleIn">
                    <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white animate-slideUp">
                    {successMessage}
                  </h3>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Bill' : 'Add New Bill'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setError('');
                    setShowSuccess(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 text-sm rounded">
                  {error}
                </div>
              )}

              {/* Essential Fields */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bill Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="e.g., Electricity Bill"
                  />
                </div>

                {/* Amount & Due Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Category & Payment Method */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="auto_debit">Auto Debit</option>
                    </select>
                  </div>
                </div>

                {/* Vendor (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vendor/Company
                  </label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="e.g., Electric Company"
                  />
                </div>

                {/* Recurring Options */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isRecurring}
                      onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurring Bill</span>
                  </label>

                  {formData.isRecurring && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Repeat Interval
                        </label>
                        <select
                          value={formData.recurringInterval}
                          onChange={(e) => setFormData({ ...formData, recurringInterval: e.target.value })}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Reminder (days before)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.reminderDays}
                          onChange={(e) => setFormData({ ...formData, reminderDays: e.target.value })}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    placeholder="Add any additional notes..."
                  ></textarea>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setError('');
                    setShowSuccess(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md text-sm"
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

export default Bills;