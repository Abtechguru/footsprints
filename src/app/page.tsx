import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductRibbon from "@/components/ProductRibbon";
import About from "@/components/About";
import ValueProps from "@/components/ValueProps";
import Process from "@/components/Process";
import MiddleBanner from "@/components/MiddleBanner";
import MissionQuote from "@/components/MissionQuote";
import ProductGrid from "@/components/ProductGrid";
import Partnership from "@/components/Partnership";
import RecentNews from "@/components/RecentNews";
import ProductsSummary from "@/components/ProductsSummary";
import Team from "@/components/Team";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import WelcomePopup from "@/components/WelcomePopup";
import FloatingSupport from "@/components/FloatingSupport";
import { getLandingSettings } from "@/lib/landing-settings-api";

export const revalidate = 0;

export default async function Home() {
  const settings = await getLandingSettings();

  return (
    <main className="min-h-screen bg-white">
      <Navbar settings={settings} />
      <Hero settings={settings} />
      <ProductRibbon />
      <About settings={settings} />
      <ValueProps settings={settings} />
      <Process settings={settings} />
      <MiddleBanner settings={settings} />
      <MissionQuote settings={settings} />
      <ProductGrid />
      <Partnership />
      <RecentNews />
      <ProductsSummary settings={settings} />
      <Team />
      <Newsletter />
      <Footer settings={settings} />
      
      <WelcomePopup />
      <FloatingSupport settings={settings} />
    </main>
  );
}
