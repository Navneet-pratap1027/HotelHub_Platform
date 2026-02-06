import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../components/CategoryBar"; 
import API from "../api"; 
import { useAuth } from "../context/AuthContext"; 
import { Star, Edit3, Trash2, Home as HomeIcon } from "lucide-react"; 
import toast from "react-hot-toast";

export default function Home() {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTax, setShowTax] = useState(false);

  // 1. Fetch Listings Logic
  const fetchListings = async (category = "Trending") => {
    setLoading(true);
    try {
      const endpoint = category === "Trending" ? "/listings" : `/listings/filter/${category}`;
      const res = await API.get(endpoint);
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching listings:", err);
      // Agar backend se error aaye toh empty array set karein
      setListings([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // 2. Price calculation (18% Tax)
  const calculateFinalPrice = (originalPrice) => {
    return showTax ? originalPrice * 1.18 : originalPrice;
  };

  // 3. Delete Listing Function
  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      // ✅ Dynamic request using API instance
      await API.delete(`/listings/${id}`);
      setListings(listings.filter((l) => l._id !== id));
      toast.success("Listing deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete listing");
    }
  };

  return (
    <div className="bg-white min-h-screen font-['Plus_Jakarta_Sans',_sans-serif]">
      
      {/* CategoryBar */}
      <CategoryBar 
        showTax={showTax} 
        setShowTax={setShowTax} 
        onCategoryChange={(cat) => fetchListings(cat)} 
      />

      <main className="max-w-[1600px] mx-auto px-4 md:px-10 mt-8 mb-20">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
            <p className="text-gray-500 font-medium animate-pulse">HotelHub is finding your next stay...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
            {listings.length > 0 ? (
              listings.map((listing) => (
                <div 
                  key={listing._id} 
                  onClick={() => navigate(`/listings/${listing._id}`)}
                  className="group cursor-pointer"
                >
                  {/* Image Card */}
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-3 shadow-sm bg-gray-100">
                    <img 
                      src={listing.image?.url || "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop"} 
                      alt={listing.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* OWNER ACTIONS */}
                    {user && listing.owner && (listing.owner._id === user._id || listing.owner === user._id) && (
                      <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/listings/${listing._id}/edit`); }}
                          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 text-gray-700 transition active:scale-90"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(listing._id, e)}
                          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 text-red-500 transition active:scale-90"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    <button className="absolute top-3 right-3 text-white/90 hover:text-white transition group-hover:scale-110 duration-200">
                      <i className="fa-regular fa-heart text-2xl drop-shadow-lg"></i>
                    </button>
                  </div>

                  {/* Listing Details */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-[15px] truncate text-gray-900 pr-2">
                        {listing.location}, {listing.country}
                      </h3>
                      <div className="flex items-center gap-1 text-sm font-semibold shrink-0">
                        <Star size={12} fill="currentColor" className="text-black" /> 
                        <span>4.85</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-[15px] line-clamp-1">{listing.title}</p>
                    <p className="text-gray-400 text-[14px]">Jan 10 - 15</p>
                    
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-bold text-[16px]">
                        ₹{calculateFinalPrice(listing.price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-gray-600 font-normal text-sm">night</span>
                      
                      {showTax && (
                        <span className="ml-1 text-[#FF385C] text-[12px] font-bold uppercase tracking-wider">
                          +18% tax
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <div className="bg-gray-200 p-4 rounded-full mb-4">
                  <HomeIcon size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">No properties found</h3>
                <p className="text-gray-500 mt-1">Try switching categories or add a new home!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}