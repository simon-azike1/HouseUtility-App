import { motion } from 'framer-motion';
import { Shield, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              Privacy Policy
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
                At UTIL, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our household financial management platform.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We collect information that you provide directly to us when you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Create an account and register for our services</li>
              <li>Add household members and manage your household</li>
              <li>Track expenses, bills, and contributions</li>
              <li>Contact our support team</li>
              <li>Subscribe to our newsletter</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              This includes your name, email address, phone number, household information, and financial transaction data you enter into our platform.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>With your household members:</strong> Information you add to your household is shared with other members</li>
              <li><strong>Service providers:</strong> We may share information with third-party service providers who perform services on our behalf</li>
              <li><strong>Legal requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities</li>
              <li><strong>Business transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure data storage infrastructure</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">5. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct or update your personal information</li>
              <li>Delete your account and personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your personal information</li>
              <li>Export your data in a portable format</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information within 30 days.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have any questions about this Privacy Policy, please contact us:
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

export default PrivacyPolicy;
