// Color Theme for House Utility Management App
// Use these colors consistently throughout the application

export const COLORS = {
  // Primary Colors (Blue-Indigo)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary Colors (Indigo)
  secondary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Feature Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Gradients (use with Tailwind)
  gradients: {
    primary: 'from-indigo-600 to-blue-600',
    secondary: 'from-blue-500 to-indigo-600',
    success: 'from-green-500 to-teal-600',
    warning: 'from-orange-500 to-red-600',
    purple: 'from-purple-500 to-pink-600',
  },
};

// Component Styles
export const STYLES = {
  // Buttons
  button: {
    primary: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  },

  // Cards
  card: 'bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow',
  
  // Inputs
  input: 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all',
  
  // Backgrounds
  pageBackground: 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100',
  authBackground: 'min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50',
};

export default { COLORS, STYLES };