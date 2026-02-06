import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api"; 

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", formData);
      
      alert("Account created successfully! Welcome to HotelHub.");
    
      navigate("/");
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-2 text-center text-[#FF385C] tracking-tight">Join HotelHub</h2>
      <p className="text-gray-500 text-center mb-8">Create an account to book unique stays</p>

      {/* Google Signup Button */}
      <button 
        onClick={googleLogin}
        className="w-full flex items-center justify-center gap-3 border-2 border-black p-3 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 mb-6 active:scale-95"
      >
        <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">Or use email</span></div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input 
          type="text" placeholder="Username" required
          className="p-3.5 border border-gray-300 rounded-xl outline-none focus:border-black bg-gray-50 focus:bg-white transition-all shadow-sm"
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        <input 
          type="email" placeholder="Email" required
          className="p-3.5 border border-gray-300 rounded-xl outline-none focus:border-black bg-gray-50 focus:bg-white transition-all shadow-sm"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" required
          className="p-3.5 border border-gray-300 rounded-xl outline-none focus:border-black bg-gray-50 focus:bg-white transition-all shadow-sm"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button className="bg-[#FF385C] text-white p-3.5 rounded-xl font-bold text-lg hover:bg-[#E31C5F] shadow-md transition-all mt-2 active:scale-95">
          Create Account
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Already have an account? <Link to="/login" className="text-[#FF385C] font-bold hover:underline">Log in</Link>
      </p>
    </div>
  );
}