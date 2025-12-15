import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  Phone,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  DollarSign,
  Home,
  CreditCard,
  Settings,
  ShieldCheck,
  PlayCircle,
  Video
} from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'Getting Started',
      icon: Book,
      question: 'How do I create a household?',
      answer: 'When you register and verify your email, a household is automatically created for you. You become the admin and receive a unique 8-character invite code that you can share with family members.'
    },
    {
      id: 2,
      category: 'Getting Started',
      icon: Book,
      question: 'How do I join an existing household?',
      answer: 'You can join a household in two ways: 1) Use the invite code during registration, or 2) Go to your Profile page, click on the Household tab, and enter the invite code provided by the household admin.'
    },
    {
      id: 3,
      category: 'Household Management',
      icon: Home,
      question: 'What is the difference between admin and member roles?',
      answer: 'Admins have full control: they can manage members, remove people from the household, and share the invite code. Members can view all household data and manage expenses, bills, and contributions but cannot manage other members.'
    },
    {
      id: 4,
      category: 'Household Management',
      icon: Users,
      question: 'How do I invite family members to my household?',
      answer: 'As an admin, go to your Profile page → Household tab. You\'ll find your invite code there. You can either copy the code or copy the full invite link to share with family members via email, text, or messaging apps, it is more advisable to copy the full invite link for better convenience and accuracy.'
    },
    {
      id: 5,
      category: 'Expenses',
      icon: DollarSign,
      question: 'How do I add an expense?',
      answer: 'Navigate to the Expenses page from the sidebar menu. Click the "Add Expense" button, fill in the details (description, amount, category, date), and click Save. The expense will be recorded and visible to all household members.'
    },
    {
      id: 6,
      category: 'Expenses',
      icon: DollarSign,
      question: 'Can I edit or delete expenses?',
      answer: 'Yes! On the Expenses page, you can edit or delete any expense. Click the edit icon to modify details or the delete icon to remove an expense. All changes are immediately reflected for all household members.'
    },
    {
      id: 7,
      category: 'Bills',
      icon: CreditCard,
      question: 'What are bills and how do they work?',
      answer: 'Bills are recurring payments like electricity, water, internet, etc. You can add bills with details like amount, due date, and category. The system will help you track which bills are paid and which are upcoming.'
    },
    {
      id: 8,
      category: 'Bills',
      icon: CreditCard,
      question: 'How do I mark a bill as paid?',
      answer: 'On the Bills page, find the bill you want to mark as paid. Click on the bill card and toggle the "Paid" status. You can also add payment date and notes for your records.'
    },
    {
      id: 9,
      category: 'Contributions',
      icon: Users,
      question: 'What are contributions?',
      answer: 'Contributions are payments made by household members towards shared expenses. This helps track who has contributed what amount and ensures fair distribution of household costs.'
    },
    {
      id: 10,
      category: 'Contributions',
      icon: Users,
      question: 'How do I record a contribution?',
      answer: 'Go to the Contributions page, click "Add Contribution", select the member who contributed, enter the amount, description, and date. This helps maintain a transparent record of all household contributions.'
    },
    {
      id: 11,
      category: 'Account & Profile',
      icon: Settings,
      question: 'How do I update my profile information?',
      answer: 'Go to your Profile page (click your avatar in the top right), navigate to the "Profile Information" tab, update your name or email, and click "Save Changes".'
    },
    {
      id: 12,
      category: 'Account & Profile',
      icon: Settings,
      question: 'How do I upload a profile picture?',
      answer: 'On your Profile page, click the camera icon on your avatar. Select an image from your device (max 5MB). The image will be uploaded and displayed immediately across the application.'
    },
    {
      id: 13,
      category: 'Account & Profile',
      icon: ShieldCheck,
      question: 'How do I change my password?',
      answer: 'Go to Profile → Security tab, enter your current password, then your new password twice to confirm. Click "Change Password". You\'ll be logged out and need to log in again with your new password.'
    },
    {
      id: 14,
      category: 'Reports & Analytics',
      icon: FileText,
      question: 'Can I view reports of my household expenses?',
      answer: 'Yes! Navigate to the Reports page to view detailed analytics, charts, and summaries of your household expenses, bills, and contributions. You can filter by date range and category.'
    },
    {
      id: 15,
      category: 'Privacy & Security',
      icon: ShieldCheck,
      question: 'Is my data secure?',
      answer: 'Yes! We use industry-standard encryption for all data transmission and storage. Your password is hashed, and we never store it in plain text. All API requests are authenticated with secure JWT tokens.'
    }
  ];

  const quickLinks = [
    {
      title: 'User Guide',
      description: 'Complete guide to using the platform',
      icon: Book,
      color: 'from-blue-500 to-blue-600',
      action: 'View Guide'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: MessageCircle,
      color: 'from-purple-500 to-purple-600',
      action: 'Watch Videos'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: Mail,
      color: 'from-green-500 to-green-600',
      action: 'Contact Us'
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      detail: 'azikeshinye@gmail.com',
      description: 'We typically respond within 24 hours',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      detail: '+212 751-780853',
      description: 'Mon-Fri, 9AM-6PM GMT+1',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      detail: 'Coming Soon',
      description: 'Instant support from our team',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg shadow-sm"
            />
          </div>
        </motion.div>

        {/* Onboarding Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-8 border border-indigo-100 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex-shrink-0">
                <Video className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Onboarding Tutorial Video</h2>
                <p className="text-indigo-100 text-base leading-relaxed">
                  Watch our comprehensive tutorial to learn how to use UTIL effectively. Perfect for new users or anyone who needs a refresher on the platform's features.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:scale-105 whitespace-nowrap"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Tutorial
            </button>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{link.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{link.description}</p>
                <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 flex items-center group-hover:translate-x-1 transition-transform">
                  {link.action}
                  <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                </button>
              </div>
            );
          })}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSearchQuery('')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                searchQuery === ''
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSearchQuery(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  searchQuery === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                        {faq.category}
                      </span>
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-4 pt-2 bg-gray-50 border-t border-gray-200"
                    >
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No FAQs found matching your search.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
            <p className="text-gray-600">Our support team is here to assist you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${method.color} rounded-xl mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-indigo-600 font-semibold mb-2">{method.detail}</p>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Help;
