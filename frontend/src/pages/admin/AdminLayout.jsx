import { Link, Outlet, useLocation } from 'react-router-dom';
// 👉 1. Added Sparkles to your icon imports
import { Package, BarChart3, ShoppingBag, Sparkles } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const navLinks = [
    { name: 'Inventory', path: '/admin/inventory', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    // 👉 2. Added the new Posts link to your array
    { name: 'Posts', path: '/admin/posts', icon: <Sparkles size={20} /> },
  ];

  return (
    <div className="min-h-[90vh] bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                  ? 'bg-brand text-white shadow-md shadow-brand/20' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area (This changes based on what you click in the sidebar) */}
      <main className="flex-1 p-6 md:p-10">
        <Outlet /> 
      </main>
      
    </div>
  );
}