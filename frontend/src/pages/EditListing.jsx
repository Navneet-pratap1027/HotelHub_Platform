import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import { Camera, MapPin, IndianRupee, Globe, Info, Sparkles, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function EditListing() {
  const { id } = useParams();
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

  // 1. Purana data fetch karein taaki form bhara hua dikhe
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await API.get(`/listings/${id}`);
        const data = res.data;
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          country: data.country,
          category: data.category || "Trending"
        });
      } catch (err) {
        toast.error("Error loading listing data");
        navigate("/");
      }
    };
    fetchListing();
  }, [id, navigate]);

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
    data.append("listing[title]", formData.title);
    data.append("listing[description]", formData.description);
    data.append("listing[price]", formData.price);
    data.append("listing[location]", formData.location);
    data.append("listing[country]", formData.country);
    data.append("listing[category]", formData.category);
    if (image) data.append("listing[image]", image);

    try {
      const res = await API.put(`/listings/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Listing updated successfully!");
        navigate(`/listings/${id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden">
        
        {/* Header - Edit Style */}
        <div className="bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-black mb-1 flex items-center gap-3">
            <Edit3 className="text-blue-400" size={24} /> Edit Listing
          </h2>
          <p className="text-slate-400 font-medium text-xs">Update your property details.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div>
            <label className="block text-[14px] font-bold text-slate-700 mb-2">Title</label>
            <input 
              required name="title" value={formData.title} onChange={handleChange} 
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#FF385C] outline-none transition-all" 
            />
          </div>

          <div>
            <label className="block text-[14px] font-bold text-slate-700 mb-2">Description</label>
            <textarea 
              required name="description" value={formData.description} onChange={handleChange} rows="3" 
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#FF385C] outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-bold text-slate-700 mb-2 flex items-center gap-1">
                <IndianRupee size={14} /> Price
              </label>
              <input 
                required name="price" type="number" value={formData.price} onChange={handleChange} 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" 
              />
            </div>

            <div>
              <label className="block text-[14px] font-bold text-slate-700 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none cursor-pointer font-semibold text-slate-600">
                <option value="Trending">Trending</option>
                <option value="Rooms">Rooms</option>
                <option value="Mountains">Mountains</option>
                <option value="Amazing Pools">Amazing Pools</option>
                <option value="Camping">Camping</option>
                <option value="Luxe">Luxe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-bold text-slate-700 mb-2 flex items-center gap-1">
                <MapPin size={14} /> Location
              </label>
              <input 
                required name="location" value={formData.location} onChange={handleChange} 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" 
              />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-slate-700 mb-2 flex items-center gap-1">
                <Globe size={14} /> Country
              </label>
              <input 
                required name="country" value={formData.country} onChange={handleChange} 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-slate-700 mb-2">Photo (Leave empty to keep current)</label>
            <label className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-black transition-all cursor-pointer block bg-slate-50 group">
              <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
              <Camera className="mx-auto mb-2 text-slate-400 group-hover:text-black transition-colors" size={32} />
              <p className="text-[13px] font-bold text-gray-600 group-hover:text-black">
                {image ? image.name : "Choose new photo"}
              </p>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl active:scale-95 disabled:bg-slate-300 flex justify-center items-center gap-2"
          >
            {loading ? "Updating..." : <><Save size={20} /> Update Listing</>}
          </button>
        </form>
      </div>
    </div>
  );
}

// Upar imports mein 'Edit3' miss ho gaya tha, ise add kar lein:
import { Edit3 } from "lucide-react";