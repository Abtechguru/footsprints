"use client";

import { useState } from "react";
import { Mail, Copy, Check, ExternalLink, Trash2 } from "lucide-react";
import { sendNewsletter, deleteSubscriber } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function SubscriberClient({ subscribers, isMasterAdmin }: { subscribers: Subscriber[]; isMasterAdmin: boolean }) {
  const [subscribersList, setSubscribersList] = useState<Subscriber[]>(subscribers);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const emailListString = subscribersList.map((s) => s.email).join(",");

  const handleCopyBCC = () => {
    navigator.clipboard.writeText(emailListString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBroadcastAction = async (formData: FormData) => {
    setStatus("idle");
    setErrorMessage("");

    const res = await sendNewsletter(formData);
    if (res.success) {
      setStatus("success");
      const form = document.getElementById("broadcastForm") as HTMLFormElement;
      form?.reset();
    } else {
      setStatus("error");
      setErrorMessage(res.error || "Failed to send newsletter.");
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!isMasterAdmin) {
      alert("Unauthorized: Only a Master Admin is permitted to delete subscribers.");
      return;
    }

    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    const res = await deleteSubscriber(id);
    if (res.success) {
      setSubscribersList(subscribersList.filter((s) => s.id !== id));
    } else {
      alert("Failed to delete: " + res.error);
    }
  };

  const mailtoLink = `mailto:?bcc=${encodeURIComponent(emailListString)}&subject=FootprintsEnergy%20Update`;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1D]">Newsletter Subscribers</h1>
          <p className="text-[#1D1D1D]/60 mt-1 font-medium">Manage and communicate with your {subscribersList.length} active subscribers</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopyBCC}
            className="flex items-center space-x-2 bg-white border border-[#1D1D1D]/10 hover:border-[#1D1D1D] text-[#1D1D1D] font-bold px-5 py-3 rounded-lg text-sm transition-all"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            <span>{copied ? "Copied BCC List" : "Copy BCC List"}</span>
          </button>
          <a
            href={mailtoLink}
            className="flex items-center space-x-2 bg-white border border-[#1D1D1D]/10 hover:border-[#FD630A] text-[#1D1D1D] hover:text-[#FD630A] font-bold px-5 py-3 rounded-lg text-sm transition-all"
          >
            <ExternalLink size={16} />
            <span>Compose in Mail App</span>
          </a>
        </div>
      </div>

      {/* Broadcast Email Form */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#1D1D1D]/5">
        <h2 className="text-xl font-bold text-[#1D1D1D] mb-2 flex items-center gap-2">
          <Mail className="text-[#FD630A]" size={20} />
          Broadcast Email Newsletter
        </h2>
        <p className="text-sm text-[#1D1D1D]/60 mb-6 font-medium">
          Send a beautiful updates newsletter to all {subscribersList.length} subscribers at once. 
          (Note: Resend credentials must be configured in <code>.env.local</code> for live broadcasts).
        </p>

        <form id="broadcastForm" action={handleBroadcastAction} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Email Subject</label>
            <input
              type="text"
              name="subject"
              required
              className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A]"
              placeholder="e.g. FootprintsEnergy Commodity Price Trends - May 2026"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Message Content</label>
            <textarea
              name="content"
              rows={8}
              required
              className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A]"
              placeholder="Write your email content here. Support line breaks to format paragraphs nicely..."
            ></textarea>
          </div>

          <div className="pt-2">
            <SubmitButton 
              defaultText="Send Broadcast" 
              loadingText="Sending Emails..." 
              className="bg-[#1D1D1D] text-white px-8 py-3.5 rounded-lg font-bold hover:bg-[#FD630A]"
            />
          </div>
        </form>

        {status === "success" && (
          <div className="mt-6 bg-green-50 text-green-700 p-4 rounded-lg text-sm font-bold border border-green-100">
            Newsletter has been broadcasted successfully to all subscribers!
          </div>
        )}
        {status === "error" && (
          <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm font-bold border border-red-100">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Subscriber List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#1D1D1D]/5 overflow-hidden">
        <div className="p-6 border-b border-[#1D1D1D]/5 bg-[#F7F3E6]/30">
          <h2 className="text-lg font-bold text-[#1D1D1D]">Subscriber Directory</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F3E6] text-[#1D1D1D] text-sm uppercase tracking-wider font-bold">
              <th className="p-4 border-b border-[#1D1D1D]/5">Email Address</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Date Joined</th>
              <th className="p-4 border-b border-[#1D1D1D]/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribersList.map((sub) => (
              <tr key={sub.id} className="hover:bg-[#F7F3E6]/50 transition-colors">
                <td className="p-4 border-b border-[#1D1D1D]/5 font-bold text-[#1D1D1D]">{sub.email}</td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-[#1D1D1D]/60 font-medium">
                  {new Date(sub.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-right">
                  {isMasterAdmin ? (
                    <button
                      onClick={() => handleDeleteSubscriber(sub.id)}
                      className="text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors inline-flex items-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <span className="text-xs text-[#1D1D1D]/30 italic font-bold">Locked</span>
                  )}
                </td>
              </tr>
            ))}
            {subscribersList.length === 0 && (
              <tr>
                <td colSpan={3} className="p-12 text-center text-[#1D1D1D]/50 font-medium">No subscribers found yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
