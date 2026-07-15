"use client";

import { Mail } from "lucide-react";
import { LandingSettings } from "@/lib/landing-settings";

export default function FloatingSupport({ settings }: { settings: LandingSettings }) {
  const supportEmail = settings.contact_email_primary || "support@footprintsenergy.com";
  
  return (
    <a 
      href={`mailto:${supportEmail}`}
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-[#1D1D1D] text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:scale-110 hover:bg-[#FD630A] transition-all duration-300 group"
      aria-label="Contact Support"
    >
      <Mail size={24} className="group-hover:animate-pulse" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-[#1D1D1D] text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Email Support
      </span>
      
      {/* Subtle ping animation behind the button */}
      <div className="absolute inset-0 rounded-full border-2 border-[#1D1D1D] opacity-20 animate-ping group-hover:border-[#FD630A]"></div>
    </a>
  );
}
