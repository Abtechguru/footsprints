import Link from "next/link";
import Image from "next/image";
import { Menu, ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <header className="absolute top-6 left-0 w-full z-50 flex justify-center px-4">
      {/* The Floating Pill Container */}
      <div className="bg-white rounded-full px-6 sm:px-8 py-3.5 flex justify-between items-center w-full max-w-7xl shadow-xl shadow-[#1D1D1D]/5 border border-[#1D1D1D]/5">
        
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center flex-1">
          <Link href="/" className="flex items-center gap-1 group">
            <div className="relative h-12 w-12 overflow-hidden">
              <Image 
                src="/images/footsprintLogo.jpeg" 
                alt="Footprints Energy Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="font-sans font-bold text-lg text-[#1D1D1D] tracking-tight group-hover:text-[#FD630A] transition-colors whitespace-nowrap">
              Footprints Energy
            </span>
          </Link>
        </div>

        {/* Desktop Menu - Centered */}
        <nav className="hidden lg:flex justify-center space-x-10">
          {['Home', 'About Us', 'Our Team', 'Products', 'Contact'].map((item) => (
            <Link 
              key={item} 
              href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
              className="text-[#1D1D1D] text-sm font-semibold hover:text-[#FD630A] transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Call to Action */}
        <div className="hidden lg:flex items-center justify-end flex-1">
          <Link href="/products" className="bg-[#1D1D1D] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#FD630A] hover:-translate-y-0.5 transition-all duration-300 shadow-sm whitespace-nowrap">
            Explore Collection
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button className="text-[#1D1D1D] hover:text-[#FD630A] transition-colors">
            <Menu size={24} />
          </button>
        </div>

      </div>
    </header>
  );
}
