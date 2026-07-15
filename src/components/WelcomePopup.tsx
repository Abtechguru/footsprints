"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, FileText, Truck, Headset, ArrowRight } from "lucide-react";

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we've already shown the popup in this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenWelcomePopup");
    
    if (!hasSeenPopup) {
      // Wait 5 seconds before showing
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("hasSeenWelcomePopup", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header / Banner */}
        <div className="bg-[#1D1D1D] text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FD630A]/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold mb-2 relative z-10">Welcome to Footprints!</h2>
          <p className="text-white/80 text-sm relative z-10">Create an account to unlock your personalized dashboard.</p>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6 bg-[#FBFBFA]">
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-full bg-[#FD630A]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FD630A] group-hover:text-white transition-colors duration-300 text-[#FD630A]">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[#1D1D1D]">Access Official Invoices</h4>
                <p className="text-sm text-[#1D1D1D]/70 mt-1 leading-relaxed">Download and manage your order invoices securely from your portal.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-full bg-[#DAA35D]/10 flex items-center justify-center shrink-0 group-hover:bg-[#DAA35D] group-hover:text-white transition-colors duration-300 text-[#DAA35D]">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[#1D1D1D]">Track Your Orders</h4>
                <p className="text-sm text-[#1D1D1D]/70 mt-1 leading-relaxed">Stay updated with real-time tracking for all your global commodity shipments.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-full bg-[#1D1D1D]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1D1D1D] group-hover:text-white transition-colors duration-300 text-[#1D1D1D]">
                <Headset size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[#1D1D1D]">Direct Customer Care</h4>
                <p className="text-sm text-[#1D1D1D]/70 mt-1 leading-relaxed">Get immediate, dedicated support tailored to your specific account needs.</p>
              </div>
            </div>
          </div>
          
          {/* Action */}
          <div className="pt-4 border-t border-[#1D1D1D]/5 flex gap-4">
            <button 
              onClick={handleClose}
              className="px-4 py-3 rounded-xl text-[#1D1D1D]/70 font-semibold text-sm hover:bg-[#1D1D1D]/5 transition-colors flex-1"
            >
              Maybe Later
            </button>
            <Link 
              href="/portal"
              onClick={handleClose}
              className="px-6 py-3 rounded-xl bg-[#FD630A] text-white font-bold text-sm hover:bg-[#e05304] transition-colors flex-[2] flex justify-center items-center gap-2 group shadow-lg shadow-[#FD630A]/20"
            >
              <span>Create Account</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
