import { Check } from "lucide-react";

export default function ProductRibbon() {
  const items = [
    "Sugar & Sweeteners",
    "Premium Grains",
    "Spices & Seasonings",
    "Energy Derivatives"
  ];

  return (
    <div className="w-full bg-[#DAA35D] text-[#1D1D1D] py-8 px-6 sm:px-12">
      <div className="max-w-[90rem] mx-auto flex flex-col space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <Check size={24} className="text-[#FD630A] font-bold" strokeWidth={3} />
            <span className="text-sm font-bold tracking-wide">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
