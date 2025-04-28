
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kitchenia</h3>
            <p className="text-gray-600 mb-4">
              Homemade desi food prepared with love, freshness, and authentic flavors.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons can go here */}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-kitchenia-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#menu" className="text-gray-600 hover:text-kitchenia-orange transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-gray-600 hover:text-kitchenia-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/order" className="text-gray-600 hover:text-kitchenia-orange transition-colors">
                  Order Now
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone size={18} className="text-kitchenia-orange mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">+92 333 1234567</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-kitchenia-orange mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">orders@kitchenia.com</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="text-kitchenia-orange mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Gulberg III, Lahore, Pakistan</span>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="text-kitchenia-orange mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Mon-Sat: 10:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; {currentYear} Kitchenia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
