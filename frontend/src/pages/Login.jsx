import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import API from "../api";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showError, setShowError] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect logic check
  const fromAddListing = location.state?.from === "/listings/new";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      alert("Welcome back!");
      navigate("/");
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Invalid username or password");
    }
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    /* h-screen aur flex-col se page center hoga */
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 bg-white">
      
      {/* 1. Red Alert Box - Bilkul Form ke upar center mein */}
      {fromAddListing && showError && (
        <div className="w-full max-w-md bg-[#f8d7da] border border-[#f5c6cb] text-[#721c24] px-6 py-4 rounded-xl flex items-center justify-between mb-6 animate-in fade-in slide-in-from-top-4">
          <p className="font-medium text-sm">You must be logged in to create listing!</p>
          <button onClick={() => setShowError(false)} className="hover:opacity-60 transition">
            <X size={18} />
          </button>
        </div>
      )}

      {/* 2. Main Login Card */}
      <div className="w-full max-w-md p-2">
        <h2 className="text-3xl font-bold text-[#FF385C] mb-2 text-center tracking-tight">
          Login on HotelHub
        </h2>
        <p className="text-gray-500 text-center mb-8">Welcome back to your account</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Username / Email</label>
            <input 
              type="text" 
              required
              placeholder="Enter your username"
              className="w-full p-3.5 border border-gray-300 rounded-xl outline-none focus:border-black transition bg-gray-50 focus:bg-white shadow-sm"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="Enter your password"
              className="w-full p-3.5 border border-gray-300 rounded-xl outline-none focus:border-black transition bg-gray-50 focus:bg-white shadow-sm"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button className="w-full bg-[#108954] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#0d6e44] transition active:scale-[0.98] shadow-md mt-2">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-[#007bff] font-bold hover:underline">Sign Up</Link>
        </p>

        {/* 3. Social Login - Only Google as requested */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 border-2 border-black p-3.5 rounded-xl font-bold text-lg hover:bg-gray-50 transition active:scale-[0.98]"
          >
            <img src="https://authjs.dev/img/providers/google.svg" alt="G" className="w-6 h-6" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}