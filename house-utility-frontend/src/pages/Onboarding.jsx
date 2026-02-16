import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isVideoWatched, setIsVideoWatched] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  // YouTube video embed URL
  const YOUTUBE_VIDEO_URL = "https://www.youtube.com/embed/NBhvT2XWBiw";

  const handleComplete = async () => {
    try {
      // Mark onboarding as completed in the backend
      await axios.put('/auth/complete-onboarding', {});

      // Update user context
      if (updateUser) {
        updateUser({ ...user, hasCompletedOnboarding: true });
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Even if the API fails, let them proceed
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    setIsSkipping(true);
  };

  const confirmSkip = () => {
    handleComplete();
  };

  const cancelSkip = () => {
    setIsSkipping(false);
  };

  // Track video progress (optional - you can use YouTube API for more accuracy)
  const handleVideoProgress = () => {
    // Simple approach: consider watched after 30 seconds
    setTimeout(() => {
      setIsVideoWatched(true);
    }, 30000); // 30 seconds
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Skip Confirmation Modal */}
        {isSkipping && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 animate-fadeIn">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Skip Onboarding?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This video will help you understand how to use UTIL effectively. Are you sure you want to skip it?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cancelSkip}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Watch Video
                </button>
                <button
                  onClick={confirmSkip}
                  className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors"
                >
                  Skip Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg overflow-hidden">
              <img
                src="/images/logo.png"
                alt="UTIL Logo"
                className="w-16 h-16 object-contain brightness-0 invert"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome to UTIL! 🎉
            </h1>
            <p className="text-indigo-100 text-lg">
              Let's get you started with a quick tour
            </p>
          </div>

          {/* Video Section */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                How to Use UTIL
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Watch this short video to learn how to manage your household finances efficiently.
              </p>
            </div>

            {/* Video Container */}
            <div className="relative bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden mb-6" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={YOUTUBE_VIDEO_URL}
                title="UTIL Onboarding Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleVideoProgress}
              ></iframe>
            </div>

            {/* Features Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Track Contributions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Record and monitor household payments</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Expenses</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Log daily household expenses</p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Schedule Bills</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Never miss a payment deadline</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleComplete}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <button
                onClick={handleSkip}
                className="sm:w-auto px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Skip for Now
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              You can always access this video later from the Help & Support section
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
