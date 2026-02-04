export default function ListingCard({ listing }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={listing.image.url} 
          alt={listing.title} 
          className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold">
          {listing.category[0] || "Trending"}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 truncate">{listing.title}</h2>
        <p className="text-gray-500 text-sm">{listing.location}, {listing.country}</p>
        <div className="mt-4 flex justify-between items-center border-t pt-3">
          <span className="text-md font-bold text-gray-900">₹{listing.price.toLocaleString("en-IN")} <span className="text-gray-500 font-normal">/ night</span></span>
          <button className="text-rose-500 font-semibold hover:underline">Details</button>
        </div>
      </div>
    </div>
  );
}