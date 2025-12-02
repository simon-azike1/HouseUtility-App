import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import {
  Settings,
  Bell,
  Globe,
  Moon,
  Smartphone,
  Mail,
  Shield,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AccountSettings = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    billReminders: true,
    expenseAlerts: true,
    contributionUpdates: true,
    weeklyReport: false,
    monthlyReport: true
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'GMT+1',
    currency: 'MAD',
    dateFormat: 'DD/MM/YYYY',
    theme: darkMode ? 'dark' : 'light'
  });

  // Load user preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/settings`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.notifications) {
          setNotifications(response.data.notifications);
        }
        if (response.data.preferences) {
          setPreferences(response.data.preferences);
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  // Sync theme preference with dark mode context
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      theme: darkMode ? 'dark' : 'light'
    }));
  }, [darkMode]);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));

    // If theme is changed, toggle dark mode
    if (key === 'theme') {
      const shouldBeDark = value === 'dark';
      if (shouldBeDark !== darkMode) {
        toggleDarkMode();
      }
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/settings`,
        {
          notifications,
          preferences
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save settings'
      });
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'es', name: 'Español' }
  ];

  const currencies = [
    { code: 'MAD', name: 'Moroccan Dirham (MAD)', symbol: 'د.م.' },
    { code: 'USD', name: 'US Dollar (USD)', symbol: '$' },
    { code: 'EUR', name: 'Euro (EUR)', symbol: '€' },
    { code: 'GBP', name: 'British Pound (GBP)', symbol: '£' }
  ];

  const timezones = [
    { value: 'GMT+1', label: 'Morocco (GMT+1)' },
    { value: 'GMT', label: 'London (GMT)' },
    { value: 'GMT-5', label: 'New York (GMT-5)' },
    { value: 'GMT+8', label: 'Singapore (GMT+8)' }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600">Manage your preferences and notifications</p>
            </div>
          </div>
        </motion.div>

        {/* Message Alert */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl flex items-start space-x-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={() => handleNotificationChange('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Get alerts on your device</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={() => handleNotificationChange('pushNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Bill Reminders */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Bill Reminders</p>
                  <p className="text-sm text-gray-600">Notify about upcoming bill due dates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.billReminders}
                  onChange={() => handleNotificationChange('billReminders')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Expense Alerts */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Expense Alerts</p>
                  <p className="text-sm text-gray-600">Get notified when expenses are added</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.expenseAlerts}
                  onChange={() => handleNotificationChange('expenseAlerts')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Contribution Updates */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Contribution Updates</p>
                  <p className="text-sm text-gray-600">Alerts for new contributions</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.contributionUpdates}
                  onChange={() => handleNotificationChange('contributionUpdates')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Weekly Report */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Weekly Report</p>
                  <p className="text-sm text-gray-600">Summary of household activity every week</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.weeklyReport}
                  onChange={() => handleNotificationChange('weeklyReport')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Monthly Report */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Monthly Report</p>
                  <p className="text-sm text-gray-600">Comprehensive monthly summary</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.monthlyReport}
                  onChange={() => handleNotificationChange('monthlyReport')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* General Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">General Preferences</h2>
          </div>

          <div className="space-y-6">
            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Format */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date Format
              </label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handlePreferenceChange('theme', 'light')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    preferences.theme === 'light'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-300"></div>
                    <span className="font-semibold text-gray-900">Light</span>
                  </div>
                </button>
                <button
                  onClick={() => handlePreferenceChange('theme', 'dark')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    preferences.theme === 'dark'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Moon className="w-10 h-10 text-gray-700" />
                    <span className="font-semibold text-gray-900">Dark</span>
                  </div>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Dark mode coming soon!</p>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
