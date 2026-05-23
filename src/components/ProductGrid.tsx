import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductTabs from "./ProductTabs";

export default async function ProductGrid() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  const safeProducts = products || [];

  return (
    <section className="py-10 lg:py-16 bg-[#F7F3E6] relative overflow-hidden">
      {/* Wavy Flowing Lines (Inspiration Image 1) - Softened */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
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

      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 lg:gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-5xl font-black text-[#FD630A]/20 tracking-tighter">{safeProducts.length}</span>
              <div className="h-px w-12 bg-[#FD630A]"></div>
              <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">Product Portfolio</span>
            </div>
            <h3 className="text-5xl lg:text-6xl font-semibold text-[#1D1D1D] tracking-tight leading-[1.1] uppercase">
              Our Products
            </h3>
          </div>
          <p className="text-sm text-[#1D1D1D]/60 font-semibold max-w-sm">
            We source products of a specific quality, size and moisture level to guarantee premium global standard delivery.
          </p>
        </div>

        {/* Product tabs wrapper */}
        <ProductTabs products={safeProducts} />

        {/* View All Button */}
        <div className="mt-16 flex justify-center border-t border-[#1D1D1D]/10 pt-10">
          <Link href="/products" className="group flex items-center space-x-4 text-[#1D1D1D] font-bold tracking-tight hover:text-[#FD630A] transition-colors">
            <span className="text-sm uppercase tracking-[0.3em]">View Full Catalog</span>
            <div className="w-12 h-px bg-[#1D1D1D] group-hover:w-20 group-hover:bg-[#FD630A] transition-all"></div>
          </Link>
        </div>

      </div>
    </section>
  );
}
