"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Maximize2 } from "lucide-react";

export default function NewsCard({ session, previewUrl }: { session: any, previewUrl: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isVideo = (previewUrl || "").endsWith(".mp4");

  return (
    <>
      <div className="bg-white border border-[#1D1D1D]/10 hover:border-[#FD630A]/30 hover:shadow-[0_20px_50px_rgba(253,99,10,0.1)] rounded-[2rem] transition-all duration-500 flex flex-col group overflow-hidden transform hover:-translate-y-2">
        {/* Visual Preview */}
        <div 
          className="relative aspect-[16/10] overflow-hidden bg-[#F7F3E6] border-b border-[#1D1D1D]/5 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none transition-opacity duration-700 group-hover:opacity-0"></div>
          {isVideo ? (
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
              sizes="(max-width: 768px) 100vw, 33vw" 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          )}
          
          {/* Overlay Icon */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
             <div className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-[#FD630A] transform scale-50 group-hover:scale-100 transition-transform duration-500 shadow-xl">
               <Maximize2 size={24} strokeWidth={2.5} />
             </div>
          </div>
          
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold text-[#1D1D1D] uppercase tracking-wider rounded-xl shadow-md z-20">
            {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-[#1D1D1D] group-hover:text-[#FD630A] transition-colors leading-snug line-clamp-2 uppercase">
              {session.title}
            </h4>
            <p className="text-base text-[#1D1D1D]/60 leading-relaxed line-clamp-3">
              {session.description}
            </p>
          </div>
          
          <div className="pt-4 border-t border-[#1D1D1D]/5">
            <Link href={`/sessions`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FD630A] hover:text-[#1D1D1D] transition-colors">
              <span>Read More &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Lightbox */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl animate-fade-in" 
          onClick={() => setIsModalOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 p-3 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md z-50" 
            onClick={() => setIsModalOpen(false)}
          >
            <X size={24} />
          </button>
          
          <div 
            className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up" 
            onClick={e => e.stopPropagation()}
          >
            {isVideo ? (
              <video src={previewUrl} controls autoPlay className="w-full h-full object-contain bg-black" />
            ) : (
              <Image src={previewUrl} alt={session.title} fill className="object-contain bg-black" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
