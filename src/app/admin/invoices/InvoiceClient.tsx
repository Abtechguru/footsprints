"use client";

import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";

interface InvoiceItem {
  id: string;
  productName: string;
  quantity: string;
  unitPrice: number;
}

export default function InvoiceClient({ products }: { products: any[] }) {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toLocaleDateString(),
    clientName: "",
    clientAddress: "",
    notes: "Please review the quotation details above. This quotation is valid for 15 days.",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", productName: products[0]?.name || "", quantity: "1 MT", unitPrice: 100 }
  ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), productName: products[0]?.name || "", quantity: "1 MT", unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * (parseFloat(item.quantity) || 1)), 0);

  // We need the full URL for the logo in react-pdf when running in browser
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const [pdfReady, setPdfReady] = useState(false);
  const [pdfData, setPdfData] = useState<any>(null);

  const handleCompile = () => {
    setPdfData({ ...formData, items, totalAmount, origin });
    setPdfReady(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Form Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#1D1D1D]/5">
        <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Invoice / Quotation Details</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-[#1D1D1D]/70">Invoice No.</label>
              <input type="text" name="invoiceNo" value={formData.invoiceNo} onChange={(e) => { handleChange(e); setPdfReady(false); }} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A]" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-[#1D1D1D]/70">Date</label>
              <input type="text" name="date" value={formData.date} onChange={(e) => { handleChange(e); setPdfReady(false); }} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A]" />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Client Name</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={(e) => { handleChange(e); setPdfReady(false); }} placeholder="Company or Individual" className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A]" />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Client Address</label>
            <input type="text" name="clientAddress" value={formData.clientAddress} onChange={(e) => { handleChange(e); setPdfReady(false); }} placeholder="123 Street, City, Country" className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A]" />
          </div>

          <div className="border-t border-[#1D1D1D]/10 pt-4 mt-6">
            <h3 className="font-bold text-[#1D1D1D] mb-4">Products</h3>
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 mb-4 items-end bg-[#F7F3E6] p-4 rounded-lg">
                <div className="col-span-12 md:col-span-5 flex flex-col space-y-2">
                  <label className="text-xs font-bold text-[#1D1D1D]/70">Product</label>
                  <select 
                    value={item.productName} 
                    onChange={(e) => { handleItemChange(item.id, 'productName', e.target.value); setPdfReady(false); }} 
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
                  <input type="text" value={item.quantity} onChange={(e) => { handleItemChange(item.id, 'quantity', e.target.value); setPdfReady(false); }} className="border border-[#1D1D1D]/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FD630A] text-sm" />
                </div>
                <div className="col-span-6 md:col-span-3 flex flex-col space-y-2">
                  <label className="text-xs font-bold text-[#1D1D1D]/70">Price ($)</label>
                  <input type="number" value={item.unitPrice} onChange={(e) => { handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0); setPdfReady(false); }} className="border border-[#1D1D1D]/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FD630A] text-sm" />
                </div>
                <div className="col-span-2 md:col-span-1 flex justify-end pb-1">
                  <button type="button" onClick={() => { removeItem(item.id); setPdfReady(false); }} className="text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-100 rounded">X</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => { addItem(); setPdfReady(false); }} className="text-sm font-bold text-[#FD630A] border border-[#FD630A] rounded-lg px-4 py-2 hover:bg-[#FD630A] hover:text-white transition-colors">
              + Add Another Product
            </button>
          </div>

          <div className="flex flex-col space-y-2 pt-4">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Quotation Text / Terms</label>
            <textarea name="notes" rows={4} value={formData.notes} onChange={(e) => { handleChange(e); setPdfReady(false); }} className="border border-[#1D1D1D]/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FD630A] resize-none" />
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="flex flex-col space-y-6">
        <div className="bg-[#1D1D1D] p-8 rounded-xl shadow-xl text-white">
          <h2 className="text-2xl font-bold mb-4">Generate PDF</h2>
          <p className="text-white/70 mb-4 leading-relaxed">
            Fill out the quotation details on the left. You can add multiple products.
          </p>
          <div className="text-2xl font-bold text-[#FD630A] mb-8 border-t border-white/20 pt-4">
            Total: ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          
          {!pdfReady ? (
            <button 
              onClick={handleCompile}
              className="block w-full text-center bg-[#DAA35D] hover:bg-[#c28f4c] transition-colors text-white font-bold py-4 rounded-lg text-lg uppercase tracking-widest shadow-lg shadow-[#DAA35D]/20"
            >
              Prepare Invoice Document
            </button>
          ) : (
            isClient && (
              <PDFDownloadLink
                document={<InvoicePDF data={pdfData} />}
                fileName={`Quotation_${pdfData.invoiceNo}.pdf`}
                className="block w-full text-center bg-[#FD630A] hover:bg-white hover:text-[#FD630A] transition-colors text-white font-bold py-4 rounded-lg text-lg uppercase tracking-widest shadow-lg shadow-[#FD630A]/20"
              >
                {/* @ts-ignore */}
                {({ blob, url, loading, error }) =>
                  loading ? 'Compiling PDF...' : 'Download Prepared PDF'
                }
              </PDFDownloadLink>
            )
          )}
        </div>
      </div>
    </div>
  );
}
