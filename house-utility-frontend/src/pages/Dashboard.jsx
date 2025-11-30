import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import HouseholdSyncBanner from '../components/HouseholdSyncBanner';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Users, 
  Plus, 
  FileText, 
  BarChart3, 
  Zap, 
  Bell,
  Sparkles,
  ArrowUpRight,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    contributions: { total: 0, thisMonth: 0, lastMonth: 0, count: 0 },
    expenses: { total: 0, thisMonth: 0, lastMonth: 0, count: 0 },
    bills: { total: 0, pending: 0, overdue: 0, pendingAmount: 0, upcomingBills: [] },
    recentActivity: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [contribStats, expenseStats, billStats, contributions, expenses, bills] = await Promise.all([
        axios.get('/api/contributions/stats', { headers }),
        axios.get('/api/expenses/stats', { headers }),
        axios.get('/api/bills/stats', { headers }),
        axios.get('/api/contributions', { headers }),
        axios.get('/api/expenses', { headers }),
        axios.get('/api/bills', { headers })
      ]);

      // Get upcoming bills (next 7 days)
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const upcomingBills = bills.data.data
        .filter(bill => {
          const dueDate = new Date(bill.dueDate);
          return bill.status === 'pending' && dueDate >= today && dueDate <= nextWeek;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

      // Build recent activity from all sources
      const recentActivity = [];
      
      // Add recent contributions (last 2)
      contributions.data.data.slice(0, 2).forEach(item => {
        recentActivity.push({
          type: 'contribution',
          message: `Added $${item.amount.toFixed(2)} contribution for ${item.description}`,
          time: getTimeAgo(item.contributionDate),
          icon: DollarSign,
          color: 'text-green-600 bg-green-100'
        });
      });

      // Add recent expenses (last 2)
      expenses.data.data.slice(0, 2).forEach(item => {
        recentActivity.push({
          type: 'expense',
          message: `${item.title} expense of $${item.amount.toFixed(2)} recorded`,
          time: getTimeAgo(item.expenseDate),
          icon: FileText,
          color: 'text-blue-600 bg-blue-100'
        });
      });

      // Add upcoming bills
      upcomingBills.forEach(bill => {
        const daysUntil = Math.ceil((new Date(bill.dueDate) - today) / (1000 * 60 * 60 * 24));
        recentActivity.push({
          type: 'bill',
          message: `${bill.title} bill due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`,
          time: getTimeAgo(bill.dueDate),
          icon: Calendar,
          color: 'text-orange-600 bg-orange-100'
        });
      });

      // Sort by most recent
      recentActivity.sort((a, b) => b.time.localeCompare(a.time));

      setDashboardData({
        contributions: contribStats.data.data,
        expenses: expenseStats.data.data,
        bills: {
          ...billStats.data.data,
          upcomingBills
        },
        recentActivity: recentActivity.slice(0, 4)
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return past.toLocaleDateString();
  };

  const calculateBalance = () => {
    return dashboardData.contributions.total - dashboardData.expenses.total - dashboardData.bills.paidAmount;
  };

  const calculateMonthlyChange = (thisMonth, lastMonth) => {
    if (lastMonth === 0) return thisMonth > 0 ? '+100%' : '0%';
    const change = ((thisMonth - lastMonth) / lastMonth) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const getTrendFromChange = (changeStr) => {
    if (changeStr.startsWith('+')) return 'up';
    if (changeStr.startsWith('-')) return 'down';
    return 'neutral';
  };

  const balance = calculateBalance();
  const expenseChange = calculateMonthlyChange(dashboardData.expenses.thisMonth, dashboardData.expenses.lastMonth);

  const stats = [
    { 
      title: 'Total Balance', 
      value: `$${Math.abs(balance).toFixed(2)}`, 
      change: balance >= 0 ? 'Surplus' : 'Deficit',
      trend: balance >= 0 ? 'up' : 'down',
      icon: DollarSign, 
      bgColor: 'from-blue-500 to-blue-600', 
      textColor: balance >= 0 ? 'text-blue-600' : 'text-red-600', 
      bgLight: balance >= 0 ? 'bg-blue-50' : 'bg-red-50',
      description: 'current status'
    },
    { 
      title: 'Monthly Expenses', 
      value: `$${dashboardData.expenses.thisMonth.toFixed(2)}`, 
      change: expenseChange, 
      trend: getTrendFromChange(expenseChange),
      icon: BarChart3, 
      bgColor: 'from-green-500 to-green-600', 
      textColor: 'text-green-600', 
      bgLight: 'bg-green-50',
      description: 'this month'
    },
    { 
      title: 'Pending Bills', 
      value: dashboardData.bills.pending.toString(), 
      change: `$${dashboardData.bills.pendingAmount.toFixed(2)}`, 
      trend: dashboardData.bills.overdue > 0 ? 'down' : 'neutral',
      icon: Calendar, 
      bgColor: 'from-orange-500 to-orange-600', 
      textColor: 'text-orange-600', 
      bgLight: 'bg-orange-50',
      description: dashboardData.bills.overdue > 0 ? `${dashboardData.bills.overdue} overdue` : 'on track'
    },
    { 
      title: 'Contributions', 
      value: `$${dashboardData.contributions.thisMonth.toFixed(2)}`, 
      change: `${dashboardData.contributions.count} total`, 
      trend: 'up',
      icon: Users, 
      bgColor: 'from-purple-500 to-purple-600', 
      textColor: 'text-purple-600', 
      bgLight: 'bg-purple-50',
      description: 'this month'
    },
  ];

  const quickActions = [
    { 
      name: 'Add Contribution', 
      icon: Plus, 
      color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      description: 'Record new payment',
      path: '/contributions'
    },
    { 
      name: 'Record Expense', 
      icon: FileText, 
      color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      description: 'Log household expense',
      path: '/expenses'
    },
    { 
      name: 'Add Bill', 
      icon: Calendar, 
      color: 'bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900',
      description: 'Schedule new bill',
      path: '/bills'
    },
    { 
      name: 'View Reports', 
      icon: BarChart3, 
      color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      description: 'Analytics dashboard',
      path: '/reports'
    },
  ];

  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getBillStatus = (bill) => {
    const daysUntil = Math.ceil((new Date(bill.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 1) return 'urgent';
    if (daysUntil <= 3) return 'warning';
    return 'normal';
  };

  const formatDaysUntil = (date) => {
    const daysUntil = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    return `In ${daysUntil} days`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Household Sync Banner */}
      <HouseholdSyncBanner />

      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Welcome Section */}
        <motion.div
          variants={cardVariant}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-3xl p-8 text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h2 className="text-3xl font-bold">
                  Welcome back, {user?.name?.split(' ')[0]}! 
                </h2>
                <p className="text-blue-100 text-lg">Here's your household overview for today</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-blue-100">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">All systems running smoothly</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariant}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariant}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${stat.bgLight} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-7 h-7 ${stat.textColor}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(stat.trend)}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.trend === 'up' ? 'text-green-700 bg-green-100' : 
                      stat.trend === 'down' ? 'text-red-700 bg-red-100' : 
                      'text-gray-700 bg-gray-100'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            variants={cardVariant}
            className="lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <motion.button
                    key={index}
                    variants={cardVariant}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(action.path)}
                    className={`${action.color} text-white p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl group`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      <ArrowUpRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg mb-1">{action.name}</p>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Upcoming Bills */}
          <motion.div
            variants={cardVariant}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Upcoming Bills</h3>
            </div>
            
            <div className="space-y-4">
              {dashboardData.bills.upcomingBills.length > 0 ? (
                dashboardData.bills.upcomingBills.map((bill, index) => {
                  const status = getBillStatus(bill);
                  return (
                    <motion.div
                      key={bill._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-l-4 ${
                        status === 'urgent' ? 'border-red-500 bg-red-50' :
                        status === 'warning' ? 'border-orange-500 bg-orange-50' :
                        'border-green-500 bg-green-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{bill.title}</p>
                          <p className="text-sm text-gray-600">{formatDaysUntil(bill.dueDate)}</p>
                        </div>
                        <p className="font-bold text-lg text-gray-900">${bill.amount.toFixed(2)}</p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No upcoming bills</p>
                  <button
                    onClick={() => navigate('/bills')}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Add your first bill →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          variants={cardVariant}
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            {dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400 mt-2">Start by adding contributions, expenses, or bills</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Coming Soon Features */}
        <motion.div
          variants={cardVariant}
          className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full -translate-y-48 translate-x-48"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold">Building Something Amazing!</h3>
                </div>
                
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  We're working on exciting new features to make household management even easier and more intuitive.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {['Smart Analytics', 'Auto Bill Reminders', 'Expense Insights', 'Mobile App'].map((feat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium">{feat}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="hidden lg:block text-8xl opacity-20">
                🚀
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;