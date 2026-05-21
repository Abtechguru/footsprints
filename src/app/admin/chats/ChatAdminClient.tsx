"use client";

import { useState, useEffect, useRef } from "react";
import { sendAdminChatMessage } from "@/app/actions";
import { MessageSquare, Send, User, ChevronRight } from "lucide-react";

interface Thread {
  user_id: string;
  user_email: string;
  last_message: string;
  last_date: string;
}

interface ChatAdminClientProps {
  initialThreads: Thread[];
  initialMessages: any[];
}

export default function ChatAdminClient({ initialThreads, initialMessages }: ChatAdminClientProps) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    initialThreads[0]?.user_id || null
  );
  
  const [replyInput, setReplyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedThread = threads.find(t => t.user_id === selectedUserId);
  const activeMessages = messages.filter(m => m.user_id === selectedUserId);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUserId]);

  // Poll for message updates
  useEffect(() => {
    if (!selectedUserId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/chat?userId=${selectedUserId}`);
        if (res.ok) {
          const threadMessages = await res.json();
          // Update message log for this user
          setMessages(prev => {
            const filtered = prev.filter(m => m.user_id !== selectedUserId);
            return [...filtered, ...threadMessages].sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });
        }

        // Also fetch updated list of threads
        const resThreads = await fetch(`/api/admin/threads`);
        if (resThreads.ok) {
          const updatedThreads = await resThreads.json();
          setThreads(updatedThreads);
        }
      } catch (err) {
        console.error("Failed to poll chat thread updates:", err);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [selectedUserId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !replyInput.trim()) return;

    const messageText = replyInput;
    setReplyInput("");
    setLoading(true);

    const res = await sendAdminChatMessage(selectedUserId, messageText);
    setLoading(false);
    
    if (res.success) {
      // Append message
      setMessages([...messages, res.chat]);
      // Update thread last message
      setThreads(prev => 
        prev.map(t => 
          t.user_id === selectedUserId 
            ? { ...t, last_message: messageText, last_date: new Date().toISOString() } 
            : t
        ).sort((a, b) => new Date(b.last_date).getTime() - new Date(a.last_date).getTime())
      );
    } else {
      alert("Failed to send reply: " + res.error);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#1D1D1D]/5 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      
      {/* Threads list (Left) */}
      <div className="w-full md:w-80 border-r border-[#1D1D1D]/5 flex flex-col bg-[#F7F3E6]/10">
        <div className="p-4 border-b border-[#1D1D1D]/5 bg-[#F7F3E6]/30 flex items-center space-x-2">
          <MessageSquare className="text-[#FD630A]" size={18} />
          <span className="font-bold text-[#1D1D1D] text-sm">Customer Channels</span>
        </div>
        
        <div className="flex-1 divide-y divide-[#1D1D1D]/5 overflow-y-auto max-h-[500px]">
          {threads.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#1D1D1D]/45 font-medium">
              No conversations initiated.
            </div>
          ) : (
            threads.map((t) => {
              const isActive = t.user_id === selectedUserId;
              return (
                <button
                  key={t.user_id}
                  onClick={() => setSelectedUserId(t.user_id)}
                  className={`w-full p-4 text-left flex items-start space-x-3 transition-colors ${
                    isActive ? "bg-[#FD630A]/10" : "hover:bg-[#F7F3E6]/40"
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-[#1D1D1D]/5 flex items-center justify-center flex-shrink-0">
                    <User size={14} className={isActive ? "text-[#FD630A]" : "text-[#1D1D1D]/55"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`text-xs font-bold truncate ${isActive ? "text-[#FD630A]" : "text-[#1D1D1D]"}`}>
                        {t.user_email}
                      </span>
                      <span className="text-[9px] text-[#1D1D1D]/45 font-bold font-mono">
                        {formatDate(t.last_date)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#1D1D1D]/50 truncate">
                      {t.last_message}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-[#1D1D1D]/30 flex-shrink-0 self-center" />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Messages (Right) */}
      <div className="flex-1 flex flex-col min-h-[400px]">
        {selectedUserId && selectedThread ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-[#1D1D1D]/5 bg-[#F7F3E6]/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#FD630A] uppercase tracking-wider">Active Conversation</span>
                <h4 className="text-sm font-black text-[#1D1D1D] mt-0.5">{selectedThread.user_email}</h4>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 bg-[#F7F3E6]/10 overflow-y-auto max-h-[360px] space-y-4">
              {activeMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[75%] ${
                    msg.sender === "admin" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <span className="text-[9px] font-bold text-[#1D1D1D]/45 mb-1 uppercase tracking-wider">
                    {msg.sender === "admin" ? "Staff Response" : "Client"}
                  </span>
                  <div 
                    className={`p-3 rounded-xl text-xs font-semibold leading-relaxed ${
                      msg.sender === "admin"
                        ? "bg-[#1D1D1D] text-white rounded-tr-none"
                        : "bg-white text-[#1D1D1D] border border-[#1D1D1D]/10 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Response Input Form */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-[#1D1D1D]/5 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Type response to client..."
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                className="flex-1 bg-[#F7F3E6]/30 border border-[#1D1D1D]/15 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] transition-colors font-medium text-xs"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FD630A] hover:bg-[#1D1D1D] text-white px-5 rounded-lg transition-colors flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#1D1D1D]/40">
            <MessageSquare size={36} className="text-[#1D1D1D]/20 mb-3" />
            <p className="text-sm font-semibold">Select a customer conversation from the list to start responding.</p>
          </div>
        )}
      </div>

    </div>
  );
}
