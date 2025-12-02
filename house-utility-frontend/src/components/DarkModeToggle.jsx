import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-gray-700 dark:to-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${className}`}
      aria-label="Toggle dark mode"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="w-6 h-6" />
      ) : (
        <Moon className="w-6 h-6" />
      )}
    </button>
  );
};

export default DarkModeToggle;
