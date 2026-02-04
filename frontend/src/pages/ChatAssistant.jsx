import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, X } from "lucide-react";
import API from "../api";

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Namaste! I'm your HotelHub Assistant. How can I help you find your dream stay today? 🏠✨" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await API.post("/api/chat", { message: input });
      setMessages((prev) => [...prev, { role: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Oops! Something went wrong. Try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <div className="bg-white border border-gray-200 rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[75vh]">
        
        {/* Header */}
        <div className="bg-[#FF385C] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-black text-lg leading-tight text-white">HotelHub AI</h2>
              <p className="text-[11px] opacity-80 font-bold uppercase tracking-wider">Online & Ready to help</p>
            </div>
          </div>
          <Sparkles className="animate-pulse" />
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#F7F7F7]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                msg.role === "user" 
                ? "bg-black text-white rounded-tr-none" 
                : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 italic text-gray-400 text-sm">
                AI is thinking...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about properties, locations, or prices..."
            className="flex-grow p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF385C] transition-all text-sm font-medium"
          />
          <button className="bg-[#FF385C] text-white p-4 rounded-2xl hover:bg-[#e32d50] transition-all shadow-lg active:scale-95">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}