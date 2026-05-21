import { createClient } from "@/lib/supabase-server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import PortalClient from "./PortalClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLandingSettings } from "@/lib/landing-settings";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  const settings = await getLandingSettings();

  const supabaseAdmin = createClientAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let orders: any[] = [];
  let invoices: any[] = [];
  let chatMessages: any[] = [];
  let products: any[] = [];

  // Fetch available products for ordering
  const { data: dbProducts } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("name", { ascending: true });
  products = dbProducts || [];

  if (user) {
    // Fetch orders placed by this user
    const { data: clientOrders } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    orders = clientOrders || [];

    // Fetch invoices matching user's email
    if (user.email) {
      const { data: clientInvoices } = await supabaseAdmin
        .from("invoices")
        .select("*")
        .eq("client_email", user.email)
        .order("date", { ascending: false });
      invoices = clientInvoices || [];
    }

    // Fetch chat messages
    const { data: messages } = await supabaseAdmin
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    chatMessages = messages || [];
  }

  return (
    <main className="min-h-screen bg-[#F7F3E6]">
      <Navbar settings={settings} />
      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 py-16">
        <PortalClient 
          user={user} 
          initialOrders={orders} 
          initialInvoices={invoices} 
          initialChats={chatMessages}
          products={products}
        />
      </div>
      <Footer settings={settings} />
    </main>
  );
}
