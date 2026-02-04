import React, { useState } from "react";
import * as Icons from "lucide-react";
import FilterModal from "./FilterModal";

const categories = [
  { label: "Trending", icon: "Flame" },
  { label: "Rooms", icon: "Bed" },
  { label: "Iconic cities", icon: "Mountain" },
  { label: "Mountains", icon: "TreePine" },
  { label: "Castles", icon: "Castle" },
  { label: "Amazing pools", icon: "Waves" },
  { label: "Camping", icon: "Tent" },
  { label: "Farms", icon: "Tree" },
  { label: "Arctic", icon: "Snowflake" },
  { label: "Beachfront", icon: "Umbrella" },
  { label: "Desert", icon: "Cactus" },
  { label: "Boats", icon: "Ship" },
];

// Props receive kar rahe hain: showTax aur setShowTax
export default function CategoryBar({ showTax, setShowTax }) {
  const [selected, setSelected] = useState("Trending");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white sticky top-[72px] z-40 border-b border-gray-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 flex items-center justify-between gap-4 py-1">
          
          {/* 1. Icons Section */}
          <div className="flex items-center gap-10 overflow-x-auto flex-grow pt-2 pb-1 custom-red-scroll">
            {categories.map((cat) => {
              const IconComponent = Icons[cat.icon] || Icons.HelpCircle;
              const isActive = selected === cat.label;
              
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelected(cat.label)}
                  className={`flex flex-col items-center gap-2 min-w-fit transition-all pb-2 border-b-2 mt-2 group cursor-pointer outline-none ${
                    isActive 
                      ? "border-black text-black opacity-100" 
                      : "border-transparent text-gray-700 opacity-90 hover:opacity-100 hover:border-gray-300"
                  }`}
                >
                  <IconComponent size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[12px] whitespace-nowrap font-bold`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Controls Section */}
          <div className="flex items-center gap-3 ml-4">
            
            {/* Filters Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center gap-2 border border-gray-300 rounded-xl px-4 h-[52px] font-bold text-xs hover:bg-gray-50 transition shadow-sm bg-white cursor-pointer active:scale-95"
            >
              <Icons.SlidersHorizontal size={16} />
              Filters
            </button>

            {/* Tax Toggle - Ab ye Parent (Home.jsx) ki state change karega */}
            <div 
              onClick={() => setShowTax(!showTax)}
              className="hidden lg:flex items-center gap-3 border border-gray-300 rounded-xl px-4 h-[52px] cursor-pointer hover:bg-gray-50 transition shadow-sm min-w-fit bg-white"
            >
              <span className="text-[12px] font-bold text-gray-700 whitespace-nowrap select-none">
                Display total after taxes
              </span>
              <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${showTax ? 'bg-[#FF385C]' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${showTax ? 'left-7' : 'left-1'}`}></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <FilterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Scrollbar Style */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-red-scroll::-webkit-scrollbar { height: 3px; }
        .custom-red-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-red-scroll::-webkit-scrollbar-thumb { background: #FF385C; border-radius: 10px; }
        .custom-red-scroll { scrollbar-width: thin; scrollbar-color: #FF385C #f1f1f1; }
      `}} />
    </>
  );
}