"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Menu, X } from "lucide-react";
import { LandingSettings, DEFAULT_LANDING_SETTINGS } from "@/lib/landing-defaults";

const SPARKLES = [
  { top: '15%', left: '20%', size: '4px', delay: '0s', duration: '2.5s', color: '#FD630A' },
  { top: '35%', left: '80%', size: '3px', delay: '1s', duration: '3s', color: '#DAA35D' },
  { top: '75%', left: '15%', size: '5px', delay: '0.5s', duration: '2.2s', color: '#FD630A' },
  { top: '85%', left: '85%', size: '4px', delay: '2s', duration: '3.5s', color: '#DAA35D' },
  { top: '25%', left: '50%', size: '6px', delay: '1.5s', duration: '4s', color: '#FD630A' },
  { top: '55%', left: '10%', size: '3px', delay: '0.2s', duration: '2.8s', color: '#DAA35D' },
  { top: '45%', left: '90%', size: '5px', delay: '1.2s', duration: '3.2s', color: '#FD630A' },
  { top: '10%', left: '60%', size: '4px', delay: '2.5s', duration: '2.6s', color: '#DAA35D' },
  { top: '90%', left: '40%', size: '3px', delay: '0.8s', duration: '3.8s', color: '#FD630A' },
  { top: '65%', left: '70%', size: '5px', delay: '1.8s', duration: '2.4s', color: '#DAA35D' },
  { top: '5%', left: '30%', size: '4px', delay: '0.3s', duration: '3.1s', color: '#FD630A' },
  { top: '80%', left: '60%', size: '6px', delay: '2.2s', duration: '2.9s', color: '#DAA35D' },
];

export default function Navbar({ settings = DEFAULT_LANDING_SETTINGS }: { settings?: LandingSettings }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="w-full flex flex-col z-50">
      {/* Top Utility Contact Bar */}
      <div className="bg-[#1D1D1D] text-white py-2.5 px-6 sm:px-12 flex justify-between items-center text-xs font-semibold">
        <div className="flex items-center space-x-6">
          <a href={`tel:${settings.contact_phone_primary}`} className="flex items-center gap-2 hover:text-[#FD630A] transition-colors">
            <Phone size={14} />
            <span>{settings.contact_phone_primary}</span>
          </a>
          <a href={`mailto:${settings.contact_email_primary}`} className="flex items-center gap-2 hover:text-[#FD630A] transition-colors">
            <Mail size={14} />
            <span>{settings.contact_email_primary}</span>
          </a>
        </div>
      </div>



      {/* Main Header Brand Area */}
      <div className="relative bg-gradient-to-b from-[#FBFBFA] via-[#F7F3E6]/30 to-white py-16 sm:py-20 px-6 sm:px-12 flex flex-col items-center justify-center border-b border-black/5 overflow-hidden group">
        
        {/* Sparkles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {SPARKLES.map((sparkle, i) => (
            <div 
              key={i}
              className="absolute rounded-full opacity-0 animate-sparkle"
              style={{
                top: sparkle.top,
                left: sparkle.left,
                width: sparkle.size,
                height: sparkle.size,
                backgroundColor: sparkle.color,
                animationDelay: sparkle.delay,
                animationDuration: sparkle.duration,
                boxShadow: `0 0 10px ${sparkle.color}`
              }}
            ></div>
          ))}
        </div>

        {/* Ambient Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="absolute inset-0 opacity-[0.03] sm:opacity-[0.02]">
            <Image 
              src="/images/footsprintLogo.jpeg"
              alt=""
              fill
              className="object-cover sm:object-contain scale-150 sm:scale-100 transition-transform duration-[10s] group-hover:scale-110 ease-out"
            />
          </div>
          <div className="w-[600px] h-[300px] bg-[#FD630A] blur-[100px] rounded-full opacity-[0.05] group-hover:opacity-[0.12] transition-opacity duration-1000 animate-glow"></div>
        </div>

        <Link href="/" className="relative z-10 flex flex-col items-center justify-center gap-6 sm:gap-8 text-center animate-float">
          {/* Logo with Frosted Glass/Gradient Frame effect */}
          <div className="relative p-[2px] rounded-[1.5rem] bg-gradient-to-br from-[#FD630A]/80 via-[#FD630A]/20 to-transparent shadow-[0_8px_32px_-10px_rgba(253,99,10,0.4)] group-hover:shadow-[0_20px_50px_-10px_rgba(253,99,10,0.6)] group-hover:-translate-y-2 transition-all duration-500 ease-out">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-[1.4rem] bg-white ring-1 ring-black/5 shadow-inner">
              <Image 
                src="/images/footsprintLogo.jpeg" 
                alt="Footprints Energy Logo" 
                fill
                sizes="(max-width: 640px) 96px, 112px"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </div>
            {/* Pulsing ring around logo on hover */}
            <div className="absolute inset-0 rounded-[1.5rem] border-2 border-[#FD630A]/0 group-hover:border-[#FD630A]/50 group-hover:animate-ping opacity-20 transition-colors duration-500"></div>
          </div>
          
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            {/* Company Name with bold modern weight and tight letter-spacing */}
            <h1 className="font-sans font-black text-4xl sm:text-[3.5rem] lg:text-[4.5rem] leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#FD630A] to-[#FD630A] hover:to-[#DAA35D] tracking-tighter uppercase transition-all duration-500 group-hover:scale-105 drop-shadow-sm">
              Footprints Energy
            </h1>
            
            {/* Minimalist Divider & Tagline */}
            <div className="flex flex-col items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-[2px] bg-[#DAA35D]/60 rounded-full"></div>
                <div className="w-12 h-[3px] bg-gradient-to-r from-[#FD630A] to-[#DAA35D] group-hover:w-24 transition-all duration-500 ease-out rounded-full shadow-[0_0_8px_rgba(253,99,10,0.4)]"></div>
                <div className="w-3 h-[2px] bg-[#DAA35D]/60 rounded-full"></div>
              </div>
              <span className="text-[10px] sm:text-[13px] font-bold text-[#1D1D1D]/80 uppercase tracking-[0.3em] sm:tracking-[0.4em] max-w-[280px] sm:max-w-3xl leading-[1.8] sm:leading-loose group-hover:text-[#FD630A] transition-colors duration-500">
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

