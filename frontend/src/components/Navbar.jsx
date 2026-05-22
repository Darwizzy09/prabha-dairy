import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Search, User as UserIcon, X, LogOut, ShieldCheck, Menu, Package, Sparkles, Info } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { totalItemsCount } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const ADMIN_EMAILS = ["rohitliverpool777@gmail.com", "prabhadairy.1992@gmail.com", "sawalkarsoham88@gmail.com"];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleLiveSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      navigate(`/shop?search=${query}`);
    } else {
      navigate(`/shop`);
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <>
      {/* FIXED: Removed backdrop-blur and transparency, made it solid bg-white */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-[100]">
        {/* FIXED: Reduced padding (py-1.5 sm:py-2) to compress height */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex justify-between items-center">

          {!isSearchOpen && (
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300">
              {/* FIXED: Compressed logo from h-28 to h-16/h-20 */}
              <img src="/logo1.jpg" alt="Prabha Dairy Logo" className="h-16 sm:h-20 w-auto object-contain origin-left" />
            </Link>
          )}

          <div className={`flex items-center gap-2 sm:gap-4 ${isSearchOpen ? 'w-full' : ''}`}>

            {/* NEW: Prabha's Journey Link (Desktop Only) */}
            {!isSearchOpen && (
              <Link to="/about" className="hidden md:block text-gray-700 hover:text-brand font-black transition-all duration-300 mr-2">
                Prabha's Journey
              </Link>
            )}

            {/* SEARCH BAR SECTION */}
            <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'flex-1' : 'w-auto'}`}>
              {isSearchOpen ? (
                <div className="w-full flex items-center">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search for milk, paneer..."
                    className="w-full bg-[#FDFBF7] border border-brand/20 rounded-full py-2 px-6 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all duration-300"
                    value={searchQuery}
                    onChange={handleLiveSearch}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      navigate('/shop');
                    }}
                    className="absolute right-4 text-gray-400 hover:text-brand hover:rotate-90 transition-all duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 hover:bg-brand-light rounded-full text-gray-600 hover:text-brand hover:scale-110 active:scale-95 transition-all duration-200"
                >
                  <Search size={22} />
                </button>
              )}
            </div>

            {!isSearchOpen && (
              <>
                {/* COMMUNITY BUTTON (Desktop Only) */}
                <Link to="/updates" title="Community" className="text-gray-600 hover:text-brand transition-all duration-300 relative p-2.5 hover:bg-brand-light rounded-full hover:scale-110 active:scale-95 hidden sm:block">
                  <Sparkles size={22} />
                </Link>

                {/* ORDERS BUTTON (Desktop Only) */}
                {user && (
                  <Link to="/my-orders" title="My Orders" className="text-gray-600 hover:text-brand transition-all duration-300 relative p-2.5 hover:bg-brand-light rounded-full hover:scale-110 active:scale-95 hidden sm:block">
                    <Package size={22} />
                  </Link>
                )}

                {/* 🛒 CART BUTTON */}
                <Link to="/checkout" className="text-gray-600 hover:text-brand transition-all duration-300 relative p-2.5 hover:bg-brand-light rounded-full hover:scale-110 active:scale-95">
                  <ShoppingCart size={22} />
                  {totalItemsCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white animate-bounce">
                      {totalItemsCount}
                    </span>
                  )}
                </Link>

                {/* 🍔 HAMBURGER MENU BUTTON */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2.5 hover:bg-brand-light rounded-full text-gray-600 hover:text-brand hover:scale-110 active:scale-95 transition-all duration-200 ml-1 sm:ml-2"
                >
                  <Menu size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 📱 SMOOTH UNIVERSAL SIDEBAR DRAWER */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#FDFBF7] shadow-2xl z-[120] flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >

        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <span className="font-black text-brand-dark text-xl">Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 hover:rotate-90 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer Links & Info */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

          {user && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand/10 mb-2 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                {ADMIN_EMAILS.includes(user.email) ? "Admin" : "Member"}
              </p>
              <p className="text-lg font-black text-brand-dark truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          )}

          <Link
            to="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-3.5 bg-white rounded-xl font-bold text-gray-700 shadow-sm border border-gray-100 hover:border-brand/50 hover:text-brand hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 group"
          >
            <span className="text-xl">🛒</span> Shop Dairy
          </Link>

          <Link
            to="/updates"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-3.5 bg-white rounded-xl font-bold text-gray-700 shadow-sm border border-gray-100 hover:border-brand/50 hover:text-brand hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 group"
          >
            <Sparkles size={20} className="text-gray-500 group-hover:text-brand transition-colors" /> Community Updates
          </Link>

          {/* NEW: Prabha's Journey Link (Mobile Menu) */}
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-3.5 bg-white rounded-xl font-bold text-gray-700 shadow-sm border border-gray-100 hover:border-brand/50 hover:text-brand hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 group"
          >
            <Info size={20} className="text-gray-500 group-hover:text-brand transition-colors" /> Prabha's Journey
          </Link>
          
          {/* ORDERS BUTTON (Mobile Menu) */}
          {user && (
            <Link
              to="/my-orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3.5 bg-white rounded-xl font-bold text-gray-700 shadow-sm border border-gray-100 hover:border-brand/50 hover:text-brand hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 group"
            >
              <Package size={20} className="text-gray-500 group-hover:text-brand transition-colors" /> My Orders
            </Link>
          )}

          <Link
            to="/checkout"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-4 py-3.5 bg-white rounded-xl font-bold text-gray-700 shadow-sm border border-gray-100 hover:border-brand/50 hover:text-brand hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 group"
          >
            <ShoppingCart size={20} className="text-gray-500 group-hover:text-brand transition-colors" /> View Cart
          </Link>

          {user && ADMIN_EMAILS.includes(user.email) && (
            <Link
              to="/admin/inventory"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 bg-brand text-white px-4 py-3.5 rounded-xl font-black shadow-md shadow-brand/20 hover:bg-brand-dark hover:-translate-y-1 hover:shadow-lg transition-all duration-300 mt-2"
            >
              <ShieldCheck size={20} /> Admin Panel
            </Link>
          )}
        </div>

        {/* Drawer Footer (Login / Logout) */}
        <div className="p-5 bg-white border-t border-gray-100 mt-auto">
          {user ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setTimeout(() => setShowLogoutConfirm(true), 300);
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/20 active:scale-95 transition-all duration-300"
            >
              <LogOut size={20} /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-dark hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              <UserIcon size={20} /> Login
            </Link>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut size={32} />
            </div>
            <h3 className="text-2xl font-black text-center text-gray-900 mb-2">Leaving so soon?</h3>
            <p className="text-gray-500 text-center mb-8">Are you sure you want to log out of Prabha Dairy?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all duration-300"
              >
                Yes, Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}