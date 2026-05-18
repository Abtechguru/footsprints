import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Image from "next/image";
import { Globe, Shield, Zap, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F3E6]">
      <Navbar />
      
      {/* --- REDESIGNED ABOUT HERO --- */}
      <section className="relative min-h-screen flex items-center pt-48 pb-32 overflow-hidden">
        {/* Architectural Radial Arcs - Top Left */}
        <svg className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] opacity-[0.05] pointer-events-none" viewBox="0 0 500 500">
          {[...Array(12)].map((_, i) => (
            <circle key={i} cx="0" cy="0" r={150 + i * 40} fill="none" stroke="#1D1D1D" strokeWidth="1" />
          ))}
        </svg>

        <div className="max-w-[90rem] mx-auto px-6 sm:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">
            
            {/* Left: Content */}
            <div className="space-y-10">
              <div className="inline-flex items-center space-x-3">
                <div className="h-px w-8 bg-[#DAA35D]"></div>
                <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">Establishment</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-semibold text-[#1D1D1D] leading-[1] tracking-tighter">
                About <br />
                <span className="text-[#FD630A]">Footprints</span> <br />
                Energy.
              </h1>
              
              <p className="text-lg lg:text-xl text-[#1D1D1D]/70 leading-relaxed font-medium max-w-xl">
                Footprints Energy is a leading commodity trader, specializing in agricultural produce, animal protein and energy derivatives. 
              </p>

              <div className="pt-6">
                <p className="text-base text-[#1D1D1D]/60 leading-relaxed max-w-lg">
                  We supply commodities such as Sugar (IC45, VHP), Animal Protein (Chicken, Bovine and Swine) and Grains (Soy, Corn and Coffee). We also facilitate trade of petroleum derivates such as Jet A4, AGO and PMS.
                </p>
              </div>
            </div>

            {/* Right: Premium Image Frame */}
            <div className="relative group lg:pl-12">
              <div className="absolute -top-6 -right-6 w-full h-full border border-[#1D1D1D]/10 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700"></div>
              
              <div className="relative aspect-[4/5] lg:aspect-square overflow-hidden rounded-sm shadow-2xl shadow-[#1D1D1D]/15">
                <Image 
                  src="/images/about-hero.png" 
                  alt="Global Trade Logistics" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-[#1D1D1D]/5 group-hover:bg-transparent transition-colors duration-700"></div>
              </div>

              <div className="absolute -bottom-8 -left-8 bg-[#FD630A] text-white p-8 shadow-2xl hidden xl:block">
                <span className="block text-3xl font-bold tracking-tighter">Global</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mt-2">Enterprise</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- ABOUT CONTINUED --- */}
      <section className="py-32 relative z-10 border-t border-[#1D1D1D]/5 bg-white/30 backdrop-blur-sm">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="space-y-8 text-lg lg:text-xl text-[#1D1D1D]/70 leading-relaxed font-medium">
              <p>
                We pride ourselves in our unique ability to build lasting partnerships with producers, which positions us to guarantee supply for our offtakers at competitive prices, making us a global enterprise with no boundaries.
              </p>
            </div>
            <div className="bg-[#1D1D1D] p-12 lg:p-16 flex items-center justify-center text-center shadow-xl">
              <p className="text-white text-xl lg:text-2xl font-bold leading-relaxed">
                At Footprints, we understand our markets, follow trends and proactively take measures to act in the best interest of our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ARTISTIC MISSION & VISION --- */}
      <section className="py-40 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02] pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 L100,100 M20,0 L100,80 M40,0 L100,60" stroke="#1D1D1D" strokeWidth="0.1" />
          </svg>
        </div>

        <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tight">Our Mission And Vision</h2>
            <div className="mt-6 h-px w-24 bg-[#FD630A] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
            {/* Mission Card */}
            <div className="group relative p-12 lg:p-20 border-b lg:border-b-0 lg:border-r border-[#1D1D1D]/5 hover:bg-[#F7F3E6]/50 transition-colors duration-500">
              <div className="absolute top-12 left-12 text-8xl font-bold text-[#1D1D1D]/5 pointer-events-none group-hover:text-[#FD630A]/10 transition-colors">01</div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">The Purpose</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1D1D1D] uppercase tracking-tighter">Mission Statement</h3>
                <p className="text-lg lg:text-xl font-medium text-[#1D1D1D]/70 leading-relaxed">
                  To deliver high-quality agricultural, protein, and energy commodities through trusted global partnerships, ensuring reliable supply, competitive pricing, and customer-centric solutions.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative p-12 lg:p-20 hover:bg-[#F7F3E6]/50 transition-colors duration-500">
              <div className="absolute top-12 left-12 text-8xl font-bold text-[#1D1D1D]/5 pointer-events-none group-hover:text-[#DAA35D]/10 transition-colors">02</div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">The Future</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1D1D1D] uppercase tracking-tighter italic">Vision Statement</h3>
                <p className="text-lg lg:text-xl font-medium text-[#1D1D1D]/70 leading-relaxed italic">
                  To be the world’s most reliable and innovative commodity trading partner, bridging producers and markets with excellence, sustainability, and integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <div className="py-20 bg-white">
        <Newsletter />
      </div>

      <Footer />
    </main>
  );
}
