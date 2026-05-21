import { createClient } from "@/lib/supabase-server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  // 1. Verify caller is active staff admin
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createClientAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: staffProfile } = await supabaseAdmin
    .from("staff_profiles")
    .select("is_active")
    .eq("id", user.id)
    .single();

  if (!staffProfile || staffProfile.is_active === false) {
    return NextResponse.json({ error: "Access Restricted" }, { status: 451 });
  }

  // 2. Fetch all messages to group into threads
  const { data: allMessages, error } = await supabaseAdmin
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group into threads
  const threadsMap: Record<string, { user_id: string; user_email: string; last_message: string; last_date: string }> = {};

  (allMessages || []).forEach((msg) => {
    threadsMap[msg.user_id] = {
      user_id: msg.user_id,
      user_email: msg.user_email || "User Account",
      last_message: msg.message,
      last_date: msg.created_at
    };
  });

  const threads = Object.values(threadsMap).sort((a, b) => 
    new Date(b.last_date).getTime() - new Date(a.last_date).getTime()
  );

  return NextResponse.json(threads);
}
