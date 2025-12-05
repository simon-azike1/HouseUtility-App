import { motion } from 'framer-motion';
import { Code, Smartphone, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DarkModeToggle from '../components/DarkModeToggle';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Code,
      title: t('services.webDevTitle'),
      description: t('services.webDevDescription'),
      features: [
        t('services.webDevFeature1'),
        t('services.webDevFeature2'),
        t('services.webDevFeature3'),
        t('services.webDevFeature4'),
        t('services.webDevFeature5'),
        t('services.webDevFeature6')
      ],
      color: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Smartphone,
      title: t('services.mobileAppsTitle'),
      description: t('services.mobileAppsDescription'),
      features: [
        t('services.mobileAppsFeature1'),
        t('services.mobileAppsFeature2'),
        t('services.mobileAppsFeature3'),
        t('services.mobileAppsFeature4'),
        t('services.mobileAppsFeature5'),
        t('services.mobileAppsFeature6')
      ],
      color: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: TrendingUp,
      title: t('services.consultingTitle'),
      description: t('services.consultingDescription'),
      features: [
        t('services.consultingFeature1'),
        t('services.consultingFeature2'),
        t('services.consultingFeature3'),
        t('services.consultingFeature4'),
        t('services.consultingFeature5'),
        t('services.consultingFeature6')
      ],
      color: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
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
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2426"
            alt="Services Hero"
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
              {t('services.heroTitle')} <span className="bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-transparent">{t('services.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
              {t('services.heroSubtitle')}
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

      {/* Services Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                >
                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${service.iconBg} rounded-2xl`}>
                      <Icon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {service.description}
                    </p>

                    <div className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/contact"
                      className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${service.color} text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                    >
                      {t('services.getStarted')}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* Image */}
                  <div className="flex-1">
                    <div className={`relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r ${service.color} p-1`}>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                        <Icon className={`w-full h-64 ${service.iconColor} opacity-20`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              {t('services.ctaTitle')}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t('services.ctaSubtitle')}
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {t('services.contactUsToday')}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
