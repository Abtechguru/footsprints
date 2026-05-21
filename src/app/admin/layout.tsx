import Link from "next/link";
import { LayoutDashboard, Package, Users, LogOut, Mail, FileText, Home, Video, MessageSquare, ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  let isMasterAdmin = false;
  if (user) {
    const supabaseAdmin = createClientAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: profile } = await supabaseAdmin
      .from("staff_profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "master_admin") {
      isMasterAdmin = true;
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3E6] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1D1D1D] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="text-xl font-bold tracking-tight text-white hover:text-[#FD630A] transition-colors">
            FootprintsEnergy <span className="text-[#FD630A]">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <ShoppingCart size={20} />
            <span className="font-medium">Orders</span>
          </Link>
          <Link href="/admin/chats" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <MessageSquare size={20} />
            <span className="font-medium">Customer Chats</span>
          </Link>
          <Link href="/admin/landing-page" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <Home size={20} />
            <span className="font-medium">Adjust Landing</span>
          </Link>
          <Link href="/admin/sessions" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <Video size={20} />
            <span className="font-medium">Sessions</span>
          </Link>
          <Link href="/admin/invoices" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <Package size={20} />
            <span className="font-medium">Invoices</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <Package size={20} />
            <span className="font-medium">Products</span>
          </Link>
          <Link href="/admin/team" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <Users size={20} />
            <span className="font-medium">Team Members</span>
          </Link>
          <Link href="/admin/receipts" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <FileText size={20} />
            <span className="font-medium">Receipts</span>
          </Link>
          <Link href="/admin/subscribers" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <Mail size={20} />
            <span className="font-medium">Subscribers</span>
          </Link>
          {isMasterAdmin && (
            <Link href="/admin/staff" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
              <Users size={20} />
              <span className="font-medium">Staff Access</span>
            </Link>
          )}
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
