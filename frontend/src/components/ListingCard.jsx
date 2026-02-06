import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ListingCard({ listing, setListings }) {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/listings/${listing._id}`,
          { 
            withCredentials: true 
          }
        );

        // Check success response
        if (response.status === 200 || response.data.success) {
          
          setListings((prev) => prev.filter((item) => item._id !== listing._id));
          alert("Listing successfully deleted!");
        }
      } catch (error) {
        console.error("Delete Error:", error.response?.status);
        
        if (error.response?.status === 401) {
          alert("Unauthorized: Please login again as the owner.");
        } else {
          alert(error.response?.data?.message || "Delete fail ho gaya.");
        }
      }
    }
  };

  const handleCardClick = () => {
    navigate(`/listings/${listing._id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer relative"
    >
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={listing.image?.url || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000"} 
          alt={listing.title} 
          className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold z-10">
          {listing.category?.[0] || "Trending"}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 truncate">{listing.title}</h2>
        <p className="text-gray-500 text-sm">{listing.location}, {listing.country}</p>
        
        <div className="mt-4 flex justify-between items-center border-t pt-3">
          <span className="text-md font-bold text-gray-900">
            ₹{listing.price?.toLocaleString("en-IN")} <span className="text-gray-500 font-normal">/ night</span>
          </span>
          
          <div className="flex gap-3 relative z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/listings/${listing._id}/edit`);
              }}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              title="Edit"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" className="w-4 h-4" alt="edit" />
            </button>
            
            <button 
              onClick={handleDelete}
              className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition"
              title="Delete"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" className="w-4 h-4" alt="delete" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}