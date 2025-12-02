import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DarkModeToggle from '../components/DarkModeToggle';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Simulate API call
    setTimeout(() => {
      setStatus({
        type: 'success',
        message: 'Thank you for reaching out! We\'ll get back to you within 24 hours.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'azikeshinye@gmail.com',
      link: 'mailto:azikeshinye@gmail.com',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+212 751-780853 / +234 813-353-6151',
      link: 'tel:+212751780853',
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'Bab Cheffa, Sale, Rabat, Morocco',
      link: null,
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
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
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2672"
            alt="Contact Hero"
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
              Get in <span className="bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
              We'd love to hear from you. Let's start a conversation.
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

      {/* Contact Information Cards */}
      <section className="py-12 bg-gray-50 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${info.iconBg} rounded-xl mb-4`}>
                    <Icon className={`w-7 h-7 ${info.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className={`text-gray-600 hover:bg-gradient-to-r ${info.color} hover:bg-clip-text hover:text-transparent transition-all`}
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.content}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Form - Takes 3 columns */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send a Message</h3>
                <p className="text-gray-600 mb-8">We'll respond as soon as possible</p>

                {status.message && (
                  <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                    status.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    {status.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm font-medium">{status.message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="+212 xxx-xxxxxx"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="What's this about?"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"
                      placeholder="Tell us about your project or question..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-green-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar Info - Takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Why Choose Us */}
              <div className="bg-gradient-to-br from-blue-600 to-green-500 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Work With Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>24-hour response time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Expert technical support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Transparent communication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Quality-focused solutions</span>
                  </li>
                </ul>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Mon - Fri</span>
                    <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold text-gray-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-semibold text-red-600">Closed</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  * Times are in GMT+1 (Morocco Time)
                </p>
              </div>

              {/* Direct Contact */}
              <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Need Immediate Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  For urgent inquiries, reach out directly:
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+212751780853"
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +212 751-780853
                  </a>
                  <a
                    href="https://my-new-portfolio-8zg5.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Visit Website
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
