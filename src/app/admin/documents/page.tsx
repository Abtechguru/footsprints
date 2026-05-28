import DocumentStudioWrapper from "./DocumentStudioWrapper";
import { getLandingSettings } from "@/lib/landing-settings-api";

export const metadata = {
  title: "Document Studio | Admin",
};

export default async function DocumentStudioPage() {
  const settings = await getLandingSettings();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1D1D1D] tracking-tight">Document Studio</h1>
      </div>
      <DocumentStudioWrapper settings={settings} />
    </div>
  );
}
