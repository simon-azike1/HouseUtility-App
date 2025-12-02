import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Users,
  Home,
  Receipt,
  PieChart,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DarkModeToggle from "../components/DarkModeToggle";

const Landing = () => {
  const features = [
    { 
      icon: DollarSign, 
      title: "Contribution Tracking", 
      description: "Monitor payments with complete transparency and automated reconciliation.", 
      color: "from-blue-600 to-blue-700" 
    },
    { 
      icon: BarChart3, 
      title: "Expense Management", 
      description: "Categorize and analyze household expenses with intelligent insights.", 
      color: "from-green-600 to-green-700" 
    },
    { 
      icon: Calendar, 
      title: "Bill Scheduling", 
      description: "Automated reminders and recurring payment management.", 
      color: "from-purple-600 to-purple-700" 
    },
    { 
      icon: TrendingUp, 
      title: "Financial Analytics", 
      description: "Advanced reporting with predictive spending analysis.", 
      color: "from-orange-600 to-orange-700" 
    },
    { 
      icon: Shield, 
      title: "Enterprise Security", 
      description: "Bank-level encryption with multi-factor authentication.", 
      color: "from-red-600 to-red-700" 
    },
    { 
      icon: Users, 
      title: "Team Collaboration", 
      description: "Role-based access with real-time synchronization.", 
      color: "from-indigo-600 to-indigo-700" 
    },
  ];

  const steps = [
    { 
      icon: Home, 
      title: "Setup Your Household", 
      description: "Create your household profile and invite members with customizable permissions.",
      color: "from-blue-600 to-blue-700"
    },
    { 
      icon: Receipt, 
      title: "Track Transactions", 
      description: "Record expenses, contributions, and bills with automated categorization.",
      color: "from-green-600 to-green-700"
    },
    { 
      icon: PieChart, 
      title: "Analyze & Optimize", 
      description: "Generate insights and optimize your household financial management.",
      color: "from-purple-600 to-purple-700"
    },
  ];

  const testimonials = [
    {
      name: "Anthony Akwa",
      role: "Household Member",
      content: "This platform transformed how we manage shared expenses. The transparency and automation saved us hours every month.",
      rating: 5
    },
    {
      name: "Eraste Akande",
      role: "House Owner",
      content: "Finally, a professional solution for household finances. The analytics help us make better spending decisions.",
      rating: 5
    },
    {
      name: "Simon Azike",
      role: "Founder",
      content: "After managing shared expenses with spreadsheets and WhatsApp messages, I realized there has to be a better way. UTIL was born from a desperate need for transparency and accountability in household finances.",
      rating: 5
    }
  ];

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <DarkModeToggle />

      {/* Simplified Hero Section */}
      <motion.section
        className="relative flex items-center justify-center text-center text-white min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('./images/house-dashboard.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          className="relative z-10 max-w-3xl px-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Manage Your <span className="text-green-400">House Expenses</span> Effortlessly
          </h1>

          <p className="text-xl mb-10 leading-relaxed text-gray-100">
            Simplify shared expenses, track contributions, and monitor bills all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-xl"
            >
              Get Started
            </Link>
            <a 
              href="#features" 
              className="px-8 py-4 rounded-xl border-2 border-white/30 backdrop-blur-sm bg-white/10 font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Explore Features
            </a>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed for modern household financial management
            </p> */}
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl transition-all duration-300"
                  variants={cardVariant}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple Implementation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our streamlined onboarding process
            </p> */}
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform translate-x-1/2"></div>
                  )}
                  
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 relative z-10`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our users say about their experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     {/* Simplified CTA Section */}
<section className="py-20 bg-gradient-to-br from-blue-600 to-green-600">
  <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-white mb-8">
        Ready to Get Started?
      </h2>
      <Link
        to="/register"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        Get Started
        <ArrowRight className="w-5 h-5" />
      </Link>
    </motion.div>
  </div>
</section>


      <Footer />
    </div>
  );
};

export default Landing;
