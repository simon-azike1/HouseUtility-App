import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '/services/api';

const overlayVariants = {
  open: { opacity: 1, transition: { duration: 0.2 } },
  closed: { opacity: 0, transition: { duration: 0.2 } }
};

const panelVariants = {
  open: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  closed: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }
};

const FeedbackModal = ({ isOpen, onClose, force = false, onSubmitted }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [country, setCountry] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setHoverRating(0);
      setMessage('');
      setCountry('');
      setError('');
      setSuccess(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rating || !message.trim() || !country.trim()) {
      setError(t('feedback.validation'));
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/feedback', {
        rating,
        message: message.trim(),
        country: country.trim(),
        page: window.location.pathname,
        userAgent: navigator.userAgent
      });
      setSuccess(true);
      if (onSubmitted) onSubmitted();
      setTimeout(() => onClose(), 700);
    } catch (err) {
      setError(err?.response?.data?.message || t('feedback.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={force ? undefined : onClose}
          />

          <motion.div
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('feedback.title')}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('feedback.subtitle')}
                </p>
              </div>
              {!force && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={t('feedback.close')}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('feedback.rating')}
                </label>
                <div className="mt-2 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const active = (hoverRating || rating) >= value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`p-2 rounded-lg transition-colors ${
                          active ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-700/50'
                        }`}
                        aria-label={t('feedback.rate', { value })}
                      >
                        <Star className={`w-6 h-6 ${active ? 'text-yellow-500' : 'text-gray-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('feedback.message')}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder={t('feedback.placeholder')}
                  className="mt-2 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('feedback.country')}
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder={t('feedback.countryPlaceholder')}
                  className="mt-2 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              )}
              {success && (
                <div className="text-sm text-green-600 dark:text-green-400">
                  {t('feedback.success')}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-1">
                {!force && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t('feedback.cancel')}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? t('feedback.sending') : t('feedback.submit')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
