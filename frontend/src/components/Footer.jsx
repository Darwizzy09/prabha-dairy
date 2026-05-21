import React from 'react';
import { Link } from 'react-router-dom';
// 👉 Removed Facebook and Instagram from the import!
import { Mail, Phone, MapPin } from 'lucide-react';

// 👉 Added the raw SVG icons since Lucide removed them
const FacebookIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-black text-brand-dark mb-4">Prabha Dairy</h2>
            <p className="text-gray-500 mb-6 max-w-sm leading-relaxed">
              Delivering 100% pure, farm-fresh milk, ghee, and dairy products straight from our farms to your doorstep.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/prabha_dairy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center hover:bg-brand hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                {/* 👉 Using the custom SVG */}
                <InstagramIcon size={20} />
              </a>
              {/* 👉 Custom JustDial Icon */}
              <a
                href="https://jsdl.in/DT-99YZWZKM"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-[#FF7A00] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="JustDial"
              >
                <span className="font-black text-lg tracking-tighter leading-none mb-0.5">jd</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-500 hover:text-brand transition-colors">About Us</Link></li>
              <li><Link to="/shop" className="text-gray-500 hover:text-brand transition-colors">Shop Dairy</Link></li>
              <li><Link to="/updates" className="text-gray-500 hover:text-brand transition-colors">Community Updates</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-brand transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Legal & Support</h3>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-gray-500 hover:text-brand transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-brand transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="text-gray-500 hover:text-brand transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/refunds" className="text-gray-500 hover:text-brand transition-colors">Cancellation & Refunds</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-medium">
            © {currentYear} Prabha Dairy. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2"><Phone size={16} /> +91 92846 25368</span>
            <span className="flex items-center gap-2"><Mail size={16} /> prabhadairy.1992@gmail.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
}