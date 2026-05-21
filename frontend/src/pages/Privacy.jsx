import React from 'react';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-12">
        
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
          <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Privacy Policy</h1>
            <p className="text-gray-500">Last Updated: May 19, 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>At Prabha Dairy, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Prabha Dairy and how we use it.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h3>
          <p>When you make a purchase or attempt to make a purchase through our website, we collect certain information from you, including your name, billing address, shipping address, payment information (processed securely via Cashfree), email address, and phone number.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h3>
          <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this information to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Communicate with you regarding your order.</li>
            <li>Screen our orders for potential risk or fraud.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Sharing Your Personal Information</h3>
          <p>We share your Personal Information with third parties only to help us use your Personal Information as described above. For example, we share your delivery details with our logistics partners to deliver your order, and we use Cashfree to process payments securely. We do not sell your personal data to third parties.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Data Retention</h3>
          <p>When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</p>

          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-900 mb-2">Contact Us</p>
            <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <strong>prabhadairy.1992@gmail.com</strong> or by mail at:</p>
            <p className="mt-2 font-medium"><strong>Prabha Dairy</strong><br/> l-138/2, N 9, Hudco, Rajiv Gandhi Bhaji Market, N 9, Shivaji Nagar, Chhatrapati Sambhajinagar, Maharashtra 431003</p>
          </div>
        </div>

      </div>
    </div>
  );
}