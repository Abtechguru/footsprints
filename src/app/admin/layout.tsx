import Link from "next/link";
import { LayoutDashboard, Package, Users, LogOut, Mail, FileText, Home, Video, MessageSquare, ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import AdminSidebar from "./AdminSidebar";

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
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans">
      <AdminSidebar isMasterAdmin={isMasterAdmin} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-auto w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
