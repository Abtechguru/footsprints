import Image from "next/image";
import Link from "next/link";

export default function Partnership() {
  return (
    <div className="relative min-h-[50vh] w-full flex items-center justify-center overflow-hidden py-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/container-ship.png" 
          alt="Partnerships That Last - Cargo Ship" 
          fill
          sizes="100vw"
          className="object-cover brightness-[0.7]"
        />
        {/* Ambient shadow overlays */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Centered Glassmorphic Card (Target Design Layout) */}
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        <div className="bg-white/90 backdrop-blur-md border border-white/20 p-8 sm:p-12 shadow-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1D] tracking-tight uppercase leading-snug mb-4 border-b border-[#1D1D1D]/10 pb-4">
            Partnerships <br /> That Last
          </h2>
          <p className="text-sm text-[#1D1D1D]/75 leading-relaxed font-semibold mb-8">
            We build long-term, sustainable relationships with our global trade partners, ensuring smooth commodity delivery and absolute supply security.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-[#FD630A] hover:bg-[#e05304] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-colors rounded-sm"
          >
            Work with Us
          </Link>
        </div>
      </div>
    </div>
  );
}
