import Image from "next/image";
import Link from "next/link";
import { LandingSettings } from "@/lib/landing-settings";

export default function About({ settings }: { settings: LandingSettings }) {
  return (
    <section className="py-8 lg:py-12 bg-white border-b border-[#1D1D1D]/5 relative overflow-hidden">
      {/* Bold Wavy Architectural Lines (Inspiration Image 1) - Reduced Opacity */}
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-[0.05] pointer-events-none z-0">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {[...Array(8)].map((_, i) => (
            <path 
              key={i}
              d={`M ${1000 - i * 40},0 Q ${800 - i * 40},400 ${1000 - i * 40},1000`}
              fill="none"
              stroke="#1D1D1D"
              strokeWidth="2"
              className="opacity-100"
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <path 
              key={i + 10}
              d={`M 0,${200 + i * 80} Q 400,${400 + i * 80} 1000,${100 + i * 80}`}
              fill="none"
              stroke="#1D1D1D"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
      <div className="absolute -bottom-20 -left-20 w-1/2 h-1/2 opacity-[0.03] pointer-events-none z-0 rotate-12">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {[...Array(10)].map((_, i) => (
            <path 
              key={i}
              d={`M 0,${i * 40} Q 250,${i * 40 + 100} 500,${i * 40}`}
              fill="none"
              stroke="#FD630A"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10 animate-fade-in-up">
        
        {/* Simple Top Label */}
        <div className="flex items-center space-x-4 mb-12 lg:mb-20">
          <div className="h-px w-12 bg-[#FD630A]"></div>
          <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">{settings.about_label}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left: Visual Asset */}
          <div className="relative group order-2 lg:order-1 flex justify-center">
            <div className="absolute inset-0 bg-[#FD630A]/5 rounded-3xl blur-2xl transform group-hover:scale-105 transition-all duration-700"></div>
            
            <div className="relative aspect-[4/5] w-full max-w-md lg:max-w-full lg:h-[600px] overflow-hidden rounded-2xl bg-white border border-[#1D1D1D]/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:shadow-[0_30px_60px_rgba(253,99,10,0.15)] transition-all duration-700 z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/40 to-transparent z-10 pointer-events-none"></div>
              {(settings.about_image || "").endsWith(".mp4") ? (
                <video
                  src={settings.about_image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000"
                />
              ) : (
                <Image 
                  src={settings.about_image || "/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg"} 
                  alt="Global Commodity Trade" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
              )}
            </div>
            
            {/* Premium Floating Accent */}
            <div className="absolute bottom-6 left-6 sm:-bottom-6 sm:-left-6 backdrop-blur-xl bg-white/90 border border-white/50 text-[#1D1D1D] p-6 sm:p-8 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] transform group-hover:-translate-y-2 transition-all duration-700 z-20 max-w-[280px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#FD630A] animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FD630A]">{settings.about_accent_subtitle}</span>
              </div>
              <span className="block text-3xl sm:text-4xl font-black tracking-tight leading-none">{settings.about_accent_title}</span>
            </div>
          </div>

          {/* Right: Typography */}
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tight leading-[1.1] uppercase">
              {settings.about_title || "Who We Are"}
            </h2>
            
            <div className="space-y-6 text-base text-[#1D1D1D]/70 leading-relaxed font-medium">
              <p>
                {settings.about_text_p1}
              </p>
              <p>
                {settings.about_text_p2}
              </p>
              <div className="pt-6 border-t border-[#1D1D1D]/5">
                <p className="text-[#1D1D1D] font-bold text-xl leading-snug italic">
                  "{settings.about_quote}"
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link 
                href="/about-us" 
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FD630A] hover:text-[#1D1D1D] transition-colors"
              >
                <span>Read More &rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
