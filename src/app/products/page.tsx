import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Wind, Activity, Box } from "lucide-react";

export default function ProductsPage() {
  const categories = [
    {
      title: "Agriculture & Grains",
      icon: <Wind className="text-[#FD630A]" size={20} />,
      products: [
        { name: "ICUMSA 45 Sugar", id: "icumsa-45-sugar", desc: "The highest quality refined white sugar, perfect for human consumption and food applications.", image: "/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg" },
        { name: "ICUMSA 150 Sugar", id: "icumsa-150-sugar", desc: "Refined white sugar suitable for various industrial and food processing needs.", image: "/images/ChatGPT-Image-Jul-19-2025-06_43_32-PM.png" },
        { name: "VHP Sugar", id: "vhp-sugar", desc: "Very High Polarization raw sugar, typically used as a raw material for refineries.", image: "/images/ChatGPT-Image-Jul-19-2025-06_59_43-PM.png" },
        { name: "White Sugar", id: "white-sugar", desc: "Premium grade white cane sugar for global consumer and industrial markets.", image: "/images/What-Is-Sodium-Tripolyphosphate_.jpeg" },
        { name: "Brown Sugar", id: "brown-sugar", desc: "High-quality brown sugar, rich in molasses and flavor.", image: "/images/Posture-Perfect-Workout.jpeg" },
        { name: "Brazilian Coffee", id: "brazilian-coffee", desc: "World-renowned coffee beans sourced directly from the finest Brazilian plantations.", image: "/images/The-Frugal-Drinkers-Guide-to-Atlas-Coffee-Club.jpeg" },
        { name: "Coffee", id: "coffee", desc: "Premium roasted coffee blends for the global hospitality and retail markets.", image: "/images/Delicious-Spiced-Hot-Chocolate-Recipe-with-Whipped-Cream-e1752928306492.jpeg" },
        { name: "Corn", id: "corn", desc: "High-grade non-GMO corn sourced for global food and feed security.", image: "/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg" },
        { name: "Black Pepper", id: "black-pepper", desc: "Premium quality black pepper berries, harvested and dried for maximum potency.", image: "/images/Black-Pepper.jpeg" }
      ]
    },
    {
      title: "Animal Protein",
      icon: <Box className="text-[#FD630A]" size={20} />,
      products: [
        { name: "Animal Protein", id: "animal-protein", desc: "Comprehensive supply of poultry, beef, and swine products processed to international standards.", image: "/images/animal-protein.png" }
      ]
    },
    {
      title: "Energy Derivatives",
      icon: <Activity className="text-[#FD630A]" size={20} />,
      products: [
        { name: "Jet A1 Fuel", id: "jet-a1", desc: "Aviation-grade kerosene for global commercial and private air transport.", image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800" },
        { name: "AGO & PMS", id: "ago-pms", desc: "Automotive Gas Oil (Diesel) and Premium Motor Spirit (Gasoline) for energy markets.", image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800" }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#F7F3E6]">
      <Navbar />

      {/* --- PRODUCTS HERO --- */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        {/* Architectural Technical Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1D1D1D" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-3 mb-10">
              <div className="h-px w-8 bg-[#DAA35D]"></div>
              <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">Inventory</span>
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-semibold text-[#1D1D1D] leading-[0.9] tracking-tighter mb-12">
              Global Supply, <br />
              <span className="text-[#FD630A]">Precision Trade.</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-[#1D1D1D]/70 leading-relaxed font-medium max-w-2xl">
              We manage the end-to-end trade of essential commodities, connecting producers to offtakers across the globe.
            </p>
          </div>
        </div>
      </section>

      {/* --- PRODUCTS SECTIONS --- */}
      {categories.map((category, idx) => {
        const isFeatured = category.products.length < 3;
        
        return (
          <section 
            key={idx} 
            id={category.title.toLowerCase().replace(/\s+/g, '-')}
            className={`py-32 ${idx % 2 !== 0 ? 'bg-[#1D1D1D] text-white' : 'bg-white text-[#1D1D1D]'}`}
          >
            <div className="max-w-[90rem] mx-auto px-6 sm:px-12">
              {/* Category Header */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    {category.icon}
                    <div className={`h-px w-12 ${idx % 2 !== 0 ? 'bg-white/20' : 'bg-[#1D1D1D]/10'}`}></div>
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-semibold tracking-tighter">{category.title}</h2>
                </div>
                <p className={`max-w-md text-lg ${idx % 2 !== 0 ? 'text-white/60' : 'text-[#1D1D1D]/60'} font-medium`}>
                  {category.title === "Animal Protein" 
                    ? "Facilitating the global trade of premium frozen and processed meat products."
                    : `Sourcing high-quality ${category.title.toLowerCase()} products through established global partnerships.`}
                </p>
              </div>

              {isFeatured ? (
                /* FEATURED LAYOUT (Side-by-Side) */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                  <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-sm shadow-2xl group">
                    <Image 
                      src={category.products[0].image} 
                      alt={category.products[0].name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-3xl lg:text-5xl font-semibold tracking-tight">{category.products[0].name}</h3>
                      <p className={`text-xl leading-relaxed ${idx % 2 !== 0 ? 'text-white/60' : 'text-[#1D1D1D]/60'} font-medium`}>
                        {category.products[0].desc}
                      </p>
                    </div>

                    {/* Specific Range Tags for Protein/Energy */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      {category.title === "Animal Protein" ? (
                        <>
                          {["Grade A Chicken", "Premium Bovine", "Swine Products", "Processed Cuts"].map((tag) => (
                            <span key={tag} className={`px-5 py-2 border rounded-full text-[10px] font-bold uppercase tracking-widest ${idx % 2 !== 0 ? 'border-white/20 text-white/80' : 'border-[#1D1D1D]/10 text-[#1D1D1D]/60'}`}>
                              {tag}
                            </span>
                          ))}
                        </>
                      ) : category.title === "Energy Derivatives" ? (
                         <>
                          {["Jet A1 / JP54", "EN590 Diesel", "AGO & PMS", "Fuel Oil D6"].map((tag) => (
                            <span key={tag} className={`px-5 py-2 border rounded-full text-[10px] font-bold uppercase tracking-widest ${idx % 2 !== 0 ? 'border-white/20 text-white/80' : 'border-[#1D1D1D]/10 text-[#1D1D1D]/60'}`}>
                              {tag}
                            </span>
                          ))}
                        </>
                      ) : null}
                    </div>

                    <div className="pt-8">
                       <Link href={`/products/${category.products[0].id}`} className={`px-10 py-5 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-all inline-block ${idx % 2 !== 0 ? 'bg-[#FD630A] text-white hover:bg-white hover:text-[#1D1D1D]' : 'bg-[#1D1D1D] text-white hover:bg-[#FD630A]'}`}>
                          View Specifications
                       </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* GRID LAYOUT (3-Column) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
                  {category.products.map((product, pIdx) => (
                    <div key={pIdx} className="group cursor-pointer">
                      <Link href={`/products/${product.id}`}>
                        <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-8 shadow-xl">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                          
                          {/* Hover Overlay Detail */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-[2px]">
                             <div className="bg-white text-[#1D1D1D] px-8 py-4 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center space-x-3">
                                <span>View Specs</span>
                                <ChevronRight size={14} />
                             </div>
                          </div>
                        </div>
                      </Link>

                      <div className="space-y-3">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="text-2xl font-semibold tracking-tight group-hover:text-[#FD630A] transition-colors">{product.name}</h3>
                        </Link>
                        <p className={`text-sm leading-relaxed ${idx % 2 !== 0 ? 'text-white/50' : 'text-[#1D1D1D]/50'} font-medium`}>
                          {product.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* --- CTA SECTION --- */}
      <section className="py-40 bg-[#F7F3E6] text-center relative overflow-hidden">
        {/* Subtle Tech Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#1D1D1D 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] mb-10 tracking-tighter leading-tight">
            Ready to secure your next <br /> <span className="text-[#FD630A]">commodity shipment?</span>
          </h2>
          <p className="text-lg text-[#1D1D1D]/60 font-medium mb-12 max-w-xl mx-auto leading-relaxed">
            Our trade desk operates across multiple time zones to ensure timely execution and logistical support for our global offtakers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/contact" className="bg-[#FD630A] text-white px-10 py-5 rounded-sm text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1D1D1D] transition-all">
              Request a Quote
            </Link>
            <Link href="mailto:info@footprintsenergy.com" className="text-[#1D1D1D] px-10 py-5 rounded-sm text-xs font-bold uppercase tracking-[0.2em] border border-[#1D1D1D]/10 hover:border-[#FD630A] transition-all">
              Speak to our Desk
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}
