import React from 'react';
import { Truck } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-12">
        
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
          <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
            <Truck size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Shipping & Delivery Policy</h1>
            <p className="text-gray-500">Last Updated: May 19, 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Delivery Locations</h3>
          <p>Prabha Dairy currently ships non-perishable items (such as Ghee) across India. Perishable items (such as Fresh Milk and Paneer) are currently restricted to delivery within <strong>Chh. Sambhajinagar</strong> to ensure freshness.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Processing and Dispatch Time</h3>
          <p>All orders are processed and dispatched within <strong>1 to 2 business days</strong> (excluding weekends and public holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Delivery Timelines</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Local Deliveries (Fresh Dairy):</strong> Delivered within 24 to 48 hours of order confirmation.</li>
            <li><strong>Nationwide Shipping (Ghee/Non-perishables):</strong> Delivered within <strong>3 to 7 business days</strong> depending on the destination state and courier partner.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Shipping Costs</h3>
          <p>Shipping charges for your order will be calculated and displayed at checkout. We offer free shipping on orders over <strong>[Amount, e.g., ₹500]</strong>.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Order Tracking</h3>
          <p>Once your order has shipped, we will send you an email with the tracking number and a link to our logistics partner's website.</p>
        </div>

      </div>
    </div>
  );
}