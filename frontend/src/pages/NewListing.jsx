import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { Camera, MapPin, IndianRupee, Globe, Info, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function NewListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    category: "Trending"
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    // Backend controllers ke mutabiq 'listing[field]' format use ho raha hai
    data.append("listing[title]", formData.title);
    data.append("listing[description]", formData.description);
    data.append("listing[price]", formData.price);
    data.append("listing[location]", formData.location);
    data.append("listing[country]", formData.country);
    data.append("listing[category]", formData.category);
    if (image) data.append("listing[image]", image);

    try {
      // FIX: Yahan "/api/listings" ki jagah "/listings" kiya hai 
      // kyunki base URL (api.js) mein pehle se "/api" hoga.
      const res = await API.post("/listings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Listing created! You are now an Owner.");
        navigate("/");
        // Role change Navbar mein dikhane ke liye page reload
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-black mb-1 flex items-center gap-3">
            <Sparkles className="text-yellow-400" size={24} /> List your home
          </h2>
          <p className="text-slate-400 font-medium text-xs flex items-center gap-2">
            <Info size={14} /> Fill in the details to become a host.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          {/* Title */}
          <div>
            <label className="block text-[14px] font-bold text-slate-700 mb-2">Property Title</label>
            <input 
              required name="title" onChange={handleChange} 
              placeholder="e.g. Modern Villa" 
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#FF385C] outline-none transition-all" 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[14px] font-bold text-slate-700 mb-2">Description</label>
            <textarea 
              required name="description" onChange={handleChange} rows="3" 
              placeholder="What makes your place special?" 
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#FF385C] outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-[14px] font-bold text-slate-700 mb-2 flex items-center gap-1">
                <IndianRupee size={14} /> Price per night
              </label>
              <input 
                required name="price" type="number" onChange={handleChange} 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="2500" 
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[14px] font-bold text-slate-700 mb-2">Category</label>
              <select name="category" onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none cursor-pointer font-semibold text-slate-600">
                <option value="Trending">Trending</option>
                <option value="Rooms">Rooms</option>
                <option value="Iconic Cities">Iconic Cities</option>
                <option value="Mountains">Mountains</option>
                <option value="Castles">Castles</option>
                <option value="Amazing Pools">Amazing Pools</option>
                <option value="Camping">Camping</option>
                <option value="Farms">Farms</option>
                <option value="Arctic">Arctic</option>
                <option value="Beachfront">Beachfront</option>
                <option value="Luxe">Luxe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-[14px] font-bold text-slate-700 mb-2 flex items-center gap-1">
                <MapPin size={14} /> Location
              </label>
              <input 
                required name="location" onChange={handleChange} 
                placeholder="City Name" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" 
              />
            </div>
            {/* Country */}
            <div>
              <label className="block text-[14px] font-bold text-slate-700 mb-2 flex items-center gap-1">
                <Globe size={14} /> Country
              </label>
              <input 
                required name="country" onChange={handleChange} 
                placeholder="India" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" 
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[14px] font-bold text-slate-700 mb-2">Photo</label>
            <label className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-[#FF385C] hover:bg-red-50 transition-all cursor-pointer block bg-slate-50 group">
              <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
              <Camera className="mx-auto mb-2 text-slate-400 group-hover:text-[#FF385C] transition-colors" size={32} />
              <p className="text-[13px] font-bold text-slate-600 group-hover:text-[#FF385C]">
                {image ? image.name : "Upload Photo"}
              </p>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FF385C] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#E31C5F] transition-all shadow-xl active:scale-95 disabled:bg-slate-300 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              "Publish Listing"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}