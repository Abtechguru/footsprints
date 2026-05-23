"use client";

import { useState } from "react";
import { Calendar, Trash2, Film, Video, Plus, Edit, Image as ImageIcon } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
import { updateMediaSession, deleteMediaSession } from "@/app/actions";

export default function SessionClient({ initialSessions, addAction, deleteAction }: { initialSessions: any[], addAction: any, deleteAction: any }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    existingMedia: [] as any[]
  });

  const handleEdit = (session: any) => {
    setIsEditing(true);
    setEditId(session.id);
    setFormData({
      title: session.title,
      date: session.date,
      description: session.description || "",
      existingMedia: Array.isArray(session.media_urls) ? session.media_urls : []
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setIsEditing(false);
    setEditId("");
    setFormData({
      title: "",
      date: "",
      description: "",
      existingMedia: []
    });
  };

  const removeExistingMedia = (index: number) => {
    setFormData({
      ...formData,
      existingMedia: formData.existingMedia.filter((_, i) => i !== index)
    });
  };

  const handleUpdate = async (e: FormData) => {
    e.append("id", editId);
    e.append("existingMedia", JSON.stringify(formData.existingMedia));
    const res = await updateMediaSession(e);
    if (res.success) {
      alert("Session updated successfully!");
      window.location.reload();
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left/Middle: Sessions List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-[#1D1D1D]/5 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Existing Sessions ({sessions.length})</h2>
          
          <div className="space-y-4">
            {sessions.map((session) => {
              const media = Array.isArray(session.media_urls) ? session.media_urls : [];
              return (
                <div 
                  key={session.id} 
                  className="flex flex-col sm:flex-row sm:items-start justify-between p-4 border border-[#1D1D1D]/5 rounded-xl hover:bg-[#F7F3E6]/10 transition-all gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-lg text-[#1D1D1D]">{session.title}</h3>
                    <div className="flex items-center space-x-4 text-xs font-semibold text-[#1D1D1D]/60">
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} className="text-[#FD630A]" />
                        <span>{session.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Film size={12} className="text-[#FD630A]" />
                        <span>{media.length} media items</span>
                      </span>
                    </div>
                    {session.description && (
                      <p className="text-sm text-[#1D1D1D]/75 line-clamp-2 mt-2 leading-relaxed">
                        {session.description}
                      </p>
                    )}
                    
                    {/* Media Thumbnails */}
                    {media.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3">
                        {media.slice(0, 5).map((m: any, idx: number) => (
                          <div key={idx} className="relative w-12 h-12 rounded bg-[#1D1D1D]/5 border border-[#1D1D1D]/5 overflow-hidden flex items-center justify-center">
                            {m.type === "video" ? (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                <Video size={14} />
                              </div>
                            ) : (
                              <img src={m.url} alt="" className="object-cover w-full h-full" />
                            )}
                          </div>
                        ))}
                        {media.length > 5 && (
                          <div className="w-12 h-12 rounded bg-[#1D1D1D]/70 text-white text-[10px] font-bold flex items-center justify-center">
                            +{media.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    <button
                      onClick={() => handleEdit(session)}
                      className="text-[#1D1D1D] hover:text-[#FD630A] hover:bg-[#FD630A]/10 p-2.5 rounded-lg transition-colors border border-transparent hover:border-[#FD630A]/20 flex items-center justify-center"
                      title="Edit Session"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-lg transition-colors border border-transparent hover:border-red-100 flex items-center justify-center w-full"
                      title="Delete Session"
                      onClick={async () => {
                        if (confirm("Delete this session?")) {
                          const res = await deleteMediaSession(session.id);
                          if (res?.success || res === undefined) {
                            window.location.reload();
                          } else {
                            alert("Error deleting session.");
                          }
                        }
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            {sessions.length === 0 && (
              <div className="text-center py-12 text-[#1D1D1D]/55 font-medium border border-dashed border-[#1D1D1D]/10 rounded-xl">
                No sessions created yet. Add one using the form on the right.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Add/Edit Session Form */}
      <div className="bg-white rounded-xl border border-[#1D1D1D]/5 p-6 shadow-sm h-fit sticky top-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#1D1D1D]">{isEditing ? "Edit Session" : "Create New Session"}</h2>
          {isEditing && (
            <button onClick={handleReset} className="text-xs font-bold text-[#FD630A] border border-[#FD630A]/20 px-3 py-1.5 rounded-lg hover:bg-[#FD630A]/10 transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
        
        <form action={isEditing ? handleUpdate : addAction} className="space-y-5">
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Session Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Grain Export Inspection 2026"
              className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FD630A]"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Date</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FD630A]"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Description / Log Details</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Write event logs, session summaries, or details..."
              className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FD630A] leading-relaxed"
            />
          </div>

          {isEditing && formData.existingMedia.length > 0 && (
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-[#1D1D1D]/70">Existing Media</label>
              <div className="flex flex-wrap gap-2">
                {formData.existingMedia.map((m: any, idx: number) => (
                  <div key={idx} className="relative w-16 h-16 rounded bg-[#1D1D1D]/5 border border-[#1D1D1D]/5 overflow-hidden group">
                    {m.type === "video" ? (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                        <Video size={16} />
                      </div>
                    ) : (
                      <img src={m.url} alt="" className="object-cover w-full h-full" />
                    )}
                    <button 
                      type="button"
                      onClick={() => removeExistingMedia(idx)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70 flex items-center space-x-1.5">
              <ImageIcon size={16} className="text-[#FD630A]" />
              <span>{isEditing ? "Add More Pictures & Videos" : "Upload Pictures & Videos"}</span>
            </label>
            <div className="border border-dashed border-[#1D1D1D]/15 rounded-lg p-4 bg-[#F7F3E6]/10 hover:bg-[#F7F3E6]/25 transition-all text-center relative cursor-pointer group">
              <input
                type="file"
                name="mediaFiles"
                multiple
                accept="image/*,video/*"
                required={!isEditing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-1">
                <Film className="mx-auto text-[#1D1D1D]/40 group-hover:text-[#FD630A] transition-colors" size={28} />
                <p className="text-xs font-bold text-[#1D1D1D]/70">Click to select files</p>
                <p className="text-[10px] text-[#1D1D1D]/50">Images & MP4 Videos allowed</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <SubmitButton
              defaultText={isEditing ? "Save Changes" : "Create Session"}
              loadingText={isEditing ? "Updating..." : "Uploading files & creating..."}
              className="w-full bg-[#FD630A] text-white hover:bg-[#e05304] transition-colors py-3 rounded-full text-sm font-bold shadow-lg shadow-[#FD630A]/10"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
