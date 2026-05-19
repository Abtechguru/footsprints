import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-server";
import InvoiceClient from "./InvoiceClient";

export const revalidate = 0;

export default async function InvoicesPage() {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  const { data: profile } = await supabaseAdmin
    .from("staff_profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  const isMasterAdmin = profile?.role === "master_admin";

  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, name, category");

  const { data: invoices } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1D1D1D] mb-8">Manage Invoices</h1>
      <InvoiceClient products={products || []} initialInvoices={invoices || []} isMasterAdmin={isMasterAdmin} />
    </div>
  );
}
