import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
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

  const stats = [
    { 
      title: 'Total Balance', 
      value: '$2,450.00', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign, 
      bgColor: 'from-blue-500 to-blue-600', 
      textColor: 'text-blue-600', 
      bgLight: 'bg-blue-50',
      description: 'vs last month'
    },
    { 
      title: 'Monthly Expenses', 
      value: '$1,230.50', 
      change: '+8.2%', 
      trend: 'up',
      icon: BarChart3, 
      bgColor: 'from-green-500 to-green-600', 
      textColor: 'text-green-600', 
      bgLight: 'bg-green-50',
      description: 'this month'
    },
    { 
      title: 'Pending Bills', 
      value: '3', 
      change: '2 due soon', 
      trend: 'neutral',
      icon: Calendar, 
      bgColor: 'from-orange-500 to-orange-600', 
      textColor: 'text-orange-600', 
      bgLight: 'bg-orange-50',
      description: 'next 7 days'
    },
    { 
      title: 'Contributors', 
      value: '4', 
      change: '1 new', 
      trend: 'up',
      icon: Users, 
      bgColor: 'from-purple-500 to-purple-600', 
      textColor: 'text-purple-600', 
      bgLight: 'bg-purple-50',
      description: 'active members'
    },
  ];

  const quickActions = [
    { 
      name: 'Add Contribution', 
      icon: Plus, 
      color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      description: 'Record new payment'
    },
    { 
      name: 'Record Expense', 
      icon: FileText, 
      color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      description: 'Log household expense'
    },
    { 
      name: 'Add Bill', 
      icon: Calendar, 
      color: 'bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900',
      description: 'Schedule new bill'
    },
    { 
      name: 'View Reports', 
      icon: BarChart3, 
      color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      description: 'Analytics dashboard'
    },
  ];

  const recentActivity = [
    { 
      type: 'contribution', 
      message: 'John added $250 for electricity bill', 
      time: '2 hours ago',
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    { 
      type: 'expense', 
      message: 'Water bill payment of $89.50 recorded', 
      time: '5 hours ago',
      icon: FileText,
      color: 'text-blue-600 bg-blue-100'
    },
    { 
      type: 'bill', 
      message: 'Internet bill due in 3 days', 
      time: '1 day ago',
      icon: Calendar,
      color: 'text-orange-600 bg-orange-100'
    },
    { 
      type: 'member', 
      message: 'Sarah joined the household', 
      time: '2 days ago',
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    },
  ];

  const upcomingBills = [
    { name: 'Internet', amount: '$79.99', due: 'Tomorrow', status: 'urgent' },
    { name: 'Electricity', amount: '$156.30', due: 'In 3 days', status: 'warning' },
    { name: 'Gas', amount: '$92.45', due: 'In 5 days', status: 'normal' },
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

  return (
    <DashboardLayout>
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
              {/* <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div> */}
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
              {upcomingBills.map((bill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-l-4 ${
                    bill.status === 'urgent' ? 'border-red-500 bg-red-50' :
                    bill.status === 'warning' ? 'border-orange-500 bg-orange-50' :
                    'border-green-500 bg-green-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{bill.name}</p>
                      <p className="text-sm text-gray-600">{bill.due}</p>
                    </div>
                    <p className="font-bold text-lg text-gray-900">{bill.amount}</p>
                  </div>
                </motion.div>
              ))}
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
            {recentActivity.map((activity, index) => {
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
            })}
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
