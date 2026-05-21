"use client";

import { useState } from "react";
import Image from "next/image";
import { updateLandingSettings } from "@/app/actions";
import { DEFAULT_LANDING_SETTINGS, LandingSettings } from "@/lib/landing-settings";
import SubmitButton from "@/components/SubmitButton";
import { Plus, Trash2, LayoutGrid, Award, Info, Milestone, RefreshCw } from "lucide-react";

interface LandingEditorProps {
  initialSettings: LandingSettings;
}

export default function LandingEditor({ initialSettings }: LandingEditorProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "value-props" | "process">("hero");
  const [settings, setSettings] = useState<LandingSettings>(initialSettings);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Handle simple input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // State for value props
  const [valueProps, setValueProps] = useState(settings.value_props_list || []);
  const handleAddValueProp = () => {
    setValueProps((prev) => [...prev, { title: "New Advantage", desc: "Describe the advantage here" }]);
  };
  const handleRemoveValueProp = (idx: number) => {
    setValueProps((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleValuePropChange = (idx: number, field: "title" | "desc", val: string) => {
    setValueProps((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  // State for process steps
  const [processSteps, setProcessSteps] = useState(settings.process_steps_list || []);
  const handleAddProcessStep = () => {
    const nextId = String(processSteps.length + 1).padStart(2, "0");
    setProcessSteps((prev) => [...prev, { id: nextId, title: "New Step", desc: "Describe this step" }]);
  };
  const handleRemoveProcessStep = (idx: number) => {
    setProcessSteps((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((item, i) => ({ ...item, id: String(i + 1).padStart(2, "0") }))
    );
  };
  const handleProcessStepChange = (idx: number, field: "title" | "desc", val: string) => {
    setProcessSteps((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    
    // Append JSON lists
    formData.append("value_props_list_json", JSON.stringify(valueProps));
    formData.append("process_steps_list_json", JSON.stringify(processSteps));

    try {
      const res = await updateLandingSettings(formData);
      if (res?.success) {
        setStatus({ success: true, message: "Landing page updated successfully!" });
      } else {
        setStatus({ success: false, message: res?.error || "Failed to update landing page." });
      }
    } catch (err: any) {
      setStatus({ success: false, message: err.message || "An unexpected error occurred." });
    }
  };

  // Image previews helper
  const [heroImage1Preview, setHeroImage1Preview] = useState(settings.hero_image1);
  const [heroImage2Preview, setHeroImage2Preview] = useState(settings.hero_image2);
  const [aboutImagePreview, setAboutImagePreview] = useState(settings.about_image);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1D1D1D]/10 overflow-x-auto gap-2 pb-px">
        {[
          { id: "hero", label: "Hero Section", icon: <LayoutGrid size={16} /> },
          { id: "about", label: "About Section", icon: <Info size={16} /> },
          { id: "value-props", label: "Value Props", icon: <Award size={16} /> },
          { id: "process", label: "Process Flow", icon: <Milestone size={16} /> },
          { id: "contact", label: "Contact Info", icon: <RefreshCw size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#FD630A] text-[#FD630A]"
                : "border-transparent text-[#1D1D1D]/55 hover:text-[#1D1D1D]"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold border ${
            status.success
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Hidden inputs to keep existing images if no new files are uploaded */}
      <input type="hidden" name="existing_hero_image1" value={settings.hero_image1} />
      <input type="hidden" name="existing_hero_image2" value={settings.hero_image2} />
      <input type="hidden" name="existing_about_image" value={settings.about_image} />

      {/* Tab Contents */}
      <div className="space-y-6">
        
        {/* HERO SECTION TAB */}
        {activeTab === "hero" && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#1D1D1D] border-b border-[#1D1D1D]/5 pb-2">Hero Copy & Action</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Hero Badge Text</label>
                <input
                  type="text"
                  name="hero_badge"
                  value={settings.hero_badge}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Button Text</label>
                <input
                  type="text"
                  name="hero_button_text"
                  value={settings.hero_button_text}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Hero Main Title</label>
                <input
                  type="text"
                  name="hero_title"
                  value={settings.hero_title}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm font-semibold"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Hero Subtitle</label>
                <textarea
                  name="hero_subtitle"
                  rows={3}
                  value={settings.hero_subtitle}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm leading-relaxed"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Button Target URL</label>
                <input
                  type="text"
                  name="hero_button_link"
                  value={settings.hero_button_link}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#1D1D1D] border-b border-[#1D1D1D]/5 pt-4 pb-2">Hero Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-[#1D1D1D]/5 bg-[#F7F3E6]/30 rounded-xl space-y-4">
                <p className="text-xs font-bold text-[#FD630A] uppercase tracking-wider">Stat 1</p>
                <input
                  type="text"
                  name="hero_stat1_value"
                  placeholder="Value (e.g. 100%)"
                  value={settings.hero_stat1_value}
                  onChange={handleChange}
                  className="w-full border border-[#1D1D1D]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FD630A]"
                />
                <input
                  type="text"
                  name="hero_stat1_label"
                  placeholder="Label (e.g. Natural)"
                  value={settings.hero_stat1_label}
                  onChange={handleChange}
                  className="w-full border border-[#1D1D1D]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FD630A]"
                />
              </div>

              <div className="p-4 border border-[#1D1D1D]/5 bg-[#F7F3E6]/30 rounded-xl space-y-4">
                <p className="text-xs font-bold text-[#FD630A] uppercase tracking-wider">Stat 2</p>
                <input
                  type="text"
                  name="hero_stat2_value"
                  placeholder="Value (e.g. 50+)"
                  value={settings.hero_stat2_value}
                  onChange={handleChange}
                  className="w-full border border-[#1D1D1D]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FD630A]"
                />
                <input
                  type="text"
                  name="hero_stat2_label"
                  placeholder="Label (e.g. Products)"
                  value={settings.hero_stat2_label}
                  onChange={handleChange}
                  className="w-full border border-[#1D1D1D]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FD630A]"
                />
              </div>

              <div className="p-4 border border-[#1D1D1D]/5 bg-[#F7F3E6]/30 rounded-xl space-y-4">
                <p className="text-xs font-bold text-[#FD630A] uppercase tracking-wider">Stat 3</p>
                <input
                  type="text"
                  name="hero_stat3_value"
                  placeholder="Value (e.g. 24/7)"
                  value={settings.hero_stat3_value}
                  onChange={handleChange}
                  className="w-full border border-[#1D1D1D]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FD630A]"
                />
                <input
                  type="text"
                  name="hero_stat3_label"
                  placeholder="Label (e.g. Support)"
                  value={settings.hero_stat3_label}
                  onChange={handleChange}
                  className="w-full border border-[#1D1D1D]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FD630A]"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#1D1D1D] border-b border-[#1D1D1D]/5 pt-4 pb-2">Hero Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-4 border border-[#1D1D1D]/5 rounded-xl bg-[#F7F3E6]/10">
                <label className="block text-sm font-bold text-[#1D1D1D]/70">Hero Side Image 1 (Left Tall)</label>
                {heroImage1Preview && (
                  <div className="relative w-full h-48 bg-[#F7F3E6] rounded-lg overflow-hidden border border-[#1D1D1D]/5">
                    <Image src={heroImage1Preview} alt="Hero 1" fill className="object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  name="hero_image1_file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setHeroImage1Preview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="w-full text-xs text-[#1D1D1D]/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1D1D1D] file:text-white hover:file:bg-[#FD630A] transition-all cursor-pointer"
                />
              </div>

              <div className="space-y-4 p-4 border border-[#1D1D1D]/5 rounded-xl bg-[#F7F3E6]/10">
                <label className="block text-sm font-bold text-[#1D1D1D]/70">Hero Side Image 2 (Right Tall)</label>
                {heroImage2Preview && (
                  <div className="relative w-full h-48 bg-[#F7F3E6] rounded-lg overflow-hidden border border-[#1D1D1D]/5">
                    <Image src={heroImage2Preview} alt="Hero 2" fill className="object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  name="hero_image2_file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setHeroImage2Preview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="w-full text-xs text-[#1D1D1D]/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1D1D1D] file:text-white hover:file:bg-[#FD630A] transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABOUT SECTION TAB */}
        {activeTab === "about" && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#1D1D1D] border-b border-[#1D1D1D]/5 pb-2">About Section Copy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Label</label>
                <input
                  type="text"
                  name="about_label"
                  value={settings.about_label}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Accent Badge Title</label>
                <input
                  type="text"
                  name="about_accent_title"
                  value={settings.about_accent_title}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Main Title</label>
                <input
                  type="text"
                  name="about_title"
                  value={settings.about_title}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm font-semibold"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Paragraph 1</label>
                <textarea
                  name="about_text_p1"
                  rows={3}
                  value={settings.about_text_p1}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm leading-relaxed"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Paragraph 2</label>
                <textarea
                  name="about_text_p2"
                  rows={3}
                  value={settings.about_text_p2}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm leading-relaxed"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Highlighted Quote</label>
                <textarea
                  name="about_quote"
                  rows={2}
                  value={settings.about_quote}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm font-bold leading-relaxed"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Accent Badge Subtitle</label>
                <input
                  type="text"
                  name="about_accent_subtitle"
                  value={settings.about_accent_subtitle}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#1D1D1D] border-b border-[#1D1D1D]/5 pt-4 pb-2">About Section Image</h3>
            <div className="space-y-4 p-4 border border-[#1D1D1D]/5 rounded-xl bg-[#F7F3E6]/10 max-w-xl">
              <label className="block text-sm font-bold text-[#1D1D1D]/70">Main Square/Portrait Image</label>
              {aboutImagePreview && (
                <div className="relative aspect-video w-full bg-[#F7F3E6] rounded-lg overflow-hidden border border-[#1D1D1D]/5">
                  <Image src={aboutImagePreview} alt="About" fill className="object-cover" />
                </div>
              )}
              <input
                type="file"
                name="about_image_file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setAboutImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="w-full text-xs text-[#1D1D1D]/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1D1D1D] file:text-white hover:file:bg-[#FD630A] transition-all cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* VALUE PROPS TAB */}
        {activeTab === "value-props" && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#1D1D1D] border-b border-[#1D1D1D]/5 pb-2">Value Props Introduction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Section Label</label>
                <input
                  type="text"
                  name="value_props_label"
                  value={settings.value_props_label}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Section Title</label>
                <input
                  type="text"
                  name="value_props_title"
                  value={settings.value_props_title}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm font-semibold"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Section Description</label>
                <textarea
                  name="value_props_desc"
                  rows={3}
                  value={settings.value_props_desc}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[#1D1D1D]/5 pt-4 pb-2">
              <h3 className="text-lg font-bold text-[#1D1D1D]">Advantage Cards ({valueProps.length})</h3>
              <button
                type="button"
                onClick={handleAddValueProp}
                className="flex items-center space-x-2 bg-[#1D1D1D] text-white hover:bg-[#FD630A] transition-colors px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                <Plus size={14} />
                <span>Add Advantage Card</span>
              </button>
            </div>

            <div className="space-y-4">
              {valueProps.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 border border-[#1D1D1D]/5 bg-[#F7F3E6]/10 rounded-xl relative group">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-[#1D1D1D]/50 uppercase">Advantage Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleValuePropChange(idx, "title", e.target.value)}
                        className="border border-[#1D1D1D]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FD630A]"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-[#1D1D1D]/50 uppercase">Advantage Description</label>
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => handleValuePropChange(idx, "desc", e.target.value)}
                        className="border border-[#1D1D1D]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FD630A]"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveValueProp(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Remove card"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {valueProps.length === 0 && (
                <p className="text-center py-6 text-sm text-[#1D1D1D]/50">No advantages defined. Click "Add Advantage Card" to add one.</p>
              )}
            </div>
          </div>
        )}

        {/* PROCESS FLOW TAB */}
        {activeTab === "process" && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#1D1D1D] border-b border-[#1D1D1D]/5 pb-2">Process Header Copy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Section Label</label>
                <input
                  type="text"
                  name="process_label"
                  value={settings.process_label}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Section Title</label>
                <input
                  type="text"
                  name="process_title"
                  value={settings.process_title}
                  onChange={handleChange}
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[#1D1D1D]/5 pt-4 pb-2">
              <h3 className="text-lg font-bold text-[#1D1D1D]">Process Steps ({processSteps.length})</h3>
              <button
                type="button"
                onClick={handleAddProcessStep}
                className="flex items-center space-x-2 bg-[#1D1D1D] text-white hover:bg-[#FD630A] transition-colors px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                <Plus size={14} />
                <span>Add Process Step</span>
              </button>
            </div>

            <div className="space-y-4">
              {processSteps.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 border border-[#1D1D1D]/5 bg-[#F7F3E6]/10 rounded-xl relative group">
                  <div className="flex-shrink-0 flex items-center justify-center bg-[#FD630A] text-white font-bold w-10 h-10 rounded-lg text-sm">
                    {item.id}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-[#1D1D1D]/50 uppercase">Step Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleProcessStepChange(idx, "title", e.target.value)}
                        className="border border-[#1D1D1D]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FD630A]"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-[#1D1D1D]/50 uppercase">Step Description</label>
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => handleProcessStepChange(idx, "desc", e.target.value)}
                        className="border border-[#1D1D1D]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FD630A]"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveProcessStep(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Remove step"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {processSteps.length === 0 && (
                <p className="text-center py-6 text-sm text-[#1D1D1D]/50">No process steps defined. Click "Add Process Step" to add one.</p>
              )}
            </div>
          </div>
        )}

        {/* CONTACT INFO TAB */}
        {activeTab === "contact" && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#1D1D1D] border-b border-[#1D1D1D]/5 pb-2">Global Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Primary Phone Number</label>
                <input
                  type="text"
                  name="contact_phone_primary"
                  value={settings.contact_phone_primary || ""}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 000-0000"
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Secondary Phone Number</label>
                <input
                  type="text"
                  name="contact_phone_secondary"
                  value={settings.contact_phone_secondary || ""}
                  onChange={handleChange}
                  placeholder="e.g. +234 810 568 2872"
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Primary Email (Trade)</label>
                <input
                  type="email"
                  name="contact_email_primary"
                  value={settings.contact_email_primary || ""}
                  onChange={handleChange}
                  placeholder="e.g. trade@footprintsenergy.com"
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Secondary Email (Info)</label>
                <input
                  type="email"
                  name="contact_email_secondary"
                  value={settings.contact_email_secondary || ""}
                  onChange={handleChange}
                  placeholder="e.g. info@footprintsenergy.com"
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Office Address (Line 1 - Country/State)</label>
                <input
                  type="text"
                  name="contact_address_line1"
                  value={settings.contact_address_line1 || ""}
                  onChange={handleChange}
                  placeholder="e.g. USA | Head Office"
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm font-semibold"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#1D1D1D]/70">Office Address (Line 2 - Street)</label>
                <input
                  type="text"
                  name="contact_address_line2"
                  value={settings.contact_address_line2 || ""}
                  onChange={handleChange}
                  placeholder="e.g. Mainland Business Park, Tower 2"
                  className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] text-sm"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Save Button */}
      <div className="border-t border-[#1D1D1D]/5 pt-6 flex justify-end">
        <SubmitButton
          defaultText="Save All Changes"
          loadingText="Saving adjustments..."
          className="bg-[#FD630A] text-white hover:bg-[#e05304] transition-colors px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-[#FD630A]/20"
        />
      </div>
    </form>
  );
}
