import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
            
            </div> */}
            <span className="text-xl font-bold text-gray-900">Util</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              About Us
            </a>
            <a href="#services" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Services
            </a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Contact Us
            </a>
            <a href="#blog" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Blog
            </a>
            <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Pricing
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <a href="#about" className="block text-gray-600 hover:text-indigo-600 font-medium">
              About Us
            </a>
            <a href="#services" className="block text-gray-600 hover:text-indigo-600 font-medium">
              Services
            </a>
            <a href="#contact" className="block text-gray-600 hover:text-indigo-600 font-medium">
              Contact Us
            </a>
            <a href="#blog" className="block text-gray-600 hover:text-indigo-600 font-medium">
              Blog
            </a>
            <Link to="/pricing" className="block text-gray-600 hover:text-indigo-600 font-medium">
              Pricing
            </Link>
            <Link to="/login" className="block text-gray-600 hover:text-indigo-600 font-medium">
              Login
            </Link>
            <Link
              to="/register"
              className="block text-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
