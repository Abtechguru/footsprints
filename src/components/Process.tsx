import Link from "next/link";
import { FileText, BadgeCheck, Truck } from "lucide-react";
import { LandingSettings } from "@/lib/landing-settings";

const getStepIcon = (idx: number) => {
  const icons = [
    <FileText className="text-[#FD630A]" size={20} />,
    <BadgeCheck className="text-[#FD630A]" size={20} />,
    <Truck className="text-[#FD630A]" size={20} />
  ];
  return icons[idx % icons.length];
};

export default function Process({ settings }: { settings: LandingSettings }) {
  const steps = settings.process_steps_list || [];

  return (
    <section className="py-10 lg:py-16 bg-white border-y border-[#1D1D1D]/5 relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="10" y1="0" x2="10" y2="100" stroke="#1D1D1D" strokeWidth="0.1" />
          <line x1="90" y1="0" x2="90" y2="100" stroke="#1D1D1D" strokeWidth="0.1" />
        </svg>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Logistics World Map SVG with Pulsing Nodes */}
          <div className="relative flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-[500px] aspect-[1.6] relative bg-[#1D1D1D] rounded-sm p-4 shadow-xl border border-[#1D1D1D]/10">
              <svg className="w-full h-full opacity-60" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* World Outline / Abstract Grid */}
                <path d="M50 150 L750 150 M50 250 L750 250 M50 350 L750 350" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                <path d="M150 50 L150 450 M300 50 L300 450 M450 50 L450 450 M600 50 L600 450" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                
                {/* Connecting Route Arcs */}
                <path d="M 180 180 Q 300 100 450 280" stroke="#FD630A" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                <path d="M 450 280 Q 550 200 680 220" stroke="#FD630A" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                <path d="M 180 180 Q 350 350 450 280" stroke="#DAA35D" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />

                {/* Hub 1: Americas (Houston) */}
                <circle cx="180" cy="180" r="6" fill="#FD630A" />
                <circle cx="180" cy="180" r="12" stroke="#FD630A" strokeWidth="1" className="animate-ping" />
                
                {/* Hub 2: Europe / ME (Paris) */}
                <circle cx="410" cy="150" r="6" fill="#FD630A" />
                <circle cx="410" cy="150" r="12" stroke="#FD630A" strokeWidth="1" className="animate-ping" />

                {/* Hub 3: Africa (Lagos) */}
                <circle cx="450" cy="280" r="8" fill="#FD630A" />
                <circle cx="450" cy="280" r="16" stroke="#FD630A" strokeWidth="1" className="animate-ping" />
                
                {/* Hub 4: Asia (Singapore) */}
                <circle cx="680" cy="320" r="6" fill="#FD630A" />
                <circle cx="680" cy="320" r="12" stroke="#FD630A" strokeWidth="1" className="animate-ping" />
              </svg>
              
              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-sm">
                <span className="text-[9px] font-bold text-white uppercase tracking-wider block">Global Sourcing Network</span>
                <span className="text-[8px] text-white/60 block">Real-time supply routes active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title and Process Steps */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-px w-12 bg-[#FD630A]"></div>
                <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">{settings.process_label || "Logistics"}</span>
              </div>
              <h3 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tight leading-[1.1] uppercase">
                {settings.process_title || "Global Logistics & Operations"}
              </h3>
            </div>

            {/* Vertical Steps */}
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="p-3 bg-[#F7F3E6] group-hover:bg-[#FD630A] group-hover:text-white transition-colors duration-500 rounded-sm text-[#1D1D1D]">
                    {getStepIcon(idx)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#1D1D1D] tracking-tight">{step.title}</h4>
                    <p className="text-sm text-[#1D1D1D]/60 leading-relaxed font-medium mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link 
                href="/sessions" 
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FD630A] hover:text-[#1D1D1D] transition-colors"
              >
                <span>View Operations Log &rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

