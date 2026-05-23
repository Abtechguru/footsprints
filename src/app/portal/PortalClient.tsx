"use client";

import { useState, useEffect, useRef } from "react";
import { 
  signUpClient, 
  signInClient, 
  signOutClient, 
  createOrder, 
  sendChatMessage 
} from "@/app/actions";
import { 
  ShoppingBag, 
  MessageSquare, 
  FileText, 
  Send, 
  LogOut, 
  Lock, 
  Mail, 
  CheckCircle, 
  RefreshCw,
  PlusCircle,
  Download,
  Activity,
  ArrowRight
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";
import Link from "next/link";

interface PortalClientProps {
  user: any;
  initialOrders: any[];
  initialInvoices: any[];
  initialChats: any[];
  products: any[];
}

export default function PortalClient({ 
  user, 
  initialOrders, 
  initialInvoices, 
  initialChats, 
  products 
}: PortalClientProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Portal tabs: 'order' | 'orders' | 'invoices' | 'chat'
  const [activeTab, setActiveTab] = useState<"order" | "orders" | "invoices" | "chat">("order");
  
  // Orders State
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [orderForm, setOrderForm] = useState({
    productId: products[0]?.id || "",
    quantity: "",
    notes: ""
  });
  const [orderStatus, setOrderStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Invoices State
  const [invoicesList, setInvoicesList] = useState(initialInvoices);
  const [activeInvoice, setActiveInvoice] = useState<any | null>(null);

  // Chat State
  const [chatList, setChatList] = useState(initialChats);
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList]);

  // Periodic polling for new chat messages & order updates when logged in
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        // We can fetch updates by re-querying via simple API endpoints or refreshing page
        // For standard client-side updates, let's fetch the new messages/orders
        const resMessages = await fetch(`/api/portal/chat?userId=${user.id}`);
        if (resMessages.ok) {
          const newChats = await resMessages.json();
          setChatList(newChats);
        }

        const resOrders = await fetch(`/api/portal/orders?userId=${user.id}`);
        if (resOrders.ok) {
          const newOrders = await resOrders.json();
          setOrdersList(newOrders);
        }

        const resInvoices = await fetch(`/api/portal/invoices?email=${encodeURIComponent(user.email || "")}`);
        if (resInvoices.ok) {
          const newInvoices = await resInvoices.json();
          setInvoicesList(newInvoices);
        }
      } catch (err) {
        console.error("Failed to poll portal updates:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [user]);

  // Handle Auth submission
  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = isSignUp ? await signUpClient(formData) : await signInClient(formData);

    setLoading(false);
    if (!result.success) {
      setAuthError(result.error || "Authentication failed. Please try again.");
    } else {
      if (isSignUp) {
        setAuthSuccess("Sign up successful! Please check your email to verify your account or proceed to log in.");
        setIsSignUp(false);
      } else {
        window.location.reload();
      }
    }
  };

  // Handle Order Submit
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus(null);
    setLoading(true);

    const selectedProduct = products.find(p => p.id === orderForm.productId) || products[0];
    if (!selectedProduct) {
      setOrderStatus({ success: false, message: "No product selected." });
      setLoading(false);
      return;
    }

    const res = await createOrder(
      orderForm.productId, 
      selectedProduct.name, 
      orderForm.quantity, 
      orderForm.notes
    );

    setLoading(false);
    if (res.success) {
      setOrderStatus({ success: true, message: "Order placed successfully! The trade desk will review it shortly." });
      setOrderForm({ productId: products[0]?.id || "", quantity: "", notes: "" });
      // Prepend to orders
      setOrdersList([res.order, ...ordersList]);
    } else {
      setOrderStatus({ success: false, message: res.error || "Failed to place order." });
    }
  };

  // Handle Chat Message Submit
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageInput.trim()) return;

    const message = chatMessageInput;
    setChatMessageInput("");
    setChatLoading(true);

    const res = await sendChatMessage(message);
    setChatLoading(false);
    if (res.success) {
      setChatList([...chatList, res.chat]);
    } else {
      alert("Failed to send message: " + res.error);
    }
  };

  // Helper to safely format Date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  if (!user) {
    // Show Auth Form
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl border border-[#1D1D1D]/5 overflow-hidden">
        <div className="p-8 bg-[#1D1D1D] text-white text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Client <span className="text-[#FD630A]">Portal</span>
          </h2>
          <p className="text-white/60 text-xs mt-2 font-medium uppercase tracking-widest">
            Footprints Energy Commodities Trade Desk
          </p>
        </div>

        <div className="p-8 space-y-6">
          {authError && (
            <div className="p-4 bg-red-50 text-red-800 border border-red-150 rounded-xl text-sm font-semibold">
              {authError}
            </div>
          )}
          {authSuccess && (
            <div className="p-4 bg-green-50 text-green-800 border border-green-150 rounded-xl text-sm font-semibold">
              {authSuccess}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1D1D1D]/60 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-[#F7F3E6]/30 border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] transition-colors font-medium"
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1D1D1D]/60 uppercase tracking-widest">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-[#F7F3E6]/30 border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] transition-colors font-medium"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FD630A] hover:bg-[#1D1D1D] text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs uppercase tracking-widest mt-6"
            >
              <span>{loading ? "Please wait..." : isSignUp ? "Create Account" : "Access Portal"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="text-center pt-4 border-t border-[#1D1D1D]/5">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError(null);
                setAuthSuccess(null);
              }}
              className="text-[#FD630A] hover:text-[#1D1D1D] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show Portal Dashboard
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#1D1D1D]/5 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
      
      {/* Sidebar Panel / Top Nav on Mobile */}
      <div className="w-full md:w-80 bg-[#1D1D1D] text-white flex flex-col p-4 md:p-6 md:border-r border-[#FD630A]/20 relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#FD630A] opacity-10 blur-[50px] rounded-full pointer-events-none"></div>
        
        <div className="pb-4 md:pb-6 border-b border-white/10 mb-4 md:mb-6 flex justify-between items-center md:block">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white relative z-10 flex items-center gap-2">
              <div className="w-2 h-6 bg-[#FD630A] rounded-full"></div>
              Client Portal
            </h2>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-2 hidden md:block">Logged In As</p>
            <p className="text-xs font-medium text-[#FD630A] break-all hidden md:block mt-1">{user.email}</p>
          </div>
          <div className="md:hidden">
            <form action={signOutClient}>
              <button type="submit" className="text-xs font-bold bg-white/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>

        <nav className="flex md:flex-col gap-2 md:space-y-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 snap-x hide-scrollbar">
          <button
            onClick={() => setActiveTab("order")}
            className={`flex items-center space-x-2 md:space-x-3 px-4 py-3 md:py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left whitespace-nowrap snap-center ${
              activeTab === "order" 
                ? "bg-gradient-to-r from-[#FD630A] to-[#ff7e33] text-white shadow-lg shadow-[#FD630A]/20" 
                : "hover:bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <ShoppingBag size={18} />
            <span>Place Order</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center space-x-2 md:space-x-3 px-4 py-3 md:py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left whitespace-nowrap snap-center ${
              activeTab === "orders" 
                ? "bg-gradient-to-r from-[#FD630A] to-[#ff7e33] text-white shadow-lg shadow-[#FD630A]/20" 
                : "hover:bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Activity size={18} />
            <span>My Orders ({ordersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex items-center space-x-2 md:space-x-3 px-4 py-3 md:py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left whitespace-nowrap snap-center ${
              activeTab === "invoices" 
                ? "bg-gradient-to-r from-[#FD630A] to-[#ff7e33] text-white shadow-lg shadow-[#FD630A]/20" 
                : "hover:bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <FileText size={18} />
            <span>Invoices ({invoicesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center space-x-2 md:space-x-3 px-4 py-3 md:py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left whitespace-nowrap snap-center ${
              activeTab === "chat" 
                ? "bg-gradient-to-r from-[#FD630A] to-[#ff7e33] text-white shadow-lg shadow-[#FD630A]/20" 
                : "hover:bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <MessageSquare size={18} />
            <span>Desk Chat</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10 mt-auto hidden md:block">
          <form action={signOutClient}>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-red-400 hover:text-red-300 bg-white/5 hover:bg-red-500/10 transition-all border border-white/5 hover:border-red-500/20"
            >
              <LogOut size={16} />
              <span>Log Out Portal</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        
        {/* PLACE ORDER TAB */}
        {activeTab === "order" && (
          <div className="space-y-6 max-w-2xl animate-fadeIn">
            <div>
              <h3 className="text-2xl font-black text-[#1D1D1D]">Request Commodity Quote / Order</h3>
              <p className="text-sm text-[#1D1D1D]/55 font-medium mt-1">
                Select from our primary commodities and specify your required volume. Our trade desk will immediately review and generate a formal FCO or Invoice.
              </p>
            </div>

            {orderStatus && (
              <div className={`p-4 rounded-xl text-sm font-semibold border ${
                orderStatus.success 
                  ? "bg-green-50 text-green-800 border-green-200" 
                  : "bg-red-50 text-red-800 border-red-200"
              }`}>
                {orderStatus.message}
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1D1D1D]/60 uppercase tracking-widest">Select Product</label>
                <select
                  value={orderForm.productId}
                  onChange={(e) => setOrderForm({ ...orderForm, productId: e.target.value })}
                  className="w-full bg-[#F7F3E6]/30 border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] transition-colors font-medium text-sm"
                  required
                >
                  <option value="" disabled>Choose a product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1D1D1D]/60 uppercase tracking-widest">Target Quantity / Size</label>
                <input
                  type="text"
                  placeholder="e.g. 5,000 MT, 25,000 Barrels, etc."
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                  className="w-full bg-[#F7F3E6]/30 border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] transition-colors font-medium text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1D1D1D]/60 uppercase tracking-widest">Delivery / Specification Notes (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Provide delivery terms (CIF, FOB, destination port) and any specific chemical/physical quality requirements."
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  className="w-full bg-[#F7F3E6]/30 border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] transition-colors font-medium text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#FD630A] hover:bg-[#1D1D1D] text-white font-bold px-8 py-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs uppercase tracking-widest"
              >
                <PlusCircle size={16} />
                <span>{loading ? "Submitting Request..." : "Submit Order Inquiry"}</span>
              </button>
            </form>
          </div>
        )}

        {/* MY ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-2xl font-black text-[#1D1D1D]">My Commodity Inquiries & Orders</h3>
              <p className="text-sm text-[#1D1D1D]/55 font-medium mt-1">
                Track status and details of your submissions to our desk.
              </p>
            </div>

            {ordersList.length === 0 ? (
              <div className="text-center py-12 bg-[#F7F3E6]/20 border border-dashed border-[#1D1D1D]/10 rounded-2xl">
                <p className="text-sm font-medium text-[#1D1D1D]/50">No inquiries placed yet.</p>
              </div>
            ) : (
              <div className="bg-white border border-[#1D1D1D]/5 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F3E6] border-b border-[#1D1D1D]/5 text-[#1D1D1D]/60 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4">Date</th>
                      <th className="p-4">Commodity</th>
                      <th className="p-4">Requested Quantity</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D1D1D]/5 text-sm">
                    {ordersList.map((order) => (
                      <tr key={order.id} className="hover:bg-[#F7F3E6]/20 transition-colors">
                        <td className="p-4 font-semibold text-[#1D1D1D]/70">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="p-4 font-bold text-[#1D1D1D]">
                          {order.product_name}
                        </td>
                        <td className="p-4 font-medium text-[#1D1D1D]/70">
                          {order.quantity}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                            order.status === "pending"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : order.status === "processing"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : order.status === "completed"
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-red-50 text-red-800 border-red-200"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* INVOICES TAB */}
        {activeTab === "invoices" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-2xl font-black text-[#1D1D1D]">My Official Invoices</h3>
              <p className="text-sm text-[#1D1D1D]/55 font-medium mt-1">
                View, download, and review standard invoices or full corporate offers matching your account email.
              </p>
            </div>

            {invoicesList.length === 0 ? (
              <div className="text-center py-12 bg-[#F7F3E6]/20 border border-dashed border-[#1D1D1D]/10 rounded-2xl">
                <p className="text-sm font-medium text-[#1D1D1D]/50">No invoices found for your email address.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {invoicesList.map((invoice) => {
                  // Structure items properly for rendering
                  const invoiceData = {
                    invoiceNo: invoice.invoice_no,
                    date: invoice.date,
                    clientName: invoice.client_name,
                    clientAddress: invoice.client_address,
                    items: invoice.items || [],
                    totalAmount: invoice.total_amount || 0,
                    notes: invoice.notes || "",
                    origin: typeof window !== 'undefined' ? window.location.origin : ''
                  };

                  return (
                    <div key={invoice.id} className="bg-white border border-[#1D1D1D]/10 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold bg-[#FD630A]/10 text-[#FD630A] border border-[#FD630A]/20 px-2 py-0.5 rounded uppercase tracking-wider">
                            Invoice
                          </span>
                          <span className="text-xs font-semibold text-[#1D1D1D]/50">
                            {invoice.date}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-[#1D1D1D] mt-2">
                          #{invoice.invoice_no}
                        </h4>
                        <p className="text-sm font-medium text-[#1D1D1D]/60 mt-1">
                          Client: <span className="font-bold text-[#1D1D1D]">{invoice.client_name}</span>
                        </p>
                        <div className="text-xl font-bold text-[#FD630A] mt-3 font-sans">
                          Total Amount: ${invoice.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#1D1D1D]/5">
                        <PDFDownloadLink
                          document={<InvoicePDF data={invoiceData} />}
                          fileName={`Invoice_${invoice.invoice_no}.pdf`}
                          className="w-full flex items-center justify-center space-x-2 bg-[#1D1D1D] hover:bg-[#FD630A] transition-colors text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-widest"
                        >
                          {/* @ts-ignore */}
                          {({ loading }) => (
                            <>
                              <Download size={14} />
                              <span>{loading ? "Compiling..." : "Download PDF"}</span>
                            </>
                          )}
                        </PDFDownloadLink>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div className="space-y-6 flex flex-col h-[550px] animate-fadeIn">
            <div>
              <h3 className="text-2xl font-black text-[#1D1D1D]">Global Trade Desk Live Chat</h3>
              <p className="text-sm text-[#1D1D1D]/55 font-medium mt-1">
                Chat in real-time with our commercial desk administrators regarding your inquiries.
              </p>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 bg-[#F7F3E6]/30 border border-[#1D1D1D]/5 rounded-xl p-4 overflow-y-auto space-y-4">
              {chatList.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm font-medium text-[#1D1D1D]/40">
                  Send a message to open your conversation with our Trade Desk.
                </div>
              ) : (
                chatList.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`flex flex-col max-w-[75%] ${
                      chat.sender === "visitor" ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-[#1D1D1D]/40 mb-1">
                      {chat.sender === "visitor" ? "You" : "Admin / Desk"}
                    </span>
                    <div 
                      className={`p-3.5 rounded-xl text-sm font-medium leading-relaxed ${
                        chat.sender === "visitor"
                          ? "bg-[#FD630A] text-white rounded-tr-none"
                          : "bg-white text-[#1D1D1D] border border-[#1D1D1D]/10 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {chat.message}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Send Form */}
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message to the Trade Desk..."
                value={chatMessageInput}
                onChange={(e) => setChatMessageInput(e.target.value)}
                className="flex-1 bg-[#F7F3E6]/30 border border-[#1D1D1D]/10 rounded-lg px-4 py-3.5 focus:outline-none focus:border-[#FD630A] transition-colors font-medium text-sm"
                required
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="bg-[#1D1D1D] hover:bg-[#FD630A] text-white px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
