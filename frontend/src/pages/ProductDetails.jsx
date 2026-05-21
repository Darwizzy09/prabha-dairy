import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, ShieldCheck, Truck, Droplet, Star, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👉 VARIANT STATE
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 👉 STAR FIX: Starts at 0 (All Grey)
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await axios.get('https://prabha-dairy.vercel.app/api/products');
      const foundProduct = response.data.find(p => p._id === id);
      setProduct(foundProduct);
      setLoading(false);
    } catch (error) {
      toast.error("Could not load product details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to write a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a star rating first! ⭐");
      return;
    }

    setReviewLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`https://prabha-dairy.vercel.app/api/products/${id}/reviews`, { rating, comment }, config);

      toast.success("Review submitted successfully!");
      setComment('');
      setRating(0); 
      fetchProduct();
    } catch (error) {
      console.log("🔴 BACKEND ERROR:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to submit review. Check console.");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-brand animate-pulse">Loading Details...</div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center"><h2 className="text-3xl font-black mb-4">Product Not Found</h2><button onClick={() => navigate('/shop')} className="text-brand font-bold">Return to Shop</button></div>;

  // 👉 DYNAMIC VARIANT LOGIC
  const variants = product.variants && product.variants.length > 0 
    ? product.variants 
    : [{ size: product.stock || 'Standard', price: product.price, mrp: product.mrp }];

  const activeVariant = variants[selectedIndex] || variants[0];
  
  const safeMrp = Number(activeVariant.mrp) || Number(activeVariant.price) || 0;
  const safePrice = Number(activeVariant.price) || 0;
  const discount = safeMrp - safePrice;

  // 👉 ADD TO CART HANDLER
  const handleAddToCart = () => {
    if (product.isOutOfStock) return;
    
    const cartItem = {
      ...product,
      selectedSize: activeVariant.size,
      price: safePrice,
      mrp: safeMrp,
      cartItemId: `${product._id}-${activeVariant.size}`
    };

    addToCart(cartItem);
    toast.success(`Added ${activeVariant.size} to cart!`, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-6 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-brand font-bold mb-8 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>

        {/* 🏆 PRODUCT INFO CARD */}
        <div className="bg-white rounded-[3rem] p-6 lg:p-12 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 mb-12">

          <div className="lg:w-1/2">
            <div className="w-full aspect-square bg-[#FDFBF7] rounded-[2rem] flex items-center justify-center overflow-hidden border border-gray-100 relative">
              {product.isNewLaunch && <div className="absolute top-6 right-6 bg-brand text-white text-sm font-black px-4 py-2 rounded-xl z-20 animate-pulse">🚀 NEW LAUNCH</div>}
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              ) : (
                <span className="text-8xl">🥛</span>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col justify-center">
            <p className="text-brand font-black tracking-widest uppercase mb-2 text-sm">{product.category}</p>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.round(product.rating || 0) ? 'currentColor' : 'none'} className={i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-gray-500 font-bold text-sm">({product.numReviews || 0} Reviews)</span>
            </div>

            {/* 👉 VARIANT PRICING UI */}
            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-black text-brand">₹{safePrice}</span>
              {safeMrp > safePrice && (
                <span className="text-xl font-bold text-gray-400 line-through mb-1">₹{safeMrp}</span>
              )}
              {discount > 0 && (
                <span className="bg-green-100 text-green-600 font-bold text-xs px-2 py-1 rounded-md mb-2">Save ₹{discount}</span>
              )}
            </div>

            {/* 👉 SIZE SELECTOR PILLS */}
            <div className="mb-2">
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {variants.map((v, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`px-5 py-3 rounded-xl font-bold border-2 transition-all ${
                      selectedIndex === index 
                        ? 'border-brand bg-brand/10 text-brand shadow-sm' 
                        : 'border-gray-200 text-gray-600 hover:border-brand/30 hover:bg-gray-50'
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 my-6"></div>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description}</p>

            <button
              onClick={(e) => {
                e.preventDefault();
                if (!product.isOutOfStock) {
                  handleAddToCart(); 
                }
              }}
              disabled={product.isOutOfStock}
              className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-2 ${product.isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
                  : 'bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-1 active:scale-95'
                }`}
            >
              {product.isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* 🌟 REVIEWS SECTION */}
        <div className="bg-white rounded-[3rem] p-6 lg:p-12 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <MessageSquare className="text-brand" /> Customer Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
              {product.reviews && product.reviews.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-3xl text-center border border-gray-100">
                  <span className="text-4xl block mb-3">🌟</span>
                  <h3 className="font-bold text-gray-900">No reviews yet</h3>
                  <p className="text-gray-500 text-sm">Be the first to review this product!</p>
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-black text-gray-900">{review.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                    <p className="text-xs text-gray-400 mt-4 font-bold">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-brand/5 p-8 rounded-3xl border border-brand/10 h-fit">
              <h3 className="text-xl font-black text-gray-900 mb-2">Write a Review</h3>
              <p className="text-gray-500 text-sm mb-6">Share your experience with other customers.</p>

              {user ? (
                <form onSubmit={submitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Your Rating</label>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((starNumber) => (
                        <button
                          key={starNumber}
                          type="button"
                          onClick={() => setRating(starNumber)}
                          onMouseEnter={() => setHoverRating(starNumber)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={32}
                            fill={starNumber <= (hoverRating || rating) ? '#FBBF24' : 'none'}
                            className={starNumber <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>

                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Comment</label>
                    <textarea
                      required
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like about this product?"
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/30 outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    disabled={reviewLoading}
                    type="submit"
                    className="w-full py-4 bg-brand text-white font-black rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4 font-medium">Please log in to share your thoughts.</p>
                  <button onClick={() => navigate('/login')} className="px-6 py-3 bg-white text-brand border border-brand/20 font-bold rounded-xl hover:bg-brand hover:text-white transition-all">
                    Login to Review
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}