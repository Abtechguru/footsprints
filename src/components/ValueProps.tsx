import Image from "next/image";
import Link from "next/link";
import { Globe, Clock, ShieldCheck, Zap, HeartHandshake } from "lucide-react";
import { LandingSettings } from "@/lib/landing-settings";

const getIcon = (idx: number) => {
  const icons = [
    <Globe className="text-[#FD630A]" size={20} />,
    <Clock className="text-[#FD630A]" size={20} />,
    <Zap className="text-[#FD630A]" size={20} />,
    <ShieldCheck className="text-[#FD630A]" size={20} />,
    <HeartHandshake className="text-[#FD630A]" size={20} />
  ];
  return icons[idx % icons.length];
};

export default function ValueProps({ settings }: { settings: LandingSettings }) {
  const reasons = settings.value_props_list || [];

  return (
    <section className="py-16 lg:py-24 bg-[#F7F3E6] relative overflow-hidden">
      {/* Radiating Lines Texture - Normalized Opacity */}
      <div className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {[...Array(10)].map((_, i) => (
            <line key={i} x1="0" y1="500" x2="1000" y2={i * 100} stroke="#1D1D1D" strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10 space-y-20">
        
        {/* Split Section: Text Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Text Block */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-px w-12 bg-[#FD630A]"></div>
              <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">{settings.value_props_label || "What We Do"}</span>
            </div>
            <h3 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tight leading-[1.1] uppercase">
              {settings.value_props_title}
            </h3>
            <p className="text-base text-[#1D1D1D]/70 font-medium leading-relaxed">
              {settings.value_props_desc}
            </p>
            <div className="pt-4">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FD630A] hover:text-[#1D1D1D] transition-colors"
              >
                <span>Discover Products &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right: Large Product Image */}
          <div className="relative group">
            <div className="relative aspect-video lg:aspect-auto lg:h-[450px] overflow-hidden rounded-sm bg-white border border-[#1D1D1D]/5 shadow-xl">
              <Image 
                src={settings.hero_image1 || "/images/Black-Pepper.jpeg"} 
                alt="Product Sourcing" 
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
          </div>
        </div>

        {/* Detailed Values Cards List below */}
        <div className="border-t border-[#1D1D1D]/10 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, idx) => (
              <div key={idx} className="bg-white p-8 border border-[#1D1D1D]/5 hover:border-[#FD630A]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[#1D1D1D]/5 group rounded-sm">
                <div className="bg-[#F7F3E6] w-10 h-10 flex items-center justify-center rounded-lg mb-6 group-hover:bg-[#FD630A] group-hover:text-white transition-colors duration-500">
                  {getIcon(idx)}
                </div>
                <h4 className="text-lg font-bold text-[#1D1D1D] mb-3">{reason.title}</h4>
                <p className="text-sm text-[#1D1D1D]/60 leading-relaxed font-medium">
                  {reason.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

