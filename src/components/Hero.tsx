import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LandingSettings } from "@/lib/landing-settings";

export default function Hero({ settings }: { settings: LandingSettings }) {
  return (
    <section className="relative min-h-[80vh] w-full flex flex-col justify-center items-center overflow-hidden font-sans">
      {/* Full-bleed Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={settings.hero_image2 || "/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg"} 
          alt="Footprints Energy Logistics" 
          fill
          sizes="100vw"
          className="object-cover brightness-[0.65]"
          priority
        />
        {/* Soft shadow gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
      </div>

      {/* Centered / Left Glassmorphism Text Card (Target Design Layout) */}
      <div className="max-w-[90rem] w-full mx-auto px-6 sm:px-12 relative z-10 flex justify-center lg:justify-start items-center py-20">
        <div className="bg-[#1D1D1D]/80 backdrop-blur-md border border-white/10 p-8 sm:p-12 max-w-2xl text-white shadow-2xl rounded-sm">
          <span className="inline-block text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.3em] mb-4 border-b border-[#DAA35D]/30 pb-2">
            {settings.hero_badge || "Premium Solutions"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight mb-6">
            {settings.hero_title}
          </h2>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium mb-8">
            {settings.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href={settings.hero_button_link || "/products"} 
              className="inline-flex items-center justify-center space-x-3 bg-[#FD630A] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#e05304] transition-all rounded-sm"
            >
              <span>{settings.hero_button_text || "Explore Collection"}</span>
              <ChevronRight size={14} />
            </Link>
            <Link 
              href="/about-us" 
              className="inline-flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-all rounded-sm"
            >
              <span>Learn More</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

