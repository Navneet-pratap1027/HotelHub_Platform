import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Star, MessageSquare, Send, Trash2, User, Compass, UtensilsCrossed, Wifi, Car, Tv } from "lucide-react";

const MAP_TOKEN = import.meta.env.VITE_MAP_TOKEN || import.meta.env.MAP_TOKEN;

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    // --- DEBUGGING LOGS START ---
    console.log("Token Loaded:", MAP_TOKEN ? "Yes" : "No");
    console.log("Coordinates:", listing?.geometry?.coordinates);
    // --- DEBUGGING LOGS END ---

    if (!loading && listing?.geometry?.coordinates && MAP_TOKEN && mapContainer.current) {
      mapboxgl.accessToken = MAP_TOKEN;
      
      if (mapInstance.current) return;

      try {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: listing.geometry.coordinates,
          zoom: 13,
          trackResize: true 
        });

        mapInstance.current = map;

        map.on('load', () => {
          map.resize();
          console.log("Map successfully resized");
        });

        new mapboxgl.Marker({ color: "#fe424d" })
          .setLngLat(listing.geometry.coordinates)
          .addTo(map);

        map.addControl(new mapboxgl.NavigationControl());
      } catch (error) {
        console.error("Mapbox init error:", error);
      }

      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    }
  }, [loading, listing]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    alert(`Review Submitted: ${newRating} Stars - ${newComment}`);
    setNewComment("");
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-[#fe424d] font-bold">Loading...</div>;
  if (!listing) return <div className="text-center mt-20">Listing not found!</div>;

  return (
    <div className="max-w-[1100px] mx-auto p-4 md:px-8 mt-4 font-sans text-gray-900">
      <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
      <div className="rounded-3xl overflow-hidden shadow-xl h-[450px] mb-10">
        <img src={listing.image?.url} className="w-full h-full object-cover" alt="Property" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold border-b pb-4 italic text-gray-700">Hosted by {listing.owner?.username}</h2>
          <p className="py-8 text-gray-700 leading-relaxed border-b italic text-lg">"{listing.description}"</p>

          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <MessageSquare className="text-[#fe424d]" /> Reviews & Feedback
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-gray-50 p-6 rounded-3xl border shadow-sm h-fit">
                <p className="font-bold mb-4 text-gray-800">Leave a Review</p>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star
                        key={num}
                        size={24}
                        className={`cursor-pointer ${num <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        onClick={() => setNewRating(num)}
                      />
                    ))}
                  </div>
                  <textarea
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tell us about your stay..."
                    className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-[#fe424d] h-28 resize-none"
                  />
                  <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-2xl font-bold hover:bg-black transition">
                    Submit Review
                  </button>
                </form>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {listing.reviews?.length > 0 ? (
                  listing.reviews.map((rev) => (
                    <div key={rev._id} className="p-5 border rounded-2xl bg-white shadow-sm relative group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-rose-50 p-2 rounded-full"><User size={16} className="text-[#fe424d]"/></div>
                        <p className="font-bold text-sm">@{rev.author?.username || "Guest"}</p>
                      </div>
                      <div className="flex text-yellow-400 text-xs mb-2">{"★".repeat(rev.rating)}</div>
                      <p className="text-gray-600 text-sm italic leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-center py-10">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="py-12 border-t mt-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Compass className="text-[#fe424d]" /> Where you'll stay
            </h3>
            <p className="text-gray-500 mb-6 font-medium">{listing.location}, {listing.country}</p>
            <div 
              ref={mapContainer} 
              style={{ height: '400px', width: '100%' }}
              className="rounded-3xl border-2 border-gray-100 shadow-lg bg-gray-50 overflow-hidden" 
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-28 border border-gray-100 rounded-3xl p-8 shadow-2xl bg-white space-y-6">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold text-gray-900">₹{listing.price?.toLocaleString("en-IN")}</span>
              <span className="text-gray-500">night</span>
            </div>
            <button className="w-full bg-[#fe424d] text-white py-4 rounded-2xl font-bold text-xl hover:bg-[#e03a44] transition-all active:scale-95">
              Book Now
            </button>
            <div className="pt-4 border-t text-sm text-gray-500 italic space-y-2">
                <p className="flex justify-between"><span>Service fee</span><span>₹500</span></p>
                <p className="flex justify-between font-bold text-black border-t pt-2 mt-2"><span>Total</span><span>₹{listing.price + 500}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}