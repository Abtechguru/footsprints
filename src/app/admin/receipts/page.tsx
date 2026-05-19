import { supabaseAdmin } from "@/lib/supabase";
import ReceiptClient from "./ReceiptClient";

export const revalidate = 0;

export default async function ReceiptsPage() {
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: receipts } = await supabaseAdmin
    .from("receipts")
    .select("*")
    .order("created_at", { ascending: false });

  return <ReceiptClient products={products || []} initialReceipts={receipts || []} />;
}
