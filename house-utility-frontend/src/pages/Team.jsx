import { motion } from 'framer-motion';
import { Linkedin, Facebook, Mail, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DarkModeToggle from '../components/DarkModeToggle';
import { useTranslation } from 'react-i18next';

const Team = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: 'Simon Azike',
      role: t('team.founderRole'),
      image: '/team/simon-azike.PNG',
      bio: t('team.founderBio'),
      linkedin: 'https://linkedin.com/in/simonzik',
      facebook: 'https://web.facebook.com/simon.azike/',
      website: 'https://my-new-portfolio-8zg5.vercel.app/',
      email: 'azikeshinye@gmail.com'
    },
    {
      name: 'Keyinde Oluwafisayo',
      role: t('team.marketerRole'),
      image: '/team/keyinde-oluwafisayo.jpg',
      bio: t('team.marketerBio'),
      linkedin: 'https://www.linkedin.com/in/marcelina-adebisi-0393b037a/',
      facebook: 'https://web.facebook.com/marcelinaadebisi',
      website: 'https://mercel-life.vercel.app/',
      email: 'keyinde@util.com'
    },
    {
      name: 'Quadri Kobiowu',
      role: t('team.developerRole'),
      image: '/team/quadri-kobiowu.png',
      bio: t('team.developerBio'),
      linkedin: 'https://www.linkedin.com/in/quadri-kobiowu-955313233/',
      facebook: 'https://web.facebook.com/abudulquadri.kobiowu',
      website: 'https://quadrikobiowu.vercel.app/',
      email: 'quadri@util.com'
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
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2670"
            alt="Team Hero"
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
              {t('team.heroTitle')} <span className="bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-transparent">{t('team.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
              {t('team.heroSubtitle')}
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

      {/* Team Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Profile Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Social Links Overlay */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    {member.linkedin && member.linkedin !== '#' && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                    {member.facebook && (
                      <a
                        href={member.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        aria-label="Website"
                      >
                        <Globe className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('team.valuesTitle')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('team.valuesSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: t('team.innovationTitle'),
                description: t('team.innovationDesc'),
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: t('team.transparencyTitle'),
                description: t('team.transparencyDesc'),
                color: 'from-green-500 to-green-600'
              },
              {
                title: t('team.collaborationTitle'),
                description: t('team.collaborationDesc'),
                color: 'from-purple-500 to-purple-600'
              },
              {
                title: t('team.excellenceTitle'),
                description: t('team.excellenceDesc'),
                color: 'from-pink-500 to-pink-600'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center text-white text-3xl font-bold`}>
                  {value.title.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {t('team.ctaTitle')}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t('team.ctaSubtitle')}
            </p>
            <a
              href="mailto:careers@util.com"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {t('team.viewPositions')}
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
