import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '../context/PreferencesContext';
import axios from 'axios';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { updatePreferences, preferences } = usePreferences();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, []);

  // Navigation items with dropdown support
  const navigationItems = [
    {
      label: t('navbar.aboutUs'),
      href: '/our-story',
      isRoute: true,
      dropdown: [
        { label: t('navbar.ourStory'), href: '/our-story', isRoute: true },
        { label: t('navbar.team'), href: '/team', isRoute: true }
      ]
    },
    {
      label: t('navbar.services'),
      href: '/services',
      isRoute: true
    },
    { label: t('navbar.contactUs'), href: '/contact', isRoute: true },
    // { label: 'Blog', href: '/blog', isRoute: true },
    { label: t('navbar.pricing'), href: '/pricing', isRoute: true }
  ];

  // Animation variants
  const menuVariants = {
    closed: { x: '100%', opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  // Logo animation variants
  const logoVariants = {
    hover: { 
      scale: 1.05,
      rotate: [0, -2, 2, 0],
      transition: { 
        duration: 0.3,
        rotate: { duration: 0.5, ease: "easeInOut" }
      }
    }
  };

  const NavItem = ({ item, isMobile = false }) => {
    const hasDropdown = item.dropdown && item.dropdown.length > 0;
    const isActive = activeDropdown === item.label;

    return (
      <div className="relative group">
        {item.isRoute ? (
          <Link
            to={item.href}
            onClick={closeMenu}
            className={`
              ${isMobile 
                ? 'block text-white hover:text-blue-300 font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all' 
                : `text-gray-800 hover:text-blue-600 transition-all duration-200 font-medium relative
                   after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
                   after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:transition-all after:duration-300 
                   hover:after:w-full ${location.pathname === item.href ? 'text-blue-600 after:w-full' : ''}`
              }
            `}
          >
            {item.label}
          </Link>
        ) : (
          <>
            <button
              className={`
                flex items-center gap-1 transition-all duration-200 font-medium
                ${isMobile 
                  ? 'text-white hover:text-blue-300 py-3 px-4 rounded-lg hover:bg-white/10 w-full text-left' 
                  : 'text-gray-800 hover:text-blue-600 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:transition-all after:duration-300 hover:after:w-full'
                }
              `}
              onClick={() => {
                if (hasDropdown && !isMobile) {
                  setActiveDropdown(isActive ? null : item.label);
                } else if (!hasDropdown) {
                  document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                  closeMenu();
                }
              }}
            >
              {item.label}
              {hasDropdown && (
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? 'rotate-180' : ''
                  }`} 
                />
              )}
            </button>

            {/* Desktop Dropdown */}
            {hasDropdown && !isMobile && (
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  >
                    {item.dropdown.map((dropdownItem, index) => (
                      dropdownItem.isRoute ? (
                        <Link
                          key={index}
                          to={dropdownItem.href}
                          onClick={closeMenu}
                          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all"
                        >
                          {dropdownItem.label}
                        </Link>
                      ) : (
                        <a
                          key={index}
                          href={dropdownItem.href}
                          onClick={closeMenu}
                          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all"
                        >
                          {dropdownItem.label}
                        </a>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Mobile Dropdown */}
            {hasDropdown && isMobile && (
              <div className="ml-4 space-y-2">
                {item.dropdown.map((dropdownItem, index) => (
                  dropdownItem.isRoute ? (
                    <Link
                      key={index}
                      to={dropdownItem.href}
                      onClick={closeMenu}
                      className="block text-gray-300 hover:text-green-300 py-2 px-4 rounded-lg hover:bg-white/5 transition-all"
                    >
                      {dropdownItem.label}
                    </Link>
                  ) : (
                    <a
                      key={index}
                      href={dropdownItem.href}
                      onClick={closeMenu}
                      className="block text-gray-300 hover:text-green-300 py-2 px-4 rounded-lg hover:bg-white/5 transition-all"
                    >
                      {dropdownItem.label}
                    </a>
                  )
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <nav 
        className={`
          fixed w-full z-50 transition-all duration-300
          ${scrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
            : 'bg-white/90 backdrop-blur-md border-b border-gray-200'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <motion.div
              variants={logoVariants}
              whileHover="hover"
              className="relative"
            >
              <Link 
                to="/" 
                className="flex items-center space-x-4 group relative z-10"
                onClick={closeMenu}
              >
                {/* Logo Container with Enhanced Styling */}
                <div className="relative">
                  {/* Glow Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  
                  {/* Main Logo Container */}
                  <div className="relative w-12 h-12 bg-gradient-to-br from-black via-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-2xl border-2 border-gray-700 group-hover:border-blue-400 transition-all duration-300">
                    {/* Logo Image */}
                    <img 
                      src="./images/logo.png" 
                      alt="Util Logo"
                      className="w-8 h-8 object-contain filter brightness-110 contrast-110 group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Overlay Gradient for Better Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </div>
                </div>

                {/* Enhanced Text Logo */}
                <div className="flex flex-col">
                  <span className="text-2xl font-black bg-gradient-to-r from-black via-blue-600 to-green-600 bg-clip-text text-transparent tracking-tight leading-none">
                    UTIL
                  </span>
                  {/* <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase leading-none">
                    Solutions
                  </span> */}
                </div>

                {/* Animated Accent Line */}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover:w-full transition-all duration-500 ease-out"></div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <NavItem key={index} item={item} />
              ))}
            </div>

            {/* Desktop Auth Items - FIXED */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Change Language"
                >
                  <Languages className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {languageDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50"
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

                            // Save to backend if user is authenticated
                            try {
                              await axios.put('/auth/settings', {
                                preferences: { ...preferences, language: lang.code }
                              });
                            } catch (error) {
                              console.error('Failed to save language preference:', error);
                            }

                            setLanguageDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                            i18n.language === lang.code ? 'bg-gray-100 font-semibold' : ''
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="text-gray-700">{lang.name}</span>
                          {i18n.language === lang.code && (
                            <span className="ml-auto text-blue-600">✓</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <DarkModeToggle variant="inline" />

              {/* Login Button */}
              <Link
                to="/login"
                className="text-gray-800 hover:text-blue-600 transition-all duration-200 font-medium relative px-4 py-2 rounded-lg hover:bg-blue-50 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {t('navbar.login')}
              </Link>

              {/* Get Started Button */}
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-2.5 rounded-full font-semibold hover:from-blue-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                {t('navbar.getStarted')}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all z-[60] relative"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Mobile Sidebar */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-black via-gray-900 to-gray-800 z-50 shadow-2xl lg:hidden border-l border-gray-700"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col h-full">
                {/* Enhanced Mobile Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center space-x-4">
                    {/* Mobile Logo */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl blur-sm opacity-40"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-black via-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-xl border border-gray-600">
                        <img 
                        src="./images/logo.png" 
                          alt="Util Logo"
                          className="w-8 h-8 object-contain filter brightness-110"
                        />
                      </div>
                    </div>
                    
                    {/* Mobile Text */}
                    <div className="flex flex-col">
                      <span className="text-xl font-black bg-gradient-to-r from-white via-blue-400 to-green-400 bg-clip-text text-transparent tracking-tight">
                        UTIL
                      </span>
                      {/* <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                        Solutions
                      </span> */}
                    </div>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-6">
                  <motion.div className="space-y-2 px-6" variants={itemVariants}>
                    {navigationItems.map((item, index) => (
                      <motion.div key={index} variants={itemVariants}>
                        <NavItem item={item} isMobile />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Mobile Auth Items - FIXED */}
                  <motion.div className="mt-8 px-6 pt-6 border-t border-gray-700 space-y-4" variants={itemVariants}>
                    {/* Mobile Language Switcher */}
                    <motion.div variants={itemVariants}>
                      <div className="mb-4">
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Language</p>
                        <div className="grid grid-cols-2 gap-2">
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

                                // Save to backend if user is authenticated
                                try {
                                  await axios.put('/auth/settings', {
                                    preferences: { ...preferences, language: lang.code }
                                  });
                                } catch (error) {
                                  console.error('Failed to save language preference:', error);
                                }
                              }}
                              className={`flex items-center gap-2 py-2 px-3 rounded-lg border transition-all ${
                                i18n.language === lang.code
                                  ? 'bg-blue-600 border-blue-500 text-white'
                                  : 'border-gray-600 text-gray-300 hover:border-blue-400 hover:bg-white/5'
                              }`}
                            >
                              <span className="text-lg">{lang.flag}</span>
                              <span className="text-xs font-medium">{lang.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <DarkModeToggle
                        variant="inline"
                        className="w-full flex items-center justify-center border border-gray-600 hover:border-blue-400"
                      />
                    </motion.div>

                    {/* Mobile Login */}
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="block text-white hover:text-blue-300 font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all text-center border border-gray-600 hover:border-blue-400"
                      >
                        {t('navbar.login')}
                      </Link>
                    </motion.div>

                    {/* Mobile Get Started */}
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/register"
                        onClick={closeMenu}
                        className="block bg-gradient-to-r from-blue-600 to-green-500 text-white text-center rounded-full font-semibold hover:from-blue-700 hover:to-green-600 py-3 px-6 transition-all shadow-lg hover:shadow-xl"
                      >
                        {t('navbar.getStarted')}
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Footer */}
                <motion.div className="p-6 border-t border-gray-700" variants={itemVariants}>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                  <p className="text-gray-400 text-xs text-center font-medium">
                    © 2024 UTIL Solutions. All rights reserved.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside handler for dropdowns */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
  );
};

export default Navbar;
