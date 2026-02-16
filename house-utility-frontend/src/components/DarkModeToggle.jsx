import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = ({ className = '', variant = 'fixed' }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const isFixed = variant === 'fixed';

  return (
    <button
      onClick={toggleDarkMode}
      className={`${isFixed ? 'fixed bottom-6 right-6 p-4' : 'relative p-1.5'} z-50 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-gray-700 dark:to-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${className}`}
      aria-label="Toggle dark mode"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className={isFixed ? 'w-6 h-6' : 'w-4 h-4'} />
      ) : (
        <Moon className={isFixed ? 'w-6 h-6' : 'w-4 h-4'} />
      )}
    </button>
  );
};

export default DarkModeToggle;
