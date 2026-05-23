import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function RecentNews() {
  const { data: sessions } = await supabase
    .from("media_sessions")
    .select("*")
    .order("date", { ascending: false })
    .limit(3);

  const safeSessions = sessions || [];

  return (
    <section className="py-10 lg:py-16 bg-[#F7F3E6] border-t border-[#1D1D1D]/5">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 space-y-16">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px w-8 bg-[#FD630A]"></div>
            <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">Updates</span>
            <div className="h-px w-8 bg-[#FD630A]"></div>
          </div>
          <h3 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tight leading-[1.1] uppercase">
            Recent News & Operations
          </h3>
        </div>

        {/* 3-Column News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safeSessions.map((session) => {
            // Find first image/video URL for preview
            const mediaList = Array.isArray(session.media_urls) ? session.media_urls : [];
            const preview = mediaList[0];
            const previewUrl = preview?.url || "/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg";

            return (
              <div 
                key={session.id} 
                className="bg-white border border-[#1D1D1D]/5 hover:border-[#FD630A]/20 hover:shadow-xl transition-all duration-500 flex flex-col group rounded-sm"
              >
                {/* Visual Preview */}
                <div className="relative aspect-video overflow-hidden bg-[#F7F3E6] border-b border-[#1D1D1D]/5">
                  {(previewUrl || "").endsWith(".mp4") ? (
                    <video
                      src={previewUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <Image 
                      src={previewUrl} 
                      alt={session.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 text-[9px] font-bold text-[#1D1D1D] uppercase tracking-wider rounded-sm shadow-sm">
                    {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-[#1D1D1D] group-hover:text-[#FD630A] transition-colors leading-snug line-clamp-2 uppercase">
                      {session.title}
                    </h4>
                    <p className="text-sm text-[#1D1D1D]/60 leading-relaxed line-clamp-3">
                      {session.description}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Link 
                      href="/sessions" 
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FD630A] hover:text-[#1D1D1D] transition-colors"
                    >
                      <span>Read More &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {safeSessions.length === 0 && (
            <div className="col-span-full text-center py-12 text-[#1D1D1D]/50 font-medium">
              No recent news or sessions logged yet.
            </div>
          )}
        </div>

        {/* View All Sessions Button */}
        <div className="flex justify-center pt-4">
          <Link 
            href="/sessions" 
            className="bg-white border border-[#1D1D1D]/10 hover:border-[#FD630A] text-[#1D1D1D] hover:text-[#FD630A] text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-all rounded-sm shadow-sm"
          >
            View All Operations Log
          </Link>
        </div>

      </div>
    </section>
  );
}
