import Link from "next/link";
import { LandingSettings } from "@/lib/landing-settings";

export default function Hero({ settings }: { settings: LandingSettings }) {
  return (
    <section className="w-full bg-[#5D5D5D] text-white pt-16 pb-20 px-6 sm:px-12 flex flex-col justify-center">
      <div className="max-w-[90rem] w-full mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 uppercase">
          {settings.hero_title}
        </h2>
        <p className="text-sm sm:text-base text-white/90 mb-8 max-w-2xl font-medium">
          {settings.hero_subtitle}
        </p>
        <Link 
          href={settings.hero_button_link || "/products"} 
          className="inline-block bg-[#FD630A] text-white font-bold uppercase text-xs px-8 py-3.5 tracking-wider hover:bg-[#e05304] transition-colors"
        >
          {settings.hero_button_text || "Explore Collection"}
        </Link>
      </div>
    </section>
  );
}
