import { supabaseAdmin } from "@/lib/supabase";
import SubscriberClient from "./SubscriberClient";

export const revalidate = 0;

export default async function SubscribersPage() {
  const { data: subscribers } = await supabaseAdmin
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return <SubscriberClient subscribers={subscribers || []} />;
}
