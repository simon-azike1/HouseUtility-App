import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-black via-gray-800 to-gray-900 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800 rounded-2xl flex items-center justify-center mb-4 animate-bounce mx-auto shadow-lg overflow-hidden">
            <img
              src="/images/logo.png"
              alt="UTIL Logo"
              className="w-12 h-12 object-contain brightness-150 contrast-125 dark:brightness-200"
            />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // ✅ Check if user needs onboarding (except when already on onboarding page)
  if (user && !user.hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;