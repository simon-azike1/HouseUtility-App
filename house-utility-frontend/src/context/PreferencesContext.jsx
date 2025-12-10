import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import i18n from '../i18n';

const PreferencesContext = createContext();

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'GMT+1',
    currency: 'MAD',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light'
  });

  const [loading, setLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('/auth/settings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Loaded preferences from backend:', response.data.preferences);

        if (response.data.preferences) {
          setPreferences(response.data.preferences);
          // Sync language with i18n
          if (response.data.preferences.language) {
            i18n.changeLanguage(response.data.preferences.language);
          }
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = (newPreferences) => {
    console.log('Updating preferences to:', newPreferences);
    setPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));

    // Sync language with i18n when language changes
    if (newPreferences.language) {
      i18n.changeLanguage(newPreferences.language);
      console.log('Changed language to:', newPreferences.language);
    }
  };

  // Format currency with user's preference
  const formatCurrency = (amount) => {
    const currencySymbols = {
      MAD: 'د.م.',
      USD: '$',
      EUR: '€',
      GBP: '£'
    };

    const symbol = currencySymbols[preferences.currency] || preferences.currency;
    const formattedAmount = Number(amount).toFixed(2);

    // Language-specific currency formatting
    // Arabic and some other languages put currency symbol after the amount
    const symbolAfterLanguages = ['ar'];
    const currentLanguage = preferences.language || i18n.language || 'en';

    let formatted;
    if (symbolAfterLanguages.includes(currentLanguage)) {
      formatted = `${formattedAmount}.${symbol}`;
    } else {
      formatted = `${symbol}${formattedAmount}`;
    }

    // Debug logging (remove in production)
    if (Math.random() < 0.01) { // Log 1% of calls to avoid spam
      console.log('formatCurrency:', {
        amount,
        currency: preferences.currency,
        language: currentLanguage,
        symbol,
        formatted
      });
    }

    return formatted;
  };

  // Format date with user's preference
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    switch (preferences.dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD/MM/YYYY':
      default:
        return `${day}/${month}/${year}`;
    }
  };

  const value = {
    preferences,
    updatePreferences,
    formatCurrency,
    formatDate,
    loading
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;
