import { createClient as createClientAdmin } from "@supabase/supabase-js";
import ChatAdminClient from "./ChatAdminClient";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminChatsPage() {
  const supabaseAdmin = createClientAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch all chat messages sorted by created_at ascending
  const { data: messages, error } = await supabaseAdmin
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load chat messages:", error);
  }

  const allMessages = messages || [];

  // Group messages by user_id to extract unique threads
  const threadsMap: Record<string, { user_id: string; user_email: string; last_message: string; last_date: string }> = {};

  allMessages.forEach((msg) => {
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

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-[#1D1D1D] tracking-tight">Customer Desk Chat</h1>
        <p className="text-xs text-[#1D1D1D]/50 mt-1 font-bold uppercase tracking-widest font-sans">
          Respond to live questions and request details from authenticated client accounts.
        </p>
      </div>

      <ChatAdminClient initialThreads={threads} initialMessages={allMessages} />
    </div>
  );
}
