import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePreferences } from '../context/PreferencesContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';


import {
  Home,
  DollarSign,
  FileText,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  User,
  Shield,
  HelpCircle,
  Moon,
  Sun,
  Zap,
  Languages
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { updatePreferences, preferences } = usePreferences();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('/notifications?limit=10', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.notifications) {
          // Transform notifications to match UI format
          const transformedNotifications = response.data.notifications.map(notif => ({
            id: notif._id,
            title: notif.title,
            message: notif.message,
            time: getRelativeTime(notif.createdAt),
            type: notif.type,
            isRead: notif.isRead
          }));
          setNotifications(transformedNotifications);
          setUnreadCount(response.data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to calculate relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now - then;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Close dropdowns on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
    // Don't close sidebar on desktop
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: Home, current: location.pathname === '/dashboard' },
    { name: t('nav.contributions'), href: '/contributions', icon: DollarSign, current: location.pathname === '/contributions' },
    { name: t('nav.expenses'), href: '/expenses', icon: FileText, current: location.pathname === '/expenses' },
    { name: t('nav.bills'), href: '/bills', icon: Calendar, current: location.pathname === '/bills' },
    { name: t('nav.reports'), href: '/reports', icon: Calendar, current: location.pathname === '/reports' },
    { name: t('nav.members'), href: '/members', icon: Users, current: location.pathname === '/members' },
    { name: t('nav.settings'), href: '/account', icon: Settings, current: location.pathname === '/account' },
  ];

  const profileMenuItems = [
    { name: t('nav.profile'), icon: User, href: '/profile' },
    { name: t('nav.accountSettings'), icon: Settings, href: '/account' },
    { name: t('nav.privacySecurity'), icon: Shield, href: '/privacy' },
    { name: t('nav.helpSupport'), icon: HelpCircle, href: '/help' },
  ];

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = [];

    // Search through navigation items
    navigation.forEach(item => {
      if (item.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'page',
          title: item.name,
          description: `Navigate to ${item.name}`,
          icon: item.icon,
          action: () => {
            navigate(item.href);
            setShowSearchResults(false);
            setSearchQuery('');
          }
        });
      }
    });

    // Search through profile menu items
    profileMenuItems.forEach(item => {
      if (item.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'page',
          title: item.name,
          description: `Go to ${item.name}`,
          icon: item.icon,
          action: () => {
            navigate(item.href);
            setShowSearchResults(false);
            setSearchQuery('');
          }
        });
      }
    });

    // Add quick action suggestions
    const quickActions = [
      { keyword: 'add contribution', title: 'Add Contribution', description: 'Record a new payment', icon: DollarSign, path: '/contributions' },
      { keyword: 'add expense', title: 'Add Expense', description: 'Log household expense', icon: FileText, path: '/expenses' },
      { keyword: 'add bill', title: 'Add Bill', description: 'Schedule a new bill', icon: Calendar, path: '/bills' },
      { keyword: 'view reports', title: 'View Reports', description: 'Analytics dashboard', icon: Calendar, path: '/reports' },
      { keyword: 'manage members', title: 'Manage Members', description: 'View household members', icon: Users, path: '/members' },
      { keyword: 'dark mode', title: 'Toggle Dark Mode', description: 'Switch theme', icon: darkMode ? Sun : Moon, path: null, action: toggleDarkMode },
      { keyword: 'logout', title: 'Logout', description: 'Sign out of your account', icon: LogOut, path: null, action: handleLogout }
    ];

    quickActions.forEach(action => {
      if (action.keyword.includes(lowerQuery) || action.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'action',
          title: action.title,
          description: action.description,
          icon: action.icon,
          action: action.action || (() => {
            navigate(action.path);
            setShowSearchResults(false);
            setSearchQuery('');
          })
        });
      }
    });

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const overlayVariants = {
    open: { opacity: 1, transition: { duration: 0.2 } },
    closed: { opacity: 0, transition: { duration: 0.2 } }
  };

  const dropdownVariants = {
    open: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar - FIXED: Always visible on desktop */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col">
          {/* Desktop Sidebar */}
          <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 px-6 py-6 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-black via-gray-800 to-gray-900 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                  <img
                    src="/images/logo.png"
                    alt="UTIL Logo"
                    className="w-10 h-10 object-contain brightness-150 contrast-125 dark:brightness-200"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-black via-blue-600 to-green-600 dark:from-white dark:via-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                  UTIL
                </h1>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                  Dashboard
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      item.current
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      item.current ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    <span>{item.name}</span>
                    {item.current && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User info */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-2xl lg:hidden border-r border-gray-200 dark:border-gray-700"
            >
              <div className="flex h-full flex-col">
                {/* Mobile Logo */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                  <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-4 hover:opacity-80 transition-opacity group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-black via-gray-800 to-gray-900 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                        <img
                          src="/images/logo.png"
                          alt="UTIL Logo"
                          className="w-10 h-10 object-contain brightness-150 contrast-125 dark:brightness-200"
                        />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-xl font-black bg-gradient-to-r from-black via-blue-600 to-green-600 dark:from-white dark:via-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                        UTIL
                      </h1>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                        Dashboard
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {navigation.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          item.current
                            ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                          item.current ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                        }`} />
                        <span>{item.name}</span>
                        {item.current && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile User info */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-30">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
              {/* Left side */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Search */}
                <div className="hidden sm:block relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    placeholder={t('common.search') || 'Search...'}
                    className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />

                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {showSearchResults && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
                      >
                        <div className="p-2">
                          {searchResults.map((result, index) => {
                            const IconComponent = result.icon;
                            return (
                              <button
                                key={index}
                                onClick={result.action}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-start gap-3 group"
                              >
                                {IconComponent && (
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <IconComponent className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {result.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {result.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3">
                {/* Dark mode toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Language Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                    title="Change Language"
                  >
                    <Languages className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {languageDropdownOpen && (
                      <motion.div
                        variants={{
                          closed: { opacity: 0, y: -10, scale: 0.95 },
                          open: { opacity: 1, y: 0, scale: 1 }
                        }}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      >
                        {[
                          { code: 'en', name: 'English', flag: '🇬🇧' },
                          { code: 'fr', name: 'Français', flag: '🇫🇷' },
                          { code: 'ar', name: 'العربية', flag: '🇸🇦' },
                          { code: 'es', name: 'Español', flag: '🇪🇸' }
                        ].map((lang) => (
                          <button
                            key={lang.code}
                            onClick={async () => {
                              i18n.changeLanguage(lang.code);
                              updatePreferences({ language: lang.code });

                              // Save to backend
                              try {
                                const token = localStorage.getItem('token');
                                await axios.put('/auth/settings', {
                                  preferences: { ...preferences, language: lang.code }
                                }, {
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                              } catch (error) {
                                console.error('Failed to save language preference:', error);
                              }

                              setLanguageDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                              i18n.language === lang.code ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : ''
                            }`}
                          >
                            <span className="text-xl">{lang.flag}</span>
                            <span className="text-gray-700 dark:text-gray-300">{lang.name}</span>
                            {i18n.language === lang.code && (
                              <span className="ml-auto text-blue-600 dark:text-blue-400">✓</span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold px-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <>
                        {/* Mobile backdrop overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setNotificationsOpen(false)}
                          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                        />

                        {/* Notification panel */}
                        <motion.div
                          variants={dropdownVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="fixed sm:absolute top-0 sm:top-auto right-0 bottom-0 sm:bottom-auto sm:mt-2 w-full sm:w-96 bg-white dark:bg-gray-800 sm:rounded-2xl shadow-xl border-0 sm:border border-gray-200 dark:border-gray-700 z-50"
                        >
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h3 className="text-base sm:text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            <button
                              onClick={() => setNotificationsOpen(false)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          {/* Notification list */}
                          <div className="overflow-y-auto h-[calc(100vh-60px)] sm:max-h-96">
                            {loadingNotifications ? (
                              <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                                Loading notifications...
                              </div>
                            ) : notifications.length === 0 ? (
                              <div className="px-4 py-12 text-center">
                                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                              </div>
                            ) : (
                              notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                  }`}
                                  onClick={() => {
                                    if (!notification.isRead) markNotificationAsRead(notification.id);
                                    setNotificationsOpen(false);
                                  }}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                      notification.type === 'success' ? 'bg-green-500' :
                                      notification.type === 'warning' ? 'bg-orange-500' :
                                      notification.type === 'error' ? 'bg-red-500' :
                                      'bg-blue-500'
                                    }`}></div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{notification.message}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
                                    </div>
                                    {!notification.isRead && (
                                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
                        </div>
                        
                        {profileMenuItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                              <IconComponent className="w-4 h-4" />
                              {item.name}
                            </Link>
                          );
                        })}
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
