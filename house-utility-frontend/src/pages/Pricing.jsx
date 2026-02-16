import { Check, X, Users, HelpCircle, Zap, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';

export default function Pricing() {
  const { t } = useTranslation();

  const plans = [
    {
      name: t('pricing.freePlan'),
      price: '$0',
      period: t('pricing.forever'),
      description: t('pricing.freeDescription'),
      features: [
        { text: t('pricing.feature1'), included: true },
        { text: t('pricing.feature2'), included: true },
        { text: t('pricing.feature3'), included: true },
        { text: t('pricing.feature4'), included: true },
        { text: t('pricing.feature5'), included: true },
        { text: t('pricing.feature6'), included: false },
        { text: t('pricing.feature7'), included: false },
        { text: t('pricing.feature8'), included: false }
      ],
      cta: t('pricing.getStartedFree'),
      highlighted: false,
      icon: Users,
      color: 'from-blue-600 to-green-500'
    },
    {
      name: t('pricing.proPlan'),
      price: '$9.99',
      period: t('pricing.perMonth'),
      description: t('pricing.proDescription'),
      features: [
        { text: t('pricing.feature1'), included: true },
        { text: t('pricing.feature2'), included: true },
        { text: t('pricing.feature3'), included: true },
        { text: t('pricing.feature4'), included: true },
        { text: t('pricing.feature5'), included: true },
        { text: t('pricing.feature6'), included: true },
        { text: t('pricing.feature7'), included: true },
        { text: t('pricing.feature8'), included: false }
      ],
      cta: t('pricing.comingSoon'),
      highlighted: true,
      icon: Zap,
      color: 'from-purple-600 to-pink-500'
    },
    {
      name: t('pricing.enterprisePlan'),
      price: '$24.99',
      period: t('pricing.perMonth'),
      description: t('pricing.enterpriseDescription'),
      features: [
        { text: t('pricing.feature1'), included: true },
        { text: t('pricing.feature2'), included: true },
        { text: t('pricing.feature3'), included: true },
        { text: t('pricing.feature4'), included: true },
        { text: t('pricing.feature5'), included: true },
        { text: t('pricing.feature6'), included: true },
        { text: t('pricing.feature7'), included: true },
        { text: t('pricing.feature8'), included: true }
      ],
      cta: t('pricing.comingSoon'),
      highlighted: false,
      icon: Building2,
      color: 'from-orange-600 to-red-500'
    }
  ];

  const faqs = [
    {
      question: t('pricing.faq1Question'),
      answer: t('pricing.faq1Answer')
    },
    {
      question: t('pricing.faq2Question'),
      answer: t('pricing.faq2Answer')
    },
    {
      question: t('pricing.faq3Question'),
      answer: t('pricing.faq3Answer')
    },
    {
      question: t('pricing.faq4Question'),
      answer: t('pricing.faq4Answer')
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative text-white pt-32 pb-40 overflow-hidden">
        {/* Background Image + Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2670"
            alt="Pricing Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-900/90"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-semibold">
                {t('pricing.heroTitleHighlight')} Plan Available
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
              {t('pricing.heroTitle')} <br />
              <span className="bg-gradient-to-r from-blue-300 via-green-300 to-blue-400 bg-clip-text text-transparent">
                {t('pricing.heroTitleHighlight')}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              {t('pricing.heroSubtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Check className="w-5 h-5 text-green-300" />
                <span className="text-white font-medium">{t('pricing.noCreditCard')}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Check className="w-5 h-5 text-green-300" />
                <span className="text-white font-medium">{t('pricing.startInMinutes')}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Check className="w-5 h-5 text-green-300" />
                <span className="text-white font-medium">{t('pricing.freePlanAvailable')}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hidden">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden dark:block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#111827"/>
          </svg>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${
                    plan.highlighted
                      ? 'border-2 border-purple-500 dark:border-purple-600 shadow-2xl'
                      : 'border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {/* Highlighted Badge */}
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-bl-2xl">
                      {t('pricing.popularBadge')}
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${plan.color} rounded-2xl mb-6`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 h-12">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                          {plan.price}
                        </span>
                        {plan.price !== 'Custom' && (
                          <span className="text-gray-500 text-lg">/{plan.period}</span>
                        )}
                      </div>
                      {plan.price === 'Custom' && (
                        <span className="text-gray-500 text-sm">{plan.period}</span>
                      )}
                    </div>

                    {/* CTA Button */}
                    {plan.name === t('pricing.freePlan') ? (
                      <Link
                        to="/register"
                        className={`block w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-300 mb-8 bg-gradient-to-r ${plan.color} text-white hover:opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105`}
                      >
                        {plan.cta}
                      </Link>
                    ) : (
                      <button
                        disabled
                        className={`w-full py-4 px-6 rounded-xl font-bold text-center mb-8 bg-gradient-to-r ${plan.color} text-white opacity-60 cursor-not-allowed`}
                      >
                        {plan.cta}
                      </button>
                    )}

                    {/* Features */}
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('pricing.features')}</p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            {feature.included ? (
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('pricing.faqTitle')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t('pricing.faqSubtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-start gap-3 mb-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{faq.question}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed ml-8">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('pricing.stillHaveQuestions')}</p>
            <Link
              to="/contact"
              className="inline-block bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('pricing.contactUs')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {t('pricing.ctaTitle')}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t('pricing.ctaSubtitle')}
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {t('pricing.getStartedFree')}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
