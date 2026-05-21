import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Menu } from "lucide-react";
import { LandingSettings, DEFAULT_LANDING_SETTINGS } from "@/lib/landing-settings";

export default function Navbar({ settings = DEFAULT_LANDING_SETTINGS }: { settings?: LandingSettings }) {
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
      <div className="bg-[#F7F3E6] py-6 px-6 sm:px-12 flex flex-col items-center border-b border-[#1D1D1D]/5">
        <Link href="/" className="flex flex-col items-center gap-2 text-center group">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#1D1D1D]/5">
            <Image 
              src="/images/footsprintLogo.jpeg" 
              alt="Footprints Energy Logo" 
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <h1 className="font-sans font-bold text-3xl text-[#1D1D1D] tracking-tight group-hover:text-[#FD630A] transition-colors uppercase">
            Footprints Energy
          </h1>
          <span className="text-xs font-bold text-[#DAA35D] uppercase tracking-[0.25em] max-w-xl leading-normal">
            Specialists in the sourcing and supply of sugar, protein, grains and energy derivatives
          </span>
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
          <button className="text-[#1D1D1D] hover:text-[#FD630A] transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

