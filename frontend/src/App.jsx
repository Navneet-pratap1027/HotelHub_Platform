import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListingDetails from "./pages/ListingDetails";
import NewListing from "./pages/NewListing"; 
import EditListing from "./pages/EditListing"; 
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup"; 
import Login from "./pages/Login";
import Footer from "./components/Footer"; 
import Flash from "./components/Flash";

function App() {
  // Flash alert state
  const [flash, setFlash] = useState({ message: "", type: "" });

  const showFlash = (msg, type = "success") => {
    setFlash({ message: msg, type: type });
    setTimeout(() => setFlash({ message: "", type: "" }), 4000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Plus_Jakarta_Sans',_sans-serif]">
      
      {/* Navbar */}
      <Navbar />
      
      {/* Global Flash Messages (Floats over content) */}
      <Flash 
        message={flash.message} 
        type={flash.type} 
        onClose={() => setFlash({ message: "", type: "" })} 
      />

      <main className="flex-grow">
        <Routes>
          {/* Home Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Home />} />

          {/* Create New Listing */}
          <Route path="/listings/new" element={<NewListing showFlash={showFlash} />} />
          
          {/* 2. EDIT LISTING ROUTE (Naya add kiya gaya hai) */}
          <Route path="/listings/:id/edit" element={<EditListing showFlash={showFlash} />} />
          
          {/* Listing Detail Route */}
          <Route path="/listings/:id" element={<ListingDetails />} />
          
          {/* Auth Routes */}
          <Route path="/signup" element={<Signup showFlash={showFlash} />} />
          <Route path="/login" element={<Login showFlash={showFlash} />} />
          
          {/* 404 Route */}
          <Route path="*" element={
            <div className="text-center mt-20">
              <h2 className="text-4xl font-bold text-[#FF385C]">404</h2>
              <p className="text-xl text-gray-500 mt-2 font-medium">Page Not Found!</p>
            </div>
          } />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;