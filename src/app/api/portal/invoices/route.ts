import { createClient } from "@/lib/supabase-server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user || user.email !== email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createClientAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invoices, error } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("client_email", email)
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(invoices);
}
