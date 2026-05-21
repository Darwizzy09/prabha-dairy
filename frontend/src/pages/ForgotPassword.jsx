import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('https://prabha-dairy.vercel.app/api/auth/forgotpassword', { email });
      setIsSent(true);
      toast.success('Reset link sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] p-8 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
        
        <Link to="/login" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-brand transition-colors mb-6">
          <ArrowLeft size={16} className="mr-1" /> Back to Login
        </Link>

        <h2 className="text-3xl font-black text-gray-900 mb-2">Reset Password</h2>
        
        {isSent ? (
          <div className="bg-green-50 rounded-2xl p-6 text-center mt-6">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} />
            </div>
            <h3 className="text-lg font-bold text-green-800 mb-2">Check your inbox</h3>
            <p className="text-green-600 text-sm font-medium">
              We've sent a password reset link to <strong>{email}</strong>. The link will expire in 15 minutes.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-8 font-medium">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand/30 outline-none transition-all font-medium"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-brand text-white rounded-2xl font-black text-lg shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}