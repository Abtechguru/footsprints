"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { uploadEncryptedVaultDocument, uploadDocumentAsset, updateDocumentAssets } from "@/app/actions";
import { LandingSettings } from "@/lib/landing-defaults";
import { PDFDownloadLink } from "@react-pdf/renderer";
import LetterPDF, { LetterData } from "@/components/LetterPDF";

export default function DocumentStudio({ settings }: { settings?: LandingSettings }) {
  const [activeTab, setActiveTab] = useState<"draft" | "vault">("draft");

  // Draft State
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [pdfReady, setPdfReady] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [pdfData, setPdfData] = useState<LetterData | null>(null);

  // Assets State
  const [letterheadUrl, setLetterheadUrl] = useState<string | null>(settings?.document_letterhead_url || null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(settings?.document_signature_url || null);
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<"letterhead" | "signature">("letterhead");

  // Vault state
  const [isUploadingVault, setIsUploadingVault] = useState(false);
  const [vaultFiles, setVaultFiles] = useState<{name: string, date: string}[]>([]);
  const vaultInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleVaultUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingVault(true);
      const formData = new FormData();
      formData.append("file", file as File);
      const res = await uploadEncryptedVaultDocument(formData);
      if (res.success) {
        setVaultFiles(prev => [{ name: res.originalName || file.name, date: new Date().toLocaleDateString() }, ...prev]);
        alert("File encrypted and stored securely in Vault.");
      } else {
        alert("Encryption failed: " + res.error);
      }
      setIsUploadingVault(false);
    }
  };

  const triggerUpload = (type: "letterhead" | "signature") => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingAsset(true);
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append("type", uploadType);
      
      const res = await uploadDocumentAsset(formData);
      if (res.success && res.url) {
        if (uploadType === "letterhead") {
          setLetterheadUrl(res.url);
          await updateDocumentAssets(res.url, null);
        } else {
          setSignatureUrl(res.url);
          await updateDocumentAssets(null, res.url);
        }
      } else {
        alert("Upload failed: " + res.error);
      }
      setIsUploadingAsset(false);
      setPdfReady(false); // reset PDF to regenerate with new asset
    }
  };

  const handleCompile = () => {
    if (!recipient.trim() || !body.trim()) {
      alert("Recipient Address and Letter Body are required!");
      return;
    }
    
    setPdfData({
      date,
      recipientDetails: recipient,
      subject,
      body,
      origin: window.location.origin,
      companyName: settings?.hero_title || "Footprints Energy",
      companyAddress: settings ? `${settings.contact_address_line1}, ${settings.contact_address_line2}` : "123 Business Avenue, Corporate District",
      companyContact: `${settings?.contact_email_primary || ''} | ${settings?.contact_phone_primary || ''}`,
      letterheadUrl,
      signatureUrl
    });
    setPdfReady(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#1D1D1D]/5 flex flex-col h-full overflow-hidden">
      
      {/* Header & Tabs */}
      <div className="flex border-b border-[#1D1D1D]/10 bg-[#FBFBFA]">
        <button 
          onClick={() => setActiveTab("draft")}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "draft" ? "text-[#FD630A] border-b-2 border-[#FD630A] bg-white" : "text-[#1D1D1D]/50 hover:text-[#1D1D1D]/80 hover:bg-white"}`}
        >
          Draft Letter
        </button>
        <button 
          onClick={() => setActiveTab("vault")}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "vault" ? "text-[#FD630A] border-b-2 border-[#FD630A] bg-white" : "text-[#1D1D1D]/50 hover:text-[#1D1D1D]/80 hover:bg-white"}`}
        >
          Secure Vault
        </button>
      </div>

      {activeTab === "vault" ? (
        <div className="p-8 h-full min-h-[600px] flex flex-col items-center bg-[#F7F7F7]">
          <div className="max-w-[600px] w-full bg-white rounded-lg shadow-sm border border-[#1D1D1D]/10 p-8 text-center mt-10">
            <h2 className="text-xl font-bold mb-2">Encrypted Document Vault</h2>
            <p className="text-sm text-[#1D1D1D]/60 mb-8">Upload sensitive business documents. They are encrypted client-side using military-grade AES-256 before being stored in the cloud.</p>
            
            <div 
              className={`border-2 border-dashed border-[#1D1D1D]/20 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${isUploadingVault ? "opacity-50" : "hover:border-[#FD630A] hover:bg-[#FD630A]/5"}`}
              onClick={() => !isUploadingVault && vaultInputRef.current?.click()}
            >
              <UploadCloud size={48} className="text-[#1D1D1D]/30 mb-4" />
              <p className="text-sm font-bold text-[#1D1D1D] mb-1">{isUploadingVault ? "Encrypting..." : "Click to select a secure file"}</p>
              <p className="text-xs text-[#1D1D1D]/50">PDF, DOCX, XLSX, etc.</p>
              <input type="file" ref={vaultInputRef} className="hidden" onChange={handleVaultUpload} />
            </div>

            {vaultFiles.length > 0 && (
              <div className="mt-8 text-left">
                <h3 className="text-xs font-bold uppercase tracking-widest border-b border-[#1D1D1D]/10 pb-2 mb-4">Stored Documents</h3>
                <div className="space-y-2">
                  {vaultFiles.map((f, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-[#FBFBFA] border border-[#1D1D1D]/5 rounded">
                      <span className="text-sm font-semibold">{f.name}</span>
                      <span className="text-xs text-[#1D1D1D]/50">{f.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 h-full min-h-[600px] bg-[#F7F7F7] flex justify-center">
          <div className="max-w-[800px] w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Form Section */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-[#1D1D1D]/10 p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1D1D1D] mb-1">Letter Draft</h2>
                <p className="text-sm text-[#1D1D1D]/60 mb-6">Simply fill in the details below. Company branding and signatures are added automatically.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-bold text-[#1D1D1D]/70">Date</label>
                  <input 
                    type="text" 
                    value={date} 
                    onChange={(e) => { setDate(e.target.value); setPdfReady(false); }} 
                    className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FD630A]" 
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-bold text-[#1D1D1D]/70">Recipient Address (Name & Address)</label>
                  <textarea 
                    rows={4} 
                    value={recipient} 
                    onChange={(e) => { setRecipient(e.target.value); setPdfReady(false); }} 
                    placeholder="John Doe&#10;123 Main Street&#10;City, Country"
                    className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FD630A] resize-none" 
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-bold text-[#1D1D1D]/70">Letter Title / Subject</label>
                  <input 
                    type="text" 
                    value={subject} 
                    onChange={(e) => { setSubject(e.target.value); setPdfReady(false); }} 
                    placeholder="e.g. INVITATION FOR PARTNERSHIP"
                    className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FD630A] uppercase" 
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-bold text-[#1D1D1D]/70">Body of Letter</label>
                  <textarea 
                    rows={12} 
                    value={body} 
                    onChange={(e) => { setBody(e.target.value); setPdfReady(false); }} 
                    placeholder="Dear Sir/Madam,&#10;&#10;We are writing to..."
                    className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FD630A] resize-y" 
                  />
                </div>
              </div>
            </div>

            {/* Controls Section */}
            <div className="md:col-span-1 space-y-6">
              
              <div className="bg-white rounded-lg shadow-sm border border-[#1D1D1D]/10 p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#1D1D1D] uppercase tracking-widest border-b border-[#1D1D1D]/10 pb-2">Branding Assets</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-[#1D1D1D]/70 mb-2">Letterhead / Logo</label>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => triggerUpload("letterhead")}
                        disabled={isUploadingAsset}
                        className="flex-1 bg-[#FBFBFA] border border-[#1D1D1D]/20 hover:border-[#FD630A] text-xs font-semibold py-2 rounded transition-colors"
                      >
                        {isUploadingAsset && uploadType === "letterhead" ? "Uploading..." : letterheadUrl ? "Update Letterhead" : "Upload Letterhead"}
                      </button>
                      {letterheadUrl && (
                        <button onClick={async () => { setLetterheadUrl(null); await updateDocumentAssets("", null); setPdfReady(false); }} className="text-xs text-red-500 hover:underline px-2">Clear</button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-[#1D1D1D]/70 mb-2">Executive Signature</label>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => triggerUpload("signature")}
                        disabled={isUploadingAsset}
                        className="flex-1 bg-[#FBFBFA] border border-[#1D1D1D]/20 hover:border-[#FD630A] text-xs font-semibold py-2 rounded transition-colors"
                      >
                        {isUploadingAsset && uploadType === "signature" ? "Uploading..." : signatureUrl ? "Update Signature" : "Upload Signature"}
                      </button>
                      {signatureUrl && (
                        <button onClick={async () => { setSignatureUrl(null); await updateDocumentAssets(null, ""); setPdfReady(false); }} className="text-xs text-red-500 hover:underline px-2">Clear</button>
                      )}
                    </div>
                  </div>
                  
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAssetUpload} />
                </div>
              </div>

              <div className="bg-[#1D1D1D] p-6 rounded-xl shadow-xl text-white space-y-6 sticky top-8">
                <h2 className="text-xl font-bold">Document Controls</h2>
                <p className="text-white/70 leading-relaxed text-sm">
                  Generate your letter into a highly professional printable PDF. It will automatically include the company letterhead and executive signature.
                </p>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  {!pdfReady ? (
                    <button
                      onClick={handleCompile}
                      className="block w-full text-center bg-[#DAA35D] hover:bg-[#c28f4c] transition-colors text-white font-bold py-4 rounded-lg text-sm uppercase tracking-widest shadow-lg shadow-[#DAA35D]/10"
                    >
                      Prepare Document
                    </button>
                  ) : (
                    isClient && pdfData && (
                      <PDFDownloadLink
                        document={<LetterPDF data={pdfData} />}
                        fileName={`Letter_${new Date().getTime()}.pdf`}
                        className="block w-full text-center bg-[#FD630A] hover:bg-white hover:text-[#FD630A] transition-colors text-white font-bold py-4 rounded-lg text-sm uppercase tracking-widest shadow-lg shadow-[#FD630A]/10 flex flex-col items-center justify-center space-y-2"
                      >
                        {/* @ts-ignore */}
                        {({ blob, url, loading, error }) => (
                          <>
                            <FileText size={20} />
                            <span>{loading ? 'Compiling PDF...' : 'Download PDF'}</span>
                          </>
                        )}
                      </PDFDownloadLink>
                    )
                  )}
                  
                  {pdfReady && (
                    <button
                      onClick={() => setPdfReady(false)}
                      className="block w-full text-center text-white/50 hover:text-white py-2 text-xs uppercase tracking-widest"
                    >
                      Edit Content
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
