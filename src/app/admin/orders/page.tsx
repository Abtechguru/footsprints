import { createClient as createClientAdmin } from "@supabase/supabase-js";
import { updateOrderStatus } from "@/app/actions";
import { ShoppingCart, ArrowUpDown, Clock } from "lucide-react";
import OrderRow from "./OrderRow";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabaseAdmin = createClientAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load orders:", error);
  }

  const orderList = orders || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1D1D1D] tracking-tight">Customer Orders & Inquiries</h1>
          <p className="text-xs text-[#1D1D1D]/50 mt-1 font-bold uppercase tracking-widest font-sans">
            Manage inquiries, specify status and generate invoices.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1D1D1D]/5 overflow-hidden">
        <div className="p-6 border-b border-[#1D1D1D]/5 bg-[#F7F3E6]/30 flex items-center space-x-2">
          <ShoppingCart className="text-[#FD630A]" size={20} />
          <h2 className="text-lg font-bold text-[#1D1D1D]">Active Inquiries ({orderList.length})</h2>
        </div>

        {orderList.length === 0 ? (
          <div className="p-12 text-center text-sm font-medium text-[#1D1D1D]/40">
            No customer inquiries placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F3E6]/50 border-b border-[#1D1D1D]/5 text-[#1D1D1D]/60 text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4">Placed Date</th>
                  <th className="p-4">Customer Email</th>
                  <th className="p-4">Commodity</th>
                  <th className="p-4">Requested Volume</th>
                  <th className="p-4">Client Notes</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1D1D]/5 text-sm">
                {orderList.map((order) => (
                  <OrderRow key={order.id} order={order} updateOrderStatus={updateOrderStatus} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
