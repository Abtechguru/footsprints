import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] lg:h-screen w-full bg-[#F7F3E6] overflow-hidden flex flex-col justify-center font-sans pt-32 lg:pt-24 pb-12 lg:pb-4">
      {/* Middle Vertical Line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#1D1D1D]/10 hidden lg:block z-0"></div>

      {/* --- REDESIGNED ARCHITECTURAL PATTERNS --- */}
      {/* Technical Dot Grid - Global Background */}
      <div className="absolute inset-0 z-0 opacity-[0.15]" 
           style={{ 
             backgroundImage: 'radial-gradient(#1D1D1D 0.5px, transparent 0.5px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      {/* Refined Radiating Arcs - Bottom Right (Inspiration 2 Style) */}
      <svg
        className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[80%] z-0 opacity-[0.08] pointer-events-none"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[...Array(10)].map((_, i) => (
          <circle 
            key={i}
            cx="500" 
            cy="500" 
            r={100 + i * 50} 
            fill="none" 
            stroke="#1D1D1D" 
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Architectural Technical Lines - Top Left */}
      <svg
        className="absolute top-0 left-0 w-[40%] h-[50%] z-0 opacity-[0.06] pointer-events-none"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[...Array(15)].map((_, i) => (
          <line 
            key={i}
            x1="0" 
            y1={i * 30} 
            x2="400" 
            y2={i * 30 + 100} 
            stroke="#1D1D1D" 
            strokeWidth="0.5"
          />
        ))}
      </svg>

      <div className="max-w-[90rem] mx-auto w-full px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 relative z-10 h-full">
        
        {/* LEFT COLUMN: Text Content */}
        <div className="flex flex-col justify-center pr-0 lg:pr-16 h-full pt-4 lg:pt-14 pb-8 lg:pb-0">
          <div className="inline-flex items-center space-x-2 bg-white/60 border border-[#DAA35D]/20 px-3 py-1.5 rounded-full mb-6 w-fit shadow-sm">
            <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-widest pl-1">Natural & Authentic</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-semibold text-[#1D1D1D] leading-[1.05] tracking-tight mb-6">
            Quality, Natural <span className="text-[#FD630A]">Products</span> <br className="hidden xl:block"/> You Can Trust.
          </h1>
          
          <p className="text-base lg:text-lg text-[#1D1D1D]/70 leading-relaxed font-medium mb-8 max-w-md">
            Our integrated approach to sourcing premium local produce and animal proteins allows us to provide a comprehensive solution that best meets your health needs.
          </p>
          
          <div>
            <Link href="/products" className="inline-flex items-center justify-center space-x-3 bg-[#FD630A] text-white px-7 py-3.5 text-sm font-bold tracking-wide hover:bg-[#e05304] transition-colors shadow-lg shadow-[#FD630A]/20">
              <span>Explore Collection</span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Images (Top 80%) & Stats (Bottom 20%) */}
        <div className="hidden lg:flex flex-col h-full">
          
          {/* Top Images Section */}
          <div className="flex-[4] flex items-end justify-center gap-4 xl:gap-8 pl-12 pb-0 relative">
            {/* Image 1 */}
            <div className="group relative w-40 xl:w-52 h-[60%] shadow-xl shadow-[#1D1D1D]/10 bg-white overflow-hidden hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#1D1D1D]/20 transition-all duration-500 cursor-pointer">
              <Image 
                src="/images/Black-Pepper.jpeg" 
                alt="Premium Black Pepper" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            {/* Image 2 */}
            <div className="group relative w-48 xl:w-60 h-[80%] shadow-2xl shadow-[#1D1D1D]/15 bg-white overflow-hidden hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#1D1D1D]/25 transition-all duration-500 cursor-pointer">
              <Image 
                src="/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg" 
                alt="Healthy Vegetables" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>
          </div>

          {/* Bottom Stats Section */}
          <div className="flex-[1] flex items-center w-full">
            <div className="grid grid-cols-3 w-full h-full border-l border-[#1D1D1D]/10">
              <div className="flex flex-col justify-center items-center h-full border-r border-[#1D1D1D]/10 bg-[#1D1D1D] text-white">
                <span className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-1">100%</span>
                <span className="text-[10px] lg:text-xs font-semibold tracking-wider text-white/70 uppercase">Natural</span>
              </div>
              <div className="flex flex-col justify-center items-center h-full border-r border-[#1D1D1D]/10">
                <span className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1D1D1D] mb-1">50+</span>
                <span className="text-[10px] lg:text-xs font-semibold tracking-wider text-[#1D1D1D]/60 uppercase">Products</span>
              </div>
              <div className="flex flex-col justify-center items-center h-full">
                <span className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1D1D1D] mb-1">24/7</span>
                <span className="text-[10px] lg:text-xs font-semibold tracking-wider text-[#1D1D1D]/60 uppercase">Support</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
