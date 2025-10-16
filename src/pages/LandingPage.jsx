import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Pricing from "../pages/Pricing";

const Landing = () => {
  const features = [
    { icon: "💰", title: "Track Contributions", description: "Monitor who paid what and when, with complete transparency.", color: "from-blue-500 to-green-400" },
    { icon: "📊", title: "Manage Expenses", description: "Categorize and record household expenses easily.", color: "from-green-400 to-blue-500" },
    { icon: "📅", title: "Bill Reminders", description: "Never miss deadlines with automated reminders.", color: "from-blue-600 to-black" },
    { icon: "📈", title: "Analytics & Reports", description: "Visualize spending patterns with beautiful charts.", color: "from-black to-green-400" },
    { icon: "🔒", title: "Secure & Private", description: "Your data is encrypted and private.", color: "from-blue-700 to-white" },
    { icon: "👥", title: "Multi-User Support", description: "Add your housemates and stay connected.", color: "from-green-500 to-blue-600" },
  ];

  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative flex items-center justify-center text-center text-white min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/images/house-dashboard.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          className="relative z-10 max-w-3xl px-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold mb-6">
            Manage Your <span className="text-green-400">House Expenses</span> Effortlessly
          </h1>
          <p className="text-lg mb-8">
            Simplify shared expenses, track contributions, and monitor bills all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 font-semibold hover:from-green-500 hover:to-blue-600 transition-all"
            >
              Get Started
            </Link>
            <a href="#features" className="px-8 py-3 rounded-xl border border-white font-semibold hover:bg-white hover:text-black transition-all">
              Explore Features
            </a>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* <h2 className="text-3xl font-bold text-black mb-12">Powerful Features</h2> */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl shadow-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 hover:scale-105 transition-transform"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={`w-14 h-14 mx-auto mb-5 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg bg-gradient-to-br ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* <h2 className="text-3xl font-bold text-black mb-12">How It Works</h2> */}
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: "📝", title: "Add Your House", desc: "Create a shared space and invite members.", bg: "from-blue-50 to-green-50" },
              { icon: "💸", title: "Record Expenses", desc: "Add contributions, bills, and spending easily.", bg: "from-green-50 to-blue-50" },
              { icon: "📊", title: "View Reports", desc: "Visualize and track home expenses instantly.", bg: "from-black/10 to-white" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className={`p-8 rounded-2xl shadow-md bg-gradient-to-br ${item.bg}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.3 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Landing;
