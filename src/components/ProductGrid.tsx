import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function ProductGrid() {
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: true });

  return (
    <section className="py-16 lg:py-24 bg-[#F7F3E6] relative overflow-hidden">
      {/* Wavy Flowing Lines (Inspiration Image 1) - Softened */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rotate-90">
          {[...Array(12)].map((_, i) => (
            <path 
              key={i}
              d={`M ${-200 + i * 120},0 Q ${200 + i * 120},500 ${-200 + i * 120},1000`}
              fill="none"
              stroke="#1D1D1D"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-20 gap-6 lg:gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-5xl font-black text-[#FD630A]/20 tracking-tighter">{products?.length || 0}</span>
              <div className="h-px w-12 bg-[#FD630A]"></div>
              <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">Active Portfolio</span>
            </div>
            <h3 className="text-5xl lg:text-7xl font-semibold text-[#1D1D1D] tracking-tight leading-[1.1]">
              Our Global <br /> <span className="text-[#FD630A]">Commodities</span>
            </h3>
          </div>
          <p className="text-lg text-[#1D1D1D]/60 font-medium max-w-sm mb-2">
            Providing direct access to top-tier producers worldwide with guaranteed quality and seamless logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {products?.map((product, idx) => (
            <div 
              key={product.id}
              className={`group relative overflow-hidden bg-white rounded-sm border border-[#1D1D1D]/5 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(29,29,29,0.15)] ${
                idx % 5 === 0 ? 'md:col-span-8 md:row-span-2' : 
                idx % 5 === 1 ? 'md:col-span-4 md:row-span-2' :
                idx % 5 === 2 ? 'md:col-span-4' :
                idx % 5 === 3 ? 'md:col-span-8' : 'md:col-span-4'
              }`}
            >
              <Link href={`/products/${product.id}`} className="block h-full">
                {/* Product Image */}
                <div className="relative h-full w-full aspect-square md:aspect-auto min-h-[400px]">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                  {/* Gradient Overlay for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  
                  {/* Floating Category Tag */}
                  <div className="absolute top-6 left-6 flex space-x-2">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 text-[9px] font-bold text-[#1D1D1D] uppercase tracking-widest rounded-full">
                      {product.category}
                    </span>
                    <span className="bg-[#FD630A]/90 backdrop-blur-md px-3 py-1 text-[9px] font-bold text-white uppercase tracking-widest rounded-full">
                      Premium
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          <span className="text-[10px] font-bold text-[#FD630A] uppercase tracking-widest">Grade A1</span>
                          <div className="h-px w-4 bg-white/20"></div>
                          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Certified</span>
                        </div>
                        <h4 className="text-3xl font-bold text-white tracking-tight">{product.name}</h4>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-full text-white border border-white/20 group-hover:bg-[#FD630A] group-hover:border-transparent transition-all duration-500">
                        <ArrowUpRight size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {(!products || products.length === 0) && (
            <div className="md:col-span-12 text-center py-12 text-[#1D1D1D]/50 font-medium">
              No products available at the moment.
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="mt-16 flex justify-center">
          <Link href="/products" className="group flex items-center space-x-4 text-[#1D1D1D] font-bold tracking-tight hover:text-[#FD630A] transition-colors">
            <span className="text-sm uppercase tracking-[0.3em]">View Full Catalog</span>
            <div className="w-12 h-px bg-[#1D1D1D] group-hover:w-20 group-hover:bg-[#FD630A] transition-all"></div>
          </Link>
        </div>

      </div>
    </section>
  );
}
