import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function Refunds() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-12">
        
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
            <RefreshCw size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Cancellation & Refunds</h1>
            <p className="text-gray-500">Last Updated: May 19, 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Order Cancellation</h3>
          <p>You can cancel your order at any time <em>before</em> the order has been dispatched from our facility. To cancel an order, please contact our support team immediately at <strong>prabhadairy.1992@gmail.com</strong> or call <strong>+91 92846 25368</strong>. Once an order has been dispatched, it cannot be cancelled.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Return Policy (Perishable Goods)</h3>
          <p>Because we deal in fresh, perishable food items (Milk, Paneer, etc.), <strong>we do not accept returns</strong> once the product has been delivered.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Refunds for Damaged or Incorrect Items</h3>
          <p>In the rare event that you receive a damaged product, a tampered package, or the wrong item, please notify us within <strong>24 hours</strong> of delivery. You must share a photograph of the damaged/incorrect product and the invoice via email to <strong>prabhadairy.1992@gmail.com</strong>.</p>
          <p>Once our team verifies the issue, we will initiate a full refund or send a replacement, as per your preference.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Refund Processing Timeline</h3>
          <p>Once your refund request is approved, the refund will be initiated immediately from our end. The amount will be credited back to your original method of payment (Credit Card, Debit Card, UPI, or Net Banking) within <strong>5 to 7 business days</strong>, depending on your bank's processing time.</p>
        </div>

      </div>
    </div>
  );
}