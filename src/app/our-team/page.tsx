import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Mail } from "lucide-react";

export const revalidate = 0;

export default async function TeamPage() {
  const { data: team } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-[#F7F3E6]">
      <Navbar />

      {/* --- TEAM HERO --- */}
      <section className="relative pt-48 pb-32 overflow-hidden text-center">
        {/* Technical Arcs */}
        <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.04] pointer-events-none" viewBox="0 0 1000 1000">
          {[...Array(10)].map((_, i) => (
            <circle key={i} cx="500" cy="-200" r={400 + i * 60} fill="none" stroke="#1D1D1D" strokeWidth="1" />
          ))}
        </svg>

        <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
          <div className="inline-flex items-center space-x-3 mb-10">
            <div className="h-px w-8 bg-[#DAA35D]"></div>
            <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">Our Leadership</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-semibold text-[#1D1D1D] leading-[1] tracking-tighter mb-12">
            The Visionaries Behind <br />
            <span className="text-[#FD630A]">FootprintsEnergy.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-[#1D1D1D]/70 leading-relaxed font-medium max-w-2xl mx-auto">
            Our leadership team brings together decades of combined experience in global trade, commodity markets, logistics, and energy infrastructure.
          </p>
        </div>
      </section>

      {/* --- TEAM GRID --- */}
      <section className="py-32 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-[#1D1D1D]/5"></div>
        
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-24">
            {team?.map((member) => (
              <div key={member.id} className="group space-y-10">
                {/* Image Container with Sliding Bio Overlay - Now 4/5 Aspect */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#F7F3E6] border border-[#1D1D1D]/5 shadow-2xl group-hover:-translate-y-4 transition-all duration-700 ease-out">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  
                  {/* Sliding Glassmorphic Bio Overlay */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out z-20">
                    <div className="bg-[#1D1D1D]/90 backdrop-blur-md p-10 lg:p-12">
                      <p className="text-white/85 text-sm lg:text-base leading-relaxed font-medium">
                        {member.name} serves as the {member.role} at FootprintsEnergy, driving operational excellence, global commodity trade initiatives, and customer success worldwide.
                      </p>
                      {member.email && (
                        <div className="mt-8 flex items-center space-x-2">
                          <a 
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center space-x-2 bg-[#FD630A] hover:bg-white text-white hover:text-[#1D1D1D] px-4 py-2.5 rounded-lg text-xs font-bold transition-colors"
                          >
                            <Mail size={14} />
                            <span>Contact {member.name.split(" ")[0]}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-[#1D1D1D]/5 group-hover:bg-transparent transition-colors z-10"></div>
                  
                  {/* Architectural Accent on image */}
                  <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity z-30"></div>
                  <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/40 opacity-0 group-hover:opacity-100 transition-opacity z-30"></div>
                </div>

                {/* Info */}
                <div className="space-y-4 text-center">
                  <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.3em]">{member.role}</span>
                  <h3 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tighter">{member.name}</h3>
                  {member.email && (
                    <p className="text-xs text-[#1D1D1D]/50 font-sans">{member.email}</p>
                  )}
                  <div className="h-px w-12 bg-[#FD630A] mx-auto opacity-40 group-hover:w-24 group-hover:opacity-100 transition-all duration-700"></div>
                </div>
              </div>
            ))}
            {(!team || team.length === 0) && (
              <div className="col-span-1 md:col-span-2 text-center py-12 text-[#1D1D1D]/45 font-bold">
                No visionary leadership team registered yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- MISSION CALLOUT --- */}
      <section className="py-40 bg-[#F7F3E6] overflow-hidden relative">
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#1D1D1D 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#1D1D1D] mb-12 tracking-tight leading-relaxed">
            "Our leaders are driven by a shared commitment to transparency, sustainability, and customer success."
          </h2>
          <div className="inline-block p-10 border border-[#1D1D1D]/10 bg-white shadow-xl">
             <p className="text-lg text-[#1D1D1D]/60 font-medium leading-relaxed">
                FootprintsEnergy is a leading commodity trader, specializing in agricultural produce, animal protein and energy derivatives. We supply commodities such as Sugar (IC45, VHP), Animal Protein (Chicken, Bovine and Swine) and Grains (Soy, Corn and Coffee).
             </p>
          </div>
        </div>
      </section>

      <div className="py-20 bg-white">
        <Newsletter />
      </div>

      <Footer />
    </main>
  );
}
