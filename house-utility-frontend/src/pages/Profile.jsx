import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Shield,
  Save,
  Camera,
  CheckCircle,
  AlertCircle,
  Home,
  Copy,
  Users
} from 'lucide-react';

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [household, setHousehold] = useState(null);
  const [householdLoading, setHouseholdLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);

  // Profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Password form
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

  useEffect(() => {
    const fetchHouseholdData = async () => {
      setHouseholdLoading(true);

      if (!user?.household) {
        setHousehold(null);
        setHouseholdLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/household', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHousehold(response.data.data);
      } catch (error) {
        console.error('Error fetching household data:', error);
        setHousehold(null);
      } finally {
        setHouseholdLoading(false);
      }
    };

    fetchHouseholdData();
  }, [user]);

  const copyInviteCode = () => {
    if (household?.inviteCode) {
      navigator.clipboard.writeText(household.inviteCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleJoinHousehold = async (e) => {
    e.preventDefault();
    setJoinLoading(true);
    setMessage({ type: '', text: '' });

    if (!joinCode || joinCode.trim().length !== 8) {
      setMessage({ type: 'error', text: 'Please enter a valid 8-character invite code' });
      setJoinLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/household/join',
        { inviteCode: joinCode.trim().toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: 'success', text: 'Successfully joined household!' });
      setShowJoinForm(false);
      setJoinCode('');

      // Refresh page after 2 seconds
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to join household'
      });
    } finally {
      setJoinLoading(false);
    }
  };

  const fetchMembers = async () => {
    if (!user?.household) return;

    setMembersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/household/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to fetch members'
      });
    } finally {
      setMembersLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member from the household?')) {
      return;
    }

    setActionLoading(memberId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/household/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Member removed successfully!' });
      fetchMembers(); // Refresh members list
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to remove member'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (memberId, newRole) => {
    setActionLoading(memberId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/household/members/${memberId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: 'success', text: 'Member role updated successfully!' });
      fetchMembers(); // Refresh members list
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update member role'
      });
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'members' && (user?.householdRole === 'admin' || user?.householdRole === 'owner')) {
      fetchMembers();
    }
  }, [activeTab]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update localStorage
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Refresh page after 2 seconds
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
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
      const token = localStorage.getItem('token');
      await axios.put('/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Logout after 3 seconds
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

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const token = localStorage.getItem('token');
      const response = await axios.post('/auth/upload-profile-picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfilePicture(response.data.profilePicture);
      setMessage({ type: 'success', text: 'Profile picture uploaded successfully!' });

      // Update user in localStorage
      const updatedUser = { ...user, profilePicture: response.data.profilePicture };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Refresh page after 2 seconds to show new picture everywhere
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload profile picture'
      });
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'household', label: 'Household', icon: Home },
    ...((user?.householdRole === 'admin' || user?.householdRole === 'owner') ? [
      { id: 'members', label: 'Members', icon: Users }
    ] : []),
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('settings.title')}</h1>
          <p className="text-gray-600">Manage your profile and security settings</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-6"
        >
          <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
            {/* Avatar */}
            <div className="relative">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <label
                htmlFor="profile-picture-input"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-gray-600" />
                )}
              </label>
              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
                disabled={uploading}
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Active
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {user?.role || 'User'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMessage({ type: '', text: '' });
                  }}
                  className={`flex-1 px-6 py-4 flex items-center justify-center space-x-2 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Message Alert */}
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${
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
                <span className="text-sm">{message.text}</span>
              </motion.div>
            )}

            {/* Household Tab */}
            {activeTab === 'household' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {householdLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading household information...</p>
                  </div>
                ) : household ? (
                  <>
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{household.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {household.members?.length || 0} member{household.members?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center text-white">
                          <Home className="w-8 h-8" />
                        </div>
                      </div>

                      {/* ✅ Only show invite code to admin */}
                      {(user?.householdRole === 'admin' || user?.householdRole === 'owner') && (
                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Invite Code
                          </label>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex-1 bg-white px-4 py-3 rounded-xl border border-gray-300 font-mono text-lg tracking-wider text-gray-900">
                              {household.inviteCode}
                            </div>
                            <button
                              onClick={copyInviteCode}
                              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center space-x-2"
                            >
                              <Copy className="w-5 h-5" />
                              <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              const inviteLink = `${window.location.origin}/register?inviteCode=${household.inviteCode}`;
                              navigator.clipboard.writeText(inviteLink);
                              setMessage({ type: 'success', text: 'Invite link copied to clipboard!' });
                              setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                            }}
                            className="w-full px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl transition-colors flex items-center justify-center space-x-2 text-sm font-semibold"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span>Copy Invite Link</span>
                          </button>
                          <p className="text-xs text-gray-500 mt-2">
                            Share the invite code or link with family members to invite them to your household
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Household Role</h3>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                          (user?.householdRole === 'admin' || user?.householdRole === 'owner') ? 'bg-indigo-100 text-indigo-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {/* Display "ADMIN" for both 'admin' and 'owner' roles */}
                          {(user?.householdRole === 'admin' || user?.householdRole === 'owner') ? 'ADMIN' : user?.householdRole?.toUpperCase() || 'MEMBER'}
                        </span>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">Permissions</p>
                            <ul className="list-disc list-inside space-y-1">
                              {(user?.householdRole === 'admin' || user?.householdRole === 'owner') && (
                                <>
                                  <li>Full access to all household data</li>
                                  <li>Manage and remove household members</li>
                                  <li>Share household invite code</li>
                                  <li>Add, edit, and delete all expenses, bills, and contributions</li>
                                </>
                              )}
                              {(user?.householdRole === 'member' || !user?.householdRole) && (
                                <>
                                  <li>View all household data</li>
                                  <li>Add, edit, and delete all expenses, bills, and contributions</li>
                                  <li>Collaborative household management</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Household Found</h3>
                    <p className="text-gray-600 mb-4">
                      You don't belong to any household yet.
                    </p>

                    {!showJoinForm ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowJoinForm(true)}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg"
                        >
                          <Users className="w-5 h-5 mr-2" />
                          Join a Household
                        </button>
                        <p className="text-sm text-gray-500">
                          Have an invite code? Click above to join an existing household
                        </p>
                      </div>
                    ) : (
                      <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleJoinHousehold}
                        className="max-w-md mx-auto mt-6"
                      >
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h4 className="text-lg font-bold text-gray-900 mb-4">Enter Invite Code</h4>
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Household Invite Code
                            </label>
                            <input
                              type="text"
                              value={joinCode}
                              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                              maxLength={8}
                              placeholder="ABC12XYZ"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl font-mono text-lg tracking-wider text-center uppercase focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Enter the 8-character code you received from the household owner
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setShowJoinForm(false);
                                setJoinCode('');
                                setMessage({ type: '', text: '' });
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={joinLoading || joinCode.trim().length !== 8}
                              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {joinLoading ? 'Joining...' : 'Join Household'}
                            </button>
                          </div>
                        </div>
                      </motion.form>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleProfileUpdate}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (user?.householdRole === 'admin' || user?.householdRole === 'owner') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Household Members</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage members and their roles</p>
                  </div>
                  <button
                    onClick={fetchMembers}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </button>
                </div>

                {membersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading members...</p>
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No members found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member._id}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Avatar */}
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                              {member.name?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            {/* Member Info */}
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {member.name}
                                {member._id === user.id && (
                                  <span className="ml-2 text-xs text-gray-500">(You)</span>
                                )}
                              </h4>
                              <p className="text-sm text-gray-600">{member.email}</p>
                            </div>
                          </div>

                          {/* Role and Actions */}
                          <div className="flex items-center space-x-3">
                            {/* Role Badge - Admin cannot change their own role or other admins */}
                            {member._id === user.id || member.householdRole === 'admin' || member.householdRole === 'owner' ? (
                              <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                                (member.householdRole === 'admin' || member.householdRole === 'owner') ? 'bg-indigo-100 text-indigo-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {/* Display "ADMIN" for both 'admin' and 'owner' roles */}
                                {(member.householdRole === 'admin' || member.householdRole === 'owner') ? 'ADMIN' : member.householdRole?.toUpperCase() || 'MEMBER'}
                              </span>
                            ) : null}

                            {/* Remove Button - Cannot remove yourself or other admins */}
                            {member._id !== user.id && member.householdRole !== 'admin' && member.householdRole !== 'owner' && (
                              <button
                                onClick={() => handleRemoveMember(member._id)}
                                disabled={actionLoading === member._id}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {actionLoading === member._id ? 'Removing...' : 'Remove'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-2">Member Management</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>As admin, you have full control over household members</li>
                        <li>You cannot remove yourself or other admins</li>
                        <li>Removed members can rejoin using the invite code</li>
                        <li>Only one admin per household (the creator)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handlePasswordChange}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-3.59 0-6.729-1.882-8.49-4.71" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-3.59 0-6.729-1.882-8.49-4.71" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-3.59 0-6.729-1.882-8.49-4.71" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
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
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Important</p>
                      <p>You will be logged out after changing your password. Please log in again with your new password.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Shield className="w-5 h-5" />
                    <span>{loading ? 'Changing...' : 'Change Password'}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;