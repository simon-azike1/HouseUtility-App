import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../../services/api';

const STORAGE_KEY = 'util_feedback_banner';
const INTERACTION_THRESHOLD = 30000;
const MIN_INTERVAL = 5 * 24 * 60 * 60 * 1000;
const MAX_INTERVAL = 7 * 24 * 60 * 60 * 1000;

const options = [
  { id: 'tracking', label: 'Tracking payments' },
  { id: 'transparency', label: 'Lack of transparency' },
  { id: 'contributions', label: 'Managing contributions' },
  { id: 'organizing', label: 'Organizing records' },
  { id: 'conflicts', label: 'Avoiding conflicts' },
  { id: 'other', label: 'Other' },
];

const FeedbackBanner = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [additionalInput, setAdditionalInput] = useState('');
  const [interactionTime, setInteractionTime] = useState(0);

  const checkAndShowModal = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { lastShown } = JSON.parse(stored);
      const now = Date.now();
      const elapsed = now - lastShown;
      const randomInterval = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
      
      if (elapsed < randomInterval) {
        return false;
      }
    }
    return true;
  }, []);

  const dismissModal = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastShown: Date.now() }));
    setIsOpen(false);
  }, []);

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = async () => {
    try {
      await api.post('/feedback/survey', {
        options: selectedOptions,
        additional: additionalInput,
        page: window.location.pathname,
        userAgent: navigator.userAgent
      });
      console.log('Feedback submitted successfully');
    } catch (error) {
      console.log('Feedback submitted (offline or error):', { options: selectedOptions, additional: additionalInput });
    }
    dismissModal();
  };

  useEffect(() => {
    let timer;
    let active = false;

    const startTimer = () => {
      if (!active && !isOpen) {
        active = true;
        timer = setInterval(() => {
          setInteractionTime(prev => {
            if (prev >= INTERACTION_THRESHOLD) {
              clearInterval(timer);
              active = false;
              if (checkAndShowModal()) {
                setIsOpen(true);
              }
              return prev;
            }
            return prev + 1000;
          });
        }, 1000);
      }
    };

    const resetTimer = () => {
      if (timer) clearInterval(timer);
      active = false;
      setInteractionTime(0);
      startTimer();
    };

    const events = ['click', 'scroll', 'keypress'];
    events.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));

    startTimer();

    return () => {
      if (timer) clearInterval(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isOpen, checkAndShowModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={dismissModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`w-full max-w-md p-6 rounded-xl shadow-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Help us improve your household experience
              </h2>
              <button
                onClick={dismissModal}
                className={`p-1 rounded-lg transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              What is the biggest challenge you face when managing shared household finances?
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionToggle(option.id)}
                  className={`p-3 text-sm text-left rounded-lg border transition-all duration-200 ${
                    selectedOptions.includes(option.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tell us more about your challenge..
              </label>
              <textarea
                value={additionalInput}
                onChange={(e) => setAdditionalInput(e.target.value)}
                placeholder="Optional details..."
                className={`w-full p-3 text-sm rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={dismissModal}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-green-500 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Submit Feedback
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackBanner;