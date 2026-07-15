import Image from "next/image";
import Link from "next/link";
import NewsCard from "./NewsCard";
import { supabase } from "@/lib/supabase";

export default async function RecentNews() {
  const { data: sessions } = await supabase
    .from("media_sessions")
    .select("*")
    .order("date", { ascending: false })
    .limit(3);

  const safeSessions = sessions || [];

  return (
    <section className="py-8 lg:py-12 bg-[#F7F3E6] border-t border-[#1D1D1D]/5">
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
              <NewsCard key={session.id} session={session} previewUrl={previewUrl} />
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
            className="bg-white border border-[#1D1D1D]/10 hover:border-[#FD630A] hover:bg-[#FD630A] text-[#1D1D1D] hover:text-white text-sm font-bold uppercase tracking-widest px-10 py-4 transition-all duration-300 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(253,99,10,0.2)]"
          >
            View All Operations Log
          </Link>
        </div>

      </div>
    </section>
  );
}
