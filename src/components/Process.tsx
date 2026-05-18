import { ArrowRight, FileText, BadgeCheck, Truck } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "LOI (Letter of Intent)",
    desc: "To get started, please send a Letter of Intent outlining product specifications, quantity, and destination. We'll promptly provide a formal offer.",
    icon: <FileText className="text-[#FD630A]" size={32} />
  },
  {
    id: "02",
    title: "FCO (Full Corporate Offer)",
    desc: "Our Full Corporate Offer will be tailored specifically to your request and will remain valid for a limited period, reflecting global market prices.",
    icon: <BadgeCheck className="text-[#FD630A]" size={32} />
  },
  {
    id: "03",
    title: "SPA & Delivery",
    desc: "To finalize, a Sales and Purchase Agreement (SPA) must be executed. Footprints Energy operates under Incoterms and is based in the USA.",
    icon: <Truck className="text-[#FD630A]" size={32} />
  }
];

export default function Process() {
  return (
    <section className="py-16 lg:py-24 bg-[#1D1D1D] text-white relative overflow-hidden">
      {/* Dark Mode Architectural Lines - Normalized Opacity */}
      <div className="absolute top-0 right-0 w-full h-full opacity-[0.06] pointer-events-none z-0">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rotate-45">
          <path d="M0,500 L1000,500 M500,0 L500,1000" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="500" cy="500" r="300" stroke="#FD630A" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Decorative vertical line to match Hero/About */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 hidden lg:block z-0"></div>

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
        <div className="mb-12 lg:mb-20">
          <h2 className="text-[10px] font-bold text-[#FD630A] uppercase tracking-[0.4em] mb-4">The Lifecycle</h2>
          <h3 className="text-4xl lg:text-6xl font-semibold tracking-tight">How We <span className="text-white/40 italic">Work</span></h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-0 border-t border-white/10 pt-16">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="flex flex-col space-y-8 lg:px-12 group first:pl-0 last:pr-0 lg:border-r border-white/5 last:border-r-0 pb-8 lg:pb-0 border-b lg:border-b-0 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-6xl font-bold text-white/5 group-hover:text-[#FD630A]/20 transition-colors duration-500">{step.id}</span>
                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[#FD630A]/10 transition-colors duration-500">
                  {step.icon}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-2xl font-bold tracking-tight group-hover:text-[#FD630A] transition-colors">{step.title}</h4>
                <p className="text-white/60 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>

              {idx < 2 && (
                <div className="hidden lg:flex items-center text-white/10 group-hover:text-[#FD630A] transition-colors duration-500">
                  <ArrowRight size={48} className="translate-x-12" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
