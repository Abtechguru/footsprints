"use client";

import dynamic from "next/dynamic";
import { LandingSettings } from "@/lib/landing-defaults";

const DocumentStudio = dynamic(() => import("./DocumentStudio"), { ssr: false });

export default function DocumentStudioWrapper({ settings }: { settings: LandingSettings }) {
  return <DocumentStudio settings={settings} />;
}
