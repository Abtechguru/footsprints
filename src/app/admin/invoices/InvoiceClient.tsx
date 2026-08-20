"use client";

import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";
import { Mail, Printer, Plus, Trash2, ShieldCheck, Save, FolderOpen, Image as ImageIcon, UploadCloud } from "lucide-react";
import { saveInvoice, deleteInvoice, uploadLogo } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";

interface InvoiceItem {
  id: string;
  productName: string;
  quantity: string;
  unitPrice: number;
}

interface SavedInvoice {
  id: string;
  invoice_no: string;
  client_name: string;
  client_address: string;
  date: string;
  items: InvoiceItem[];
  total_amount: number;
  notes: string;
  header_title?: string;
  created_at: string;
}

export default function InvoiceClient({ products, initialInvoices, isMasterAdmin }: { products: any[]; initialInvoices: SavedInvoice[]; isMasterAdmin: boolean }) {
  const [invoicesList, setInvoicesList] = useState<SavedInvoice[]>(initialInvoices);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    headerTitle: "PROFORMA INVOICE",
    invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toLocaleDateString("en-US"),
    clientName: "John Doe & Co.",
    clientAddress: "123 Business Rd, suite 100",
    notes: "Please review the quotation details above. This quotation is valid for 15 days.",
    companyName: "Footprints Energy",
    companyAddress: "123 Trade Center Blvd\nNew York, NY 10001",
    companyContact: "contact@footprintsenergy.com\n+1 (555) 123-4567",
    companyLogo: "",
    bankDetails: "Acct Name : Footprints Energy Inc\nBank: Bank of America\nAcct No: 4881 3467 4843\nRouting: 111000025\nWire: 026009593\nSwift : BOFAUS3N",
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const res = await uploadLogo(formDataUpload);
      if (res.success && res.url) {
        setFormData({ ...formData, companyLogo: res.url });
        setPdfReady(false);
      } else {
        alert("Failed to upload logo: " + res.error);
      }
    }
  };

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", productName: products[0]?.name || "ICUMSA 45 Sugar", quantity: "100 MT", unitPrice: 450 }
  ]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setPdfReady(false);
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    setPdfReady(false);
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), productName: products[0]?.name || "Custom Item", quantity: "1 MT", unitPrice: 0 }]);
    setPdfReady(false);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
      setPdfReady(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * (parseFloat(item.quantity) || 1)), 0);

  // PDF Compilation
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfData, setPdfData] = useState<any>(null);

  const handleCompile = () => {
    setPdfData({ ...formData, items, totalAmount, origin });
    setPdfReady(true);
  };

  const getInvoiceData = () => {
    return {
      headerTitle: formData.headerTitle,
      invoiceNo: formData.invoiceNo,
      clientName: formData.clientName,
      clientAddress: formData.clientAddress,
      date: formData.date,
      items: items.map(item => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice)
      })),
      totalAmount: totalAmount,
      notes: formData.notes,
      bankDetails: formData.bankDetails
    };
  };

  const handleSaveInvoice = async () => {
    if (!isMasterAdmin) {
      alert("Unauthorized: Only a Master Admin is permitted to save or edit invoice records.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const res = await saveInvoice(getInvoiceData());
    if (res.success && res.invoice) {
      setStatus("success");
      setMessage("Invoice successfully saved in the database!");

      const exists = invoicesList.find((i) => i.invoice_no === formData.invoiceNo);
      if (exists) {
        setInvoicesList(invoicesList.map((i) => (i.invoice_no === formData.invoiceNo ? res.invoice : i)));
      } else {
        setInvoicesList([res.invoice, ...invoicesList]);
      }
    } else {
      setStatus("error");
      setMessage(res.error || "Failed to save invoice to database.");
    }
  };

  const handleLoadInvoice = (inv: SavedInvoice) => {
    setFormData({
      ...formData,
      headerTitle: inv.header_title || "PROFORMA INVOICE",
      invoiceNo: inv.invoice_no,
      date: inv.date,
      clientName: inv.client_name,
      clientAddress: inv.client_address,
      notes: inv.notes || ""
    });
    setItems(inv.items);
    setPdfReady(false);

    setStatus("idle");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!isMasterAdmin) {
      alert("Unauthorized: Only a Master Admin is permitted to delete invoice records.");
      return;
    }

    if (!confirm("Are you sure you want to delete this invoice from the database?")) return;

    const res = await deleteInvoice(id);
    if (res.success) {
      setInvoicesList(invoicesList.filter((i) => i.id !== id));
    } else {
      alert("Failed to delete: " + res.error);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Form Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#1D1D1D]/5 space-y-6">
          <div className="border-b border-[#1D1D1D]/5 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[#1D1D1D]">Invoice / Quotation Details</h2>
              <p className="text-xs text-[#1D1D1D]/50 mt-1 font-medium font-sans">Input invoice details and compile to download.</p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  headerTitle: "PROFORMA INVOICE",
                  invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
                  date: new Date().toLocaleDateString("en-US"),
                  clientName: "John Doe & Co.",
                  clientAddress: "123 Business Rd, suite 100",
                  notes: "Please review the quotation details above. This quotation is valid for 15 days.",
                  companyName: "Footprints Energy",
                  companyAddress: "123 Trade Center Blvd\nNew York, NY 10001",
                  companyContact: "contact@footprintsenergy.com\n+1 (555) 123-4567",
                  companyLogo: "",
                  bankDetails: "Acct Name : Footprints Energy Inc\nBank: Bank of America\nAcct No: 4881 3467 4843\nRouting: 111000025\nWire: 026009593\nSwift : BOFAUS3N",
                });
                setItems([{ id: "1", productName: products[0]?.name || "ICUMSA 45 Sugar", quantity: "100 MT", unitPrice: 450 }]);
                setPdfReady(false);
              }}
              className="text-xs font-bold text-[#FD630A] border border-[#FD630A]/20 hover:bg-[#FD630A]/5 px-3 py-1.5 rounded-lg"
            >
              Reset Form
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col space-y-2 bg-[#F7F3E6]/40 p-4 rounded-xl border border-[#1D1D1D]/5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#1D1D1D] uppercase tracking-wider">Document Header Title</label>
                <span className="text-[10px] text-[#FD630A] font-bold uppercase">Editable on Editor</span>
              </div>
              <input 
                type="text" 
                name="headerTitle" 
                value={formData.headerTitle} 
                onChange={(e) => handleChange(e)} 
                placeholder="e.g. PROFORMA INVOICE, COMMERCIAL INVOICE, QUOTATION" 
                className="border border-[#1D1D1D]/15 rounded-lg px-4 py-2.5 text-sm font-bold text-[#1D1D1D] bg-white focus:outline-none focus:border-[#FD630A] shadow-sm" 
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["PROFORMA INVOICE", "COMMERCIAL INVOICE", "TAX INVOICE", "QUOTATION", "OFFICIAL OFFER", "PURCHASE ORDER"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, headerTitle: preset });
                      setPdfReady(false);
                    }}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${
                      formData.headerTitle === preset
                        ? "bg-[#1D1D1D] text-white shadow-sm"
                        : "bg-white border border-[#1D1D1D]/10 text-[#1D1D1D]/70 hover:bg-[#FD630A] hover:text-white hover:border-[#FD630A]"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Invoice No.</label>
                <input type="text" name="invoiceNo" value={formData.invoiceNo} onChange={(e) => { handleChange(e); }} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A]" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Date</label>
                <input type="text" name="date" value={formData.date} onChange={(e) => { handleChange(e); }} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A]" />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-[#1D1D1D]/70">Client Name</label>
              <input type="text" name="clientName" value={formData.clientName} onChange={(e) => { handleChange(e); }} placeholder="Company or Individual" className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A]" />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-[#1D1D1D]/70">Client Address</label>
              <input type="text" name="clientAddress" value={formData.clientAddress} onChange={(e) => { handleChange(e); }} placeholder="123 Street, City, Country" className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A]" />
            </div>

            <div className="border-t border-[#1D1D1D]/10 pt-4 mt-6">
              <h3 className="font-bold text-[#1D1D1D] mb-4">Issuer / Company Details</h3>

              <div className="flex flex-col space-y-2 mb-4">
                <label className="text-sm font-bold text-[#1D1D1D]/70 flex items-center space-x-1.5">
                  <ImageIcon size={16} className="text-[#FD630A]" />
                  <span>Company Logo</span>
                </label>
                <div className="flex items-center space-x-4">
                  {formData.companyLogo && (
                    <img src={formData.companyLogo} alt="Logo" className="h-12 w-12 object-contain border border-[#1D1D1D]/10 rounded bg-white p-1 shadow-sm" />
                  )}
                  <div className="relative flex-1 group">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="flex items-center justify-center gap-2 border-2 border-dashed border-[#1D1D1D]/20 group-hover:border-[#FD630A] group-hover:bg-[#FD630A]/5 rounded-lg py-3 transition-all">
                      <UploadCloud size={18} className="text-[#1D1D1D]/40 group-hover:text-[#FD630A]" />
                      <span className="text-xs font-bold text-[#1D1D1D]/70 group-hover:text-[#FD630A]">Click or drop to upload logo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-bold text-[#1D1D1D]/70">Company Name</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={(e) => { handleChange(e); }} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A]" />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-bold text-[#1D1D1D]/70">Company Contact</label>
                  <textarea name="companyContact" value={formData.companyContact} onChange={(e) => { handleChange(e); }} rows={2} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A] text-xs resize-none" />
                </div>
              </div>

              <div className="flex flex-col space-y-2 mt-4">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Company Address</label>
                <textarea name="companyAddress" value={formData.companyAddress} onChange={(e) => { handleChange(e); }} rows={2} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A] text-xs resize-none" />
              </div>

              <div className="flex flex-col space-y-2 mt-4">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Bank Account Details</label>
                <textarea name="bankDetails" value={formData.bankDetails} onChange={(e) => { handleChange(e); }} rows={6} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A] text-xs resize-none" />
              </div>
            </div>

            <div className="border-t border-[#1D1D1D]/10 pt-4 mt-6">
              <h3 className="font-bold text-[#1D1D1D] mb-4">Products</h3>
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 mb-4 items-end bg-[#F7F3E6] p-4 rounded-lg">
                  <div className="col-span-12 md:col-span-5 flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1D1D1D]/70">Product</label>
                    <select
                      value={item.productName}
                      onChange={(e) => { handleItemChange(item.id, 'productName', e.target.value); }}
                      className="border border-[#1D1D1D]/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FD630A] bg-white text-sm"
                    >
                      <option value="">Custom Item</option>
                      {products.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-4 md:col-span-3 flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1D1D1D]/70">Qty</label>
                    <input type="text" value={item.quantity} onChange={(e) => { handleItemChange(item.id, 'quantity', e.target.value); }} className="border border-[#1D1D1D]/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FD630A] text-sm" />
                  </div>
                  <div className="col-span-6 md:col-span-3 flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1D1D1D]/70">Price ($)</label>
                    <input type="number" value={item.unitPrice} onChange={(e) => { handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0); }} className="border border-[#1D1D1D]/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FD630A] text-sm" />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex justify-end pb-1">
                    <button type="button" onClick={() => { removeItem(item.id); }} className="text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-100 rounded">X</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addItem} className="text-sm font-bold text-[#FD630A] border border-[#FD630A] rounded-lg px-4 py-2 hover:bg-[#FD630A] hover:text-white transition-colors">
                + Add Another Product
              </button>
            </div>

            <div className="flex flex-col space-y-2 pt-4">
              <label className="text-sm font-bold text-[#1D1D1D]/70">Quotation Text / Terms</label>
              <textarea name="notes" rows={4} value={formData.notes} onChange={(e) => { handleChange(e); }} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A] resize-none" />
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col space-y-6">
          <div className="bg-[#1D1D1D] p-8 rounded-xl shadow-xl text-white space-y-6">
            <h2 className="text-2xl font-bold">Quotation Controls</h2>
            <p className="text-white/70 leading-relaxed text-sm">
              Compile this quotation into a printable PDF layout or securely store/update it in the shared database.
            </p>
            <div className="text-3xl font-black text-[#FD630A] border-t border-white/10 pt-4 font-sans">
              Total: ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div className="space-y-4">
              {!pdfReady ? (
                <button
                  onClick={handleCompile}
                  className="block w-full text-center bg-[#DAA35D] hover:bg-[#c28f4c] transition-colors text-white font-bold py-4 rounded-lg text-sm uppercase tracking-widest shadow-lg shadow-[#DAA35D]/10"
                >
                  Prepare Invoice Document
                </button>
              ) : (
                isClient && (
                  <PDFDownloadLink
                    document={<InvoicePDF data={pdfData} />}
                    fileName={`Quotation_${pdfData.invoiceNo}.pdf`}
                    className="block w-full text-center bg-[#FD630A] hover:bg-white hover:text-[#FD630A] transition-colors text-white font-bold py-4 rounded-lg text-sm uppercase tracking-widest shadow-lg shadow-[#FD630A]/10"
                  >
                    {/* @ts-ignore */}
                    {({ blob, url, loading, error }) =>
                      loading ? 'Compiling PDF...' : 'Download Prepared PDF'
                    }
                  </PDFDownloadLink>
                )
              )}

              {isMasterAdmin ? (
                <button
                  onClick={handleSaveInvoice}
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 transition-colors text-white font-bold py-4 rounded-lg text-sm uppercase tracking-widest"
                >
                  <Save size={16} />
                  <span>{status === "loading" ? "Saving..." : "Save Invoice to Database"}</span>
                </button>
              ) : (
                <div className="text-center text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                  ⚠️ Database saving and editing is restricted to Master Admin.
                </div>
              )}
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
        </div>
      </div>

      {/* Database Directory Section */}
      <div className="bg-white rounded-xl shadow-sm border border-[#1D1D1D]/5 overflow-hidden">
        <div className="p-6 border-b border-[#1D1D1D]/5 bg-[#F7F3E6]/30 flex items-center space-x-2">
          <FolderOpen className="text-[#FD630A]" size={20} />
          <h2 className="text-lg font-bold text-[#1D1D1D]">Saved Invoices Directory ({invoicesList.length})</h2>
        </div>
        <table className="w-full text-left border-collapse text-sm font-medium font-sans">
          <thead>
            <tr className="bg-[#F7F3E6] text-[#1D1D1D] text-xs uppercase tracking-wider font-bold">
              <th className="p-4 border-b border-[#1D1D1D]/5">Invoice Number</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Client</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Date</th>
              <th className="p-4 border-b border-[#1D1D1D]/5 text-right">Grand Total</th>
              <th className="p-4 border-b border-[#1D1D1D]/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoicesList.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#F7F3E6]/50 transition-colors">
                <td className="p-4 border-b border-[#1D1D1D]/5 font-bold text-[#FD630A]">{inv.invoice_no}</td>
                <td className="p-4 border-b border-[#1D1D1D]/5">
                  <div>{inv.client_name}</div>
                  <div className="text-xs text-[#1D1D1D]/50">{inv.client_address}</div>
                </td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-[#1D1D1D]/60">{inv.date}</td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-right font-black text-[#1D1D1D]">
                  ${Number(inv.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-right space-x-3">
                  <button
                    onClick={() => handleLoadInvoice(inv)}
                    className="bg-[#1D1D1D] text-white hover:bg-[#FD630A] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Load & Edit
                  </button>
                  {isMasterAdmin ? (
                    <button
                      onClick={() => handleDeleteInvoice(inv.id)}
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
            {invoicesList.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-[#1D1D1D]/40 font-bold font-sans">
                  No saved invoices found in the directory database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
