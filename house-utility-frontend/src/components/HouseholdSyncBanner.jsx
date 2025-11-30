import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const HouseholdSyncBanner = () => {
  const { user, logout } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkHouseholdSync = async () => {
      // Only check if user is logged in
      if (!user) return;

      try {
        // Fetch fresh user data from server
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const serverUser = response.data;

        // Check if household data is out of sync
        const localHousehold = user.household;
        const serverHousehold = serverUser.household;

        // Case 1: Server has household but local doesn't
        if (serverHousehold && !localHousehold) {
          console.log('🔄 Household sync issue detected: Server has household, local does not');
          setShowBanner(true);
        }

        // Case 2: Different household IDs
        if (serverHousehold && localHousehold && serverHousehold !== localHousehold) {
          console.log('🔄 Household sync issue detected: Different household IDs');
          setShowBanner(true);
        }

      } catch (error) {
        console.error('Error checking household sync:', error);
      }
    };

    // Check on component mount
    checkHouseholdSync();
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      // Clear localStorage and reload
      localStorage.clear();
      sessionStorage.clear();

      // Show a brief message before reload
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error refreshing:', error);
      setIsRefreshing(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Store dismissed state for this session
    sessionStorage.setItem('householdSyncBannerDismissed', 'true');
  };

  // Don't show if already dismissed in this session
  if (sessionStorage.getItem('householdSyncBannerDismissed') === 'true') {
    return null;
  }

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slideDown">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-1 flex items-center gap-2">
                🔄 Household Data Needs Refresh
              </h3>
              <p className="text-amber-800 mb-3">
                Your household information needs to be updated. This happens when your account was recently added to a household.
                Please refresh to see all household expenses, bills, and contributions.
              </p>

              <div className="flex flex-wrap gap-3">
                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRefreshing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh Now
                    </>
                  )}
                </button>

                {/* Dismiss Button */}
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2.5 bg-white border-2 border-amber-300 text-amber-800 font-semibold rounded-lg hover:bg-amber-50 transition-all duration-200"
                >
                  Dismiss
                </button>
              </div>

              {/* Help Text */}
              <p className="text-xs text-amber-700 mt-3 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Clicking "Refresh Now" will log you out and reload the page. You'll need to login again.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-amber-600 hover:text-amber-800 transition-colors"
              aria-label="Close banner"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdSyncBanner;
