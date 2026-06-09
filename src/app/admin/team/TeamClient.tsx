"use client";

import { useState } from "react";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton";
import { addTeamMember, updateTeamMember, deleteTeamMember } from "@/app/actions";
import { UserCheck, Edit3, Trash2, Mail, Plus, X } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string | null;
  image: string;
}

export default function TeamClient({ initialTeam }: { initialTeam: TeamMember[] }) {
  const [teamList, setTeamList] = useState<TeamMember[]>(initialTeam);
  
  // Edit Mode state
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  // Form input states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setEmail(member.email || "");
    setImageFile(null); // Reset file input
    setStatus("idle");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setName("");
    setRole("");
    setEmail("");
    setImageFile(null);
    setStatus("idle");
    setMessage("");
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("email", email);
    
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    if (editingMember) {
      formData.append("id", editingMember.id);
      formData.append("existingImage", editingMember.image);
      
      const res = await updateTeamMember(formData);
      if (res?.success) {
        setStatus("success");
        setMessage("Team member successfully updated!");
        
        // Refresh local list state
        const updatedImageUrl = imageFile ? URL.createObjectURL(imageFile) : editingMember.image;
        setTeamList(
          teamList.map((m) =>
            m.id === editingMember.id
              ? { ...m, name, role, email, image: updatedImageUrl }
              : m
          )
        );
        handleCancelEdit();
      } else {
        setStatus("error");
        setMessage(res?.error || "Failed to update team member.");
      }
    } else {
      // Add mode
      if (!imageFile) {
        setStatus("error");
        setMessage("Profile picture is required for new team members.");
        return;
      }

      // We let standard form submission handle adding to DB and revalidating,
      // or we can invoke it via Server Action programmatically here:
      const addForm = e.currentTarget;
      const data = new FormData(addForm);
      const res = await addTeamMember(data);
      
      if (res?.success) {
        setStatus("success");
        setMessage("Team member successfully added!");
        setName("");
        setRole("");
        setEmail("");
        setImageFile(null);
        
        // Reload window after 1 second to fetch latest public URL from Supabase
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setStatus("error");
        setMessage(res?.error || "Failed to add team member.");
      }
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    
    await deleteTeamMember(id);
    setTeamList(teamList.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-12">
      {/* Editor Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#1D1D1D]/5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#1D1D1D] flex items-center gap-2">
            <UserCheck size={20} className="text-[#FD630A]" />
            {editingMember ? "Edit Team Member" : "Add Team Member"}
          </h2>
          {editingMember && (
            <button
              onClick={handleCancelEdit}
              className="flex items-center space-x-1 text-xs text-[#1D1D1D]/60 hover:text-red-500 font-bold border border-[#1D1D1D]/10 px-3 py-1.5 rounded-lg bg-gray-50"
            >
              <X size={14} />
              <span>Cancel Edit</span>
            </button>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Fields */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
              placeholder="e.g. Akin Tunmbi"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Role / Designation</label>
            <input
              type="text"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
              placeholder="e.g. Executive Director"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1D1D1D]/40">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#1D1D1D]/10 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                placeholder="e.g. akin@footprintsenergy.com"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">
              Profile Picture {editingMember && "(Optional - Leave empty to keep existing)"}
            </label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              required={!editingMember}
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#FD630A] bg-white file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1D1D1D]/5 file:text-[#1D1D1D] hover:file:bg-[#1D1D1D]/10 transition-all cursor-pointer text-sm"
            />
          </div>

          {/* Submit Actions */}
          <div className="md:col-span-2 pt-4 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <SubmitButton
                defaultText={editingMember ? "Save Changes" : "Add Member"}
                loadingText={editingMember ? "Saving Changes..." : "Uploading..."}
                className="bg-[#1D1D1D] text-white px-8 py-3.5 rounded-lg font-bold hover:bg-[#FD630A] transition-colors w-auto text-sm inline-flex"
              />
            </div>
            
            {status === "success" && (
              <p className="text-green-600 font-bold text-sm bg-green-50 p-3 rounded-lg border border-green-100 max-w-md">{message}</p>
            )}
            {status === "error" && (
              <p className="text-red-600 font-bold text-sm bg-red-50 p-3 rounded-lg border border-red-100 max-w-md">{message}</p>
            )}
          </div>
        </form>
      </div>

      {/* Directory Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-[#1D1D1D]/5 overflow-hidden">
        <div className="p-6 border-b border-[#1D1D1D]/5 bg-[#F7F3E6]/30 flex items-center space-x-2">
          <h2 className="text-lg font-bold text-[#1D1D1D]">Active Team Members ({teamList.length})</h2>
        </div>
        <table className="w-full text-left border-collapse text-sm font-medium font-sans">
          <thead>
            <tr className="bg-[#F7F3E6] text-[#1D1D1D] text-xs uppercase tracking-wider font-bold">
              <th className="p-4 border-b border-[#1D1D1D]/5">Image</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Name</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Role</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Email</th>
              <th className="p-4 border-b border-[#1D1D1D]/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamList.map((member) => (
              <tr key={member.id} className="hover:bg-[#F7F3E6]/50 transition-colors">
                <td className="p-4 border-b border-[#1D1D1D]/5">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#1D1D1D]/5 shadow-sm">
                    <Image src={member.image} alt={member.name} fill sizes="48px" className="object-cover" />
                  </div>
                </td>
                <td className="p-4 border-b border-[#1D1D1D]/5 font-bold text-[#1D1D1D]">{member.name}</td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-[#1D1D1D]/60">{member.role}</td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-[#1D1D1D]/60 font-sans">
                  {member.email ? (
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} className="text-[#FD630A]/60" />
                      <span>{member.email}</span>
                    </span>
                  ) : (
                    <span className="text-[#1D1D1D]/30 italic text-xs">No email set</span>
                  )}
                </td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-right space-x-3">
                  <button
                    onClick={() => handleEditClick(member)}
                    className="inline-flex items-center space-x-1 bg-[#1D1D1D] text-white hover:bg-[#FD630A] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(member.id)}
                    className="inline-flex items-center text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {teamList.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-[#1D1D1D]/40 font-bold">
                  No active team members registered in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
