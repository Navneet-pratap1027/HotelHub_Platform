import React from "react";
import { 
  Globe, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  ArrowUp 
} from "lucide-react";

export default function Footer() {
  // Scroll to Top Function - Yeh ab force-scroll karega
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    
    // Backup agar smooth scroll fail ho jaye
    setTimeout(() => {
        if (window.scrollY !== 0) {
            window.scrollTo(0, 0);
        }
    }, 500);
  };

  const footerLinkStyle = "text-gray-600 hover:underline text-sm mb-2 block transition-all";
  const sectionTitleStyle = "font-bold text-gray-900 mb-3 text-lg";

  return (
    <footer className="bg-[#f7f7f7] border-t border-gray-200 pt-16 pb-8 mt-20 relative">
      
      {/* 1. Scroll Up Button (Square Style as per SS) */}
      <div className="absolute right-6 md:right-12 -top-6">
        <button 
          onClick={scrollToTop}
          type="button"
          className="bg-white border border-gray-300 p-3 rounded-md shadow-md hover:bg-gray-50 transition-all text-gray-700 cursor-pointer active:scale-90 z-50 relative"
          title="Back to top"
        >
          <ArrowUp size={22} strokeWidth={3} />
        </button>
      </div>

      <div className="container mx-auto px-6 md:px-20">
        
        {/* 2. Three Column Grid (SS 143) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Support Section */}
          <div className="footer-item">
            <h5 className={sectionTitleStyle}>Support</h5>
            <hr className="w-[70%] border-gray-300 mb-4" />
            <div className="flex flex-col">
              <a href="#" className={footerLinkStyle}>Help Centre</a>
              <a href="#" className={footerLinkStyle}>AirCover</a>
              <a href="#" className={footerLinkStyle}>Anti-discrimination</a>
              <a href="#" className={footerLinkStyle}>Disability support</a>
              <a href="#" className={footerLinkStyle}>Concern</a>
              <a href="#" className={footerLinkStyle}>Cancellation option</a>
              <a href="#" className={footerLinkStyle}>Report neighbourhood</a>
            </div>
          </div>

          {/* Hosting Section */}
          <div className="footer-item">
            <h5 className={sectionTitleStyle}>Hosting</h5>
            <hr className="w-[70%] border-gray-300 mb-4" />
            <div className="flex flex-col">
              <a href="#" className={footerLinkStyle}>HotelHub your home</a>
              <a href="#" className={footerLinkStyle}>AirCover for Hosts</a>
              <a href="#" className={footerLinkStyle}>Hosting resources</a>
              <a href="#" className={footerLinkStyle}>Community forum</a>
              <a href="#" className={footerLinkStyle}>Hosting responsibly</a>
            </div>
          </div>

          {/* Brand Section */}
          <div className="footer-item">
            <h5 className={sectionTitleStyle}>HotelHub</h5>
            <hr className="w-[70%] border-gray-300 mb-4" />
            <div className="flex flex-col">
              <a href="#" className={footerLinkStyle}>Newsroom</a>
              <a href="#" className={footerLinkStyle}>New features</a>
              <a href="#" className={footerLinkStyle}>Careers</a>
              <a href="#" className={footerLinkStyle}>Investors</a>
              <a href="#" className={footerLinkStyle}>HotelHub.org emergency</a>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 my-10" />

        {/* 3. Logo & Language (SS 144) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <img src="/images/logo.png" className="w-10 h-10 rounded-full object-cover" alt="logo" />
              <b className="text-2xl font-bold tracking-tight text-[#FF385C]">HotelHub</b>
            </div>
            <p className="text-gray-500 text-sm italic">Holidays rentals homes, villa, cabins, beach house and more</p>
          </div>

          <button className="flex items-center gap-2 border border-gray-800 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition shadow-sm">
            <Globe size={18} /> English (IN)
          </button>
        </div>

        <hr className="border-gray-300 my-10" />

        {/* 4. Social Icons & Legal */}
        <div className="flex flex-col items-center gap-6">
          
          {/* Icons colored exactly as per your EJS style */}
          <div className="flex items-center gap-8">
            <Facebook className="cursor-pointer hover:scale-110 transition text-[#106cdd]" size={24} fill="#106cdd" stroke="none" />
            <Instagram className="cursor-pointer hover:scale-110 transition text-[#e81414]" size={24} />
            <Twitter className="cursor-pointer hover:scale-110 transition text-[#26c3fd]" size={24} fill="#26c3fd" stroke="none" />
            <Linkedin className="cursor-pointer hover:scale-110 transition text-[#06657b]" size={24} fill="#06657b" stroke="none" />
          </div>

          <div className="text-gray-600 text-sm font-semibold">
            &copy; 2026 HotelHub Private Limited, inc.
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 font-medium underline decoration-gray-300 underline-offset-4">
            <a href="/privacy" className="hover:text-black">Privacy</a>
            <a href="/terms" className="hover:text-black">Terms</a>
            <a href="/sitemap" className="hover:text-black">Sitemap</a>
            <a href="/details" className="hover:text-black">Company details</a>
          </div>
        </div>

        <div className="mb-8"></div>
      </div>
    </footer>
  );
}