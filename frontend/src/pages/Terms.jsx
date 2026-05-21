import React from 'react';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-12">
        
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
          <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Terms and Conditions</h1>
            <p className="text-gray-500">Last Updated: May 19, 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>Welcome to Prabha Dairy. These terms and conditions outline the rules and regulations for the use of <strong>Prabha Dairy</strong>'s Website. </p>
          <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use Prabha Dairy if you do not agree to take all of the terms and conditions stated on this page.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. License and Site Access</h3>
          <p>Unless otherwise stated, <strong>Prabha Dairy</strong> owns the intellectual property rights for all material on Prabha Dairy. You may access this from Prabha Dairy for your own personal use subjected to restrictions set in these terms and conditions.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Product Pricing and Availability</h3>
          <p>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to modify the prices of our products at any time without prior notice. While we strive to ensure all items are in stock, we reserve the right to cancel an order if the product is unavailable.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h3>
          <p>If you create an account on our website, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device.</p>

          
          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-900 mb-2">Contact Us</p>
            <p>If you have any queries regarding our Terms, please contact us at <strong>prabhadairy.1992@gmail.com</strong>.</p>
          </div>
        </div>

      </div>
    </div>
  );
}