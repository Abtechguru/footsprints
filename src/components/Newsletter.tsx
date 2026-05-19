"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { subscribeNewsletter } from "@/app/actions";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    const formData = new FormData();
    formData.append("email", email);

    const res = await subscribeNewsletter(formData);
    if (res.success) {
      setStatus("success");
      setMessage("Thank you for subscribing to FootprintsEnergy!");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(res.error || "Subscription failed. Please try again.");
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white px-6 sm:px-12">
      <div 
        className="max-w-6xl mx-auto bg-[#1D1D1D] rounded-3xl lg:rounded-[3rem] p-8 sm:p-12 lg:p-24 relative overflow-hidden text-center flex flex-col items-center"
      >
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FD630A]/20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[100px]"></div>
        
        {/* Architectural Diagonal Lines */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M-100,200 L1100,800 M-100,400 L1100,1000 M-100,0 L1100,600" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <h2 className="text-sm font-bold text-[#FD630A] uppercase tracking-[0.4em] mb-6">Get Updates</h2>
          <h3 className="text-4xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-8">
            Subscribe to our newsletter <br /> <span className="text-white/40 italic">and get a discount</span>
          </h3>
          <p className="text-xl text-white/60 mb-12 font-medium">
            Subscribe to our newsletter for the latest commodity price trends and trade opportunities.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-4 mb-4">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              required
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FD630A] transition-colors"
            />
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="bg-[#FD630A] text-white px-10 py-5 rounded-full font-bold hover:bg-white hover:text-[#1D1D1D] transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <span>{status === "loading" ? "Subscribing..." : "Subscribe Now"}</span>
              <Send size={18} />
            </button>
          </form>

          {status === "success" && (
            <p className="text-green-400 font-bold text-sm bg-green-500/10 py-2 px-4 rounded-full inline-block">{message}</p>
          )}
          {status === "error" && (
            <p className="text-red-400 font-bold text-sm bg-red-500/10 py-2 px-4 rounded-full inline-block">{message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
