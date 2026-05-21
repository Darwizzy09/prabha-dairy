import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Search, Loader2 } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://prabha-dairy.vercel.app/api/orders');
      // Sort newest first using MongoDB _id
      setOrders(response.data.sort((a, b) => b._id.localeCompare(a._id)));
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    // Optimistic UI update for instant feedback
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    
    try {
      await axios.put(`https://prabha-dairy.vercel.app/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
      fetchOrders(); // Revert on failure
    }
  };

  // Analytics Math
  const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== 'Cancelled' ? order.totalAmount : 0), 0);
  const pendingOrders = orders.filter(o => !o.status || o.status === 'Processing' || o.status === 'Pending').length;

  // Live Search & Filter Logic
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order.customerName?.toLowerCase().includes(searchLower) || 
      order.phone?.includes(searchTerm) ||
      order._id.toLowerCase().includes(searchLower);
    
    // 👉 THE FIX: Force old "Pending" orders or blank orders to act as "Processing"
    const actualStatus = (order.status === 'Pending' || !order.status) ? 'Processing' : order.status;
    const matchesFilter = filter === "All" || actualStatus === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Processing': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Out for Delivery': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-200';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-orange-50 text-orange-600 border-orange-200'; // Default to Processing
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & MINI ANALYTICS */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-6">Order Fulfillment</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center"><Package size={24}/></div>
              <div><p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Orders</p><p className="text-2xl font-black">{orders.length}</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center"><Clock size={24}/></div>
              <div><p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Dispatch</p><p className="text-2xl font-black">{pendingOrders}</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand/20 flex items-center gap-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-brand/5 rounded-full -mr-10 -mt-10"></div>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><CheckCircle size={24}/></div>
              <div><p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p><p className="text-2xl font-black text-brand">₹{totalRevenue}</p></div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search by name, phone, or ID..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/30 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm overflow-x-auto hide-scrollbar">
            {['All', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${filter === f ? 'bg-brand text-white shadow-sm' : 'text-gray-500 hover:text-brand hover:bg-brand/5'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS LIST (Card Layout for better mobile viewing) */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold">
               <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand" />
               Loading fresh orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-gray-100 text-gray-500 font-medium">No orders found matching your criteria.</div>
          ) : (
            filteredOrders.map(order => (
              <div key={order._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row hover:shadow-md transition-shadow">
                
                {/* Left Side: Customer Info */}
                <div className="lg:w-1/3 bg-gray-50 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                      <p className="font-mono text-sm text-gray-900 font-bold">...{order._id.slice(-6)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time</p>
                      <p className="text-sm font-bold text-gray-700">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <h3 className="font-black text-lg text-gray-900 mb-2">{order.customerName}</h3>
                  <p className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                    <MapPin size={16} className="text-brand shrink-0 mt-0.5" />
                    <span>{order.address}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Phone size={16} className="text-gray-400" />
                    {order.phone}
                  </p>
                </div>

                {/* Right Side: Order Details & Action */}
                <div className="lg:w-2/3 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Order Items</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-black text-sm shrink-0">{item.quantity}x</span>
                          <span className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total & Payment</p>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-brand">₹{order.totalAmount}</span>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${order.paymentMethod === 'Cash on Delivery' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                          {order.paymentMethod === 'Cash on Delivery' ? 'COD' : 'Paid'}
                        </span>
                      </div>
                    </div>

                    {/* STATUS DROPDOWN CONTROLLER */}
                    <div className="w-full sm:w-auto flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                      <span className="text-sm font-bold text-gray-500 whitespace-nowrap">Status:</span>
                      <select 
                        // 👉 THE FIX: Force the dropdown to show "Processing" for old Pending orders
                        value={(order.status === 'Pending' || !order.status) ? 'Processing' : order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`appearance-none cursor-pointer bg-transparent font-black text-sm outline-none transition-all ${getStatusColor(order.status || 'Processing').split(' ')[1]}`}
                      >
                        <option value="Processing" className="text-orange-600">⏳ Processing</option>
                        <option value="Out for Delivery" className="text-blue-600">🚚 Out for Delivery</option>
                        <option value="Delivered" className="text-green-600">✅ Delivered</option>
                        <option value="Cancelled" className="text-red-600">❌ Cancelled</option>
                      </select>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}