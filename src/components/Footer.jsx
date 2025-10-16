// src/components/Footer.jsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
             
            </div>
            <span className="text-xl font-bold text-white">Util</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Simplify how you manage shared expenses, bills, and contributions —
            all in one smart app built for modern households.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-3 text-gray-400">
            <li>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="hover:text-white transition-colors"
              >
                How it Works
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
          <ul className="space-y-3 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter / Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Stay Connected
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe for updates, feature releases, and community insights.
          </p>
          <form className="flex items-center">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 rounded-r-lg text-white font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all"
            >
              Subscribe
            </button>
          </form>

          <div className="flex space-x-5 mt-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} House Utility. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
