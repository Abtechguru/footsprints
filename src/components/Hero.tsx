import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { LandingSettings } from "@/lib/landing-settings";

export default function Hero({ settings }: { settings: LandingSettings }) {
  return (
    <section className="relative min-h-[70vh] w-full flex flex-col justify-center items-center overflow-hidden font-sans group">
      {/* Full-bleed Background Image with subtle zoom animation */}
      <div className="absolute inset-0 z-0">
        {(settings.hero_image2 || "").endsWith(".mp4") ? (
          <video
            src={settings.hero_image2}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full brightness-[0.55]"
          />
        ) : (
          <Image 
            src={settings.hero_image2 || "/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg"} 
            alt="Footprints Energy Logistics" 
            fill
            sizes="100vw"
            className="object-cover brightness-[0.55] transition-transform duration-[20s] ease-out group-hover:scale-105"
            priority
          />
        )}
        {/* Soft shadow gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D1D1D]/70 to-transparent"></div>
      </div>

      {/* Hero Content Grid */}
      <div className="max-w-[90rem] w-full mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10 lg:py-16">
        
        {/* Premium Glassmorphism Card */}
        <div className="lg:col-span-7 xl:col-span-6 bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-14 text-white shadow-2xl rounded-[2.5rem] relative overflow-hidden transform transition-all hover:border-white/20">
          
          {/* Ambient Glow behind card content */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FD630A] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FD630A] animate-pulse"></span>
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                {settings.hero_badge || "Premium Solutions"}
              </span>
            </div>

            {/* Title with Gradient Text */}
            <h2 className="text-4xl sm:text-6xl lg:text-[4rem] font-black leading-[1.1] tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
                {settings.hero_title}
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/70 leading-relaxed font-medium mb-10 max-w-xl">
              {settings.hero_subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={settings.hero_button_link || "/products"} 
                className="group/btn relative inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-[#FD630A] to-[#ff7e33] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(253,99,10,0.3)] transition-all hover:shadow-[0_12px_40px_rgba(253,99,10,0.5)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                <span className="relative z-10">{settings.hero_button_text || "Explore Collection"}</span>
                <ChevronRight size={16} className="relative z-10 transition-transform group-hover/btn:translate-x-1" />
              </Link>
              
              <Link 
                href="/about-us" 
                className="group/btn2 inline-flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all hover:-translate-y-1"
              >
                <span>Discover Our Story</span>
                <ArrowRight size={16} className="text-white/50 group-hover/btn2:text-white transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Optional Right-side graphical element / floating badge */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 justify-center items-center">
          <div className="relative animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="w-32 h-32 md:w-48 md:h-48 border-2 border-white/20 rounded-full flex items-center justify-center backdrop-blur-md bg-white/5">
              <div className="text-center">
                <span className="block text-2xl md:text-3xl font-black text-[#FD630A]">100%</span>
                <span className="block text-[10px] uppercase tracking-widest font-bold text-white mt-1">Premium<br/>Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

