import { motion } from 'framer-motion';
import { Target, Users, Award, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DarkModeToggle from '../components/DarkModeToggle';
import { useTranslation } from 'react-i18next';

const OurStory = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Target,
      title: t('ourStory.transparencyTitle'),
      description: t('ourStory.transparencyDesc'),
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Award,
      title: t('ourStory.accountabilityTitle'),
      description: t('ourStory.accountabilityDesc'),
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Users,
      title: t('ourStory.simplicityTitle'),
      description: t('ourStory.simplicityDesc'),
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: t('ourStory.milestone2020Title'),
      description: t('ourStory.milestone2020Desc')
    },
    {
      year: '2021',
      title: t('ourStory.milestone2021Title'),
      description: t('ourStory.milestone2021Desc')
    },
    {
      year: '2022',
      title: t('ourStory.milestone2022Title'),
      description: t('ourStory.milestone2022Desc')
    },
    {
      year: '2023',
      title: t('ourStory.milestone2023Title'),
      description: t('ourStory.milestone2023Desc')
    },
    {
      year: '2024',
      title: t('ourStory.milestone2024Title'),
      description: t('ourStory.milestone2024Desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <DarkModeToggle />

      {/* Hero Section */}
      <section className="relative text-white pt-24 pb-32 overflow-hidden">
        {/* Background Image + Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2670"
            alt="Our Story Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-900/90"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              {t('ourStory.heroTitle')} <span className="bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-transparent">{t('ourStory.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
              {t('ourStory.heroSubtitle')}
            </p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Founder's Story */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* The Problem */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-3xl p-8 md:p-12 border border-red-100 dark:border-red-900">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">😤</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('ourStory.frustrationTitle')}</h2>
                  <p className="text-lg text-red-700 dark:text-red-400 font-semibold">{t('ourStory.frustrationSubtitle')}</p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {t('ourStory.frustrationPara1')}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  <strong className="text-gray-900 dark:text-white">{t('ourStory.frustrationQuestion1')}</strong><br />
                  <strong className="text-gray-900 dark:text-white">{t('ourStory.frustrationQuestion2')}</strong><br />
                  <strong className="text-gray-900 dark:text-white">{t('ourStory.frustrationQuestion3')}</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('ourStory.frustrationPara2')}
                </p>
              </div>
            </div>

            {/* The Solution */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-3xl p-8 md:p-12 border border-blue-100 dark:border-blue-900">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('ourStory.revelationTitle')}</h2>
                  <p className="text-lg text-blue-700 dark:text-blue-400 font-semibold">{t('ourStory.revelationSubtitle')}</p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {t('ourStory.revelationPara1')}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {t('ourStory.revelationPara2')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>{t('ourStory.revelationPoint1')}</li>
                  <li>{t('ourStory.revelationPoint2')}</li>
                  <li>{t('ourStory.revelationPoint3')}</li>
                  <li>{t('ourStory.revelationPoint4')}</li>
                  <li>{t('ourStory.revelationPoint5')}</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('ourStory.revelationPara3')}
                </p>
              </div>
            </div>

            {/* The Impact */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-3xl p-8 md:p-12 border border-green-100 dark:border-green-900">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('ourStory.transformationTitle')}</h2>
                  <p className="text-lg text-green-700 dark:text-green-400 font-semibold">{t('ourStory.transformationSubtitle')}</p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {t('ourStory.transformationPara1')}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {t('ourStory.transformationPara2')}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('ourStory.transformationPara3')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('ourStory.coreValuesTitle')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('ourStory.coreValuesSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${value.iconBg} dark:bg-opacity-20 rounded-2xl mb-6`}>
                    <Icon className={`w-8 h-8 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline - Simple Cards Layout */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('ourStory.journeyTitle')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t('ourStory.journeySubtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-2xl p-6 border border-blue-100 dark:border-blue-900 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
                  {milestone.year}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {t('ourStory.ctaTitle')}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t('ourStory.ctaSubtitle')}
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {t('ourStory.getStarted')}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurStory;
