import Image from "next/image";
import { LandingSettings } from "@/lib/landing-settings";

export default function Process({ settings }: { settings: LandingSettings }) {
  const steps = settings.process_steps_list || [];
  
  // Images to mimic the stacked images in the template
  const stepImages = [
    "/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg",
    "/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg",
    "/images/container-ship.png"
  ];

  return (
    <section className="py-12 bg-white flex flex-col items-center">
      <div className="max-w-[90rem] w-full mx-auto px-6 sm:px-12 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-[#FD630A] uppercase tracking-wider mb-10 max-w-3xl mx-auto">
          {settings.process_title || "Global Logistics & Operations"}
        </h3>

        <div className="flex flex-col space-y-12">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center max-w-4xl mx-auto w-full">
              <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1] overflow-hidden mb-6 bg-gray-100">
                <Image 
                  src={stepImages[idx % stepImages.length]} 
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-lg font-bold text-[#1D1D1D] uppercase tracking-wide">
                {idx + 1}. {step.title}
              </h4>
              <p className="text-sm text-[#1D1D1D]/70 mt-2 max-w-2xl font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
