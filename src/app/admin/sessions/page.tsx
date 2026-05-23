import { supabaseAdmin } from "@/lib/supabase-admin";
import { addMediaSession, deleteMediaSession } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import SessionClient from "./SessionClient";

export const revalidate = 0; // Disable caching

export default async function AdminSessionsPage() {
  let sessions: any[] = [];
  let fetchError = null;

  try {
    const { data, error } = await supabaseAdmin
      .from("media_sessions")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) {
      fetchError = error.message;
    } else {
      sessions = data || [];
    }
  } catch (err: any) {
    fetchError = err.message;
  }

  // Handle action wrapping for delete to avoid client-side wrapper need
  const deleteAction = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    await deleteMediaSession(id);
    revalidatePath("/admin/sessions");
  };

  const addAction = async (formData: FormData) => {
    "use server";
    await addMediaSession(formData);
    revalidatePath("/admin/sessions");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1D]">Interactive & Media Sessions</h1>
          <p className="text-sm text-[#1D1D1D]/60 mt-1">
            Create sessions and events, uploading multiple images and videos for gallery showcases.
          </p>
        </div>
        <Link 
          href="/sessions" 
          target="_blank"
          className="inline-flex items-center space-x-2 text-sm font-bold text-[#FD630A] hover:underline"
        >
          <span>View Public Sessions Page</span>
          <Plus size={16} />
        </Link>
      </div>

      {fetchError && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-medium">
          Note: Could not query 'media_sessions' table. Make sure you run the SQL migration schema in your Supabase SQL editor. Error details: {fetchError}
        </div>
      )}

      <SessionClient 
        initialSessions={sessions} 
        addAction={addAction} 
        deleteAction={deleteAction} 
      />
    </div>
  );
}
