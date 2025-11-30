// frontend/src/pages/VerifyEmail.jsx - FIXED
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get email from URL params or localStorage
    const urlEmail = searchParams.get('email');
    const storedEmail = localStorage.getItem('pendingVerificationEmail');

    const emailToVerify = urlEmail || storedEmail || '';
    setEmail(emailToVerify);

    console.log('📧 Email to verify:', emailToVerify);

    // Store in localStorage as backup
    if (emailToVerify) {
      localStorage.setItem('pendingVerificationEmail', emailToVerify);
    }

    // Handle invite code
    const urlInviteCode = searchParams.get('inviteCode');
    const storedInviteCode = localStorage.getItem('pendingInviteCode');
    if (urlInviteCode || storedInviteCode) {
      const inviteCodeToUse = urlInviteCode || storedInviteCode;
      localStorage.setItem('pendingInviteCode', inviteCodeToUse);
      console.log('📝 Invite code detected:', inviteCodeToUse);
    }

    // Check for errors from Google OAuth callback
    const errorType = searchParams.get('error');
    if (errorType === 'email_mismatch') {
      const registered = searchParams.get('registered');
      const google = searchParams.get('google');
      setError(
        `Email mismatch! You registered with ${registered} but signed in with ${google}. Please use the same email.`
      );
    } else if (errorType === 'user_not_found') {
      setError('Account not found. Please register first.');
    } else if (errorType === 'server_error') {
      setError('Something went wrong. Please try again.');
    } else if (errorType === 'auth_failed') {
      setError('Google authentication failed. Please try again.');
    } else if (errorType === 'session_expired') {
      setError('Session expired. Please try again.');
    } else if (errorType === 'no_google_email') {
      setError('Could not get email from Google account.');
    }
  }, [searchParams]);

  // ✅ FIXED: Correct redirect URL with invite code support
  const handleVerifyWithGoogle = () => {
    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    console.log('🚀 Starting verification for:', email);

    // Get invite code from localStorage
    const inviteCode = localStorage.getItem('pendingInviteCode');

    // ✅ CORRECT URL - No /undefined/
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    let redirectUrl = `${backendUrl}/auth/google/verify?email=${encodeURIComponent(email)}`;

    // Add invite code if present
    if (inviteCode) {
      redirectUrl += `&inviteCode=${encodeURIComponent(inviteCode)}`;
      console.log('📝 Including invite code:', inviteCode);
    }

    console.log('🔗 Redirecting to:', redirectUrl);

    // Redirect to backend Google OAuth route
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 text-white text-4xl rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            📧
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We need to verify that you own this email address
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-1">
                <strong>Registered email:</strong>
              </p>
              <p className="text-lg font-semibold text-blue-600 break-all">
                {email || 'Loading...'}
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> Sign in with Google using the <strong>same email address</strong> you registered with.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleVerifyWithGoogle}
            disabled={!email}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-blue-500 transition-all duration-200 shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Verify with Google
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              ← Back to registration
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          🔒 Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;