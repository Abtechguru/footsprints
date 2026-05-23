import Image from "next/image";
import Link from "next/link";
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
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight uppercase leading-tight">
          READY TO PARTNER WITH US?
        </h2>
        <p className="text-white text-lg font-medium">
          Experience premium global sourcing with Footprints Energy.
        </p>
        <div className="pt-4">
          <Link 
            href="/contact" 
            className="inline-block bg-[#FD630A] text-white font-bold uppercase text-xs px-8 py-3.5 tracking-wider hover:bg-[#e05304] transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </div>
    </div>
  );
}
