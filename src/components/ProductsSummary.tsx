import Image from "next/image";
import Link from "next/link";
import { LandingSettings } from "@/lib/landing-settings";

export default function ProductsSummary({ settings }: { settings: LandingSettings }) {
  return (
    <section className="py-8 lg:py-12 bg-white border-t border-[#1D1D1D]/5 relative overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10 space-y-16 animate-fade-in-up">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h3 className="text-4xl lg:text-5xl font-extrabold text-[#1D1D1D] tracking-tight leading-[1.1] uppercase">
            Our Products Selection
          </h3>
          <p className="text-sm font-bold text-[#DAA35D] uppercase tracking-[0.25em]">
            Quality Sourcing & Trusted Operations
          </p>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Left Column: Visual collage representation */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#FD630A]/5 to-[#DAA35D]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-sm lg:max-w-md relative z-10">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white border border-white/40 shadow-xl group transform hover:-translate-y-2 transition-all duration-700">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
                {(settings.hero_image1 || "").endsWith(".mp4") ? (
                  <video
                    src={settings.hero_image1}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-1000"
                  />
                ) : (
                  <Image 
                    src={settings.hero_image1 || "/images/Black-Pepper.jpeg"} 
                    alt="Product 1" 
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  />
                )}
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white border border-white/40 shadow-xl group mt-12 transform hover:-translate-y-2 transition-all duration-700">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
                {(settings.about_image || "").endsWith(".mp4") ? (
                  <video
                    src={settings.about_image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-1000"
                  />
                ) : (
                  <Image 
                    src={settings.about_image || "/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg"} 
                    alt="Product 2" 
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Text & Button */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-base text-[#1D1D1D]/75 leading-relaxed font-semibold">
              At Footprints Energy, we operate as specialists in the supply and trade of Sugar, Grains, Animal Proteins, and Petroleum. We guarantee strict adherence to industry quality standards, sizing parameters, and moisture levels, ensuring every batch meets the international specifications required by our corporate clients.
            </p>
            <div className="pt-4">
              <Link 
                href="/products" 
                className="inline-block bg-[#1D1D1D] hover:bg-[#FD630A] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-colors rounded-sm shadow-md"
              >
                View Products Selection
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
