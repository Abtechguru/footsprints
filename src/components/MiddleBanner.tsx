import Image from "next/image";
import { LandingSettings } from "@/lib/landing-settings";

export default function MiddleBanner({ settings }: { settings: LandingSettings }) {
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden py-20 sm:py-28">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {(settings.about_image || "").endsWith(".mp4") ? (
          <video
            src={settings.about_image}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full brightness-50"
          />
        ) : (
          <Image 
            src={settings.about_image || "/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg"} 
            alt="Footprints Sourcing Fields" 
            fill
            sizes="100vw"
            className="object-cover brightness-50"
          />
        )}
      </div>

      {/* Overlay Text */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight uppercase leading-tight">
          Specialists in the sourcing and supply of sugar, proteins, grains and energy derivatives.
        </h2>
      </div>
    </div>
  );
}
