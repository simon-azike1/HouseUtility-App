import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';

const Expenses = () => {
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
      const token = localStorage.getItem('token');
      const url = filterCategory 
        ? `/api/expenses?category=${filterCategory}`
        : '/api/expenses';
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/expenses/stats', {
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
      
      // Prepare data
      const data = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      if (editingId) {
        await axios.put(`/api/expenses/${editingId}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/expenses', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchExpenses();
      fetchStats();
      
      setShowModal(false);
      setEditingId(null);
      setFormData({
        title: '',
        amount: '',
        description: '',
        category: 'other',
        expenseDate: new Date().toISOString().split('T')[0],
        paidBy: '',
        tags: ''
      });
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
      const token = localStorage.getItem('token');
      await axios.delete(`/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track and manage household expenses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Expense</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Expenses</span>
              <span className="text-2xl">💸</span>
            </div>
            <p className="text-3xl font-bold text-red-600">${stats.total.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.count} transactions</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">This Month</span>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">${stats.thisMonth.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Current period</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Last Month</span>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">${stats.lastMonth.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Previous period</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">This Year</span>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">${stats.thisYear.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Annual total</p>
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
            All
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
          <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {expenses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No expenses yet</h3>
            <p className="text-gray-600 mb-6">Start tracking your household expenses</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all"
            >
              Add Your First Expense
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
                          {new Date(expense.expenseDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${catDetails.color}`}>
                      {catDetails.label}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-red-600 mb-2">
                    ${expense.amount.toFixed(2)}
                  </p>

                  {expense.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {expense.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Paid by: {expense.paidBy}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Expense' : 'Add New Expense'}
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
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="e.g., Electric bill payment"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
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

                {/* Paid By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Paid By *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.paidBy}
                    onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Who paid for this?"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Add any additional details..."
                ></textarea>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="urgent, shared, monthly (comma separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30"
                >
                  {editingId ? 'Update Expense' : 'Add Expense'}
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