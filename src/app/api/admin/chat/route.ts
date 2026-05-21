import { createClient } from "@/lib/supabase-server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

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

  // 2. Fetch the message thread
  const { data: chats, error } = await supabaseAdmin
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(chats);
}
