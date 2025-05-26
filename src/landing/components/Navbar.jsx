// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/images/logo.jpeg'; // You'll need to save your logo here

const Navbar = ( { onLogin }) => {
  

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="w-24 h-12 md:w-40 md:h-14 overflow-hidden rounded-lg border-2 ">
            <img
              src={logo}
              alt="SoJourn Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="font-medium text-sojourn-green hover:text-sojourn-teal transition-colors">Features</a>
            {/* <a href="#experience" className="font-medium text-sojourn-green hover:text-sojourn-teal transition-colors">Experience</a> */}
            <a href="#destinations" className="font-medium text-sojourn-green hover:text-sojourn-teal transition-colors">Destinations</a>
            {/* <a href="#testimonials" className="font-medium text-sojourn-green hover:text-sojourn-teal transition-colors">Testimonials</a> */}
            <a href="#download" className="btn-primary">Download Now</a>
            <button
              className="btn-primary"
              onClick={onLogin}
            >
              Login
            </button>       
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-sojourn-green focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg py-4 px-6 space-y-4 transition-all">
            <a 
              href="#features" 
              className="block font-medium text-sojourn-green hover:text-sojourn-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            {/* <a 
              href="#experience" 
              className="block font-medium text-sojourn-green hover:text-sojourn-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Experience
            </a> */}
            <a 
              href="#destinations" 
              className="block font-medium text-sojourn-green hover:text-sojourn-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Destinations
            </a>
            {/* <a 
              href="#testimonials" 
              className="block font-medium text-sojourn-green hover:text-sojourn-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a> */}
            <a 
              href="#download" 
              className="btn-primary inline-block"
              onClick={() => setIsMenuOpen(false)}
            >
              Download Now
            </a>
            <button
              className="w-full mt-2 px-4 py-2 rounded-lg border border-sojourn-green text-sojourn-green font-semibold hover:bg-sojourn-green hover:text-white transition"
              onClick={() => {
                setIsMenuOpen(false);
                onLogin();
              }}
            >
              Login
            </button>
            
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;