import { Globe, Clock, ShieldCheck, Zap, HeartHandshake } from "lucide-react";

const reasons = [
  {
    title: "Global Network",
    desc: "Direct access to top-tier producers and suppliers worldwide, ensuring quality at the source.",
    icon: <Globe className="text-[#FD630A]" size={24} />
  },
  {
    title: "Timely Logistics",
    desc: "Robust supply chain management and logistics partnerships ensure your shipments arrive on time.",
    icon: <Clock className="text-[#FD630A]" size={24} />
  },
  {
    title: "Flexible Terms",
    desc: "Tailored trade agreements and financial instruments designed to meet your specific needs.",
    icon: <Zap className="text-[#FD630A]" size={24} />
  },
  {
    title: "Full Transparency",
    desc: "End-to-end documentation and transparent communication throughout the entire trade lifecycle.",
    icon: <ShieldCheck className="text-[#FD630A]" size={24} />
  },
  {
    title: "Exceptional Support",
    desc: "Dedicated account management from initial inquiry to final delivery and beyond.",
    icon: <HeartHandshake className="text-[#FD630A]" size={24} />
  }
];

export default function ValueProps() {
  return (
    <section className="py-16 lg:py-24 bg-[#F7F3E6] relative overflow-hidden">
      {/* Radiating Lines Texture - Normalized Opacity */}
      <div className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 opacity-[0.04] pointer-events-none z-0">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {[...Array(10)].map((_, i) => (
            <line key={i} x1="0" y1="500" x2="1000" y2={i * 100} stroke="#1D1D1D" strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Header Content */}
          <div className="lg:col-span-4 sticky top-32">
            <h2 className="text-sm font-bold text-[#DAA35D] uppercase tracking-[0.2em] mb-4">The Advantage</h2>
            <h3 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tight leading-[1.1] mb-8">
              Why Choose <br /> <span className="text-[#FD630A]">Footprints Energy?</span>
            </h3>
            <p className="text-lg text-[#1D1D1D]/70 font-medium leading-relaxed">
              Trusted globally for reliable supply, competitive pricing, and seamless delivery. At Footprints Energy, we combine market expertise with strong partnerships to serve you better every time.
            </p>
          </div>

          {/* Value Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {reasons.map((reason, idx) => (
              <div key={idx}>
                <div className="h-full bg-white p-10 border border-[#1D1D1D]/5 hover:border-[#FD630A]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#1D1D1D]/5 group">
                  <div className="bg-[#F7F3E6] w-12 h-12 flex items-center justify-center rounded-xl mb-6 group-hover:bg-[#FD630A] group-hover:text-white transition-colors duration-500">
                    {reason.icon}
                  </div>
                  <h4 className="text-xl font-bold text-[#1D1D1D] mb-3">{reason.title}</h4>
                  <p className="text-[#1D1D1D]/60 leading-relaxed font-medium">
                    {reason.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
