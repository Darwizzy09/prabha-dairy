import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 text-brand rounded-full mb-4">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Have a question about our fresh dairy products, delivery slots, or bulk orders? We would love to hear from you.
          </p>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-2xl font-black text-gray-900 mb-8 text-center border-b border-gray-50 pb-8">
            Contact Information
          </h3>
          
          <div className="space-y-8 max-w-lg mx-auto">
            
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Prabha Dairy</p>
                <p className="text-gray-500 mt-1 leading-relaxed">
                  l-138/2, N 9, Hudco, Rajiv Gandhi Bhaji Market, N 9, Shivaji Nagar, Chhatrapati Sambhajinagar, Maharashtra 431003
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Phone</p>
                <p className="text-gray-500 mt-1 text-lg font-medium">+91 92846 25368</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Email</p>
                <p className="text-gray-500 mt-1 text-lg font-medium">prabhadairy.1992@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Working Hours</p>
                <p className="text-gray-500 mt-1 leading-relaxed">
                  Everyday: 
                  7:00 AM - 9:00 PM
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}