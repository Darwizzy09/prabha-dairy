import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams(); // 👉 Grabs the secret code from the URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setIsLoading(true);

    try {
      await axios.put(`https://prabha-dairy.vercel.app/api/auth/resetpassword/${token}`, { password });
      toast.success('Password reset successful! You can now log in.');
      navigate('/login'); // 👉 Send them straight to login
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] p-8 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-6">
          <Lock size={32} />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-2">Create New Password</h2>
        <p className="text-gray-500 mb-8 font-medium">
          Your new password must be different from previous used passwords.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                required 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand/30 outline-none transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                required 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand/30 outline-none transition-all font-medium"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-brand text-white rounded-2xl font-black text-lg shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}