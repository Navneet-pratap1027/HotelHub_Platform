import React, { useState } from "react";
import { X, Home, Building2, Landmark, Hotel, Check, Star, MapPin, ShieldAlert, Languages } from "lucide-react";

export default function FilterModal({ isOpen, onClose }) {
  const [selectedType, setSelectedType] = useState("Any type");
  const [selectedProp, setSelectedProp] = useState("");
  const [selections, setSelections] = useState([]);

  if (!isOpen) return null;

  const toggleSelection = (name) => {
    setSelections(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  // Common UI Styles
  const sectionTitle = "text-[22px] font-bold text-gray-900 mb-1 flex items-center gap-2";
  const sectionDesc = "text-gray-500 text-sm mb-6 ml-1";
  const checkboxBox = "w-6 h-6 border-2 rounded-md transition-all duration-200 flex items-center justify-center cursor-pointer";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-white sticky top-0 z-10">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all cursor-pointer text-gray-600">
            <X size={22} />
          </button>
          <h2 className="font-extrabold text-lg tracking-tight">Filters</h2>
          <div className="w-10"></div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-8 space-y-10 custom-scrollbar bg-[#fcfcfc]">
          
          {/* 1. Type of Place */}
          <section>
            <h3 className={sectionTitle}>Type of place</h3>
            <p className={sectionDesc}>Search rooms, entire homes or any type of place.</p>
            <div className="flex w-full border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
              {["Any type", "Room", "Entire home"].map((type) => (
                <button 
                  key={type} 
                  onClick={() => setSelectedType(type)}
                  className={`flex-1 py-4 font-bold text-[15px] transition-all duration-300 border-r last:border-0 cursor-pointer
                    ${selectedType === type 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          {/* 2. Guest Favourites - Improved Style (No Toggle) */}
          <section className="border-t pt-10">
            <div 
              onClick={() => toggleSelection('guest_fav')}
              className={`flex items-center gap-4 border-2 p-6 rounded-3xl transition-all cursor-pointer group bg-white shadow-sm
                ${selections.includes('guest_fav') ? 'border-black ring-1 ring-black' : 'border-gray-100 hover:border-black'}`}
            >
              <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-gray-100 transition-colors">
                <Star size={32} fill="#FF385C" stroke="#FF385C" className="opacity-90" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Guest favourites
                  {selections.includes('guest_fav') && <Check size={18} className="text-[#108954]" strokeWidth={3} />}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[320px]">
                  The most loved homes on HotelHub, according to guests
                </p>
              </div>
            </div>
          </section>

          {/* 3. Property Type */}
          <section className="border-t pt-10">
            <h3 className={sectionTitle}>Property type</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { name: "House", icon: <Home size={34} /> },
                { name: "Flat", icon: <Building2 size={34} /> },
                { name: "Guest house", icon: <Landmark size={34} /> },
                { name: "Hotel", icon: <Hotel size={34} /> },
              ].map((prop) => (
                <button 
                  key={prop.name}
                  onClick={() => setSelectedProp(prop.name)}
                  className={`flex flex-col items-start p-5 border-2 rounded-2xl transition-all cursor-pointer gap-8 group bg-white shadow-sm
                    ${selectedProp === prop.name ? "border-black bg-gray-50 ring-1 ring-black" : "border-gray-200 hover:border-black hover:shadow-md"}`}
                >
                  <span className="text-gray-800 group-hover:scale-110 transition-transform">{prop.icon}</span>
                  <span className="font-bold text-sm">{prop.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 4. Locations */}
          <section className="border-t pt-10">
            <h3 className={sectionTitle}><MapPin size={22} className="text-red-500" /> Locations</h3>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {["Beachfront", "Waterfront", "Ski-in/out", "Country side"].map((loc) => (
                <label key={loc} className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-black hover:bg-white transition-all cursor-pointer group shadow-sm bg-white">
                  <div onClick={() => toggleSelection(loc)} className={`${checkboxBox} ${selections.includes(loc) ? "bg-black border-black" : "border-gray-300 group-hover:border-black"}`}>
                    {selections.includes(loc) && <Check size={16} className="text-white" />}
                  </div>
                  <span className="font-semibold text-gray-700">{loc}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 5. Safety */}
          <section className="border-t pt-10">
            <h3 className={sectionTitle}><ShieldAlert size={22} className="text-orange-500" /> Safety</h3>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {["Smoke allowed", "Carbon mono-oxide", "First aid kit"].map((safe) => (
                <label key={safe} className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-black hover:bg-white transition-all cursor-pointer group shadow-sm bg-white">
                  <div onClick={() => toggleSelection(safe)} className={`${checkboxBox} ${selections.includes(safe) ? "bg-black border-black" : "border-gray-300 group-hover:border-black"}`}>
                    {selections.includes(safe) && <Check size={16} className="text-white" />}
                  </div>
                  <span className="font-semibold text-gray-700">{safe}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 6. Host Language */}
          <section className="border-t pt-10 pb-6">
            <h3 className={sectionTitle}><Languages size={22} className="text-blue-500" /> Host language</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {["English", "German", "French", "Japanese", "Hindi"].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => toggleSelection(lang)}
                  className={`py-3 px-4 border-2 rounded-xl font-bold text-sm transition-all cursor-pointer
                    ${selections.includes(lang) ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-black text-gray-600"}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t flex items-center justify-between bg-white sticky bottom-0 z-10 shadow-inner">
          <button 
            onClick={() => {setSelectedType("Any type"); setSelectedProp(""); setSelections([]);}} 
            className="underline font-extrabold text-gray-800 hover:bg-gray-100 px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Clear all
          </button>
          
          <button className="bg-[#108954] hover:bg-[#0d6e44] text-white px-12 py-3.5 rounded-2xl font-black text-[15px] shadow-lg shadow-green-100 transition-all active:scale-95 cursor-pointer">
            Show properties
          </button>
        </div>
      </div>
    </div>
  );
}