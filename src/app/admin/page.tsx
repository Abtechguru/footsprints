import { supabaseAdmin } from "@/lib/supabase";
import { Package, Users, Eye } from "lucide-react";

export const revalidate = 0; // Disable caching for admin

export default async function AdminDashboard() {
  // Fetch stats from Supabase
  const { count: productsCount } = await supabaseAdmin
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: teamCount } = await supabaseAdmin
    .from("team_members")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1D1D1D] mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1D1D1D]/5 flex items-center space-x-4">
          <div className="p-4 bg-[#FD630A]/10 text-[#FD630A] rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1D1D1D]/50 uppercase tracking-widest">Total Products</p>
            <p className="text-3xl font-black text-[#1D1D1D]">{productsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1D1D1D]/5 flex items-center space-x-4">
          <div className="p-4 bg-[#DAA35D]/10 text-[#DAA35D] rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1D1D1D]/50 uppercase tracking-widest">Team Members</p>
            <p className="text-3xl font-black text-[#1D1D1D]">{teamCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1D1D1D]/5 flex items-center space-x-4">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-lg">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1D1D1D]/50 uppercase tracking-widest">Page Views</p>
            <p className="text-3xl font-black text-[#1D1D1D]">Active</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#1D1D1D]/5">
        <h2 className="text-xl font-bold text-[#1D1D1D] mb-4">Welcome to FootprintsEnergy Admin</h2>
        <p className="text-[#1D1D1D]/60 leading-relaxed font-medium">
          Use the sidebar to navigate through the admin panel. You can manage your products and collections in the "Products" section, and update your leadership team in the "Team Members" section. All changes made here will reflect instantly on the public landing page.
        </p>
      </div>
    </div>
  );
}
