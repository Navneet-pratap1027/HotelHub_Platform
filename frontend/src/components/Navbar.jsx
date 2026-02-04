import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Search, 
  Menu, 
  UserCircle, 
  UserPlus, 
  LogIn, 
  LogOut, 
  PlusCircle, 
  MessageSquare 
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path) => {
    setIsDropdownOpen(false);
    if (!user && (path === "/listings/new" || path === "/chat")) {
      navigate("/login", { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-white border-b-2 border-[#FF385C] sticky top-0 z-[100] py-2 px-4 md:px-10">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        
        {/* 1. Logo Section */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/images/logo.png" 
              alt="logo" 
              className="w-[45px] h-[45px] rounded-full object-cover border-none shadow-sm" 
            />
            <h1 className="text-[#FF385C] text-2xl font-bold tracking-tighter hidden sm:block">
              HotelHub
            </h1>
          </Link>
        </div>

        {/* 2. Search Bar Section */}
        <div className="flex-grow max-w-xl mx-auto hidden md:block px-6">
          <form className="relative flex items-center">
            <input
              type="text"
              placeholder="Search Location   |   Title   |   Price"
              className="w-full border border-gray-300 rounded-[25px] py-2.5 px-12 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF385C] shadow-sm"
            />
            <button 
              type="submit"
              className="absolute right-1 bg-[#fe424d] text-white rounded-[25px] px-5 py-1.5 flex items-center gap-2 hover:bg-[#e03a44] transition-all shadow-sm cursor-pointer"
            >
              <Search size={14} strokeWidth={3} />
              <span className="text-sm font-bold">Search</span>
            </button>
          </form>
        </div>

        {/* 3. User Dropdown & Roles */}
        <div className="flex items-center gap-3">
          
          {/* Become a Host Button */}
          <button 
            onClick={() => handleNav("/listings/new")}
            className="hidden md:block text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-full transition-all cursor-pointer"
          >
            {user?.role === "owner" || user?.role === "admin" 
              ? "Add New Home" 
              : "HotelHub your home"}
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 border border-gray-300 rounded-full p-1.5 pl-3 hover:shadow-md transition bg-white z-50 cursor-pointer"
            >
              <Menu size={18} className="text-gray-600" />
              <div className="text-white bg-[#FF385C] rounded-full p-1 shadow-inner">
                  {user ? (
                    <div className="w-[22px] h-[22px] flex items-center justify-center font-bold text-[10px]">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <UserCircle size={22} />
                  )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
                  
                  {!user ? (
                    <div className="flex flex-col">
                      <button onClick={() => handleNav("/signup")} className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 flex items-center gap-3 font-bold cursor-pointer">
                        <UserPlus size={18} className="text-[#FF385C]" /> Sign up
                      </button>
                      <button onClick={() => handleNav("/login")} className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 flex items-center gap-3 font-medium cursor-pointer">
                        <LogIn size={18} className="text-gray-400" /> Log in
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                        Welcome, {user.username}
                        <span className="ml-2 px-1 py-0.5 bg-gray-100 rounded text-[#FF385C] border border-gray-200">
                          {user.role}
                        </span>
                      </div>
                      <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-3 font-bold cursor-pointer">
                        <LogOut size={18} /> Log out
                      </button>
                    </div>
                  )}

                  <hr className="my-2 border-gray-100" />

                  <button onClick={() => handleNav("/listings/new")} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-semibold cursor-pointer">
                    <PlusCircle size={18} className="text-gray-400" /> Add New Home
                  </button>
                  
                  <button onClick={() => handleNav("/chat")} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-semibold cursor-pointer">
                    <MessageSquare size={18} className="text-gray-400" /> Chat with AI
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}