// src/components/Footer.jsx
import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import logo from '../assets/images/logo.jpeg';

const Footer = () => {
  return (
    <footer className="bg-sojourn-gray text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img src={logo} alt="SoJourn Logo" className="h-10 mr-3" />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted travel companion for exploring the beauty of Jammu and Kashmir. 
              Discover authentic experiences with safety and confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#destinations" className="text-gray-300 hover:text-white transition-colors">Destinations</a></li>
              <li><a href="#experience" className="text-gray-300 hover:text-white transition-colors">App Experience</a></li>
              <li><a href="#download" className="text-gray-300 hover:text-white transition-colors">Download</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <FiMail className="w-4 h-4 mr-3 text-sojourn-teal" />
                <span className="text-gray-300">info@sojourn.com</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="w-4 h-4 mr-3 text-sojourn-teal" />
                <span className="text-gray-300">+91 XXX XXX XXXX</span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="w-4 h-4 mr-3 text-sojourn-teal" />
                <span className="text-gray-300">Jammu & Kashmir, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SoJourn. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;