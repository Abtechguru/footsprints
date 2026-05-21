import Image from "next/image";
import Link from "next/link";
import { LandingSettings } from "@/lib/landing-settings";

export default function ProductsSummary({ settings }: { settings: LandingSettings }) {
  return (
    <section className="py-16 lg:py-24 bg-white border-t border-[#1D1D1D]/5 relative overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10 space-y-16">
        
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
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-square overflow-hidden rounded-sm bg-[#F7F3E6] border border-[#1D1D1D]/5">
              <Image 
                src={settings.hero_image1 || "/images/Black-Pepper.jpeg"} 
                alt="Product 1" 
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-sm bg-[#F7F3E6] border border-[#1D1D1D]/5 mt-8">
              <Image 
                src={settings.about_image || "/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg"} 
                alt="Product 2" 
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
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
