import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Clock, CheckCircle, ShoppingBag, Truck, XCircle } from 'lucide-react';

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://prabha-dairy.vercel.app/api/orders');
        const userOrders = response.data.filter(
          (order) => order.customerEmail === user?.email
        );
        // Bulletproof Sort: Newest first using MongoDB _id
        setOrders(userOrders.sort((a, b) => b._id.localeCompare(a._id)));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Helper function to design the status badge
  const getStatusUI = (rawStatus) => {
    // Treat old/missing statuses as "Processing"
    const status = (rawStatus === 'Pending' || !rawStatus) ? 'Processing' : rawStatus;

    switch (status) {
      case 'Processing':
        return { color: 'bg-orange-100 text-orange-600 border-orange-200', icon: <Clock size={16} />, text: 'Processing' };
      case 'Out for Delivery':
        return { color: 'bg-blue-100 text-blue-600 border-blue-200 animate-pulse', icon: <Truck size={16} />, text: 'Out for Delivery' };
      case 'Delivered':
        return { color: 'bg-green-100 text-green-600 border-green-200', icon: <CheckCircle size={16} />, text: 'Delivered' };
      case 'Cancelled':
        return { color: 'bg-red-100 text-red-600 border-red-200', icon: <XCircle size={16} />, text: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: <Clock size={16} />, text: 'Processing' };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-4 text-center mt-16">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Please log in</h2>
        <p className="text-gray-500 mb-8">You need to be logged in to view your order history.</p>
        <Link to="/login" className="bg-brand text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all">Log In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
            <p className="text-gray-500 font-medium">Track and manage your past purchases</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-brand font-bold animate-pulse text-xl">
            Loading your history...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
             <div className="w-24 h-24 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6">
               <ShoppingBag size={40} />
             </div>
             <h2 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h2>
             <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't placed any orders with Prabha Dairy yet. Let's fix that!</p>
             <Link to="/shop" className="bg-brand text-white px-8 py-4 rounded-xl font-black shadow-lg shadow-brand/20 hover:-translate-y-1 transition-all">
               Start Shopping
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusUI = getStatusUI(order.status);
              
              return (
                <div key={order._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  
                  {/* Header of the Order Card with the NEW LIVE STATUS */}
                  <div className="bg-gray-50 px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                        Order Placed • {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    
                    {/* 👉 THE LIVE STATUS BADGE */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm border ${statusUI.color}`}>
                      {statusUI.icon}
                      {statusUI.text}
                    </div>
                  </div>

                  {/* Body of the Order Card */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
                      <div>
                        <p className="text-sm font-bold text-gray-800 mb-2">Delivery Address</p>
                        <p className="text-sm text-gray-500">{order.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 mb-2">Payment Method</p>
                        <div className="flex items-center gap-2">
                          {order.paymentMethod === 'Online Payment' ? (
                            <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100">
                              <CheckCircle className="w-3.5 h-3.5 shrink-0"/> Paid Online
                            </span>
                          ) : order.paymentMethod === 'Cash on Delivery' ? (
                            <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold border border-orange-100">
                              <Clock className="w-3.5 h-3.5 shrink-0"/> COD
                            </span>
                          ) : (
                            <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">
                              <Clock className="w-3.5 h-3.5 shrink-0"/> Processing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-800 mb-3">Items ({order.items.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="bg-[#FDFBF7] border border-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-sm font-medium">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto bg-brand/5 p-4 rounded-xl border border-brand/10">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="font-black text-brand text-2xl">₹{order.totalAmount}</p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}