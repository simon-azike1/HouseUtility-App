import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/DashboardLayout';
import { usePreferences } from '../context/PreferencesContext';
import axios from 'axios';

const Expenses = () => {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = usePreferences();
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    description: '',
    category: 'other',
    expenseDate: new Date().toISOString().split('T')[0],
    paidBy: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    { value: 'utilities', label: 'Utilities', icon: '💡', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'groceries', label: 'Groceries', icon: '🛒', color: 'bg-green-100 text-green-700' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'bg-blue-100 text-blue-700' },
    { value: 'cleaning', label: 'Cleaning', icon: '🧹', color: 'bg-purple-100 text-purple-700' },
    { value: 'internet', label: 'Internet', icon: '📡', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'bg-pink-100 text-pink-700' },
    { value: 'transportation', label: 'Transportation', icon: '🚗', color: 'bg-orange-100 text-orange-700' },
    { value: 'other', label: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-700' },
  ];

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, [filterCategory]);

  const fetchExpenses = async () => {
    try {
      const url = filterCategory
        ? `/expenses?category=${filterCategory}`
        : '/expenses';
      
      const response = await axios.get(url);
      setExpenses(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to load expenses');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/expenses/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Prepare data
      const data = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      if (editingId) {
        await axios.put(`/expenses/${editingId}`, data);
        setSuccessMessage('Expense updated successfully!');
      } else {
        await axios.post('/expenses', data);
        setSuccessMessage('Expense added successfully!');
      }

      // Show success animation
      setShowSuccess(true);

      // Refresh data
      fetchExpenses();
      fetchStats();

      // Close modal after animation
      setTimeout(() => {
        setShowModal(false);
        setEditingId(null);
        setShowSuccess(false);
        setFormData({
          title: '',
          amount: '',
          description: '',
          category: 'other',
          expenseDate: new Date().toISOString().split('T')[0],
          paidBy: '',
          tags: ''
        });
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      description: expense.description || '',
      category: expense.category,
      expenseDate: new Date(expense.expenseDate).toISOString().split('T')[0],
      paidBy: expense.paidBy,
      tags: expense.tags?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await axios.delete(`/expenses/${id}`);
      fetchExpenses();
      fetchStats();
    } catch (error) {
      setError('Failed to delete expense');
    }
  };

  const getCategoryDetails = (category) => {
    return categories.find(c => c.value === category) || categories[categories.length - 1];
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
          <h1 className="text-3xl font-bold text-gray-900">{t('expenses.title')}</h1>
          <p className="text-gray-600 mt-1">{t('expenses.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>{t('expenses.addNew')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{t('expenses.totalExpenses')}</span>
            </div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(stats.total)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.count} {t('expenses.transactions')}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{t('expenses.thisMonth')}</span>
            </div>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(stats.thisMonth)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('expenses.currentPeriod')}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{t('expenses.lastMonth')}</span>
            </div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(stats.lastMonth)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('expenses.previousPeriod')}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{t('expenses.thisYear')}</span>
            </div>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(stats.thisYear)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('expenses.annualTotal')}</p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setFilterCategory('')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterCategory === ''
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('common.all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center space-x-1 ${
                filterCategory === cat.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{t('expenses.recentExpenses')}</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {expenses.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('expenses.noExpenses')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('expenses.startTracking')}</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all"
            >
              {t('expenses.addFirst')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {expenses.map((expense) => {
              const catDetails = getCategoryDetails(expense.category);
              return (
                <div
                  key={expense._id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{catDetails.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{expense.title}</h3>
                        <p className="text-xs text-gray-500">
                          {formatDate(expense.expenseDate)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${catDetails.color}`}>
                      {catDetails.label}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-red-600 mb-2">
                    {formatCurrency(expense.amount)}
                  </p>

                  {expense.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {expense.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{t('expenses.paidBy')}: {expense.paidBy}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </div>

                  {expense.tags && expense.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {expense.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
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

            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Expense' : t('expenses.addNew')}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setError('');
                    setShowSuccess(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expense Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="e.g., Grocery Shopping"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Paid By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paid By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.paidBy}
                    onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Add any additional details..."
                ></textarea>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="e.g., urgent, shared, monthly"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate multiple tags with commas</p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setError('');
                    setShowSuccess(false);
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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

export default Expenses;
