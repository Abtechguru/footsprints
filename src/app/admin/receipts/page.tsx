import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import ReceiptClient from "./ReceiptClient";

export const revalidate = 0;

export default async function ReceiptsPage() {
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
    .select("*")
    .order("created_at", { ascending: true });

  const { data: receipts } = await supabaseAdmin
    .from("receipts")
    .select("*")
    .order("created_at", { ascending: false });

  return <ReceiptClient products={products || []} initialReceipts={receipts || []} isMasterAdmin={isMasterAdmin} />;
}
