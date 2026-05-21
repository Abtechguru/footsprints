import { LandingSettings } from "@/lib/landing-settings";

export default function MissionQuote({ settings }: { settings: LandingSettings }) {
  return (
    <div className="w-full bg-[#F7F3E6] py-16 px-6 sm:px-12 border-b border-[#1D1D1D]/5">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-2xl sm:text-4xl font-semibold text-[#1D1D1D] tracking-tight leading-relaxed italic">
          "{settings.about_quote || "We are proactive in finding specific products, which bring that all important competitive edge."}"
        </p>
      </div>
    </div>
  );
}
