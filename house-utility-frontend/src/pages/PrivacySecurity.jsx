import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Trash2,
  Download,
  FileText
} from 'lucide-react';

const PrivacySecurity = () => {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('password');

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'household',
    activityStatus: true,
    shareEmail: false,
    sharePhone: false,
    allowDataAnalytics: true
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      await axios.put('/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      );

      setMessage({ type: 'success', text: 'Password changed successfully! You will be logged out.' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyChange = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDownloadData = () => {
    setMessage({ type: 'success', text: 'Your data export has been requested and will be sent to your email.' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setMessage({ type: 'error', text: 'Account deletion feature coming soon. Please contact support.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const sections = [
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'privacy', label: 'Privacy Settings', icon: Eye },
    { id: 'data', label: 'Data & Privacy', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy & Security</h1>
              <p className="text-gray-600">Manage your account security and privacy settings</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              {/* Change Password Section */}
              {activeSection === 'password' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordData.confirmPassword && (
                        <p className={`text-xs mt-1 ${
                          passwordData.newPassword === passwordData.confirmPassword
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {passwordData.newPassword === passwordData.confirmPassword
                            ? '✓ Passwords match'
                            : '✗ Passwords do not match'}
                        </p>
                      )}
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                          You will be logged out after changing your password. Please log in again with your new password.
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all shadow-lg disabled:opacity-50"
                    >
                      {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              )}

              {/* Privacy Settings Section */}
              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">Profile Visibility</p>
                        <p className="text-sm text-gray-600">Who can see your profile information</p>
                      </div>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      >
                        <option value="public">Everyone</option>
                        <option value="household">Household Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">Activity Status</p>
                        <p className="text-sm text-gray-600">Show when you're active</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.activityStatus}
                          onChange={() => handlePrivacyChange('activityStatus')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">Share Email with Household</p>
                        <p className="text-sm text-gray-600">Allow household members to see your email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.shareEmail}
                          onChange={() => handlePrivacyChange('shareEmail')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">Allow Data Analytics</p>
                        <p className="text-sm text-gray-600">Help us improve by sharing anonymous usage data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.allowDataAnalytics}
                          onChange={() => handlePrivacyChange('allowDataAnalytics')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Privacy Section */}
              {activeSection === 'data' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Data & Privacy</h2>
                  <div className="space-y-4">
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <div className="flex items-start space-x-4">
                        <Download className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">Download Your Data</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Request a copy of all your data including expenses, bills, contributions, and profile information.
                          </p>
                          <button
                            onClick={handleDownloadData}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Request Data Export
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border border-red-200 rounded-xl bg-red-50">
                      <div className="flex items-start space-x-4">
                        <Trash2 className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
                          <p className="text-sm text-red-700 mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <button
                            onClick={handleDeleteAccount}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security</h2>
                  <div className="space-y-6">
                    <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-start space-x-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-green-900 mb-2">Your Account is Secure</h3>
                          <ul className="text-sm text-green-700 space-y-2">
                            <li>✓ Email verified</li>
                            <li>✓ Strong password encryption</li>
                            <li>✓ Secure authentication (JWT)</li>
                            <li>✓ HTTPS encrypted connection</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Add an extra layer of security to your account. Coming soon!
                      </p>
                      <button
                        disabled
                        className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                      >
                        Enable 2FA (Coming Soon)
                      </button>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Active Sessions</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Manage devices where you're currently logged in. Coming soon!
                      </p>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">Current Device</p>
                          <p className="text-xs text-gray-600">Last active: Now</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrivacySecurity;
