import { LandingSettings } from "@/lib/landing-settings";
import { Plane, Truck, Scale, ShieldCheck, Leaf } from "lucide-react";

const getIcon = (idx: number) => {
  const icons = [
    <Plane className="text-[#FD630A]" size={48} strokeWidth={1.5} />,
    <Truck className="text-[#FD630A]" size={48} strokeWidth={1.5} />,
    <Scale className="text-[#FD630A]" size={48} strokeWidth={1.5} />,
    <ShieldCheck className="text-[#FD630A]" size={48} strokeWidth={1.5} />,
    <Leaf className="text-[#FD630A]" size={48} strokeWidth={1.5} />
  ];
  return icons[idx % icons.length];
};

export default function ValueProps({ settings }: { settings: LandingSettings }) {
  const reasons = settings.value_props_list || [];

  return (
    <section className="py-12 bg-white relative overflow-hidden flex flex-col items-center">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 w-full text-center mb-10 animate-fade-in-up">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] mb-4">
          Open a Footprints Energy Account for International Trade
        </h3>
        <p className="text-[#FD630A] font-bold text-lg max-w-2xl mx-auto">
          {settings.value_props_title}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-12 w-full flex flex-col space-y-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {reasons.map((reason, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 group">
            <div className="shrink-0 flex items-center justify-center w-24 h-24">
              {getIcon(idx)}
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-bold text-[#1D1D1D] mb-2">{reason.title}</h4>
              <p className="text-sm text-[#1D1D1D]/70 font-medium leading-relaxed max-w-xl">
                {reason.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
