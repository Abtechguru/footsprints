"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Share2, Clock } from "lucide-react";
import { LandingSettings, DEFAULT_LANDING_SETTINGS } from "@/lib/landing-settings";

export default function Footer({ settings = DEFAULT_LANDING_SETTINGS }: { settings?: LandingSettings }) {
  return (
    <footer className="bg-[#F7F3E6] pt-16 lg:pt-24 pb-12 border-t border-[#1D1D1D]/5 relative overflow-hidden">
      {/* Technical Parallel Lines - Normalized Opacity */}
      <div className="absolute top-0 right-0 w-full h-full opacity-[0.04] pointer-events-none z-0">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {[...Array(15)].map((_, i) => (
            <line 
              key={i} 
              x1={-100} y1={i * 100} 
              x2={1100} y2={i * 100 + 400} 
              stroke="#1D1D1D" 
              strokeWidth="1" 
            />
          ))}
        </svg>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-24 mb-16 lg:mb-24">
          
          {/* Brand Info */}
          <div className="md:col-span-2 lg:col-span-4 flex flex-col space-y-8">
            <Link href="/" className="flex items-center gap-1 group">
              <div className="relative h-12 w-12 overflow-hidden">
                <Image 
                  src="/images/footsprintLogo.jpeg" 
                  alt="Footprints Energy Logo" 
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <span className="font-sans font-bold text-xl text-[#1D1D1D] tracking-tight group-hover:text-[#FD630A] transition-colors whitespace-nowrap">
                Footprints Energy
              </span>
            </Link>
            <p className="text-[#1D1D1D]/60 leading-relaxed font-medium">
              Footprints Energy is a leading commodity trader , specializing in agricultural produce, animal protein and energy derivatives. We supply commodities such as Sugar (IC45, VHP) , Animal Protein (Chicken, Bovine and Swine) and Grains (Soy, Corn and Coffee). We also facilitate trade of petroleum derivates such as Jet A4, AGO and PMS.
            </p>
            <div className="flex space-x-4">
              {settings.contact_phone_secondary && (
                <Link href={settings.contact_phone_secondary} target="_blank" className="bg-white p-3 rounded-full text-[#1D1D1D] hover:bg-[#FD630A] hover:text-white transition-all shadow-sm">
                  <Globe size={20} />
                </Link>
              )}
              {settings.contact_email_secondary && (
                <Link href={`mailto:${settings.contact_email_secondary}`} className="bg-white p-3 rounded-full text-[#1D1D1D] hover:bg-[#FD630A] hover:text-white transition-all shadow-sm">
                  <Mail size={20} />
                </Link>
              )}
              <button onClick={() => {
                if (typeof window !== 'undefined' && navigator.share) {
                  navigator.share({ title: 'Footprints Energy', url: window.location.href });
                }
              }} className="bg-white p-3 rounded-full text-[#1D1D1D] hover:bg-[#FD630A] hover:text-white transition-all shadow-sm">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[#1D1D1D] font-bold uppercase tracking-widest text-xs mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Products', 'Our Team', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="text-[#1D1D1D]/60 hover:text-[#FD630A] font-medium transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2">
            <h4 className="text-[#1D1D1D] font-bold uppercase tracking-widest text-xs mb-8">Commodities</h4>
            <ul className="space-y-4 text-[#1D1D1D]/60 font-medium">
              <li>Sugar (IC45, VHP)</li>
              <li>Animal Protein</li>
              <li>Grains & Grains</li>
              <li>Spices & Black Pepper</li>
              <li>Energy Derivatives</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2 lg:col-span-4">
            <h4 className="text-[#1D1D1D] font-bold uppercase tracking-widest text-xs mb-8">Contact Our Team</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <div className="bg-white p-2.5 rounded-lg text-[#FD630A] shadow-sm">
                  <MapPin size={18} />
                </div>
                <span className="text-[#1D1D1D]/70 font-medium leading-relaxed pt-1">
                  {settings.contact_address_line1} <br />
                  <span className="text-[#1D1D1D]/50 text-sm">{settings.contact_address_line2}</span>
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <div className="bg-white p-2.5 rounded-lg text-[#FD630A] shadow-sm">
                  <Phone size={18} />
                </div>
                <span className="text-[#1D1D1D]/70 font-medium pt-1">{settings.contact_phone_primary}</span>
              </li>
              <li className="flex items-start space-x-4">
                <div className="bg-white p-2.5 rounded-lg text-[#FD630A] shadow-sm">
                  <Mail size={18} />
                </div>
                <span className="text-[#1D1D1D]/70 font-medium pt-1">{settings.contact_email_primary}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[#1D1D1D]/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-widest">
            <span>© 2024 Footprints Energy.</span>
            <div className="h-px w-4 bg-[#1D1D1D]/10"></div>
            <span>All Rights Reserved.</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 md:gap-8 lg:gap-12">
            <Link href="#" className="text-[10px] font-bold text-[#1D1D1D]/40 hover:text-[#FD630A] transition-colors uppercase tracking-widest">Privacy Policy</Link>
            <Link href="#" className="text-[10px] font-bold text-[#1D1D1D]/40 hover:text-[#FD630A] transition-colors uppercase tracking-widest">Terms of Service</Link>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#1D1D1D]/5">
              <Clock size={12} className="text-[#DAA35D]" />
              <span className="text-[9px] font-bold text-[#1D1D1D]/60 uppercase tracking-tighter">Mon - Fri: 9AM - 6PM</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
