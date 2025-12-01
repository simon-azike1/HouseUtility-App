import { motion } from 'framer-motion';
import { Cookie, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative text-white pt-24 pb-20 overflow-hidden bg-gradient-to-r from-blue-900 to-green-900">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Last updated: December 1, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-xl">
              <p className="text-gray-700 leading-relaxed">
                This Cookie Policy explains how UTIL uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work more efficiently and to provide reporting information.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">2. Why We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use cookies for several reasons:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
              <li><strong>Authentication:</strong> To keep you logged in and secure</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences</li>
              <li><strong>Analytics:</strong> To understand how you use our service</li>
              <li><strong>Performance:</strong> To optimize and improve our service</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">3. Types of Cookies We Use</h2>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Strictly Necessary Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              These cookies are essential for the website to function and cannot be switched off. They are usually set in response to actions you take, such as logging in or filling in forms.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Performance Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the performance of our service.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Functional Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use on our pages.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Analytics Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use analytics services to help us analyze how users use the service. These cookies collect information about how you use the website, which pages you visit, and any errors you may encounter.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              In addition to our own cookies, we may use various third-party cookies to report usage statistics and deliver relevant content. These third parties include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Analytics providers (e.g., Google Analytics)</li>
              <li>Payment processors</li>
              <li>Email service providers</li>
              <li>Social media platforms</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">5. How to Control Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by:
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Browser Settings</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Most web browsers allow you to control cookies through their settings. You can set your browser to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Block all cookies</li>
              <li>Accept only first-party cookies</li>
              <li>Delete cookies when you close your browser</li>
              <li>Receive a notification when a cookie is set</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6 rounded-r-xl">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-yellow-800">Note:</strong> If you block or delete essential cookies, some features of UTIL may not function properly, and you may not be able to access certain parts of the service.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookie Consent Management</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              When you first visit UTIL, you'll see a cookie consent banner. You can manage your cookie preferences at any time through your account settings.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">6. Cookie Duration</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Cookies can be either:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>Session cookies:</strong> Temporary cookies that expire when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Remain on your device until they expire or you delete them</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">7. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the new policy on this page.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">8. More Information</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              For more information about how we process your personal data, please see our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-blue-600" />
                <a href="mailto:azikeshinye@gmail.com" className="text-blue-600 font-semibold hover:underline">
                  azikeshinye@gmail.com
                </a>
              </div>
              <p className="text-gray-600 text-sm">
                Or visit our <Link to="/contact" className="text-blue-600 hover:underline">Contact Page</Link> for more ways to reach us.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
