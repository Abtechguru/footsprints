import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Calendar, Film, Play, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0; // Fresh fetching

export default async function SessionsPage() {
  let sessions: any[] = [];
  let errorMsg = null;

  try {
    const { data, error } = await supabase
      .from("media_sessions")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) {
      errorMsg = error.message;
    } else {
      sessions = data || [];
    }
  } catch (err: any) {
    errorMsg = err.message;
  }

  return (
    <div className="min-h-screen bg-[#F7F3E6] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 pt-36 pb-20 px-6 sm:px-12 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Background Decorative Arcs */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 overflow-hidden">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-150">
            {[...Array(12)].map((_, i) => (
              <circle key={i} cx="500" cy="500" r={100 + i * 60} fill="none" stroke="#1D1D1D" strokeWidth="1" />
            ))}
          </svg>
        </div>

        {/* Section Header */}
        <div className="relative z-10 mb-16 lg:mb-24 max-w-3xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-px w-12 bg-[#FD630A]"></div>
            <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">Operations Log</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1D1D1D] tracking-tight leading-[1.05] mb-6">
            Interactive <span className="text-[#FD630A] italic font-serif">Sessions</span> <br /> & Event Galleries
          </h1>
          <p className="text-lg text-[#1D1D1D]/70 leading-relaxed font-medium">
            Explore our real-time trade logs, logistics audits, product inspections, and physical trade operations documented live across our global network.
          </p>
        </div>

        {/* Sessions Grid */}
        <div className="relative z-10 space-y-12 sm:space-y-16">
          {sessions.map((session, sIdx) => {
            const media = Array.isArray(session.media_urls) ? session.media_urls : [];
            return (
              <div 
                key={session.id}
                className="bg-white border border-[#1D1D1D]/5 rounded-sm p-6 sm:p-10 hover:shadow-[0_45px_90px_-25px_rgba(29,29,29,0.08)] transition-all duration-700 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
              >
                {/* Left Side: Text Details (col 4) */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#DAA35D] bg-[#F7F3E6] px-3.5 py-1.5 rounded-full">
                      <Calendar size={12} className="text-[#FD630A]" />
                      <span>{session.date}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] tracking-tight leading-snug">
                      {session.title}
                    </h2>

                    {session.description && (
                      <p className="text-sm sm:text-base text-[#1D1D1D]/65 leading-relaxed font-medium whitespace-pre-line">
                        {session.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 border-t border-[#1D1D1D]/5 mt-6 lg:mt-0 flex items-center space-x-2 text-xs font-bold text-[#1D1D1D]/40">
                    <Film size={14} />
                    <span>Contains {media.length} media attachments</span>
                  </div>
                </div>

                {/* Right Side: Media Showcase Grid (col 8) */}
                <div className="lg:col-span-8">
                  {media.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {media.map((item: any, idx: number) => {
                        const isVideo = item.type === "video";
                        return (
                          <div 
                            key={idx}
                            className={`group relative overflow-hidden bg-[#F7F3E6] border border-[#1D1D1D]/5 rounded-sm aspect-video ${
                              media.length === 1 ? "sm:col-span-2 aspect-[16/9]" : ""
                            }`}
                          >
                            {isVideo ? (
                              <div className="w-full h-full relative">
                                <video 
                                  src={item.url} 
                                  controls 
                                  preload="metadata" 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase pointer-events-none z-10 flex items-center space-x-1">
                                  <Play size={8} fill="white" />
                                  <span>Video Clip</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full relative group cursor-zoom-in">
                                <Image 
                                  src={item.url} 
                                  alt={session.title} 
                                  fill
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#1D1D1D] text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase pointer-events-none">
                                  Image
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full min-h-[200px] flex items-center justify-center border border-dashed border-[#1D1D1D]/10 rounded-sm bg-[#F7F3E6]/10 text-sm text-[#1D1D1D]/50 font-medium">
                      No media attached to this session.
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div className="bg-white border border-[#1D1D1D]/5 p-12 text-center rounded-sm">
              <Film size={40} className="mx-auto text-[#FD630A] mb-4 opacity-70" />
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">No Sessions Logged</h3>
              <p className="text-sm text-[#1D1D1D]/60 max-w-md mx-auto">
                No multimedia sessions are available at this time. Please check back later or log in to the admin panel to add a session.
              </p>
              <div className="mt-8">
                <Link href="/" className="inline-flex items-center space-x-2 text-sm font-bold text-[#1D1D1D] hover:text-[#FD630A] transition-colors">
                  <ArrowLeft size={16} />
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
