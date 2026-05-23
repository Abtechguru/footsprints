"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, LogOut, Mail, FileText, Home, Video, MessageSquare, ShoppingCart, Menu, X } from "lucide-react";

export default function AdminSidebar({ isMasterAdmin }: { isMasterAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/admin/chats", icon: MessageSquare, label: "Customer Chats" },
    { href: "/admin/landing-page", icon: Home, label: "Adjust Landing" },
    { href: "/admin/sessions", icon: Video, label: "Sessions" },
    { href: "/admin/documents", icon: FileText, label: "Document Studio" },
    { href: "/admin/invoices", icon: Package, label: "Invoices" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/team", icon: Users, label: "Team Members" },
    { href: "/admin/receipts", icon: FileText, label: "Receipts" },
    { href: "/admin/subscribers", icon: Mail, label: "Subscribers" },
  ];

  if (isMasterAdmin) {
    links.push({ href: "/admin/staff", icon: Users, label: "Staff Access" });
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#1D1D1D] text-white p-4 flex justify-between items-center z-50 sticky top-0 shadow-md">
        <Link href="/admin" className="text-xl font-bold tracking-tight text-white hover:text-[#FD630A] transition-colors">
          FootprintsEnergy <span className="text-[#FD630A]">Admin</span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-[#FD630A] transition-colors p-1">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#1D1D1D] text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} overflow-y-auto border-r border-[#FD630A]/20`}>
        <div className="p-6 border-b border-white/10 hidden md:block relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FD630A] opacity-10 blur-[50px] rounded-full pointer-events-none"></div>
          <Link href="/admin" className="text-2xl font-bold tracking-tight text-white hover:text-[#FD630A] transition-colors relative z-10 flex flex-col">
            FootprintsEnergy
            <span className="text-[#FD630A] text-sm uppercase tracking-[0.2em] mt-1 font-semibold">Admin Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? "bg-gradient-to-r from-[#FD630A]/20 to-transparent border-l-4 border-[#FD630A] text-white" : "text-white/60 hover:bg-white/5 hover:text-white border-l-4 border-transparent hover:border-white/20"}`}
              >
                <Icon size={20} className={`transition-colors ${isActive ? "text-[#FD630A]" : "group-hover:text-[#FD630A]/70"}`} />
                <span className={`font-semibold tracking-wide text-sm ${isActive ? "text-white" : ""}`}>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-white/10 bg-[#1D1D1D]">
          <Link href="/" className="flex items-center justify-center space-x-2 w-full py-3 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all font-semibold text-sm border border-white/5 hover:border-red-500/30">
            <LogOut size={18} />
            <span>Exit Portal</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
