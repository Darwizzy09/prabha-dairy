import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
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

  const handleAddToCart = (e) => {
    e.preventDefault(); // Stops the Link wrapper from navigating to details page
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
      
      {/* Clicking the top half navigates to Product Details */}
      <Link to={`/product/${product._id}`} className="flex-grow flex flex-col">
        
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
                🚀 New Launch
              </span>
            )}
          </div>

          {product.image ? (
             <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
          ) : (
             <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🥛</span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-lg font-black text-gray-900 leading-tight mb-1">{product.name}</h3>
      </Link>

      {/* THE VARIANT SELECTOR */}
      <div className="mb-4 mt-2 h-[38px]">
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
            {/* Custom small arrow for dropdown */}
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

      {/* Price & Add to Cart */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex flex-col">
          {safeMrp > safePrice && (
            <span className="text-xs font-bold text-gray-400 line-through">₹{safeMrp}</span>
          )}
          <span className="text-2xl font-black text-brand leading-none">₹{safePrice}</span>
        </div>
        
        {/* 👉 THE UPGRADED PREMIUM BUTTON */}
        <button 
          onClick={handleAddToCart}
          disabled={product.isOutOfStock}
          className={`flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-300 border-2 ${
            product.isOutOfStock 
              ? 'border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'border-brand/20 bg-brand/10 text-brand hover:bg-brand hover:text-white active:scale-95 hover:shadow-lg hover:shadow-brand/20'
          }`}
        >
          {product.isOutOfStock ? 'Sold Out' : 'ADD'}
          {!product.isOutOfStock && <Plus size={16} strokeWidth={3} />}
        </button>
      </div>

    </div>
  );
}