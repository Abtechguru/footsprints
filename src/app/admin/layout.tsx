import Link from "next/link";
import { LayoutDashboard, Package, Users, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F3E6] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1D1D1D] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="text-xl font-bold tracking-tight text-white hover:text-[#FD630A] transition-colors">
            Footprints <span className="text-[#FD630A]">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <Package size={20} />
            <span className="font-medium">Products</span>
          </Link>
          <Link href="/admin/team" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <Users size={20} />
            <span className="font-medium">Team Members</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
