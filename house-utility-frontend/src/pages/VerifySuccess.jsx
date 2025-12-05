// frontend/src/pages/VerifySuccess.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const VerifySuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAutoLogin = async () => {
      const token = searchParams.get('token');

      if (!token) {
        console.error('❌ No token found in URL');
        setError('No authentication token found');
        setIsLoggingIn(false);
        // Redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        console.log('🔑 Token received, fetching user data...');

        // Fetch user data with the token
        const response = await axios.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ User data fetched:', response.data);

        // Store token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data));

        console.log('✅ Auto-login successful!');
        console.log('📊 User household:', response.data.household);
        console.log('👤 User role:', response.data.householdRole);

        setIsLoggingIn(false);

        // Clear invite code from localStorage if present
        localStorage.removeItem('pendingInviteCode');
        localStorage.removeItem('pendingVerificationEmail');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);

      } catch (err) {
        console.error('❌ Auto-login failed:', err);
        setError('Failed to log you in automatically. Please login manually.');
        setIsLoggingIn(false);

        // Redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAutoLogin();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white text-4xl rounded-2xl mb-4 shadow-lg shadow-green-500/30 animate-bounce">
            ✅
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-gray-600">
            {isLoggingIn ? 'Logging you in...' : 'Your email has been successfully verified'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error ? (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-900 mb-1">
                      Error
                    </p>
                    <p className="text-sm text-red-800">
                      {error}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30"
              >
                Go to Login
              </button>
            </div>
          ) : isLoggingIn ? (
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Setting up your account...
                    </p>
                    <p className="text-sm text-blue-800">
                      Please wait while we log you in
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      🎉 All Set!
                    </p>
                    <p className="text-sm text-green-800">
                      Redirecting you to the dashboard...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifySuccess;