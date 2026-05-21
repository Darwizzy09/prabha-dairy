import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';

export default function Login() {
  // 1. Setup local "State" to remember what the user types
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 2. Handle input changes (when you type, the state updates)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. The "Submit" Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Log the user in
        await login(formData.email, formData.password);
        toast.success("Welcome back to Prabha Dairy!");
      } else {
        // Register a new user
        const { data } = await api.post('/auth/register', formData);
        // Automatically log them in after signup
        await login(formData.email, formData.password);
        toast.success("Account created successfully!");
      }
      // After success, send them to the shop
      navigate('/shop');
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#FDFBF7]">
      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-brand/5 w-full max-w-md border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-brand-dark mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLogin ? "Fresh milk is just a login away." : "Join the Prabha Dairy family today."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                required
                autoComplete="off"
                className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-brand/20 transition-all"
                onChange={handleChange}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              autoComplete="off"
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-brand/20 transition-all"
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete="new-password"
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-brand/20 transition-all"
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end mt-2 mb-4">
            <Link to="/forgotpassword" className="text-sm font-bold text-brand hover:text-brand-dark transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-brand text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
          >
            {isLogin ? "Sign In" : "Sign Up"} <ArrowRight size={20} />
          </button>
        </form>

        {/* Toggle between Login/Signup */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-brand hover:underline"
          >
            {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}