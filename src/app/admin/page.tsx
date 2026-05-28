import { supabaseAdmin } from "@/lib/supabase-admin";
import { Package, Users, Eye, ShoppingCart, Mail, Video, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable caching for admin

export default async function AdminDashboard() {
  // Fetch stats from Supabase
  const { count: productsCount } = await supabaseAdmin
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: teamCount } = await supabaseAdmin
    .from("team_members")
    .select("*", { count: "exact", head: true });

  const { count: ordersCount } = await supabaseAdmin
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { count: subscribersCount } = await supabaseAdmin
    .from("subscribers")
    .select("*", { count: "exact", head: true });

  const { count: sessionsCount } = await supabaseAdmin
    .from("sessions")
    .select("*", { count: "exact", head: true });

  return (
    <div className="animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-[#1D1D1D] rounded-2xl p-8 md:p-10 mb-10 shadow-xl border border-[#1D1D1D]/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#FD630A]/20 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-[#DAA35D]/20 to-transparent rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/10 text-white/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/5 backdrop-blur-sm">
              <ShieldCheck size={14} className="text-[#DAA35D]" />
              <span>Admin Portal Access</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              Welcome back to <span className="text-[#FD630A]">Footprints</span>
            </h1>
            <p className="text-white/60 font-medium max-w-xl leading-relaxed">
              Here is what's happening with your platform today. Manage your commodities, review customer orders, and configure your site's landing page all in one place.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/admin/orders" className="inline-flex items-center justify-center space-x-2 bg-[#FD630A] hover:bg-[#FD630A]/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#FD630A]/20">
              <span>View Orders</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/admin/invoices" className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6 py-3 rounded-xl font-bold transition-all backdrop-blur-sm">
              <span>New Invoice</span>
            </Link>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-black text-[#1D1D1D] mb-6 tracking-tight flex items-center space-x-2">
        <Zap size={20} className="text-[#FD630A]" />
        <span>System Overview</span>
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Products Stat */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#1D1D1D]/5 hover:shadow-md hover:border-[#FD630A]/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#1D1D1D]/5 group-hover:bg-[#FD630A]/10 text-[#1D1D1D] group-hover:text-[#FD630A] rounded-xl transition-colors">
              <Package size={22} />
            </div>
            <span className="bg-green-500/10 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Live</span>
          </div>
          <div>
            <p className="text-3xl font-black text-[#1D1D1D] mb-1">{productsCount || 0}</p>
            <p className="text-sm font-bold text-[#1D1D1D]/50 uppercase tracking-widest">Total Products</p>
          </div>
        </div>

        {/* Orders Stat */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#1D1D1D]/5 hover:shadow-md hover:border-[#FD630A]/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#1D1D1D]/5 group-hover:bg-[#FD630A]/10 text-[#1D1D1D] group-hover:text-[#FD630A] rounded-xl transition-colors">
              <ShoppingCart size={22} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[#1D1D1D] mb-1">{ordersCount || 0}</p>
            <p className="text-sm font-bold text-[#1D1D1D]/50 uppercase tracking-widest">Customer Orders</p>
          </div>
        </div>

        {/* Subscribers Stat */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#1D1D1D]/5 hover:shadow-md hover:border-[#FD630A]/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#1D1D1D]/5 group-hover:bg-[#FD630A]/10 text-[#1D1D1D] group-hover:text-[#FD630A] rounded-xl transition-colors">
              <Mail size={22} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[#1D1D1D] mb-1">{subscribersCount || 0}</p>
            <p className="text-sm font-bold text-[#1D1D1D]/50 uppercase tracking-widest">Newsletter Subs</p>
          </div>
        </div>

        {/* Sessions Stat */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#1D1D1D]/5 hover:shadow-md hover:border-[#FD630A]/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#1D1D1D]/5 group-hover:bg-[#FD630A]/10 text-[#1D1D1D] group-hover:text-[#FD630A] rounded-xl transition-colors">
              <Video size={22} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[#1D1D1D] mb-1">{sessionsCount || 0}</p>
            <p className="text-sm font-bold text-[#1D1D1D]/50 uppercase tracking-widest">Training Sessions</p>
          </div>
        </div>

        {/* Team Stat */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#1D1D1D]/5 hover:shadow-md hover:border-[#FD630A]/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#1D1D1D]/5 group-hover:bg-[#FD630A]/10 text-[#1D1D1D] group-hover:text-[#FD630A] rounded-xl transition-colors">
              <Users size={22} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[#1D1D1D] mb-1">{teamCount || 0}</p>
            <p className="text-sm font-bold text-[#1D1D1D]/50 uppercase tracking-widest">Team Members</p>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-br from-[#F7F3E6] to-white p-6 rounded-2xl shadow-sm border border-[#1D1D1D]/5 flex flex-col justify-between group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            </div>
            <span className="font-bold text-[#1D1D1D] tracking-tight">System Status</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#1D1D1D] mb-1">Operational</p>
            <p className="text-xs font-bold text-[#1D1D1D]/50 uppercase tracking-widest">All services online</p>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/landing-page" className="bg-white p-6 rounded-2xl shadow-sm border border-[#1D1D1D]/5 hover:shadow-md hover:border-[#FD630A]/50 transition-all group flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1D1D1D] text-lg mb-1 group-hover:text-[#FD630A] transition-colors">Adjust Landing Page</h3>
            <p className="text-sm font-medium text-[#1D1D1D]/50">Edit your public website content and settings</p>
          </div>
          <div className="p-3 bg-[#F8F9FA] rounded-full group-hover:bg-[#FD630A]/10 group-hover:text-[#FD630A] transition-colors">
            <ArrowRight size={20} />
          </div>
        </Link>
        <Link href="/admin/products" className="bg-white p-6 rounded-2xl shadow-sm border border-[#1D1D1D]/5 hover:shadow-md hover:border-[#FD630A]/50 transition-all group flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1D1D1D] text-lg mb-1 group-hover:text-[#FD630A] transition-colors">Manage Products</h3>
            <p className="text-sm font-medium text-[#1D1D1D]/50">Add or edit commodities and pricing</p>
          </div>
          <div className="p-3 bg-[#F8F9FA] rounded-full group-hover:bg-[#FD630A]/10 group-hover:text-[#FD630A] transition-colors">
            <ArrowRight size={20} />
          </div>
        </Link>
      </div>
    </div>
  );
}
