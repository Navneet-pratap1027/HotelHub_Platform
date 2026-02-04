import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api"; // Purana axios import hata kar apna API instance use karein

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // API instance use karne se baseURL aur cookies automatic handle honge
      const res = await API.post("/auth/signup", formData);
      alert("Account created successfully! Welcome to Wanderlust.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const googleLogin = () => {
    // Google login ke liye direct window location hi best hai
    // Note: Backend port 3000 hai aur route /auth/google hai
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-800 tracking-tight">Join HotelHub</h2>
      <p className="text-gray-500 text-center mb-8">Create an account to book unique stays</p>

      {/* Google Signup Button */}
      <button 
        onClick={googleLogin}
        className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 p-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-6 active:scale-95"
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
          className="p-3 border rounded-xl outline-rose-500 bg-gray-50 focus:bg-white transition-all"
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        <input 
          type="email" placeholder="Email" required
          className="p-3 border rounded-xl outline-rose-500 bg-gray-50 focus:bg-white transition-all"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" required
          className="p-3 border rounded-xl outline-rose-500 bg-gray-50 focus:bg-white transition-all"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button className="bg-rose-500 text-white p-3 rounded-xl font-bold text-lg hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all mt-2 active:scale-95">
          Create Account
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Already have an account? <Link to="/login" className="text-rose-500 font-bold hover:underline">Log in</Link>
      </p>
    </div>
  );
}