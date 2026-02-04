import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

// 1. Context Create karein
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Check if user is logged in (On Page Load)
  const checkUser = async () => {
    try {
      // Backend route: /api/current-user
      const res = await API.get("/current-user");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // 3. Logout Function
  const logout = async () => {
    try {
      await API.get("/auth/logout");
      setUser(null);
      window.location.href = "/"; // Refresh to clear state
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // 4. Loading State (Prevents blank screen or flickering)
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
        <p className="text-rose-500 font-medium animate-pulse">Wanderlust is loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Custom Hook for easy use
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};