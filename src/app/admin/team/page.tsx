import { supabaseAdmin } from "@/lib/supabase";
import TeamClient from "./TeamClient";

export const revalidate = 0;

export default async function AdminTeam() {
  const { data: team } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1D1D1D] mb-8">Manage Team</h1>
      <TeamClient initialTeam={team || []} />
    </div>
  );
}
