import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import SubmitButton from "@/components/SubmitButton";

export const revalidate = 0;

export default async function StaffManagement() {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  // Check if current user is master admin
  const { data: profile } = await supabaseAdmin
    .from("staff_profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profile?.role !== "master_admin") {
    return (
      <div className="bg-red-50 text-red-600 p-8 rounded-xl font-bold border border-red-100">
        You do not have Master Admin privileges to view this page.
      </div>
    );
  }

  const { data: staffList } = await supabaseAdmin
    .from("staff_profiles")
    .select("*")
    .order("created_at", { ascending: true });

  async function addStaff(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email || !password) return;

    // Create user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error(authError);
      return;
    }

    // Create profile
    await supabaseAdmin.from("staff_profiles").insert([{
      id: authData.user.id,
      email: authData.user.email,
      role: "staff",
      is_active: true
    }]);

    revalidatePath("/admin/staff");
  }

  async function toggleStaffStatus(id: string, currentStatus: boolean) {
    "use server";
    await supabaseAdmin.from("staff_profiles").update({ is_active: !currentStatus }).eq("id", id);
    revalidatePath("/admin/staff");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1D1D1D] mb-8">Manage Staff</h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#1D1D1D]/5 mb-12">
        <h2 className="text-xl font-bold text-[#1D1D1D] mb-4">Register New Staff Member</h2>
        <form action={addStaff} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Email Address</label>
            <input type="email" name="email" required className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A]" placeholder="staff@footprintsenergy.com" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Temporary Password</label>
            <input type="text" name="password" required minLength={6} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A]" placeholder="••••••••" />
          </div>
          <div className="md:col-span-2 pt-4">
            <SubmitButton defaultText="Add Staff" loadingText="Creating..." className="bg-[#1D1D1D] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#FD630A] transition-colors w-auto inline-flex" />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1D1D1D]/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F3E6] text-[#1D1D1D] text-sm uppercase tracking-wider font-bold">
              <th className="p-4 border-b border-[#1D1D1D]/5">Email</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Role</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Status</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList?.map((staff) => (
              <tr key={staff.id} className="hover:bg-[#F7F3E6]/50 transition-colors">
                <td className="p-4 border-b border-[#1D1D1D]/5 font-bold text-[#1D1D1D]">{staff.email}</td>
                <td className="p-4 border-b border-[#1D1D1D]/5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${staff.role === 'master_admin' ? 'bg-[#FD630A]/10 text-[#FD630A]' : 'bg-[#1D1D1D]/10 text-[#1D1D1D]'}`}>
                    {staff.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 border-b border-[#1D1D1D]/5">
                  {staff.is_active ? (
                    <span className="text-green-600 font-bold">Active</span>
                  ) : (
                    <span className="text-red-600 font-bold">Restricted</span>
                  )}
                </td>
                <td className="p-4 border-b border-[#1D1D1D]/5">
                  {staff.role !== 'master_admin' && (
                    <div className="flex flex-col space-y-4 max-w-sm">
                      <form action={async () => {
                        "use server";
                        await toggleStaffStatus(staff.id, staff.is_active);
                      }}>
                        <button type="submit" className={`font-bold text-sm ${staff.is_active ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}>
                          {staff.is_active ? 'Restrict Access' : 'Restore Access'}
                        </button>
                      </form>
                      
                      <form action={async (formData: FormData) => {
                        "use server";
                        const newEmail = formData.get("email") as string;
                        if (!newEmail || !newEmail.includes("@")) return;
                        
                        await supabaseAdmin.auth.admin.updateUserById(staff.id, { email: newEmail });
                        await supabaseAdmin.from("staff_profiles").update({ email: newEmail }).eq("id", staff.id);
                        
                        revalidatePath("/admin/staff");
                      }} className="flex items-center space-x-2">
                        <input type="email" name="email" defaultValue={staff.email} required className="border border-[#1D1D1D]/20 px-3 py-1 text-xs rounded-lg focus:outline-none focus:border-[#FD630A] w-48" />
                        <SubmitButton defaultText="Update Email" loadingText="..." className="bg-[#1D1D1D] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#FD630A] transition-colors" />
                      </form>

                      <form action={async (formData: FormData) => {
                        "use server";
                        const newPassword = formData.get("password") as string;
                        if (!newPassword || newPassword.length < 6) return;
                        await supabaseAdmin.auth.admin.updateUserById(staff.id, { password: newPassword });
                      }} className="flex items-center space-x-2">
                        <input type="text" name="password" placeholder="New Password" required minLength={6} className="border border-[#1D1D1D]/20 px-3 py-1 text-xs rounded-lg focus:outline-none focus:border-[#FD630A] w-48" />
                        <SubmitButton defaultText="Set Password" loadingText="..." className="bg-[#1D1D1D] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#FD630A] transition-colors" />
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {(!staffList || staffList.length === 0) && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[#1D1D1D]/50 font-medium">No staff members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
