import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ListingDetails() {
  const { id } = useParams(); // URL se ID nikalne ke liye
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Details fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-20 animate-pulse text-rose-500 font-bold">Loading details...</div>;
  if (!listing) return <div className="text-center mt-20">Listing not found!</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
        <img 
          src={listing.image.url} 
          alt={listing.title} 
          className="w-full h-[450px] object-cover"
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">
            Hosted by {listing.owner?.username || "Superhost"}
          </h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            {listing.description}
          </p>
          <hr className="my-6" />
          <div className="flex items-center gap-4 text-lg font-bold">
            <span>₹{listing.price.toLocaleString("en-IN")} / night</span>
            <button className="bg-rose-500 text-white px-8 py-3 rounded-xl hover:bg-rose-600 transition shadow-md">
              Reserve Now
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 bg-white border p-6 rounded-2xl shadow-sm h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-2">Location</h3>
          <p className="text-gray-500">{listing.location}, {listing.country}</p>
          {/* Map ka component hum baad mein add karenge */}
          <div className="bg-gray-100 h-40 rounded-xl mt-4 flex items-center justify-center text-gray-400">
            Map Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}