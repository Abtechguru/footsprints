import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import SubscriberClient from "./SubscriberClient";

export const revalidate = 0;

export default async function SubscribersPage() {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  const { data: profile } = await supabaseAdmin
    .from("staff_profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  const isMasterAdmin = profile?.role === "master_admin";

  const { data: subscribers } = await supabaseAdmin
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return <SubscriberClient subscribers={subscribers || []} isMasterAdmin={isMasterAdmin} />;
}
