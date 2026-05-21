import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, MapPin, Receipt, CreditCard, Calendar, Mail, Package, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { clearCart } = useCart();
  
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(true);

  const orderDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  useEffect(() => {
    // 1. Clear the cart
    clearCart();
    
    // 2. Load the order details
    const savedOrder = sessionStorage.getItem('recentOrder');
    if (savedOrder) {
      setOrderDetails(JSON.parse(savedOrder));
    }
    
    // 👉 FIX 1: The empty array [] tells React to run this ONLY ONCE! No more infinite loops blocking your clicks!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const isCOD = orderDetails?.paymentMethod === 'Cash on Delivery';
  const headingText = isCOD ? 'Order Successful!' : 'Payment Successful!';
  const subText = isCOD 
    ? 'Your order has been placed securely. You can pay with cash upon delivery.' 
    : 'Your transaction was completed securely. Your farm-fresh dairy is being prepared!';

  return (
    // 👉 FIX 2: Replaced 'relative mt-16' with 'pt-28' to prevent it from invisibly overlapping the logo
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-12 px-4">
      
      {/* --- POPUP MODAL --- */}
      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20 animate-bounce">
              <CheckCircle className="w-10 h-10 shrink-0" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{headingText}</h2>
            <p className="text-gray-500 text-sm mb-8">{subText}</p>
            <button onClick={() => setShowPopup(false)} className="w-full bg-brand text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-1 active:scale-95 transition-all duration-300">
              View Receipt
            </button>
          </div>
        </div>
      )}

      {/* --- RECEIPT PAGE --- */}
      <div className={`max-w-3xl mx-auto transition-opacity duration-700 ${showPopup ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Order Receipt</h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">Here are the verified details of your recent purchase.</p>
        </div>

        {orderDetails && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-10">
            
            <div className="bg-gray-50 border-b border-gray-100 px-6 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Transaction ID</span>
                <span className="font-mono font-black text-brand text-lg">{orderId || `TXN-${Math.floor(Math.random() * 1000000)}`}</span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 sm:justify-end"><Calendar size={14}/> Date & Time</span>
                <span className="font-bold text-gray-800 text-sm">{orderDate}</span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><MapPin size={16}/> Delivery To</h3>
                  <p className="font-bold text-gray-900">{orderDetails.customerName}</p>
                  <p className="text-gray-600 text-sm mt-1 flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {orderDetails.customerEmail}</p>
                  <p className="text-gray-600 text-sm mt-1">{orderDetails.address}</p>
                  <p className="text-gray-600 text-sm mt-1">Ph: {orderDetails.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><CreditCard size={16}/> Payment Method</h3>
                  <p className="font-bold text-gray-900">{orderDetails.paymentMethod}</p>
                  
                  {isCOD ? (
                    <p className="text-orange-500 font-bold text-sm mt-1 flex items-center gap-1">
                      <Clock size={14}/> To be paid on delivery
                    </p>
                  ) : (
                    <p className="text-green-500 font-bold text-sm mt-1 flex items-center gap-1">
                      <CheckCircle size={14}/> Verified & Paid
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 mb-8"></div>

              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Receipt size={16}/> Order Summary</h3>
              <div className="space-y-4 mb-8">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-[#FDFBF7] p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-black text-sm">{item.quantity}x</span>
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.price} per unit</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900 text-lg">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="bg-brand/5 rounded-2xl p-6 flex justify-between items-center border border-brand/10">
                <span className="text-lg font-bold text-gray-700">Total Amount {isCOD ? 'Due' : 'Paid'}</span>
                <span className="text-3xl font-black text-brand">₹{orderDetails.totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* --- BUTTONS --- */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link 
            to="/shop" 
            className="px-8 py-4 bg-white text-brand border-2 border-brand/20 rounded-xl font-black hover:bg-brand hover:text-white hover:border-brand hover:-translate-y-1 active:scale-95 transition-all duration-300 text-center"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/my-orders" 
            className="px-8 py-4 bg-brand text-white rounded-xl font-black shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-1 active:scale-95 transition-all duration-300 flex justify-center items-center gap-2"
          >
            <Package size={20} /> View Order History
          </Link>
        </div>

      </div>
    </div>
  );
}