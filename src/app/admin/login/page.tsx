import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

import LoginForm from "./LoginForm";

export default async function AdminLogin(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  async function login(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const supabaseServer = await createClient();
    const { error } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      redirect(`/admin/login?error=${error.message}`);
    } else {
      redirect("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3E6] font-sans">
      <div className="bg-white p-12 rounded-2xl shadow-xl w-full max-w-md border border-[#1D1D1D]/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1D1D1D] mb-2">Admin Login</h1>
          <p className="text-[#1D1D1D]/60 font-medium">Sign in to manage FootprintsEnergy</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <LoginForm loginAction={login} />
      </div>
    </div>
  );
}
