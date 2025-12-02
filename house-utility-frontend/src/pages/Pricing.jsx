import { Check, X, Users, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import DarkModeToggle from '../components/DarkModeToggle';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for individuals getting started',
    features: [
      { text: 'Up to 5 household members', included: true },
      { text: 'Basic expense tracking', included: true },
      { text: 'Monthly reports', included: true },
      { text: 'Mobile app access', included: true },
      { text: 'Email support', included: true },
      { text: 'Advanced analytics', included: false },
      { text: 'Priority support', included: false },
      { text: 'Custom categories', included: false }
    ],
    cta: 'Get Started Free',
    highlighted: true,
    icon: Users,
    color: 'from-blue-600 to-green-500'
  }
  // Pro and Enterprise plans coming soon
];

const faqs = [
  {
    question: 'Is UTIL really free?',
    answer: 'Yes! Our free plan is 100% free forever with no hidden costs. You get all essential features to manage your household finances.'
  },
  {
    question: 'Do I need a credit card to sign up?',
    answer: 'No credit card required! Simply create an account with your email and start managing your household right away.'
  },
  {
    question: 'How many household members can I add?',
    answer: 'The free plan allows up to 5 household members, which is perfect for most families and shared living situations.'
  },
  {
    question: 'Will there be paid plans in the future?',
    answer: 'We are working on Pro and Enterprise plans with advanced features. However, the free plan will always remain available with core functionality.'
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DarkModeToggle />

      {/* Hero Section */}
      <section className="relative text-white pt-24 pb-32 overflow-hidden">
        {/* Background Image + Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2670"
            alt="Pricing Hero"
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
              Start Managing Your Household <span className="bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-transparent">For Free</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
              Get started with UTIL's free plan. Track expenses, manage bills, and achieve financial transparency.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-green-300">
              <Check className="w-5 h-5" />
              <span>100% Free forever</span>
              <span className="mx-2">•</span>
              <Check className="w-5 h-5" />
              <span>No credit card required</span>
              <span className="mx-2">•</span>
              <Check className="w-5 h-5" />
              <span>Get started in minutes</span>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gray-50 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 border-2 border-blue-500 shadow-2xl"
                >
                  {/* Highlighted Badge */}
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-green-500 text-white text-xs font-bold px-4 py-1 rounded-bl-2xl">
                      FREE FOREVER
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${plan.color} rounded-2xl mb-6`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6 h-12">{plan.description}</p>

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
                    <Link
                      to="/register"
                      className="block w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-300 mb-8 bg-gradient-to-r from-blue-600 to-green-500 text-white hover:from-blue-700 hover:to-green-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {plan.cta}
                    </Link>

                    {/* Features */}
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Features</p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            {feature.included ? (
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
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
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our pricing</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-start gap-3 mb-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed ml-8">{faq.answer}</p>
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
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-block bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us
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
              Ready to Take Control of Your Household Finances?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join UTIL today and start managing your household finances the smart way. 100% free, forever.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
