import React from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

export default function Flash({ message, type, onClose }) {
  if (!message) return null;

  const isSuccess = type === "success";
  
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
      <div className={`flex items-center justify-between p-4 rounded-xl shadow-2xl border animate-in fade-in slide-in-from-top-5 duration-300 ${
        isSuccess 
        ? "bg-green-50 border-green-200 text-green-800" 
        : "bg-red-50 border-red-200 text-red-800"
      }`}>
        <div className="flex items-center gap-3">
          {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p className="font-bold text-sm tracking-tight">{message}</p>
        </div>
        
        <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}