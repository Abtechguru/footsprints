import Image from "next/image";

export default function ProductRibbon() {
  const items = [
    { name: "Sugar", img: "/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg" },
    { name: "Grains", img: "/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg" },
    { name: "Spices", img: "/images/Black-Pepper.jpeg" },
    { name: "Petroleum", img: "/images/container-ship.png" }
  ];

  return (
    <div className="w-full bg-[#1D1D1D] text-white py-12 px-6 sm:px-12 relative overflow-hidden border-b border-white/5">
      <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-center md:text-left max-w-xl">
          We source and supply a broad range of premium agricultural products, proteins and energy globally.
        </h3>
        
        {/* Horizontal Thumbnails Row */}
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto justify-center">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 group-hover:border-[#FD630A] transition-all duration-300">
                <Image 
                  src={item.img} 
                  alt={item.name} 
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 group-hover:text-[#FD630A] transition-colors">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
