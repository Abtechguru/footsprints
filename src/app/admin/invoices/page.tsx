import { supabaseAdmin } from "@/lib/supabase";
import InvoiceClient from "./InvoiceClient";

export const revalidate = 0;

export default async function InvoicesPage() {
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, name, category");

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1D1D1D] mb-8">Generate Invoice / Quotation</h1>
      <InvoiceClient products={products || []} />
    </div>
  );
}
