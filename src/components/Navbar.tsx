"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Menu, X } from "lucide-react";
import { LandingSettings, DEFAULT_LANDING_SETTINGS } from "@/lib/landing-settings";

export default function Navbar({ settings = DEFAULT_LANDING_SETTINGS }: { settings?: LandingSettings }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="w-full flex flex-col z-50">
      {/* Top Utility Contact Bar */}
      <div className="bg-[#1D1D1D] text-white py-2.5 px-6 sm:px-12 flex justify-between items-center text-xs font-semibold">
        <div className="flex items-center space-x-6">
          <a href={`tel:${settings.contact_phone_secondary}`} className="flex items-center gap-2 hover:text-[#FD630A] transition-colors">
            <Phone size={14} />
            <span>{settings.contact_phone_secondary}</span>
          </a>
          <a href={`mailto:${settings.contact_email_secondary}`} className="flex items-center gap-2 hover:text-[#FD630A] transition-colors">
            <Mail size={14} />
            <span>{settings.contact_email_secondary}</span>
          </a>
        </div>
      </div>

      {/* Main Header Brand Area */}
      <div className="relative bg-[#FBFBFA] py-14 px-6 sm:px-12 flex flex-col items-center justify-center border-b border-black/5 overflow-hidden">
        {/* Ambient Orange Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[250px] bg-[#FD630A] blur-[120px] rounded-full opacity-[0.07]"></div>
        </div>

        <Link href="/" className="relative z-10 flex flex-col items-center justify-center gap-6 text-center group">
          {/* Logo with Frosted Glass/Gradient Frame effect */}
          <div className="relative p-[1.5px] rounded-[1.25rem] bg-gradient-to-b from-[#FD630A]/60 via-[#FD630A]/10 to-transparent shadow-[0_8px_32px_-10px_rgba(253,99,10,0.3)] group-hover:shadow-[0_12px_40px_-10px_rgba(253,99,10,0.45)] transition-all duration-500 ease-out">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-black/5 shadow-inner">
              <Image 
                src="/images/footsprintLogo.jpeg" 
                alt="Footprints Energy Logo" 
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            {/* Company Name with bold modern weight and tight letter-spacing */}
            <h1 className="font-sans font-black text-3xl sm:text-[2.5rem] lg:text-[3.25rem] leading-none text-[#111111] tracking-tighter uppercase">
              Footprints <span className="text-[#FD630A]">Energy</span>
            </h1>
            
            {/* Minimalist Divider & Tagline */}
            <div className="flex flex-col items-center gap-3 mt-1">
              <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-[#FD630A] to-transparent group-hover:w-16 transition-all duration-500 ease-out"></div>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-[0.25em] sm:tracking-[0.35em] max-w-md sm:max-w-2xl leading-loose">
                Specialists in the sourcing and supply of sugar, protein, grains and energy derivatives
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Menu Bar */}
      <div className="bg-white border-y border-[#1D1D1D]/10 py-3.5 px-6 sm:px-12 flex justify-center sticky top-0 z-40 shadow-sm">
        <nav className="hidden lg:flex justify-center space-x-12">
          {['Home', 'About Us', 'Our Team', 'Products', 'Sessions', 'Contact'].map((item) => (
            <Link 
              key={item} 
              href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
              className="text-[#1D1D1D] text-sm font-bold uppercase tracking-wider hover:text-[#FD630A] transition-colors relative group py-1"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FD630A] transition-all group-hover:w-full"></span>
            </Link>
          ))}
          <Link 
            href="/portal"
            className="text-[#DAA35D] text-sm font-bold uppercase tracking-wider hover:text-[#FD630A] transition-colors relative group py-1"
          >
            Sign In
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FD630A] transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden w-full flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1D1D1D]">Navigation</span>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-[#1D1D1D] hover:text-[#FD630A] transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm lg:hidden flex flex-col">
          <div className="flex justify-end p-6">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FD630A] transition-colors p-2"
            >
              <X size={32} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 space-y-8 p-6 overflow-y-auto pb-20">
            {['Home', 'About Us', 'Our Team', 'Products', 'Sessions', 'Contact'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white text-2xl font-bold uppercase tracking-widest hover:text-[#FD630A] transition-colors"
              >
                {item}
              </Link>
            ))}
            <div className="w-16 h-px bg-white/20 my-4"></div>
            <Link 
              href="/portal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#FD630A] text-2xl font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

