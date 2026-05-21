"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
}

export default function ProductTabs({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-[#1D1D1D]/50 font-medium">
        No products available at the moment.
      </div>
    );
  }

  // Get unique products (or fallback if empty)
  const activeProduct = products[activeTab % products.length];

  return (
    <div className="space-y-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-[#1D1D1D]/10 pb-4">
        {products.map((product, idx) => (
          <button
            key={product.id}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${
              activeTab === idx
                ? "bg-[#FD630A] text-white shadow-md shadow-[#FD630A]/20"
                : "bg-white text-[#1D1D1D] hover:bg-[#F7F3E6] border border-[#1D1D1D]/5"
            }`}
          >
            {product.name}
          </button>
        ))}
      </div>

      {/* Tab Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center min-h-[400px]">
        {/* Left Column: Product Information */}
        <div className="space-y-6 animate-fadeIn">
          <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.3em] block">
            {activeProduct.category || "Premium Commodity"}
          </span>
          <h3 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tight leading-[1.1] uppercase">
            {activeProduct.name}
          </h3>
          <p className="text-base text-[#1D1D1D]/70 font-medium leading-relaxed">
            {activeProduct.description || "High-quality raw materials sourced and processed with absolute care and precision, meeting international quality certifications."}
          </p>
          <div className="pt-4">
            <Link
              href={`/products/${activeProduct.id}`}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FD630A] hover:text-[#1D1D1D] transition-colors"
            >
              <span>Explore Specifications &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Product Image Showcase */}
        <div className="relative group">
          <div className="relative aspect-video lg:aspect-square lg:h-[450px] overflow-hidden rounded-sm bg-white border border-[#1D1D1D]/5 shadow-xl">
            <Image
              src={activeProduct.image || "/images/Black-Pepper.jpeg"}
              alt={activeProduct.name}
              fill
              className="object-cover transition-all duration-700 ease-out"
              key={activeProduct.id} // Forces image animation on change
            />
          </div>
        </div>
      </div>
    </div>
  );
}
