import { motion } from 'framer-motion';
import { FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfService = () => {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              Terms of Service
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
                Please read these Terms of Service carefully before using UTIL. By accessing or using our service, you agree to be bound by these terms.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              By creating an account or using UTIL, you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              UTIL provides a household financial management platform that allows users to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Track household expenses and contributions</li>
              <li>Manage bills and recurring payments</li>
              <li>Generate financial reports and analytics</li>
              <li>Collaborate with household members</li>
              <li>Export and share financial data</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">3. User Accounts</h2>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Account Registration</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              To use UTIL, you must create an account by providing accurate and complete information. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Providing accurate and up-to-date information</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Account Eligibility</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              You must be at least 18 years old to create an account. By creating an account, you represent that you meet this age requirement.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">4. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              When using UTIL, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Use the service only for lawful purposes</li>
              <li>Not violate any local, state, national, or international law</li>
              <li>Not impersonate any person or entity</li>
              <li>Not interfere with or disrupt the service</li>
              <li>Not attempt to gain unauthorized access to the service</li>
              <li>Respect the privacy and rights of other users</li>
              <li>Not upload malicious code or harmful content</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">5. Household Management</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              As a household administrator, you are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Managing household member invitations and permissions</li>
              <li>Ensuring that household members consent to sharing financial information</li>
              <li>Maintaining accurate household financial records</li>
              <li>Resolving disputes among household members</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">6. Subscription and Payments</h2>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pricing</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              UTIL offers both free and paid subscription plans. Pricing is available on our <Link to="/pricing" className="text-blue-600 hover:underline">Pricing page</Link>. We reserve the right to change our pricing at any time with reasonable notice.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Billing</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Paid subscriptions are billed on a recurring basis. By subscribing, you authorize us to charge your payment method at regular intervals until you cancel your subscription.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cancellation</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. No refunds will be provided for partial billing periods.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              All content, features, and functionality of UTIL, including but not limited to text, graphics, logos, and software, are owned by UTIL and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our written permission.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">8. Data Ownership</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              You retain ownership of all data you enter into UTIL. We claim no intellectual property rights over the content you provide. You grant us a license to use your data solely to provide and improve our services.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              UTIL is provided "as is" without warranties of any kind. We are not liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or goodwill</li>
              <li>Service interruptions or errors</li>
              <li>User errors or inaccurate data entry</li>
              <li>Third-party actions or content</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">10. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason. Upon termination, your right to use UTIL will immediately cease.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may modify these Terms of Service at any time. We will notify you of significant changes via email or through the service. Continued use of UTIL after changes constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              These terms are governed by the laws of Morocco. Any disputes will be resolved in the courts of Rabat, Morocco.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about these Terms of Service, please contact us:
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

export default TermsOfService;
