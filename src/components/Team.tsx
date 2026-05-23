import Image from "next/image";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function Team() {
  const { data: team } = await supabase.from("team_members").select("*").order("created_at", { ascending: true });

  return (
    <section className="py-8 lg:py-12 bg-white relative overflow-hidden">
      {/* Bold Wavy Architectural Lines (Inspiration Image 1) - Normalized Opacity */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none z-0">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {[...Array(12)].map((_, i) => (
            <path 
              key={i}
              d={`M ${-200 + i * 100},0 Q ${200 + i * 100},500 ${-200 + i * 100},1000`}
              fill="none"
              stroke="#1D1D1D"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col items-center text-center mb-12 lg:mb-20 max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-[#DAA35D] uppercase tracking-[0.2em] mb-4">The Minds Behind Footprints</h2>
          <h3 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tight mb-8">Meet Our Leadership Team</h3>
          <p className="text-lg text-[#1D1D1D]/70 font-medium leading-relaxed mb-10">
            At Footprints Energy, our leadership team brings together decades of combined experience in global trade, commodity markets, logistics, and energy infrastructure. Our leaders are driven by a shared commitment to transparency, sustainability, and customer success. With deep industry insight and strong international networks, they guide our vision, cultivate partnerships, and ensure we stay ahead in a rapidly evolving marketplace.
          </p>
          <div className="h-1 w-20 bg-[#FD630A]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {team?.map((member) => (
            <div 
              key={member.id} 
              className="group relative"
            >
              <div className="relative aspect-square overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D] via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
                
                {/* Social Overlay */}
                {member.email && (
                  <div className="absolute bottom-8 left-8 flex items-center space-x-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 z-30">
                    <a 
                      href={`mailto:${member.email}`}
                      className="bg-white p-3 rounded-full text-[#1D1D1D] hover:bg-[#FD630A] hover:text-white transition-colors cursor-pointer block"
                      title={`Email ${member.name}`}
                    >
                      <Mail size={20} />
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <h4 className="text-2xl font-bold text-[#1D1D1D] mb-1">{member.name}</h4>
                {member.email && (
                  <p className="text-xs text-[#1D1D1D]/50 mb-2 font-sans">{member.email}</p>
                )}
                <p className="text-[#DAA35D] font-bold uppercase tracking-widest text-xs">{member.role}</p>
              </div>
            </div>
          ))}
          {(!team || team.length === 0) && (
            <div className="md:col-span-2 text-center py-8 text-[#1D1D1D]/50 font-medium">
              No team members available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
