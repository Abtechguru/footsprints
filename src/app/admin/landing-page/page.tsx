import { getLandingSettings } from "@/lib/landing-settings-api";
import LandingEditor from "./LandingEditor";

export const revalidate = 0; // Disable caching

export default async function AdminLandingPage() {
  const settings = await getLandingSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1D1D1D]">Adjust Landing Page</h1>
        <p className="text-sm text-[#1D1D1D]/60 mt-1">
          Customize all sections, titles, statistics, images, and lists displayed on the public home page.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1D1D1D]/5 p-6 md:p-8">
        <LandingEditor initialSettings={settings} />
      </div>
    </div>
  );
}
