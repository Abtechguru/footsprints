"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Download, Save, UploadCloud, FileText, File as FileIcon
} from "lucide-react";
import { saveDocumentDraft, uploadDocumentAsset, uploadEncryptedVaultDocument } from "@/app/actions";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[#1D1D1D]/10 bg-white p-2 rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-[#F7F3E6] transition-colors ${editor.isActive("bold") ? "text-[#FD630A] bg-[#F7F3E6]" : "text-[#1D1D1D]/70"}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-[#F7F3E6] transition-colors ${editor.isActive("italic") ? "text-[#FD630A] bg-[#F7F3E6]" : "text-[#1D1D1D]/70"}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-[#F7F3E6] transition-colors ${editor.isActive("underline") ? "text-[#FD630A] bg-[#F7F3E6]" : "text-[#1D1D1D]/70"}`}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </button>

      <div className="w-px h-6 bg-[#1D1D1D]/10 mx-2"></div>

      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded hover:bg-[#F7F3E6] transition-colors ${editor.isActive({ textAlign: "left" }) ? "text-[#FD630A] bg-[#F7F3E6]" : "text-[#1D1D1D]/70"}`}
        title="Align Left"
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded hover:bg-[#F7F3E6] transition-colors ${editor.isActive({ textAlign: "center" }) ? "text-[#FD630A] bg-[#F7F3E6]" : "text-[#1D1D1D]/70"}`}
        title="Align Center"
      >
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded hover:bg-[#F7F3E6] transition-colors ${editor.isActive({ textAlign: "right" }) ? "text-[#FD630A] bg-[#F7F3E6]" : "text-[#1D1D1D]/70"}`}
        title="Align Right"
      >
        <AlignRight size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`p-2 rounded hover:bg-[#F7F3E6] transition-colors ${editor.isActive({ textAlign: "justify" }) ? "text-[#FD630A] bg-[#F7F3E6]" : "text-[#1D1D1D]/70"}`}
        title="Justify"
      >
        <AlignJustify size={18} />
      </button>

      <div className="w-px h-6 bg-[#1D1D1D]/10 mx-2"></div>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1.5 text-sm font-bold rounded hover:bg-[#F7F3E6] transition-colors ${editor.isActive("heading", { level: 1 }) ? "text-[#FD630A] bg-[#F7F3E6]" : "text-[#1D1D1D]/70"}`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1.5 text-sm font-bold rounded hover:bg-[#F7F3E6] transition-colors ${editor.isActive("heading", { level: 2 }) ? "text-[#FD630A] bg-[#F7F3E6]" : "text-[#1D1D1D]/70"}`}
      >
        H2
      </button>
    </div>
  );
};

type TextBoxData = {
  id: string;
  pos: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
};

const DraggableTextBox = ({ box, updateBox, removeBox }: { box: TextBoxData, updateBox: (id: string, data: Partial<TextBoxData>) => void, removeBox: (id: string) => void }) => {
  const nodeRef = useRef(null);
  
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextAlign.configure({ types: ["heading", "paragraph"] })],
    content: box.content,
    onUpdate: ({ editor }) => {
      updateBox(box.id, { content: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        className: "prose prose-sm focus:outline-none w-full h-full bg-transparent p-1",
      },
    },
  });

  return (
    <Draggable
      nodeRef={nodeRef}
      position={box.pos}
      onStop={(e, data) => updateBox(box.id, { pos: { x: data.x, y: data.y } })}
      bounds="parent"
      cancel=".ProseMirror"
    >
      <div ref={nodeRef} className="absolute z-20 group">
        {/* @ts-ignore */}
        <ResizableBox 
          width={box.size.width} 
          height={box.size.height} 
          onResizeStop={(e, data) => updateBox(box.id, { size: { width: data.size.width, height: data.size.height } })}
          className="border border-dashed border-transparent hover:border-[#FD630A]/30 bg-transparent"
          minConstraints={[50, 20]}
        >
          <div className="w-full h-full relative flex flex-col cursor-move">
            <div className="absolute -top-10 left-0 hidden group-hover:flex bg-white shadow-md border border-[#1D1D1D]/10 rounded z-30">
              <MenuBar editor={editor} />
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 cursor-pointer text-xs w-5 h-5 flex items-center justify-center shadow-md z-30"
                 onClick={() => removeBox(box.id)}>
              ×
            </div>
            <div className="w-full h-full overflow-hidden text-box-content cursor-text">
              <EditorContent editor={editor} />
            </div>
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
};

export default function DocumentStudio() {
  const [activeTab, setActiveTab] = useState<"proposal" | "draft" | "vault">("proposal");
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [sigPos, setSigPos] = useState({ x: 50, y: 300 });
  const [sigSize, setSigSize] = useState({ width: 200, height: 100 });
  const [docFormat, setDocFormat] = useState<string>("A4");
  const [docSize, setDocSize] = useState({ width: 794, height: 1123 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const [bgSize, setBgSize] = useState({ width: 794, height: 1123 });
  const [textBoxes, setTextBoxes] = useState<TextBoxData[]>([]);
  const [savedLetterheads, setSavedLetterheads] = useState<string[]>([]);
  const [savedSignatures, setSavedSignatures] = useState<string[]>([]);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [isUploadingSig, setIsUploadingSig] = useState(false);
  const [isUploadingVault, setIsUploadingVault] = useState(false);
  const [vaultFiles, setVaultFiles] = useState<{name: string, date: string}[]>([]);

  useEffect(() => {
    const loadedBgs = localStorage.getItem("savedLetterheads");
    const loadedSigs = localStorage.getItem("savedSignatures");
    if (loadedBgs) setSavedLetterheads(JSON.parse(loadedBgs));
    if (loadedSigs) setSavedSignatures(JSON.parse(loadedSigs));
  }, []);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const vaultInputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const draggableNodeRef = useRef<HTMLDivElement>(null);
  const bgNodeRef = useRef<HTMLDivElement>(null);

  const handlePaperSize = (format: string, width: number, height: number) => {
    setDocFormat(format);
    setDocSize({ width, height });
    if (backgroundUrl) {
      setBgSize({ width, height });
      setBgPos({ x: 0, y: 0 });
    }
  };

  const addTextBox = () => {
    setTextBoxes(prev => [
      ...prev,
      { id: Math.random().toString(), pos: { x: 50, y: 50 }, size: { width: 300, height: 100 }, content: "<p>Double click to edit...</p>" }
    ]);
  };

  const updateTextBox = (id: string, data: Partial<TextBoxData>) => {
    setTextBoxes(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const removeTextBox = (id: string) => {
    setTextBoxes(prev => prev.filter(b => b.id !== id));
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p>Start writing your document here...</p>",
    editorProps: {
      attributes: {
        className: "prose prose-sm sm:prose-base focus:outline-none min-h-[600px] w-full p-10 relative z-10 bg-transparent",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const saved = localStorage.getItem(`docDraft_${activeTab}`);
    if (saved && activeTab !== "vault") {
      try {
        const data = JSON.parse(saved);
        if (data.content) editor.commands.setContent(data.content);
        if (data.textBoxes) setTextBoxes(data.textBoxes);
        if (data.signatureUrl !== undefined) setSignatureUrl(data.signatureUrl);
        if (data.sigPos) setSigPos(data.sigPos);
        if (data.sigSize) setSigSize(data.sigSize);
        if (data.backgroundUrl !== undefined) setBackgroundUrl(data.backgroundUrl);
        if (data.bgPos) setBgPos(data.bgPos);
        if (data.bgSize) setBgSize(data.bgSize);
        if (data.docFormat) setDocFormat(data.docFormat);
        if (data.docSize) setDocSize(data.docSize);
      } catch (e) {
        console.error("Error parsing draft", e);
      }
    } else if (activeTab !== "vault") {
      editor.commands.setContent("<p>Start writing your document here...</p>");
      setTextBoxes([]);
      setSignatureUrl(null);
      setBackgroundUrl(null);
    }
  }, [activeTab, editor]);


  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingSig(true);
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append("type", "signature");
      const res = await uploadDocumentAsset(formData);
      if (res.success && res.url) {
        setSignatureUrl(res.url);
        const newSigs = [res.url, ...savedSignatures.filter(u => u !== res.url)].slice(0, 5);
        setSavedSignatures(newSigs);
        localStorage.setItem("savedSignatures", JSON.stringify(newSigs));
      } else {
        alert("Upload failed: " + res.error);
      }
      setIsUploadingSig(false);
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (file) {
      setIsUploadingBg(true);
      try {
        if (file.type === "application/pdf") {
          const pdfjsLib = await import("pdfjs-dist");
          // @ts-ignore
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
            const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, "image/jpeg", 0.95));
            if (blob) file = new File([blob], file.name.replace(".pdf", ".jpg"), { type: "image/jpeg" });
          }
        }

        const formData = new FormData();
        formData.append("file", file as File);
        formData.append("type", "letterhead");
        const res = await uploadDocumentAsset(formData);
        if (res.success && res.url) {
          setBackgroundUrl(res.url);
          const newBgs = [res.url, ...savedLetterheads.filter(u => u !== res.url)].slice(0, 5);
          setSavedLetterheads(newBgs);
          localStorage.setItem("savedLetterheads", JSON.stringify(newBgs));
        } else {
          alert("Upload failed: " + res.error);
        }
      } catch (err) {
        console.error(err);
        alert("Error processing background upload");
      }
      setIsUploadingBg(false);
    }
  };

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

  const saveDraft = async () => {
    if (!editor) return;
    setIsSaving(true);
    
    const draftData = {
      content: editor.getHTML(),
      textBoxes,
      signatureUrl,
      sigPos,
      sigSize,
      backgroundUrl,
      bgPos,
      bgSize,
      docFormat,
      docSize
    };
    
    localStorage.setItem(`docDraft_${activeTab}`, JSON.stringify(draftData));
    
    try {
      const formData = new FormData();
      formData.append("mode", activeTab);
      formData.append("content", draftData.content);
      formData.append("textBoxes", JSON.stringify(textBoxes));
      formData.append("signatureUrl", signatureUrl || "");
      formData.append("signaturePos", JSON.stringify({ pos: sigPos, size: sigSize }));
      await saveDocumentDraft(formData);
    } catch(e) {
      console.error("Failed to sync draft to server", e);
    }
    
    setIsSaving(false);
    alert("Draft saved successfully! You can leave and come back later.");
  };

  const exportPDF = async () => {
    if (!documentRef.current) return;
    setIsExportingPdf(true);
    
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin:       10,
        filename:     `${activeTab}-document.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      
      await html2pdf().set(opt).from(documentRef.current).save();
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to export PDF.");
    }
    
    setIsExportingPdf(false);
  };

  const exportDOCX = async () => {
    if (!editor) return;
    
    try {
      // Basic extraction of text for DOCX
      const textContent = editor.getText();
      const paragraphs = textContent.split('\n').filter(t => t.trim().length > 0).map(t => 
        new Paragraph({
          children: [new TextRun(t)],
          spacing: { after: 200 }
        })
      );

      const docChildren: any[] = [...paragraphs];

      // If we have a signature, attempt to append it (requires converting object URL or external URL to blob/buffer)
      if (signatureUrl) {
        try {
          const response = await fetch(signatureUrl);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          
          docChildren.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: arrayBuffer,
                  transformation: {
                    width: sigSize.width,
                    height: sigSize.height,
                  },
                  type: "jpg" as const,
                }),
              ],
            })
          );
        } catch (imgErr) {
          console.warn("Could not include signature in DOCX", imgErr);
        }
      }

      const doc = new Document({
        sections: [{ properties: {}, children: docChildren }],
      });

      const blob = await Packer.toBlob(doc);
      
      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}-document.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("DOCX Export failed:", error);
      alert("Failed to export DOCX.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#1D1D1D]/5 flex flex-col h-full overflow-hidden">
      
      {/* Header & Tabs */}
      <div className="flex border-b border-[#1D1D1D]/10 bg-[#FBFBFA]">
        <button 
          onClick={() => setActiveTab("proposal")}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "proposal" ? "text-[#FD630A] border-b-2 border-[#FD630A] bg-white" : "text-[#1D1D1D]/50 hover:text-[#1D1D1D]/80 hover:bg-white"}`}
        >
          Proposal Builder
        </button>
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
        <div className="p-8 h-full min-h-[800px] flex flex-col items-center bg-[#F7F7F7]">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full min-h-[800px]">
        {/* Editor Area */}
        <div className="col-span-3 border-r border-[#1D1D1D]/10 bg-[#F7F7F7] p-8 overflow-auto relative flex justify-center items-start">
          
          <div 
            className={`${backgroundUrl ? "bg-transparent" : "bg-white"} shadow-md border border-[#1D1D1D]/10 relative overflow-hidden flex flex-col`} 
            style={{ width: `${docSize.width}px`, minHeight: `${docSize.height}px` }}
            ref={documentRef}
          >
            {backgroundUrl && (
              <Draggable
                nodeRef={bgNodeRef}
                position={bgPos}
                onStop={(e, data) => setBgPos({ x: data.x, y: data.y })}
                cancel=".react-resizable-handle"
              >
                <div ref={bgNodeRef} className="absolute z-0 cursor-move group" style={{ top: 0, left: 0 }}>
                  {/* @ts-ignore */}
                  <ResizableBox 
                    width={bgSize.width} 
                    height={bgSize.height} 
                    onResizeStop={(e, data) => setBgSize({ width: data.size.width, height: data.size.height })}
                    resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
                    className="border-2 border-dashed border-transparent hover:border-[#FD630A]/50 bg-transparent"
                    minConstraints={[100, 100]}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={backgroundUrl} alt="Letterhead" className="w-full h-full object-fill pointer-events-none opacity-100" />
                  </ResizableBox>
                </div>
              </Draggable>
            )}
            
            <div className="relative z-20 bg-white shadow-sm">
              <MenuBar editor={editor} />
            </div>
            
            <div className="relative z-10">
              <EditorContent editor={editor} />
            </div>

            {/* Draggable Text Boxes */}
            {textBoxes.map(box => (
              <DraggableTextBox key={box.id} box={box} updateBox={updateTextBox} removeBox={removeTextBox} />
            ))}
            
            {/* Signature Overlay */}
            {signatureUrl && (
              <Draggable
                nodeRef={draggableNodeRef}
                position={sigPos}
                onStop={(e, data) => setSigPos({ x: data.x, y: data.y })}
                bounds="parent"
              >
                <div ref={draggableNodeRef} className="absolute z-10 cursor-move" style={{ top: 0, left: 0 }}>
                  {/* @ts-ignore */}
                  <ResizableBox 
                    width={sigSize.width} 
                    height={sigSize.height} 
                    onResizeStop={(e, data) => setSigSize({ width: data.size.width, height: data.size.height })}
                    minConstraints={[50, 25]}
                    maxConstraints={[400, 200]}
                    className="border-2 border-dashed border-transparent hover:border-[#FD630A]/50 group"
                  >
                    <div className="w-full h-full relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={signatureUrl} 
                        alt="Signature" 
                        className="w-full h-full object-contain pointer-events-none mix-blend-multiply"
                      />
                      <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 cursor-pointer text-xs w-6 h-6 flex items-center justify-center shadow-md"
                           onClick={(e) => { e.stopPropagation(); setSignatureUrl(null); }}>
                        ×
                      </div>
                    </div>
                  </ResizableBox>
                </div>
              </Draggable>
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="col-span-1 bg-[#FBFBFA] p-6 flex flex-col space-y-8 border-t lg:border-t-0 border-[#1D1D1D]/10">
          
          {/* Action Tools */}
          <div className="space-y-4">
            <button 
              onClick={addTextBox}
              className="w-full py-3 border-2 border-dashed border-[#FD630A]/50 text-[#FD630A] font-bold text-xs uppercase tracking-widest rounded hover:bg-[#FD630A]/10 transition-colors"
            >
              + Add Text Box
            </button>
          </div>

          {/* Document Format Panel */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#1D1D1D] uppercase tracking-widest border-b border-[#1D1D1D]/10 pb-2">Document Size</h3>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => handlePaperSize("A4", 794, 1123)} className={`py-2 text-[10px] uppercase tracking-wider font-bold rounded border ${docFormat === "A4" ? "border-[#FD630A] bg-[#FD630A]/10 text-[#FD630A]" : "border-[#1D1D1D]/20 text-[#1D1D1D]/70 hover:border-[#1D1D1D]/40"}`}>A4</button>
              <button onClick={() => handlePaperSize("Letter", 816, 1056)} className={`py-2 text-[10px] uppercase tracking-wider font-bold rounded border ${docFormat === "Letter" ? "border-[#FD630A] bg-[#FD630A]/10 text-[#FD630A]" : "border-[#1D1D1D]/20 text-[#1D1D1D]/70 hover:border-[#1D1D1D]/40"}`}>Letter</button>
              <button onClick={() => handlePaperSize("Legal", 816, 1344)} className={`py-2 text-[10px] uppercase tracking-wider font-bold rounded border ${docFormat === "Legal" ? "border-[#FD630A] bg-[#FD630A]/10 text-[#FD630A]" : "border-[#1D1D1D]/20 text-[#1D1D1D]/70 hover:border-[#1D1D1D]/40"}`}>Legal</button>
              <button onClick={() => handlePaperSize("A5", 559, 794)} className={`py-2 text-[10px] uppercase tracking-wider font-bold rounded border ${docFormat === "A5" ? "border-[#FD630A] bg-[#FD630A]/10 text-[#FD630A]" : "border-[#1D1D1D]/20 text-[#1D1D1D]/70 hover:border-[#1D1D1D]/40"}`}>A5</button>
              <button onClick={() => handlePaperSize("Executive", 696, 1008)} className={`py-2 text-[10px] uppercase tracking-wider font-bold rounded border ${docFormat === "Executive" ? "border-[#FD630A] bg-[#FD630A]/10 text-[#FD630A]" : "border-[#1D1D1D]/20 text-[#1D1D1D]/70 hover:border-[#1D1D1D]/40"}`}>Exec</button>
              <button onClick={() => setDocFormat("Custom")} className={`py-2 text-[10px] uppercase tracking-wider font-bold rounded border ${docFormat === "Custom" ? "border-[#FD630A] bg-[#FD630A]/10 text-[#FD630A]" : "border-[#1D1D1D]/20 text-[#1D1D1D]/70 hover:border-[#1D1D1D]/40"}`}>Custom</button>
            </div>
            {docFormat === "Custom" && (
              <div className="flex gap-4 pt-2">
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-[#1D1D1D]/50 mb-1 block">Width (px)</label>
                  <input type="number" value={docSize.width} onChange={e => setDocSize(prev => ({...prev, width: Number(e.target.value)}))} className="w-full border border-[#1D1D1D]/20 rounded p-2 text-xs focus:border-[#FD630A] outline-none" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-[#1D1D1D]/50 mb-1 block">Height (px)</label>
                  <input type="number" value={docSize.height} onChange={e => setDocSize(prev => ({...prev, height: Number(e.target.value)}))} className="w-full border border-[#1D1D1D]/20 rounded p-2 text-xs focus:border-[#FD630A] outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* Background Upload Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1D1D1D]/10 pb-2">
               <h3 className="text-sm font-bold text-[#1D1D1D] uppercase tracking-widest">Letterhead</h3>
               {backgroundUrl && (
                 <div className="flex items-center space-x-3">
                   <button onClick={() => { setBgPos({x: 0, y: 0}); setBgSize({ width: docSize.width, height: docSize.height }) }} className="text-[10px] font-bold uppercase tracking-wider text-[#FD630A] hover:underline">Fit to Page</button>
                   <button onClick={() => setBackgroundUrl(null)} className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline">Remove</button>
                 </div>
               )}
            </div>
            
            <div 
              className={`border-2 border-dashed border-[#1D1D1D]/20 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white ${isUploadingBg ? "opacity-50 cursor-not-allowed" : "hover:border-[#FD630A] hover:bg-[#FD630A]/5"}`}
              onClick={() => !isUploadingBg && bgInputRef.current?.click()}
            >
              <UploadCloud size={24} className="text-[#1D1D1D]/40 mb-2" />
              <p className="text-xs font-semibold text-[#1D1D1D]/70">{isUploadingBg ? "Uploading..." : "Upload Background"}</p>
              <p className="text-[10px] text-[#1D1D1D]/40 mt-1">PNG, JPG, PDF up to 2MB</p>
              <input 
                type="file" 
                ref={bgInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, application/pdf" 
                onChange={handleBackgroundUpload}
              />
            </div>

            {savedLetterheads.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] text-[#1D1D1D]/50 uppercase tracking-widest font-bold mb-2">Saved Letterheads</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {savedLetterheads.map((url, i) => (
                    <div key={i} className="relative group flex-shrink-0">
                      <div onClick={() => setBackgroundUrl(url)} className={`w-12 h-16 cursor-pointer border-2 rounded ${backgroundUrl === url ? "border-[#FD630A]" : "border-transparent"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="saved" className="w-full h-full object-cover rounded-sm border border-[#1D1D1D]/10" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] cursor-pointer opacity-0 group-hover:opacity-100 shadow-md z-10"
                           onClick={(e) => {
                             e.stopPropagation();
                             const newBgs = savedLetterheads.filter(u => u !== url);
                             setSavedLetterheads(newBgs);
                             localStorage.setItem("savedLetterheads", JSON.stringify(newBgs));
                             if (backgroundUrl === url) setBackgroundUrl(null);
                           }}>
                        ×
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Signature Upload Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1D1D1D]/10 pb-2">
               <h3 className="text-sm font-bold text-[#1D1D1D] uppercase tracking-widest">Insert Signature</h3>
               {signatureUrl && (
                 <button onClick={() => setSignatureUrl(null)} className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline">Remove</button>
               )}
            </div>
            
            <div 
              className={`border-2 border-dashed border-[#1D1D1D]/20 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white ${isUploadingSig ? "opacity-50 cursor-not-allowed" : "hover:border-[#FD630A] hover:bg-[#FD630A]/5"}`}
              onClick={() => !isUploadingSig && fileInputRef.current?.click()}
            >
              <UploadCloud size={32} className="text-[#1D1D1D]/40 mb-3" />
              <p className="text-xs font-semibold text-[#1D1D1D]/70">{isUploadingSig ? "Uploading..." : "Click to browse or drag image"}</p>
              <p className="text-[10px] text-[#1D1D1D]/40 mt-1">PNG, JPG up to 2MB</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg" 
                onChange={handleSignatureUpload}
              />
            </div>

            {savedSignatures.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] text-[#1D1D1D]/50 uppercase tracking-widest font-bold mb-2">Saved Signatures</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {savedSignatures.map((url, i) => (
                    <div key={i} className="relative group flex-shrink-0">
                      <div onClick={() => setSignatureUrl(url)} className={`w-16 h-10 cursor-pointer border-2 rounded ${signatureUrl === url ? "border-[#FD630A]" : "border-transparent"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="saved" className="w-full h-full object-contain rounded-sm border border-[#1D1D1D]/10 bg-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] cursor-pointer opacity-0 group-hover:opacity-100 shadow-md z-10"
                           onClick={(e) => {
                             e.stopPropagation();
                             const newSigs = savedSignatures.filter(u => u !== url);
                             setSavedSignatures(newSigs);
                             localStorage.setItem("savedSignatures", JSON.stringify(newSigs));
                             if (signatureUrl === url) setSignatureUrl(null);
                           }}>
                        ×
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-grow"></div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-[#1D1D1D]/10">
            <button 
              onClick={exportPDF}
              disabled={isExportingPdf}
              className="w-full flex items-center justify-center space-x-2 bg-[#1D1D1D] hover:bg-[#FD630A] text-white py-3.5 rounded text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              <FileText size={16} />
              <span>{isExportingPdf ? "Generating..." : "Download as PDF"}</span>
            </button>
            <button 
              onClick={exportDOCX}
              className="w-full flex items-center justify-center space-x-2 bg-white border border-[#1D1D1D]/20 hover:border-[#FD630A] text-[#1D1D1D] hover:text-[#FD630A] py-3.5 rounded text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <FileIcon size={16} />
              <span>Save as WPS/DOCX</span>
            </button>
            <button 
              onClick={saveDraft}
              disabled={isSaving}
              className="w-full flex items-center justify-center space-x-2 bg-white text-[#1D1D1D]/60 hover:text-[#1D1D1D] py-3 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 mt-2"
            >
              <Save size={16} />
              <span>{isSaving ? "Saving..." : "Save Draft"}</span>
            </button>
          </div>

        </div>
      </div>
      )}
    </div>
  );
}
