import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/DashboardLayout';
import { usePreferences } from '../context/PreferencesContext';
import axios from 'axios';
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
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { exportExpensesPDF, exportBillsPDF, exportFullReportPDF } from '../utils/pdfExport';

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

const Reports = () => {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [data, setData] = useState({
    contributions: [],
    expenses: [],
    bills: [],
    contributionStats: null,
    expenseStats: null,
    billStats: null
  });

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [contributions, expenses, bills, contribStats, expenseStats, billStats] = await Promise.all([
        axios.get('/contributions', { headers }),
        axios.get('/expenses', { headers }),
        axios.get('/bills', { headers }),
        axios.get('/contributions/stats', { headers }),
        axios.get('/expenses/stats', { headers }),
        axios.get('/bills/stats', { headers })
      ]);

      setData({
        contributions: contributions.data.data || [],
        expenses: expenses.data.data || [],
        bills: bills.data.data || [],
        contributionStats: contribStats.data.data,
        expenseStats: expenseStats.data.data,
        billStats: billStats.data.data
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Get user name from token or localStorage
  const getUserName = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.name || 'User';
    } catch {
      return 'User';
    }
  };

  // Handle PDF Exports
  const handleExportExpenses = async () => {
    setExporting(true);
    try {
      const userName = getUserName();
      const filteredExpenses = data.expenses.filter(expense => {
        const expenseDate = new Date(expense.expenseDate);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        return expenseDate >= start && expenseDate <= end;
      });

      exportExpensesPDF(
        filteredExpenses,
        { start: dateRange.startDate, end: dateRange.endDate },
        userName
      );
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportBills = async () => {
    setExporting(true);
    try {
      const userName = getUserName();
      exportBillsPDF(data.bills, userName);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportFullReport = async () => {
    setExporting(true);
    try {
      const userName = getUserName();
      const totalContributions = data.contributionStats?.total || 0;
      const totalExpenses = data.expenseStats?.total || 0;
      const pendingBills = data.billStats?.pendingAmount || 0;
      const balance = totalContributions - totalExpenses;

      exportFullReportPDF(
        {
          expenses: data.expenses,
          bills: data.bills,
          contributions: data.contributions,
          stats: {
            balance,
            totalContributions,
            totalExpenses,
            pendingBills
          }
        },
        userName
      );
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Monthly Spending Trend Chart
  const getMonthlyTrendData = () => {
    const months = {};
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { contributions: 0, expenses: 0, bills: 0 };
    }

    // Sum contributions
    data.contributions.forEach(item => {
      const date = new Date(item.contributionDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) months[key].contributions += item.amount;
    });

    // Sum expenses
    data.expenses.forEach(item => {
      const date = new Date(item.expenseDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) months[key].expenses += item.amount;
    });

    // Sum bills
    data.bills.forEach(item => {
      if (item.status === 'paid') {
        const date = new Date(item.lastPaidDate || item.dueDate);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (months[key]) months[key].bills += item.amount;
      }
    });

    const labels = Object.keys(months).map(key => {
      const [year, month] = key.split('-');
      return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Contributions',
          data: Object.values(months).map(m => m.contributions),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: Object.values(months).map(m => m.expenses),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4
        },
        {
          label: 'Bills',
          data: Object.values(months).map(m => m.bills),
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  // Expense Category Distribution
  const getExpenseCategoryData = () => {
    const categories = data.expenseStats?.byCategory || {};
    
    return {
      labels: Object.keys(categories).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  // Contribution vs Expense Bar Chart
  const getComparisonData = () => {
    return {
      labels: ['This Month', 'Last Month', 'Total'],
      datasets: [
        {
          label: 'Contributions',
          data: [
            data.contributionStats?.thisMonth || 0,
            data.contributionStats?.lastMonth || 0,
            data.contributionStats?.total || 0
          ],
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
        },
        {
          label: 'Expenses',
          data: [
            data.expenseStats?.thisMonth || 0,
            data.expenseStats?.lastMonth || 0,
            data.expenseStats?.total || 0
          ],
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
        }
      ]
    };
  };

  // Bill Status Distribution
  const getBillStatusData = () => {
    return {
      labels: ['Pending', 'Paid', 'Overdue'],
      datasets: [{
        data: [
          data.billStats?.pendingAmount || 0,
          data.billStats?.paidAmount || 0,
          data.billStats?.overdueAmount || 0
        ],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
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

  const totalContributions = data.contributionStats?.total || 0;
  const totalExpenses = data.expenseStats?.total || 0;
  const totalBills = data.billStats?.total || 0;
  const balance = totalContributions - totalExpenses - totalBills;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('reports.title')}</h1>
        <p className="text-gray-600">{t('reports.subtitle')}</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('reports.startDate')}
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('reports.endDate')}
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button
            onClick={fetchAllData}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            {t('reports.applyFilter')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">{t('reports.totalContributions')}</span>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalContributions)}</p>
          <p className="text-xs opacity-75 mt-1">{data.contributionStats?.count || 0} transactions</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">{t('reports.totalExpenses')}</span>
            <span className="text-2xl">💸</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs opacity-75 mt-1">{data.expenseStats?.count || 0} transactions</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">{t('reports.totalBills')}</span>
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalBills)}</p>
          <p className="text-xs opacity-75 mt-1">{data.billStats?.count || 0} bills</p>
        </div>

        <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-2xl p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">{t('reports.balance')}</span>
            <span className="text-2xl">{balance >= 0 ? '✅' : '⚠️'}</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(Math.abs(balance))}</p>
          <p className="text-xs opacity-75 mt-1">{balance >= 0 ? t('reports.surplus') : t('reports.deficit')}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reports.monthlyTrend')}</h3>
          <div className="h-80">
            <Line data={getMonthlyTrendData()} options={chartOptions} />
          </div>
        </div>

        {/* Contributions vs Expenses */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reports.contributionsVsExpenses')}</h3>
          <div className="h-80">
            <Bar data={getComparisonData()} options={chartOptions} />
          </div>
        </div>

        {/* Expense Category Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reports.expenseByCategory')}</h3>
          <div className="h-80 flex items-center justify-center">
            {Object.keys(data.expenseStats?.byCategory || {}).length > 0 ? (
              <Pie data={getExpenseCategoryData()} options={chartOptions} />
            ) : (
              <p className="text-gray-500">{t('reports.noData')}</p>
            )}
          </div>
        </div>

        {/* Bill Status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reports.billStatus')}</h3>
          <div className="h-80 flex items-center justify-center">
            {data.billStats && (data.billStats.pendingAmount > 0 || data.billStats.paidAmount > 0 || data.billStats.overdueAmount > 0) ? (
              <Doughnut data={getBillStatusData()} options={chartOptions} />
            ) : (
              <p className="text-gray-500">{t('reports.noData')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{t('reports.detailedStats')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contributions Details */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-xl mr-2">💰</span>
              {t('contributions.title')}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('reports.thisMonth')}:</span>
                <span className="font-semibold">${data.contributionStats?.thisMonth.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('reports.lastMonth')}:</span>
                <span className="font-semibold">${data.contributionStats?.lastMonth.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('reports.avgContribution')}:</span>
                <span className="font-semibold">
                  ${data.contributionStats?.count > 0
                    ? (data.contributionStats.total / data.contributionStats.count).toFixed(2)
                    : '0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Expenses Details */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-xl mr-2">💸</span>
              {t('expenses.title')}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('reports.thisMonth')}:</span>
                <span className="font-semibold">${data.expenseStats?.thisMonth.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('reports.lastMonth')}:</span>
                <span className="font-semibold">${data.expenseStats?.lastMonth.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('reports.thisYear')}:</span>
                <span className="font-semibold">${data.expenseStats?.thisYear.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Bills Details */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-xl mr-2">📋</span>
              {t('bills.title')}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('reports.pending')}:</span>
                <span className="font-semibold text-yellow-600">
                  ${data.billStats?.pendingAmount.toFixed(2) || '0.00'} ({data.billStats?.pending || 0})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('reports.overdue')}:</span>
                <span className="font-semibold text-red-600">
                  ${data.billStats?.overdueAmount.toFixed(2) || '0.00'} ({data.billStats?.overdue || 0})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('reports.paid')}:</span>
                <span className="font-semibold text-green-600">
                  ${data.billStats?.paidAmount.toFixed(2) || '0.00'} ({data.billStats?.paid || 0})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Section - Updated with PDF functionality */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            📄 {t('reports.exportReports')}
          </h3>
          <p className="text-indigo-100">{t('reports.exportDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Export Expenses PDF */}
          <button
            onClick={handleExportExpenses}
            disabled={exporting || data.expenses.length === 0}
            className="bg-white text-indigo-600 px-6 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>{t('reports.expensesReport')}</span>
              </>
            )}
          </button>

          {/* Export Bills PDF */}
          <button
            onClick={handleExportBills}
            disabled={exporting || data.bills.length === 0}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/50 transform hover:-translate-y-0.5"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t('reports.billsReport')}</span>
              </>
            )}
          </button>

          {/* Export Full Report PDF */}
          <button
            onClick={handleExportFullReport}
            disabled={exporting || (data.expenses.length === 0 && data.bills.length === 0)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t('reports.fullReport')}</span>
              </>
            )}
          </button>
        </div>

        {/* Info Message */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="text-white font-medium mb-1">Professional PDF Reports Include:</p>
              <ul className="text-indigo-100 space-y-1">
                <li>• Detailed transaction tables with dates and categories</li>
                <li>• Summary statistics and breakdowns</li>
                <li>• Color-coded status indicators</li>
                <li>• Professional formatting with your name and date</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data count info */}
        <div className="mt-4 text-center text-indigo-100 text-sm">
          Available data: {data.expenses.length} expenses • {data.bills.length} bills • {data.contributions.length} contributions
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;