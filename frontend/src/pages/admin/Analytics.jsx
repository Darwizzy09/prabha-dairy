import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, Banknote, Loader2, Package } from 'lucide-react';
import axios from 'axios';

export default function Analytics() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH REAL DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both endpoints at the same time for speed!
        const [ordersRes, productsRes] = await Promise.all([
          axios.get('https://prabha-dairy.vercel.app/api/orders'),
          axios.get('https://prabha-dairy.vercel.app/api/products')
        ]);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching analytics data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🧮 REAL CALCULATIONS
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  
  // Get unique customers by extracting emails and putting them in a Set
  const uniqueCustomers = new Set(orders.map(order => order.customerEmail)).size;
  
  // Count products where stock is under 20
  const lowStockItems = products.filter(p => {
    const stockNum = parseInt(p.stock); // Handles strings like "15 kg"
    return !isNaN(stockNum) && stockNum < 20;
  }).length;

  // 📊 DYNAMIC BAR CHART MATH
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const salesByDay = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  
  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const dayName = days[date.getDay()]; // Gets 'Mon', 'Tue', etc.
    salesByDay[dayName] += order.totalAmount;
  });

  // Find the highest sales day so we know how tall to make the 100% bar
  const maxSale = Math.max(...Object.values(salesByDay), 1); 
  
  const weeklySales = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    amount: salesByDay[day],
    height: `${(salesByDay[day] / maxSale) * 100}%` // Calculates percentage height dynamically!
  }));

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand mb-4" />
        <p className="text-gray-500 font-bold">Calculating real-time analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Store Analytics</h1>
        <p className="text-gray-500 mt-1">Track your business growth and sales performance.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-500 rounded-xl group-hover:scale-110 transition-transform">
              <Banknote size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
          <h3 className="text-3xl font-black text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-brand/10 text-brand rounded-xl group-hover:scale-110 transition-transform">
              <ShoppingBag size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Orders</p>
          <h3 className="text-3xl font-black text-gray-900">{totalOrders}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Unique Customers</p>
          <h3 className="text-3xl font-black text-gray-900">{uniqueCustomers}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
              <Package size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Items Low Stock</p>
          <h3 className="text-3xl font-black text-red-500">{lowStockItems}</h3>
        </div>

      </div>

      {/* Visual Chart Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-8">Revenue This Week</h3>
        
        {/* CSS-Only Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-64 mt-4">
          {weeklySales.map((stat, index) => (
            <div key={stat.day} className="flex flex-col items-center w-full group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-xs font-bold bg-gray-900 text-white px-2 py-1 rounded-lg">
                ₹{stat.amount}
              </div>
              <div className="w-full max-w-[40px] bg-brand/10 rounded-t-lg group-hover:bg-brand/20 transition-colors duration-300 relative overflow-hidden h-full flex items-end">
                <div 
                  className="w-full bg-brand rounded-t-lg animate-in slide-in-from-bottom-full duration-1000 ease-out"
                  style={{ height: stat.height, animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
                ></div>
              </div>
              <span className="mt-4 text-sm font-bold text-gray-400">{stat.day}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}