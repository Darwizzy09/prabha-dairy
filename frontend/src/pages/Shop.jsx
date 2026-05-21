import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ShoppingCart, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext'; // 👉 Cart properly connected!
import { Link } from 'react-router-dom';

// ------------------------------------------------------------------
// 1. THE INDIVIDUAL PRODUCT CARD COMPONENT
// ------------------------------------------------------------------
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Safely grab variants, with backwards compatibility for old products
  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [{ size: product.stock || 'Standard', price: product.price, mrp: product.mrp }];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeVariant = variants[selectedIndex] || variants[0];

  // Safely calculate numbers for UI
  const safeMrp = Number(activeVariant.mrp) || Number(activeVariant.price) || 0;
  const safePrice = Number(activeVariant.price) || 0;
  const discount = safeMrp - safePrice;

  const handleAddToCart = () => {
    if (product.isOutOfStock) return;

    const cartItem = {
      ...product,
      selectedSize: activeVariant.size,
      price: safePrice,
      mrp: safeMrp,
      cartItemId: `${product._id}-${activeVariant.size}` // Unique ID for CartContext
    };

    addToCart(cartItem);
    toast.success(`Added ${activeVariant.size} ${product.name} to cart!`, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  return (
    <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300 flex flex-col h-full relative group">
      
      {/* 👉 THE FIX: Wrap the top half in a Link tag! */}
      <Link to={`/product/${product._id}`} className="flex-grow flex flex-col cursor-pointer">
        
        {/* Image Container with Badges */}
        <div className="bg-[#FAFAFA] rounded-2xl aspect-square mb-4 relative flex items-center justify-center p-6 overflow-hidden">
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            {discount > 0 ? (
              <span className="bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                Save ₹{discount}
              </span>
            ) : <div />}

            {product.isNewLaunch && (
              <span className="bg-brand text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider shadow-sm">
                🚀 New
              </span>
            )}
          </div>

          {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
          ) : (
              <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🥛</span>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-grow flex flex-col px-1">
          <span className="text-brand text-xs font-black uppercase tracking-widest mb-1">{product.category}</span>
          <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">{product.name}</h3>
        </div>
      </Link>

      {/* Interactive Controls (Outside the link so buttons still work!) */}
      <div className="px-1 mt-auto">
        {/* THE VARIANT SELECTOR */}
        <div className="mb-4 h-[38px]">
          {variants.length > 1 ? (
            <div className="relative">
              <select 
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 cursor-pointer transition-all"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
              >
                {variants.map((v, idx) => (
                  <option key={idx} value={idx}>{v.size} - ₹{v.price}</option>
                ))}
              </select>
              {/* Custom small arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          ) : (
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block leading-[38px]">
              {activeVariant.size}
            </span>
          )}
        </div>

        {/* Price & Add to Cart Row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-1 gap-2">
          
          {/* Price Section */}
          <div className="flex flex-col min-w-0"> 
            {safeMrp > safePrice && (
              <span className="text-[10px] sm:text-xs font-bold text-gray-400 line-through truncate">₹{safeMrp}</span>
            )}
            {/* 👉 Shrinks to text-lg on mobile, text-2xl on larger screens */}
            <span className="text-lg sm:text-2xl font-black text-brand-dark leading-none truncate">₹{safePrice}</span>
          </div>
          
          {/* Add Button */}
          <button 
            onClick={handleAddToCart}
            disabled={product.isOutOfStock}
            // 👉 shrink-0 prevents it from getting squished. Padding and text size adapt to screen size!
            className={`shrink-0 flex items-center justify-center gap-1 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm transition-all duration-300 border-2 ${
              product.isOutOfStock 
                ? 'border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'border-brand/20 bg-brand/10 text-brand hover:bg-brand hover:text-white active:scale-95 hover:shadow-lg hover:shadow-brand/20'
            }`}
          >
            {product.isOutOfStock ? 'Sold Out' : 'ADD'}
            {!product.isOutOfStock && <Plus className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={3} />}
          </button>

        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// 2. THE MAIN SHOP COMPONENT
// ------------------------------------------------------------------
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        // Only show products that are not out of stock (or show them at the bottom)
        const sortedProducts = response.data.sort((a, b) => (a.isOutOfStock === b.isOutOfStock ? 0 : a.isOutOfStock ? 1 : -1));
        setProducts(sortedProducts);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter Categories
  const baseCategories = ["Milk", "Ghee & Butter", "Curd & Buttermilk", "Paneer & Khawa", "Shrikhand & Desserts", "Sweets & Mithai", "Farsan & Snacks", "Dry Fruits & Gifting", "Ready to Cook", "Other"];
  const categories = ["All", ...new Set([...baseCategories, ...products.map(p => p.category)])];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">

        {/* Header & Filters */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 text-center">Shop Fresh Dairy</h1>

          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand/30 outline-none shadow-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                className="w-full appearance-none pl-12 pr-10 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand/30 outline-none shadow-sm font-bold text-gray-700 cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20 text-brand font-bold animate-pulse text-xl">Loading fresh products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
            <span className="text-6xl mb-4 block">🧐</span>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}