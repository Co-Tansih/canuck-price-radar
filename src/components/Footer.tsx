
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary rounded-lg p-2">
                <Search className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">PriceTrackr</span>
            </div>
            <p className="text-gray-300 text-sm">
              Canada's leading price comparison platform. Find the best deals across thousands of products from top retailers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link to="/search" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Search Products
              </Link>
              <Link to="/stores" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Store Locator
              </Link>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                About Us
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Contact
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Popular Categories</h3>
            <div className="space-y-2">
              <Link to="/search?category=Hardware Tools" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Hardware Tools
              </Link>
              <Link to="/search?category=Clothing" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Clothing
              </Link>
              <Link to="/search?category=Building Materials" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Building Materials
              </Link>
              <Link to="/search?category=Electronics" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Electronics
              </Link>
              <Link to="/search?category=Accessories" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Accessories
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">support@pricetrackr.ca</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">1-800-PRICE-CA</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Main Street<br />
                  Toronto, ON M5V 3A8<br />
                  Canada
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 PriceTrackr. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
