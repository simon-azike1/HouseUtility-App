import { motion } from 'framer-motion';
import { Target, Users, Award, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DarkModeToggle from '../components/DarkModeToggle';

const OurStory = () => {
  const values = [
    {
      icon: Target,
      title: 'Transparency',
      description: 'Born from the need for clear, honest financial tracking. Every transaction visible, every member accountable.',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Award,
      title: 'Accountability',
      description: 'Making sure everyone knows who paid for what, when, and why. No more confusion or misunderstandings.',
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Users,
      title: 'Simplicity',
      description: 'Complex problems need simple solutions. We make household finance management effortless and intuitive.',
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'The Spark',
      description: 'A university student becomes apartment manager, faces the chaos of tracking shared expenses.'
    },
    {
      year: '2021',
      title: 'First Solution',
      description: 'Simple spreadsheet evolves into a working prototype. First 100 users join from campus.'
    },
    {
      year: '2022',
      title: 'Going Live',
      description: 'UTIL officially launches. Transparency and accountability become our core principles.'
    },
    {
      year: '2023',
      title: 'Rapid Growth',
      description: 'Reached 10,000 households. Expanded to help families, roommates, and couples worldwide.'
    },
    {
      year: '2024',
      title: 'Today',
      description: 'Serving 50K+ users across 100+ countries, staying true to our founding vision.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
              Our <span className="bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-transparent">Story</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
              From a frustrated student to a solution that serves thousands
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
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* The Problem */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-red-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">😤</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">The Frustration</h2>
                  <p className="text-lg text-red-700 font-semibold">Where it all began</p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  It was a typical Tuesday evening at university when everything changed. Our founder, then a student,
                  had just been put in charge of managing the apartment he shared with five other students. What seemed
                  like a simple responsibility quickly turned into a nightmare.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong className="text-gray-900">"Who paid for the electricity?"</strong><br />
                  <strong className="text-gray-900">"Did everyone contribute to groceries this month?"</strong><br />
                  <strong className="text-gray-900">"How much do I owe for the internet bill?"</strong>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These questions became a daily struggle. Trying to recall who paid for what, organizing scattered
                  receipts, chasing roommates for their share, and providing clear reports at the end of each month
                  was overwhelming. Spreadsheets became messy, WhatsApp messages got lost, and trust started to waver.
                </p>
              </div>
            </div>

            {/* The Solution */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 md:p-12 border border-blue-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">The Revelation</h2>
                  <p className="text-lg text-blue-700 font-semibold">A simple idea that changed everything</p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Late one night, after spending hours trying to reconcile the monthly expenses, our founder had an epiphany:
                  <span className="font-bold text-gray-900"> "There has to be a better way."</span>
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  What if there was a tool that could:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li>Track every expense automatically</li>
                  <li>Show exactly who paid for what</li>
                  <li>Calculate fair splits instantly</li>
                  <li>Generate clear, transparent reports</li>
                  <li>Keep everyone accountable</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  That night, UTIL was born—not as a business idea, but as a desperate need for <strong className="text-blue-600">transparency</strong> and
                  <strong className="text-green-600"> accountability</strong> in shared living spaces.
                </p>
              </div>
            </div>

            {/* The Impact */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">The Transformation</h2>
                  <p className="text-lg text-green-700 font-semibold">From chaos to harmony</p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  What started as a simple solution for one apartment quickly spread across campus. Roommates who used
                  to argue about money now had complete visibility into their shared finances. The tension disappeared.
                  Trust was restored.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Students started telling their families about it. Families told other families. Soon, UTIL wasn't
                  just helping students—it was helping households of all kinds: couples managing joint expenses,
                  families tracking budgets, friends splitting vacation costs.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Today, UTIL serves over 50,000 users across 100+ countries. But we've never forgotten our roots:
                  a frustrated student who just wanted a fair, transparent way to manage shared expenses. That's why
                  <strong className="text-gray-900"> transparency and accountability</strong> remain at the core of everything we build.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do, inspired by our founder's experience
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
                  className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${value.iconBg} rounded-2xl mb-6`}>
                    <Icon className={`w-8 h-8 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline - Simple Cards Layout */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">From a university apartment to households worldwide</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
                  {milestone.year}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{milestone.description}</p>
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
              Start Your Journey with UTIL
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Experience the transparency and accountability that changed everything
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurStory;
