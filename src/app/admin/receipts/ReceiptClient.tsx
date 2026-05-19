"use client";

import { useState } from "react";
import { Mail, Printer, Plus, Trash2, ShieldCheck, Save, FolderOpen } from "lucide-react";
import { sendReceiptEmail, saveReceipt, deleteReceipt } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";

interface ChargeItem {
  id: string;
  date: string;
  type: string;
  productType: string;
  productName: string;
  term: string;
  amount: number;
  tax: number;
  taxType: string;
}

interface PaymentItem {
  id: string;
  date: string;
  orderNo: string;
  method: string;
  details: string;
  total: number;
}

interface SavedReceipt {
  id: string;
  receipt_no: string;
  buyer_name: string;
  buyer_email: string;
  date: string;
  items: ChargeItem[];
  payments: PaymentItem[];
  total_charges: number;
  footnotes: string;
  created_at: string;
}

export default function ReceiptClient({ products, initialReceipts, isMasterAdmin }: { products: any[]; initialReceipts: SavedReceipt[]; isMasterAdmin: boolean }) {
  const [receiptsList, setReceiptsList] = useState<SavedReceipt[]>(initialReceipts);
  
  const [buyerName, setBuyerName] = useState("John Doe");
  const [buyerEmail, setBuyerEmail] = useState("buyer@example.com");
  const [receiptNo, setReceiptNo] = useState(`RE-${Math.floor(100000000 + Math.random() * 900000000)}`);
  const [receiptDate, setReceiptDate] = useState(new Date().toLocaleDateString("en-US"));
  
  const [charges, setCharges] = useState<ChargeItem[]>([
    {
      id: "1",
      date: new Date().toLocaleDateString("en-US"),
      type: "Acquisition",
      productType: "Commodity",
      productName: products[0]?.name || "ICUMSA 45 Sugar",
      term: "One-time",
      amount: 12500.00,
      tax: 0.00,
      taxType: "VAT",
    }
  ]);

  const [payments, setPayments] = useState<PaymentItem[]>([
    {
      id: "1",
      date: new Date().toLocaleDateString("en-US"),
      orderNo: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      method: "Wire Transfer",
      details: "TXN-982749",
      total: 12500.00,
    }
  ]);

  const [footnotes, setFootnotes] = useState(
    "1. The payment information shown may not reflect the payment method used for each transaction, and all billing activity may not be shown here.\n2. Order numbers may appear in multiple accounts if an order included services from more than one account."
  );

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const addCharge = () => {
    setCharges([
      ...charges,
      {
        id: Math.random().toString(),
        date: new Date().toLocaleDateString("en-US"),
        type: "Acquisition",
        productType: "Commodity",
        productName: products[0]?.name || "Custom Item",
        term: "One-time",
        amount: 0,
        tax: 0,
        taxType: "VAT",
      }
    ]);
  };

  const removeCharge = (id: string) => {
    if (charges.length > 1) {
      setCharges(charges.filter((c) => c.id !== id));
    }
  };

  const handleChargeChange = (id: string, field: keyof ChargeItem, value: any) => {
    setCharges(
      charges.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addPayment = () => {
    setPayments([
      ...payments,
      {
        id: Math.random().toString(),
        date: new Date().toLocaleDateString("en-US"),
        orderNo: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        method: "CreditCard",
        details: "****4422",
        total: 0,
      }
    ]);
  };

  const removePayment = (id: string) => {
    if (payments.length > 1) {
      setPayments(payments.filter((p) => p.id !== id));
    }
  };

  const handlePaymentChange = (id: string, field: keyof PaymentItem, value: any) => {
    setPayments(
      payments.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Calculations
  const subtotalCharges = charges.reduce((sum, item) => sum + Number(item.amount) + Number(item.tax), 0);
  const totalPayments = payments.reduce((sum, item) => sum + Number(item.total), 0);

  const handlePrint = () => {
    window.print();
  };

  // Compile Receipt Data
  const getReceiptData = () => {
    return {
      buyerEmail,
      buyerName,
      receiptNo,
      date: receiptDate,
      items: charges.map((c) => ({
        date: c.date,
        type: c.type,
        productType: c.productType,
        productName: c.productName,
        term: c.term,
        amount: Number(c.amount),
        tax: Number(c.tax),
        taxType: c.taxType,
        total: Number(c.amount) + Number(c.tax),
      })),
      payments: payments.map((p) => ({
        date: p.date,
        orderNo: p.orderNo,
        method: p.method,
        details: p.details,
        total: Number(p.total),
      })),
      totalCharges: subtotalCharges,
      footnotes,
    };
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await sendReceiptEmail(getReceiptData());
    if (res.success) {
      setStatus("success");
      setMessage("Receipt was successfully emailed to " + buyerEmail);
    } else {
      setStatus("error");
      setMessage(res.error || "Failed to send email receipt.");
    }
  };

  const handleSaveReceipt = async () => {
    if (!isMasterAdmin) {
      alert("Unauthorized: Only a Master Admin is permitted to save or edit receipt records.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const res = await saveReceipt(getReceiptData());
    if (res.success && res.receipt) {
      setStatus("success");
      setMessage("Receipt saved successfully in the database!");
      
      const exists = receiptsList.find((r) => r.receipt_no === receiptNo);
      if (exists) {
        setReceiptsList(receiptsList.map((r) => (r.receipt_no === receiptNo ? res.receipt : r)));
      } else {
        setReceiptsList([res.receipt, ...receiptsList]);
      }
    } else {
      setStatus("error");
      setMessage(res.error || "Failed to save receipt to database.");
    }
  };

  const handleLoadReceipt = (receipt: SavedReceipt) => {
    setBuyerName(receipt.buyer_name);
    setBuyerEmail(receipt.buyer_email);
    setReceiptNo(receipt.receipt_no);
    setReceiptDate(receipt.date);
    setCharges(receipt.items);
    setPayments(receipt.payments);
    setFootnotes(receipt.footnotes || "");
    
    setStatus("idle");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteReceipt = async (id: string) => {
    if (!isMasterAdmin) {
      alert("Unauthorized: Only a Master Admin is permitted to delete receipt records.");
      return;
    }

    if (!confirm("Are you sure you want to delete this receipt from the database?")) return;
    
    const res = await deleteReceipt(id);
    if (res.success) {
      setReceiptsList(receiptsList.filter((r) => r.id !== id));
    } else {
      alert("Failed to delete: " + res.error);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Dynamic Printing CSS Override */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-receipt-area, #print-receipt-area * {
              visibility: visible;
            }
            #print-receipt-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              border: none;
              box-shadow: none;
            }
          }
        `}</style>

        {/* Form Fields - 6 Columns */}
        <div className="xl:col-span-6 bg-white p-8 rounded-xl shadow-sm border border-[#1D1D1D]/5 space-y-8 no-print">
          <div className="border-b border-[#1D1D1D]/5 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[#1D1D1D]">Create Customer Receipt</h2>
              <p className="text-sm text-[#1D1D1D]/50 mt-1 font-medium font-sans">Input charges, credits, and payments.</p>
            </div>
            <button
              onClick={() => {
                setReceiptNo(`RE-${Math.floor(100000000 + Math.random() * 900000000)}`);
                setBuyerName("John Doe");
                setBuyerEmail("buyer@example.com");
                setReceiptDate(new Date().toLocaleDateString("en-US"));
              }}
              className="text-xs font-bold text-[#FD630A] border border-[#FD630A]/20 hover:bg-[#FD630A]/5 px-3 py-1.5 rounded-lg"
            >
              Reset Form
            </button>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-[#1D1D1D]/70 uppercase">Customer Name</label>
              <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#FD630A]" />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-[#1D1D1D]/70 uppercase">Customer Email</label>
              <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} required className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#FD630A]" />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-[#1D1D1D]/70 uppercase">Receipt No.</label>
              <input type="text" value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} required className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#FD630A]" />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-[#1D1D1D]/70 uppercase">Receipt Date</label>
              <input type="text" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} required className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#FD630A]" />
            </div>
          </div>

          {/* Charges and Credits Editor */}
          <div className="space-y-4 pt-4 border-t border-[#1D1D1D]/5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#1D1D1D]">Charges & Credits</h3>
              <button type="button" onClick={addCharge} className="flex items-center space-x-1.5 text-xs bg-[#FD630A]/10 text-[#FD630A] font-bold px-3 py-1.5 rounded-lg hover:bg-[#FD630A] hover:text-white transition-colors">
                <Plus size={14} />
                <span>Add Charge</span>
              </button>
            </div>

            <div className="space-y-4">
              {charges.map((charge, idx) => (
                <div key={charge.id} className="bg-[#F7F3E6]/40 p-4 rounded-xl border border-[#1D1D1D]/5 space-y-4 relative">
                  {charges.length > 1 && (
                    <button type="button" onClick={() => removeCharge(charge.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="font-bold text-xs text-[#1D1D1D]/50">Charge Item #{idx + 1}</div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-[#1D1D1D]/70">Date</label>
                      <input type="text" value={charge.date} onChange={(e) => handleChargeChange(charge.id, "date", e.target.value)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-[#1D1D1D]/70">Type</label>
                      <input type="text" value={charge.type} onChange={(e) => handleChargeChange(charge.id, "type", e.target.value)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-[#1D1D1D]/70">Product Type</label>
                      <input type="text" value={charge.productType} onChange={(e) => handleChargeChange(charge.id, "productType", e.target.value)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" />
                    </div>
                    <div className="flex flex-col space-y-1 col-span-1">
                      <label className="font-bold text-[#1D1D1D]/70">Term</label>
                      <input type="text" value={charge.term} onChange={(e) => handleChargeChange(charge.id, "term", e.target.value)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex flex-col space-y-1 md:col-span-2">
                      <label className="font-bold text-[#1D1D1D]/70">Product Name</label>
                      <select
                        value={charge.productName}
                        onChange={(e) => handleChargeChange(charge.id, "productName", e.target.value)}
                        className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white"
                      >
                        <option value="">Custom Item</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                      {charge.productName === "" && (
                        <input
                          type="text"
                          placeholder="Type custom name..."
                          onChange={(e) => handleChargeChange(charge.id, "productName", e.target.value)}
                          className="mt-1 border border-[#1D1D1D]/10 rounded-lg p-2 bg-white"
                        />
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-[#1D1D1D]/70">Amount ($)</label>
                      <input type="number" step="0.01" value={charge.amount} onChange={(e) => handleChargeChange(charge.id, "amount", parseFloat(e.target.value) || 0)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-[#1D1D1D]/70">Tax ($)</label>
                      <input type="number" step="0.01" value={charge.tax} onChange={(e) => handleChargeChange(charge.id, "tax", parseFloat(e.target.value) || 0)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payments Editor */}
          <div className="space-y-4 pt-4 border-t border-[#1D1D1D]/5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#1D1D1D]">Payments Recieved</h3>
              <button type="button" onClick={addPayment} className="flex items-center space-x-1.5 text-xs bg-[#FD630A]/10 text-[#FD630A] font-bold px-3 py-1.5 rounded-lg hover:bg-[#FD630A] hover:text-white transition-colors">
                <Plus size={14} />
                <span>Add Payment</span>
              </button>
            </div>

            <div className="space-y-4">
              {payments.map((pmt, idx) => (
                <div key={pmt.id} className="bg-[#F7F3E6]/40 p-4 rounded-xl border border-[#1D1D1D]/5 space-y-4 relative">
                  {payments.length > 1 && (
                    <button type="button" onClick={() => removePayment(pmt.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="font-bold text-xs text-[#1D1D1D]/50">Payment #{idx + 1}</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-[#1D1D1D]/70">Date</label>
                      <input type="text" value={pmt.date} onChange={(e) => handlePaymentChange(pmt.id, "date", e.target.value)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-[#1D1D1D]/70">Order Number</label>
                      <input type="text" value={pmt.orderNo} onChange={(e) => handlePaymentChange(pmt.id, "orderNo", e.target.value)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-[#1D1D1D]/70">Method</label>
                      <input type="text" value={pmt.method} onChange={(e) => handlePaymentChange(pmt.id, "method", e.target.value)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" placeholder="CreditCard, Wire, Cash" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-[#1D1D1D]/70">Ref details</label>
                      <input type="text" value={pmt.details} onChange={(e) => handlePaymentChange(pmt.id, "details", e.target.value)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" placeholder="****4422" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-[#1D1D1D]/70">Total ($)</label>
                      <input type="number" step="0.01" value={pmt.total} onChange={(e) => handlePaymentChange(pmt.id, "total", parseFloat(e.target.value) || 0)} className="border border-[#1D1D1D]/10 rounded-lg p-2 bg-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footnotes Textarea */}
          <div className="flex flex-col space-y-2 pt-4 border-t border-[#1D1D1D]/5">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Receipt Footnotes / Notes</label>
            <textarea rows={4} value={footnotes} onChange={(e) => setFootnotes(e.target.value)} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#FD630A] resize-none" />
          </div>
        </div>

        {/* Live Receipt Preview - 6 Columns */}
        <div className="xl:col-span-6 space-y-6">
          <div className="bg-[#1D1D1D] p-8 rounded-xl shadow-xl text-white space-y-6 no-print">
            <h2 className="text-2xl font-bold mb-4">Receipt Controls</h2>
            <p className="text-white/70 leading-relaxed text-sm">
              Deliver this receipt to your customer's inbox, print/save it, or securely save/update it in the database.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleSendEmail}
                className="flex items-center justify-center space-x-2 bg-[#FD630A] hover:bg-[#FD630A]/90 transition-colors text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider"
              >
                <Mail size={16} />
                <span>Email Customer</span>
              </button>

              {isMasterAdmin ? (
                <button
                  type="button"
                  onClick={handleSaveReceipt}
                  className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 transition-colors text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider"
                >
                  <Save size={16} />
                  <span>Save to Database</span>
                </button>
              ) : (
                <div className="text-center text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg col-span-1 md:col-span-1">
                  ⚠️ Database saving restricted to Master Admin.
                </div>
              )}

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center space-x-2 col-span-1 md:col-span-2 bg-white/10 hover:bg-white/20 transition-all text-white border border-white/15 font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider"
              >
                <Printer size={16} />
                <span>Print / Save PDF</span>
              </button>
            </div>

            {status === "success" && (
              <div className="bg-green-500/10 text-green-400 p-4 rounded-lg text-sm font-bold border border-green-500/15">
                {message}
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-lg text-sm font-bold border border-red-500/15">
                {message}
              </div>
            )}
          </div>

          {/* Live Document Box - Matches the GoDaddy format! */}
          <div id="print-receipt-area" className="bg-white p-8 rounded-xl shadow-sm border border-[#1D1D1D]/10 text-[#1D1D1D] font-sans overflow-x-auto min-w-[700px] xl:min-w-0 relative">
            
            {/* Elegant Watermark Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0">
              <div className="text-center transform -rotate-12">
                <h1 className="text-7xl font-black tracking-tight leading-none text-[#1D1D1D]">FootprintsEnergy</h1>
                <p className="text-lg uppercase tracking-widest font-black mt-2 text-[#FD630A]">Global Commodities & Energy</p>
              </div>
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex justify-between items-center border-b-2 border-[#FD630A] pb-6 mb-8">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-[#1D1D1D] leading-none">
                    Footprints<span className="text-[#FD630A]">Energy</span>
                  </h1>
                  <p className="text-[10px] text-[#1D1D1D]/50 uppercase tracking-widest mt-1.5 font-bold flex items-center gap-1">
                    <ShieldCheck size={12} className="text-[#FD630A]" /> Global Trade & Commodity Logistics
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-[#1D1D1D]/40 uppercase tracking-widest leading-none mb-2">RECEIPT</h2>
                  <div className="text-xs space-y-0.5 text-[#1D1D1D]/75 font-medium">
                    <div><span className="font-bold text-[#1D1D1D]">Receipt ID:</span> {receiptNo}</div>
                    <div><span className="font-bold text-[#1D1D1D]">Date:</span> {receiptDate}</div>
                  </div>
                </div>
              </div>

              {/* Billed To Recipient Info */}
              <div className="mb-8 bg-[#F7F3E6]/60 p-4 rounded-lg border border-[#1D1D1D]/5">
                <div className="text-[10px] font-bold text-[#FD630A] uppercase tracking-wider mb-1">Billed To</div>
                <div className="font-bold text-sm text-[#1D1D1D]">{buyerName}</div>
                <div className="text-xs text-[#1D1D1D]/60 mt-0.5">{buyerEmail}</div>
              </div>

              {/* Charges and Credits */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-[#1D1D1D] uppercase tracking-wider">Charges and Credits:</h3>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#7F7F7F] text-white font-bold">
                      <th className="p-2 border border-[#7F7F7F]">Date</th>
                      <th className="p-2 border border-[#7F7F7F]">Type</th>
                      <th className="p-2 border border-[#7F7F7F]">Product Type</th>
                      <th className="p-2 border border-[#7F7F7F]">Product Name</th>
                      <th className="p-2 border border-[#7F7F7F]">Term</th>
                      <th className="p-2 border border-[#7F7F7F] text-right">Amount</th>
                      <th className="p-2 border border-[#7F7F7F] text-right">Tax</th>
                      <th className="p-2 border border-[#7F7F7F]">Tax Type</th>
                      <th className="p-2 border border-[#7F7F7F] text-right">Total Charges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charges.map((item) => {
                      const total = Number(item.amount) + Number(item.tax);
                      return (
                        <tr key={item.id} className="hover:bg-[#F7F3E6]/20 transition-colors border-b border-gray-200">
                          <td className="p-2 border-r border-gray-200">{item.date}</td>
                          <td className="p-2 border-r border-gray-200">{item.type}</td>
                          <td className="p-2 border-r border-gray-200">{item.productType}</td>
                          <td className="p-2 border-r border-gray-200 font-bold">{item.productName}</td>
                          <td className="p-2 border-r border-gray-200">{item.term}</td>
                          <td className="p-2 border-r border-gray-200 text-right">USD{Number(item.amount).toFixed(2)}</td>
                          <td className="p-2 border-r border-gray-200 text-right">USD{Number(item.tax).toFixed(2)}</td>
                          <td className="p-2 border-r border-gray-200">{item.taxType}</td>
                          <td className="p-2 text-right font-bold">USD{total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    {/* Total Row */}
                    <tr className="bg-gray-50 font-bold border-t-2 border-gray-400">
                      <td colSpan={7} className="p-2 text-right text-xs uppercase tracking-wider text-gray-500">Total Invoice Amount</td>
                      <td colSpan={2} className="p-2 text-right text-sm text-[#FD630A] font-black">USD{subtotalCharges.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payments */}
              <div className="space-y-3 mt-8">
                <h3 className="text-sm font-black text-[#1D1D1D] uppercase tracking-wider">Payments:</h3>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#7F7F7F] text-white font-bold">
                      <th className="p-2 border border-[#7F7F7F]">Date</th>
                      <th className="p-2 border border-[#7F7F7F]">Order Number</th>
                      <th className="p-2 border border-[#7F7F7F]">Payment Method</th>
                      <th className="p-2 border border-[#7F7F7F]">Check/Card#/PayPal ID</th>
                      <th className="p-2 border border-[#7F7F7F] text-right">Total Payments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((pmt) => (
                      <tr key={pmt.id} className="hover:bg-[#F7F3E6]/20 transition-colors border-b border-gray-200">
                        <td className="p-2 border-r border-gray-200">{pmt.date}</td>
                        <td className="p-2 border-r border-gray-200">{pmt.orderNo}</td>
                        <td className="p-2 border-r border-gray-200 font-bold">{pmt.method}</td>
                        <td className="p-2 border-r border-gray-200">{pmt.details}</td>
                        <td className="p-2 text-right font-bold">USD{Number(pmt.total).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes */}
              <div className="border-t border-gray-300 mt-10 pt-4">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Please Note:</h4>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed whitespace-pre-line">
                  {footnotes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Directory Section */}
      <div className="bg-white rounded-xl shadow-sm border border-[#1D1D1D]/5 overflow-hidden no-print">
        <div className="p-6 border-b border-[#1D1D1D]/5 bg-[#F7F3E6]/30 flex items-center space-x-2">
          <FolderOpen className="text-[#FD630A]" size={20} />
          <h2 className="text-lg font-bold text-[#1D1D1D]">Saved Receipts Registry ({receiptsList.length})</h2>
        </div>
        <table className="w-full text-left border-collapse text-sm font-medium font-sans">
          <thead>
            <tr className="bg-[#F7F3E6] text-[#1D1D1D] text-xs uppercase tracking-wider font-bold">
              <th className="p-4 border-b border-[#1D1D1D]/5">Receipt Number</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Buyer</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Date</th>
              <th className="p-4 border-b border-[#1D1D1D]/5 text-right">Total Amount</th>
              <th className="p-4 border-b border-[#1D1D1D]/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {receiptsList.map((rec) => (
              <tr key={rec.id} className="hover:bg-[#F7F3E6]/50 transition-colors">
                <td className="p-4 border-b border-[#1D1D1D]/5 font-bold text-[#FD630A]">{rec.receipt_no}</td>
                <td className="p-4 border-b border-[#1D1D1D]/5">
                  <div>{rec.buyer_name}</div>
                  <div className="text-xs text-[#1D1D1D]/50 font-sans">{rec.buyer_email}</div>
                </td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-[#1D1D1D]/60">{rec.date}</td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-right font-black text-[#1D1D1D]">
                  USD{Number(rec.total_charges).toFixed(2)}
                </td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-right space-x-3">
                  <button
                    onClick={() => handleLoadReceipt(rec)}
                    className="bg-[#1D1D1D] text-white hover:bg-[#FD630A] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Load & Edit
                  </button>
                  {isMasterAdmin ? (
                    <button
                      onClick={() => handleDeleteReceipt(rec.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="text-[10px] text-[#1D1D1D]/30 italic font-bold">Locked</span>
                  )}
                </td>
              </tr>
            ))}
            {receiptsList.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-[#1D1D1D]/40 font-bold font-sans">
                  No saved receipts found in the registry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
