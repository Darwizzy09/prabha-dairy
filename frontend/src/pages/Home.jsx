import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// ------------------------------------------------------------------
// 1. THE SMART PRODUCT CARD (Same premium design as Shop page!)
// ------------------------------------------------------------------
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Safely grab variants, with backwards compatibility
  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [{ size: product.stock || 'Standard', price: product.price, mrp: product.mrp }];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeVariant = variants[selectedIndex] || variants[0];

  const safeMrp = Number(activeVariant.mrp) || Number(activeVariant.price) || 0;
  const safePrice = Number(activeVariant.price) || 0;
  const discount = safeMrp - safePrice;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.isOutOfStock) return;

    const cartItem = {
      ...product,
      selectedSize: activeVariant.size,
      price: safePrice,
      mrp: safeMrp,
      cartItemId: `${product._id}-${activeVariant.size}`
    };

    addToCart(cartItem);
    toast.success(`Added ${activeVariant.size} ${product.name} to cart!`, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  return (
    <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300 flex flex-col h-full relative group">

      <Link to={`/product/${product._id}`} className="flex-grow flex flex-col">
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

        <div className="flex-grow flex flex-col px-1">
          <span className="text-brand text-xs font-black uppercase tracking-widest mb-1">{product.category}</span>
          <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">{product.name}</h3>
        </div>
      </Link>

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
            className={`shrink-0 flex items-center justify-center gap-1 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm transition-all duration-300 border-2 ${product.isOutOfStock
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
// 2. THE MAIN HOME COMPONENT
// ------------------------------------------------------------------
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://prabha-dairy.vercel.app/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800">

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=2000&auto=format&fit=crop"
            alt="Fresh Dairy Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 z-10"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16">
          <div className="max-w-3xl space-y-8 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand/30 text-white font-bold text-sm tracking-wide backdrop-blur-md border border-white/20">
              🌱 100% Organic & Farm Fresh
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Pure goodness, <br />
              <span className="text-brand-light">delivered daily.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto lg:mx-0 font-medium">
              Experience the rich, authentic taste of milk from happy, healthy cows.
              Uncompromised purity straight from our farm to your table.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-10 py-4 bg-brand text-white rounded-full font-black shadow-xl hover:bg-white hover:text-brand transition-all duration-300 flex items-center justify-center gap-2 text-lg"
              >
                Order Now <ArrowRight size={20} />
              </Link>
              <a
                href="#categories"
                className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white border border-white/30 backdrop-blur-md rounded-full font-bold hover:bg-white/20 transition-all duration-300 text-center text-lg"
              >
                Explore Products
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC PRODUCTS SECTION */}
      <section id="categories" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Our Premium Range</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose from our selection of farm-fresh essentials.</p>
        </div>

        {loading ? (
          <div className="text-center py-10 animate-pulse text-brand font-bold text-xl">
            Loading products...
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* 👉 MAP USING THE SMART PRODUCT CARD */}
            {[...products]
              .sort((a, b) => (a.isNewLaunch === b.isNewLaunch ? 0 : a.isNewLaunch ? -1 : 1))
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <img src="/logo1.jpg" alt="Logo" className="h-16 w-auto object-contain" />
          <p className="text-sm text-gray-400">© 2026 Prabha Dairy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}