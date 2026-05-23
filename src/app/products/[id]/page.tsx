import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Package, Globe, Users, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

// Centralized Product Data
const productsData = [
  {
    id: "animal-protein",
    name: "Animal Protein",
    category: "Animal Protein",
    image: "/images/animal-protein.png",
    subtitle: "High-Quality Animal Protein",
    shortDesc: "Sustainably Sourced. Nutrient-Rich. Globally Delivered. Footprints Energy supplies premium-grade animal protein products for food processors, manufacturers, retailers, and bulk buyers.",
    range: [
      "Beef (Frozen Cuts, Boneless, Offals)",
      "Poultry (Whole Chicken, Chicken Parts, Gizzards)",
      "Goat & Lamb Meat",
      "Fish (Tilapia, Mackerel, Catfish - fresh or frozen)",
      "Dry Animal Protein (Stockfish, Smoked Fish, Meat Powder)"
    ],
    quality: [
      "Processed and packaged under strict food safety standards",
      "Halal & export-certified where required",
      "Packed for freshness with cold-chain logistics"
    ],
    packaging: [
      "Available in bulk: 10kg, 25kg, 50kg cartons or bags",
      "Cold storage & shipping available for local and international orders"
    ],
    idealFor: [
      "Food manufacturers & distributors",
      "Retail chains & wholesale markets",
      "Export buyers across Africa, Middle East, and Europe"
    ]
  },
  {
    id: "icumsa-45-sugar",
    name: "ICUMSA 45 Sugar",
    category: "Agriculture & Grains",
    image: "/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg",
    subtitle: "Premium Refined White Sugar",
    shortDesc: "The highest grade of refined sugar available. Our ICUMSA 45 is globally recognized for its purity, whiteness, and consistent crystal quality.",
    range: ["Refined White Sugar (Grade A)", "Crystal Purity: 99.80% minimum", "Moisture: 0.04% maximum", "Solubility: 100% dry and free-flowing"],
    quality: ["SGS certified for international export", "Non-GMO and 100% natural cane source", "Refined using state-of-the-art filtration"],
    packaging: ["50kg PP/PE bags with inner lining", "Bulk vessel shipments available"],
    idealFor: ["Beverage manufacturers", "Confectionery industries"]
  },
  {
    id: "icumsa-150-sugar",
    name: "ICUMSA 150 Sugar",
    category: "Agriculture & Grains",
    image: "/images/ChatGPT-Image-Jul-19-2025-06_43_32-PM.png",
    subtitle: "Crystal White Sugar (S-30)",
    shortDesc: "High-quality crystal sugar suitable for direct consumption and industrial use in beverages and food processing.",
    range: ["Polarization: 99.70% min", "Ash content: 0.10% max", "Moisture: 0.10% max", "Color: 150 ICUMSA Units max"],
    quality: ["Halal Certified", "SGS Inspected", "Non-GMO"],
    packaging: ["50kg bags", "Bulk loading"],
    idealFor: ["Bakeries", "Beverage plants", "Direct retail"]
  },
  {
    id: "vhp-sugar",
    name: "VHP Sugar",
    category: "Agriculture & Grains",
    image: "/images/ChatGPT-Image-Jul-19-2025-06_59_43-PM.png",
    subtitle: "Very High Polarization Raw Sugar",
    shortDesc: "Premium raw sugar designed for refineries, offering high efficiency and low impurities.",
    range: ["Polarization: 99.0% to 99.4%", "Ash: 0.15% max", "Color: 600-1200 ICUMSA"],
    quality: ["High refinery yield", "Bulk handling optimized", "Verified origin"],
    packaging: ["Bulk vessel only", "Minimum 12,500 MT"],
    idealFor: ["Sugar refineries", "Industrial chemical plants"]
  },
  {
    id: "white-sugar",
    name: "White Sugar",
    category: "Agriculture & Grains",
    image: "/images/What-Is-Sodium-Tripolyphosphate_.jpeg",
    subtitle: "Premium Refined Cane Sugar",
    shortDesc: "All-purpose refined sugar for global markets, known for its fine grain and high purity.",
    range: ["Pure cane origin", "Standard refined grade", "Multi-purpose crystal size"],
    quality: ["100% Natural", "ISO Certified production", "Quality guaranteed"],
    packaging: ["1kg, 2kg, 5kg retail packs", "50kg industrial bags"],
    idealFor: ["Household consumption", "Restaurants & Cafes"]
  },
  {
    id: "brown-sugar",
    name: "Brown Sugar",
    category: "Agriculture & Grains",
    image: "/images/Posture-Perfect-Workout.jpeg",
    subtitle: "Natural Brown Cane Sugar",
    shortDesc: "Rich, molasses-infused brown sugar that adds depth and flavor to culinary applications.",
    range: ["Light and Dark varieties", "High molasses retention", "Moist texture"],
    quality: ["Natural coloring", "Rich mineral content", "Non-refined process"],
    packaging: ["25kg bags", "Retail-ready pouches"],
    idealFor: ["Specialty baking", "Sauce manufacturing"]
  },
  {
    id: "brazilian-coffee",
    name: "Brazilian Coffee",
    category: "Agriculture & Grains",
    image: "/images/The-Frugal-Drinkers-Guide-to-Atlas-Coffee-Club.jpeg",
    subtitle: "Single Origin Brazilian Beans",
    shortDesc: "Sourced from the heart of Brazil's coffee regions. We offer a variety of Arabica and Robusta beans known for their rich aroma and balanced acidity.",
    range: ["Arabica (Santos, Fine Cup)", "Robusta (Conilon)", "Green Coffee Beans for Roasters"],
    quality: ["Strict grading", "Sustainably farmed", "Moisture controlled"],
    packaging: ["60kg jute bags", "Bulk containers"],
    idealFor: ["Coffee roasters", "Global wholesalers"]
  },
  {
    id: "coffee",
    name: "Coffee",
    category: "Agriculture & Grains",
    image: "/images/Delicious-Spiced-Hot-Chocolate-Recipe-with-Whipped-Cream-e1752928306492.jpeg",
    subtitle: "Premium Roasted Blends",
    shortDesc: "Expertly roasted coffee blends curated for the perfect balance of flavor, body, and aroma.",
    range: ["Medium Roast", "Dark Roast", "Whole Bean or Ground"],
    quality: ["Freshly roasted", "Oxygen-free packaging", "Flavor profile verified"],
    packaging: ["250g, 500g, 1kg valve bags", "Bulk 10kg boxes"],
    idealFor: ["Hospitality", "Office coffee service", "Retail shelves"]
  },
  {
    id: "corn",
    name: "Corn",
    category: "Agriculture & Grains",
    image: "/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg",
    subtitle: "High-Grade Yellow & White Maize",
    shortDesc: "Supplying top-tier maize for both human consumption and animal feed. Our corn is harvested at peak maturity to ensure maximum nutritional value.",
    range: ["Yellow Maize (Grade 2)", "White Maize (Grade 1)", "Non-GMO varieties"],
    quality: ["Aflatoxin controlled", "Cleaned and polished", "Low moisture"],
    packaging: ["50kg bags", "Bulk silo loading"],
    idealFor: ["Flour mills", "Livestock feed producers"]
  },
  {
    id: "black-pepper",
    name: "Black Pepper",
    category: "Agriculture & Grains",
    image: "/images/Black-Pepper.jpeg",
    subtitle: "High-Piperine Black Pepper",
    shortDesc: "Sourced from premium pepper vines, our black pepper berries are dried to perfection for maximum spice and aroma.",
    range: ["Whole Black Peppercorns", "Cracked Pepper", "Fine Ground"],
    quality: ["High essential oil content", "Steam sterilized option", "Zero additives"],
    packaging: ["25kg multi-wall paper bags", "Bulk super sacks"],
    idealFor: ["Spice blenders", "Meat processing", "Food service"]
  },
  {
    id: "jet-a1",
    name: "Jet A1 Fuel",
    category: "Energy Derivatives",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800",
    subtitle: "Aviation Grade Kerosene",
    shortDesc: "Standardized international aviation fuel suitable for most turbine-engine aircraft.",
    range: ["ASTM D1655 compliant", "Freeze point: -47°C max", "Flash point: 38°C min"],
    quality: ["Certified refinery origin", "Joint Inspection Group (JIG) standards", "Traceable supply chain"],
    packaging: ["Bulk vessel", "Pipeline injection", "Storage tanks"],
    idealFor: ["Commercial airlines", "Private aviation fleets", "Airport fuel farms"]
  },
  {
    id: "ago-pms",
    name: "AGO & PMS",
    category: "Energy Derivatives",
    image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800",
    subtitle: "Diesel & Gasoline Derivatives",
    shortDesc: "Automotive Gas Oil (Diesel) and Premium Motor Spirit (Petrol) for industrial and commercial transport.",
    range: ["AGO (Diesel) Low Sulfur", "PMS (Gasoline) Premium Unleaded", "Industrial Grade Fuel Oil"],
    quality: ["Standardized flash points", "Efficiency optimized", "Environmental compliance"],
    packaging: ["Bulk trucks", "Coastal tankers", "Storage facilities"],
    idealFor: ["Transport fleets", "Industrial power generation", "Retail station networks"]
  }
];

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = productsData.find(p => p.id === id);
  
  if (!product) {
    return notFound();
  }

  const relatedProducts = productsData.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#F7F3E6]">
      <Navbar />

      {/* --- HERO / BREADCRUMB --- */}
      <section className="relative pt-40 pb-20 bg-[#1D1D1D] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <Image src={product.image} alt="" fill sizes="100vw" className="object-cover blur-xl scale-110" />
        </div>
        <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
          <Link href="/products" className="inline-flex items-center space-x-2 text-[#FD630A] text-xs font-bold uppercase tracking-widest mb-8 hover:translate-x-[-4px] transition-transform">
             <ArrowLeft size={14} />
             <span>Back to Catalog</span>
          </Link>
          <h1 className="text-4xl lg:text-7xl font-semibold tracking-tighter uppercase mb-4">{product.name}</h1>
          <nav className="flex items-center space-x-2 text-xs font-bold text-white/40 uppercase tracking-widest">
             <Link href="/" className="hover:text-white transition-colors">Home</Link>
             <span>›</span>
             <Link href="/products" className="hover:text-white transition-colors">Products</Link>
             <span>›</span>
             <span className="text-[#DAA35D]">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* --- PRODUCT MAIN SECTION --- */}
      <section className="py-24">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            
            {/* Image Gallery Mockup */}
            <div className="space-y-8">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl bg-white group">
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-6 right-6 bg-white/90 p-3 rounded-full shadow-lg">
                   <Globe size={18} className="text-[#1D1D1D]" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="aspect-square bg-white rounded-sm border border-[#1D1D1D]/5 opacity-40 hover:opacity-100 cursor-pointer transition-opacity"></div>
                 ))}
              </div>
            </div>

            {/* Info & Specs */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-3">
                  <div className="h-px w-8 bg-[#FD630A]"></div>
                  <span className="text-[10px] font-bold text-[#FD630A] uppercase tracking-[0.4em]">{product.category}</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tighter">{product.subtitle}</h2>
                <p className="text-xl text-[#1D1D1D]/70 font-medium leading-relaxed max-w-xl">
                  {product.shortDesc}
                </p>
              </div>

              {/* Tabs Mockup */}
              <div className="border-b border-[#1D1D1D]/10 flex space-x-10 text-[10px] font-bold uppercase tracking-widest pb-4">
                 <button className="text-[#FD630A] border-b-2 border-[#FD630A] pb-4 -mb-[18px]">Description</button>
                 <button className="text-[#1D1D1D]/40 hover:text-[#1D1D1D] transition-colors">Reviews (0)</button>
              </div>

              {/* Detailed Technical Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                
                {/* Product Range */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Users size={18} className="text-[#DAA35D]" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Product Range</h4>
                  </div>
                  <ul className="space-y-4">
                    {product.range.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#DAA35D] mt-1.5 group-hover:scale-125 transition-transform"></div>
                        <span className="text-sm font-medium text-[#1D1D1D]/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quality */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={18} className="text-[#FD630A]" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Quality Assurance</h4>
                  </div>
                  <ul className="space-y-4">
                    {product.quality.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle2 size={14} className="text-green-500" />
                        </div>
                        <span className="text-sm font-medium text-[#1D1D1D]/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Packaging */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Package size={18} className="text-[#1D1D1D]" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Packaging & Delivery</h4>
                  </div>
                  <ul className="space-y-4">
                    {product.packaging.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <Package size={14} className="text-[#1D1D1D]/30 mt-1" />
                        <span className="text-sm font-medium text-[#1D1D1D]/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ideal For */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Globe size={18} className="text-[#1D1D1D]" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Global Markets</h4>
                  </div>
                  <ul className="space-y-4">
                    {product.idealFor.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <Globe size={14} className="text-[#1D1D1D]/30 mt-1" />
                        <span className="text-sm font-medium text-[#1D1D1D]/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              <div className="pt-8 border-t border-[#1D1D1D]/10">
                <Link href="/contact" className="inline-block bg-[#1D1D1D] text-white px-12 py-5 rounded-sm font-bold hover:bg-[#FD630A] transition-all tracking-widest uppercase text-xs">
                  Request Price Quote
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- RELATED PRODUCTS --- */}
      <section className="py-24 bg-white">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-12">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
               <div className="h-px w-12 bg-[#FD630A]"></div>
               <h3 className="text-3xl font-semibold tracking-tighter">Related Commodities</h3>
            </div>
            <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-[#1D1D1D]/40 hover:text-[#FD630A] transition-colors">
               View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {relatedProducts.map((p, idx) => (
               <div key={idx} className="group cursor-pointer">
                 <Link href={`/products/${p.id}`}>
                    <div className="relative aspect-square overflow-hidden rounded-sm mb-6 shadow-lg">
                      <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <h4 className="text-lg font-bold text-[#1D1D1D] group-hover:text-[#FD630A] transition-colors">{p.name}</h4>
                    <p className="text-xs font-bold text-[#1D1D1D]/40 uppercase tracking-widest mt-1">{p.category}</p>
                 </Link>
               </div>
             ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
