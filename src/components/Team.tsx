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
          <h3 className="text-3xl lg:text-4xl font-semibold text-[#1D1D1D] tracking-tight mb-8">Meet Our Leadership Team</h3>
          <p className="text-base text-[#1D1D1D]/70 font-medium leading-relaxed mb-10">
            At Footprints Energy, our leadership team brings together decades of combined experience in global trade, commodity markets, logistics, and energy infrastructure. Our leaders are driven by a shared commitment to transparency, sustainability, and customer success. With deep industry insight and strong international networks, they guide our vision, cultivate partnerships, and ensure we stay ahead in a rapidly evolving marketplace.
          </p>
          <div className="h-1 w-20 bg-[#FD630A]"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          {team?.map((member) => (
            <div 
              key={member.id} 
              className="group relative bg-white rounded-[2rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#1D1D1D]/5 hover:shadow-[0_25px_50px_rgba(253,99,10,0.12)] transition-all duration-500 transform hover:-translate-y-2 text-center w-full max-w-[320px]"
            >
              {/* Profile Image */}
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-6 border-4 border-[#F7F3E6] group-hover:border-[#FD630A] transition-colors duration-500 shadow-inner">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  sizes="160px"
                  className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Text Content */}
              <div>
                <h4 className="text-lg font-bold text-[#1D1D1D] mb-1">{member.name}</h4>
                <p className="text-[#FD630A] font-bold uppercase tracking-widest text-[10px] mb-6">{member.role}</p>
              </div>

              {/* Action */}
              {member.email && (
                <a 
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center justify-center w-12 h-12 bg-[#F7F3E6] rounded-full text-[#1D1D1D] group-hover:bg-[#FD630A] group-hover:text-white transition-colors duration-300 shadow-sm"
                  title={`Email ${member.name}`}
                >
                  <Mail size={18} />
                </a>
              )}
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
