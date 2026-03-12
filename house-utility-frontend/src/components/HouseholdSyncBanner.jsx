import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { logger } from '../utils/logger';

const HouseholdSyncBanner = () => {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkHouseholdSync = async () => {
      // Only check if user is logged in
      if (!user) return;

      try {
        // Fetch fresh user data from server
        const response = await axios.get('/auth/me');

        const serverUser = response.data;

        // Check if household data is out of sync
        const localHousehold = user.household;
        const serverHousehold = serverUser.household;

        // ✅ Extract IDs properly (handle both object and string formats)
        const localHouseholdId = typeof localHousehold === 'object' && localHousehold?._id 
          ? localHousehold._id 
          : localHousehold;

        const serverHouseholdId = typeof serverHousehold === 'object' && serverHousehold?._id 
          ? serverHousehold._id 
          : serverHousehold;

        // Case 1: Server has household but local doesn't
        if (serverHouseholdId && !localHouseholdId) {
          logger.log('🔄 Household sync issue detected: Server has household, local does not');
          setShowBanner(true);
        }

        // Case 2: Different household IDs (compare as strings)
        if (serverHouseholdId && localHouseholdId && 
            String(serverHouseholdId) !== String(localHouseholdId)) {
          logger.log('🔄 Household sync issue detected: Different household IDs');
          logger.log('Local ID:', String(localHouseholdId));
          logger.log('Server ID:', String(serverHouseholdId));
          setShowBanner(true);
        }

      } catch (error) {
        logger.error('Error checking household sync:', error);
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
      logger.error('Error refreshing:', error);
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
      <div className="bg-white dark:bg-gray-800 border-b border-blue-200 dark:border-blue-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Household data needs to be refreshed
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Please refresh to see updated household information
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isRefreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDismiss}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdSyncBanner;