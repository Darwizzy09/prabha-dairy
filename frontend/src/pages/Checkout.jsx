import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, MapPin, Phone, User as UserIcon, CheckCircle, ShoppingBag, Loader2, Trash2, Plus, Minus, CreditCard, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';

export default function Checkout() {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const LOCAL_PINCODES = ['431001', '431002', '431003', '431005', '431006', '431009']; 
  const NATIONAL_CATEGORIES = ['Ghee', 'Shrikhand', 'Sweets']; // Add any

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: user ? user.name : '',
    customerEmail: user ? user.email : '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: '' 
  });

  const getSafeQuantity = (item) => Number(item.quantity) || 1;
  const getSafePrice = (item) => Number(item.price) || 0;

  const getSafeMRP = (item) => Number(item.mrp) || Number(item.price) || 0; 
  const totalMRP = cartItems.reduce((total, item) => total + (getSafeMRP(item) * getSafeQuantity(item)), 0);
  const totalAmount = cartItems.reduce((total, item) => total + (getSafePrice(item) * getSafeQuantity(item)), 0);
  const discount = totalMRP - totalAmount;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 2) {
      if (!formData.customerName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
        toast.error("Please fill in all delivery details");
        return;
      }
      
      if (!formData.paymentMethod) {
        toast.error("Please select a payment method to continue");
        return;
      }

      // THE SMART PINCODE VALIDATOR LOGIC
      const pin = formData.pincode.trim();
      
      if (pin.length !== 6 || isNaN(pin)) {
        toast.error("Please enter a valid 6-digit Indian Pincode");
        return;
      }

      const isLocalPincode = LOCAL_PINCODES.includes(pin);

      const localItemsInCart = cartItems.filter(item => !NATIONAL_CATEGORIES.includes(item.category));

      if (localItemsInCart.length > 0 && !isLocalPincode) {
        const itemNames = localItemsInCart.map(i => i.name).join(', ');
        toast.error(
          `Sorry! We only deliver fresh items (${itemNames}) locally. Please remove them to ship Ghee/Shrikhand nationwide.`,
          { duration: 5000, icon: '🚚' }
        );
        return; 
      }
    }
    
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formattedItems = cartItems.map(item => ({
      name: item.name,
      price: getSafePrice(item),
      quantity: getSafeQuantity(item),
      size: item.selectedSize || item.stock // 👉 Save the size to the backend order
    }));

    const fullAddress = `${formData.address}, ${formData.city}, Pincode: ${formData.pincode}`;

    const orderPayload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      phone: formData.phone,
      address: fullAddress,
      items: formattedItems,
      totalAmount: totalAmount,
      paymentMethod: formData.paymentMethod
    };

    try {
      if (formData.paymentMethod === 'Cash on Delivery') {
        await axios.post('https://prabha-dairy.vercel.app/api/orders', orderPayload);
        
        sessionStorage.setItem('recentOrder', JSON.stringify(orderPayload));
        clearCart();
        setIsSubmitting(false);
        
        navigate(`/payment-success?order_id=COD-${Date.now()}`);

      } else {
        if (!user) {
          toast.error("Please login to pay online!");
          setIsSubmitting(false);
          return;
        }

        const toastId = toast.loading("Connecting securely to Cashfree...");
        
        await axios.post('https://prabha-dairy.vercel.app/api/orders', orderPayload);

        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await axios.post('https://prabha-dairy.vercel.app/api/payment/create-order', {
          orderAmount: totalAmount,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail || "guest@prabhadairy.com",
          customerPhone: formData.phone
        }, config);

        const { payment_session_id } = response.data;
        
        const cashfree = await load({ mode: "production" }); 
        toast.dismiss(toastId);

        let checkoutOptions = {
          paymentSessionId: payment_session_id,
          redirectTarget: "_self", 
        };

        sessionStorage.setItem('recentOrder', JSON.stringify(orderPayload));
        clearCart(); 
        
        cashfree.checkout(checkoutOptions);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Failed to process order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FDFBF7] p-4 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 shrink-0" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any fresh dairy to your cart yet.</p>
        <Link to="/shop" className="bg-brand text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-1 active:scale-95 transition-all duration-300">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* WIZARD STEPPER */}
        <div className="max-w-3xl mx-auto mb-12 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand rounded-full z-0 transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>

            {[{ num: 1, label: 'Cart' }, { num: 2, label: 'Address' }, { num: 3, label: 'Review' }].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 ${step >= s.num ? 'bg-brand text-white shadow-lg shadow-brand/30 scale-110' : 'bg-white text-gray-400 border-2 border-gray-200'}`}>
                  {step > s.num ? <CheckCircle size={20} /> : s.num}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-brand-dark' : 'text-gray-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          <div className="w-full lg:w-2/3 space-y-6">

            {/* --- STEP 1: CART ITEMS --- */}
            {step === 1 && (
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 animate-in slide-in-from-left-8 duration-500">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-black text-gray-900">Shopping Cart</h2>
                  <span className="text-gray-500 font-bold">{cartItems.length} Items</span>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-brand/30 hover:shadow-md transition-all group bg-[#FDFBF7]/50">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-4xl group-hover:scale-110 transition-transform">🥛</span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">{item.category || 'Dairy'}</p>
                            <h3 className="font-bold text-gray-900 sm:text-lg leading-tight">{item.name}</h3>
                            {/* 👉 UPDATED: Now shows selectedSize if it exists */}
                            <p className="text-sm text-gray-500 mt-0.5">{item.selectedSize || item.stock}</p>
                          </div>
                          <button
                            /* 👉 UPDATED: Uses cartItemId */
                            onClick={() => removeFromCart(item.cartItemId || item._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex justify-between items-end mt-2">
                          <div>
                            {getSafeMRP(item) > getSafePrice(item) && (
                              <p className="text-xs text-gray-400 line-through font-bold">₹{getSafeMRP(item)}</p>
                            )}
                            <p className="font-black text-lg text-gray-900">₹{getSafePrice(item)}</p>
                          </div>

                          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                            <button
                              onClick={() => {
                                if (getSafeQuantity(item) > 1) {
                                  /* 👉 UPDATED: Uses cartItemId */
                                  decreaseQuantity(item.cartItemId || item._id);
                                } else {
                                  removeFromCart(item.cartItemId || item._id);
                                }
                              }}
                              className="p-1 text-gray-500 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-4 text-center font-bold text-sm text-gray-900">
                              {getSafeQuantity(item)}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="p-1 text-gray-500 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- STEP 2: ADDRESS & PAYMENT --- */}
            {step === 2 && (
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <button onClick={prevStep} className="p-2 bg-gray-50 text-gray-500 hover:text-brand rounded-full transition-colors active:scale-95"><ArrowLeft size={20} /></button>
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2"><MapPin className="text-brand" /> Delivery Details</h2>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><UserIcon className="w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" /> Full Name</label>
                      <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/30 outline-none transition-all" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" /> Phone Number</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/30 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-bold text-gray-700">Complete Address (House No, Street)</label>
                    <textarea required name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/30 outline-none transition-all resize-none"></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">City</label>
                      <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/30 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Pincode</label>
                      <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/30 outline-none transition-all" />
                      <p className="text-[10px] font-bold text-gray-400 mt-1">
                        *Fresh Milk/Paneer restricted to Sambhajinagar. Ghee ships Nationwide.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="text-brand" /> Payment Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${formData.paymentMethod === 'Cash on Delivery' ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-brand/30'}`}>
                        <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={formData.paymentMethod === 'Cash on Delivery'} onChange={handleChange} className="w-4 h-4 text-brand focus:ring-brand" />
                        <span className="font-bold text-gray-800">Cash on Delivery</span>
                      </label>
                      <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${formData.paymentMethod === 'Online Payment' ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-brand/30'}`}>
                        <input type="radio" name="paymentMethod" value="Online Payment" checked={formData.paymentMethod === 'Online Payment'} onChange={handleChange} className="w-4 h-4 text-brand focus:ring-brand" />
                        <span className="font-bold text-gray-800">Online UPI / Card</span>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* --- STEP 3: REVIEW --- */}
            {step === 3 && (
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <button onClick={prevStep} className="p-2 bg-gray-50 text-gray-500 hover:text-brand rounded-full transition-colors active:scale-95"><ArrowLeft size={20} /></button>
                  <h2 className="text-2xl font-black text-gray-900">Review Your Order</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                    <button onClick={() => setStep(2)} className="absolute top-4 right-4 text-xs font-bold text-brand hover:underline">Edit</button>
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> Deliver to</h3>
                    <p className="text-gray-700 font-medium">{formData.customerName}</p>
                    <p className="text-gray-500 text-sm">{formData.address}, {formData.city} - {formData.pincode}</p>
                    <p className="text-gray-500 text-sm mt-1">{formData.phone}</p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                    <button onClick={() => setStep(2)} className="absolute top-4 right-4 text-xs font-bold text-brand hover:underline">Edit</button>
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CreditCard size={16} className="text-gray-400" /> Payment</h3>
                    <p className="text-gray-700 font-medium">{formData.paymentMethod}</p>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Items inside</h3>
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-black text-sm">{getSafeQuantity(item)}x</span>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                          {/* 👉 UPDATED: Shows size */}
                          <p className="text-xs text-gray-500 mt-0.5">{item.selectedSize || item.stock}</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-600">₹{getSafePrice(item) * getSafeQuantity(item)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: STICKY ORDER SUMMARY         */}
          {/* ========================================== */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 sticky top-28 animate-in slide-in-from-bottom-12 duration-700">
              <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex gap-3 items-center">
                      <span className="w-8 h-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-black text-sm">
                        {getSafeQuantity(item)}x
                      </span>
                      <div>
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</p>
                        {/* 👉 UPDATED: Shows size safely */}
                        <p className="text-xs text-gray-500">{item.selectedSize || item.stock ? `${item.selectedSize || item.stock} • ` : ''}₹{getSafePrice(item)} each</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900">₹{getSafePrice(item) * getSafeQuantity(item)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Total MRP ({cartItems.length} items)</span>
                  <span className="line-through text-gray-400">₹{totalMRP}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500 font-bold">
                    <span>Discount on MRP</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Delivery Fee</span>
                  <span className="text-brand font-bold">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-black text-gray-900 pt-4 border-t border-gray-100 mb-6">
                <span>Total Amount</span>
                <span className="text-brand">₹{totalAmount}</span>
              </div>

              {step === 1 && (
                <button onClick={nextStep} className="w-full py-4 bg-brand text-white rounded-xl font-black text-lg shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
                  Proceed to Details <ChevronRight size={20} />
                </button>
              )}

              {step === 2 && (
                <button onClick={nextStep} className="w-full py-4 bg-brand text-white rounded-xl font-black text-lg shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
                  Proceed to Review <ChevronRight size={20} />
                </button>
              )}

              {step === 3 && (
                <button onClick={handleSubmit} disabled={isSubmitting} className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-white shadow-xl shadow-green-500/20 hover:bg-green-600 hover:-translate-y-1 active:scale-95'}`}>
                  {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin shrink-0" /> Processing...</> : <>Place Order <CheckCircle size={20} /></>}
                </button>
              )}

              {discount > 0 && (
                <p className="text-center text-xs font-bold text-green-500 mt-4 bg-green-50 py-2 rounded-lg">
                  YOU ARE SAVING ₹{discount} ON THIS ORDER!
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}