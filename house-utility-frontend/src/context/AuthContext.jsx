import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI, householdAPI } from '/services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Refresh user data from server
  const refreshUser = useCallback(async () => {
    try {
      const userResponse = await authAPI.getMe();
      const userData = userResponse.data;

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      console.log('✅ User data refreshed from server:', userData);
      console.log('📋 Household field:', userData.household);
      console.log('👤 Household role:', userData.householdRole);
      return userData;
    } catch (err) {
      console.error('❌ Failed to refresh user data:', err);
      localStorage.removeItem('user');
      setUser(null);
      return null;
    }
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        try {
          // Set cached user first for immediate display
          setUser(JSON.parse(savedUser));

          // Then refresh from server to get latest data
          await refreshUser();
        } catch (err) {
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        await refreshUser();
      }
      setLoading(false);
    };

    loadUser();
  }, [refreshUser]);

  // Login method
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const userResponse = await authAPI.getMe();
      const userData = userResponse.data;

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      console.log('User fetched after login:', userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      
      // ✅ Check if error is about email verification
      const needsVerification = err.response?.data?.needsVerification || 
                               message.toLowerCase().includes('not verified') ||
                               message.toLowerCase().includes('verify');
      
      setError(message);
      
      return { 
        success: false, 
        error: message,
        needsVerification: needsVerification,
        email: email // Pass email for redirect
      };
    }
  };

  // ✅ CORRECTED REGISTER METHOD
  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await authAPI.register({ name, email, password });
      
      // ✅ ALWAYS return needsVerification: true for new registrations
      // Store email for verification page
      localStorage.setItem('pendingVerificationEmail', email);
      
      console.log('Registration response:', response.data);
      
      return { 
        success: true, 
        needsVerification: true, // ✅ ALWAYS TRUE for new users
        email: email,
        message: response.data.message || 'Registration successful'
      };
      
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      console.error('Registration error:', err);
      return { 
        success: false, 
        error: message 
      };
    }
  };

  
  // Logout method
  const logout = () => {
    authAPI.logout().catch(() => {});
    localStorage.removeItem('user');
    localStorage.removeItem('pendingVerificationEmail'); // ✅ Clean up
    setUser(null);
    window.location.href = '/';
  };

  // ✅ GOOGLE LOGIN METHOD
  const loginWithGoogle = () => {
    // Redirect to backend Google OAuth endpoint
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/google`;
    
    // Return success immediately since we're redirecting
    return { success: true };
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle, // ✅ ADD THIS
    register,
    logout,
    refreshUser, // ✅ Expose refresh function
    updateUser: setUser, // ✅ Allow manual user updates
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
