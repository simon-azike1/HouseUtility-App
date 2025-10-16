import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Balance', value: '$0.00', change: '+0%', icon: '💰', bgColor: 'from-blue-500 to-indigo-600', textColor: 'text-blue-600', bgLight: 'bg-blue-50' },
    { title: 'Monthly Expenses', value: '$0.00', change: '+0%', icon: '📊', bgColor: 'from-green-500 to-teal-600', textColor: 'text-green-600', bgLight: 'bg-green-50' },
    { title: 'Pending Bills', value: '0', change: '0 due', icon: '📅', bgColor: 'from-black to-gray-700', textColor: 'text-black', bgLight: 'bg-gray-100' },
    { title: 'Contributors', value: '1', change: 'Active', icon: '👥', bgColor: 'from-blue-400 to-green-400', textColor: 'text-green-600', bgLight: 'bg-green-50' },
  ];

  const quickActions = [
    { name: 'Add Contribution', icon: '💵', color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Record Expense', icon: '🧾', color: 'bg-green-500 hover:bg-green-600' },
    { name: 'Add Bill', icon: '📝', color: 'bg-black/80 hover:bg-black' },
    { name: 'View Reports', icon: '📈', color: 'bg-indigo-500 hover:bg-indigo-600' },
  ];

  const recentActivity = [
    { type: 'info', message: 'Welcome to House Utility Management!', time: 'Just now' },
    { type: 'success', message: 'Your account has been created successfully', time: '1 min ago' },
  ];

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-gray-600">Here's what's happening with your household today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgLight} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">⚡</span> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                className={`${action.color} text-white p-6 rounded-xl transition-all duration-200 shadow-lg hover:scale-100  hover:cursor-pointer hover:shadow-xl`}
                whileHover={{ scale: 1.08 }}
              >
                <div className="text-4xl mb-3">{action.icon}</div>
                <p className="font-semibold">{action.name}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">🔔</span> Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Coming Soon Features */}
      <motion.div
        className="bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl p-8 text-white shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">🚀 Building Something Amazing!</h3>
            <p className="text-indigo-100 mb-4">
              More features are coming soon to help you manage your household utilities better.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Contributions Tracking','Expense Management','Bill Reminders','Analytics & Reports'].map((feat, i) => (
                <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm">{feat}</span>
              ))}
            </div>
          </div>
          <div className="hidden lg:block text-8xl">📊</div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
