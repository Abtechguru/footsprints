import Image from "next/image";

export default function About() {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-[#1D1D1D]/5 relative overflow-hidden">
      {/* Bold Wavy Architectural Lines (Inspiration Image 1) - Reduced Opacity */}
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-[0.05] pointer-events-none z-0">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {[...Array(8)].map((_, i) => (
            <path 
              key={i}
              d={`M ${1000 - i * 40},0 Q ${800 - i * 40},400 ${1000 - i * 40},1000`}
              fill="none"
              stroke="#1D1D1D"
              strokeWidth="2"
              className="opacity-100"
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <path 
              key={i + 10}
              d={`M 0,${200 + i * 80} Q 400,${400 + i * 80} 1000,${100 + i * 80}`}
              fill="none"
              stroke="#1D1D1D"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
      <div className="absolute -bottom-20 -left-20 w-1/2 h-1/2 opacity-[0.03] pointer-events-none z-0 rotate-12">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {[...Array(10)].map((_, i) => (
            <path 
              key={i}
              d={`M 0,${i * 40} Q 250,${i * 40 + 100} 500,${i * 40}`}
              fill="none"
              stroke="#FD630A"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Simple Top Label */}
        <div className="flex items-center space-x-4 mb-12 lg:mb-20">
          <div className="h-px w-12 bg-[#FD630A]"></div>
          <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">Our Mission</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left: Balanced Typography */}
          <div className="space-y-12">
            <h2 className="text-5xl lg:text-6xl font-semibold text-[#1D1D1D] tracking-tight leading-[1.1]">
              Leading the way in <br />
              <span className="text-[#FD630A]">Global Commodity</span> Trade.
            </h2>
            
            <div className="space-y-8 text-lg text-[#1D1D1D]/60 leading-relaxed font-medium max-w-xl">
              <p>
                Footprints Energy is a leading commodity trader , specializing in agricultural produce, animal protein and energy derivatives. 
              </p>
              <p>
                We supply commodities such as Sugar (IC45, VHP) , Animal Protein (Chicken, Bovine and Swine) and Grains (Soy, Corn and Coffee). We also facilitate trade of petroleum derivates such as Jet A4, AGO and PMS.
              </p>
              <div className="pt-8 border-t border-[#1D1D1D]/5">
                <p className="text-[#1D1D1D] font-bold text-2xl leading-snug">
                  At Footprints, we understand our markets, follow trends and proactively take measures to act in the best interest of our customers.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Properly Placed Visual */}
          <div className="relative group">
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px] overflow-hidden rounded-sm bg-[#F7F3E6]">
              <Image 
                src="/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg" 
                alt="Global Commodity Trade" 
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            {/* Minimalist Floating Accent */}
            <div className="absolute bottom-0 left-0 sm:-bottom-8 sm:-left-8 bg-[#FD630A] text-white p-6 sm:p-10 shadow-2xl">
              <span className="block text-4xl font-bold tracking-tighter">Global</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mt-2">Trading Network</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

