import { supabaseAdmin } from "@/lib/supabase";

export interface LandingSettings {
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  hero_button_link: string;
  hero_stat1_value: string;
  hero_stat1_label: string;
  hero_stat2_value: string;
  hero_stat2_label: string;
  hero_stat3_value: string;
  hero_stat3_label: string;
  hero_image1: string;
  hero_image2: string;
  about_label: string;
  about_title: string;
  about_text_p1: string;
  about_text_p2: string;
  about_quote: string;
  about_image: string;
  about_accent_title: string;
  about_accent_subtitle: string;
  value_props_label: string;
  value_props_title: string;
  value_props_desc: string;
  value_props_list: Array<{ title: string; desc: string }>;
  process_label: string;
  process_title: string;
  process_steps_list: Array<{ id: string; title: string; desc: string }>;
  contact_phone_primary: string;
  contact_phone_secondary: string;
  contact_email_primary: string;
  contact_email_secondary: string;
  contact_address_line1: string;
  contact_address_line2: string;
}

export const DEFAULT_LANDING_SETTINGS: LandingSettings = {
  hero_badge: "Natural & Authentic",
  hero_title: "Quality, Natural Products You Can Trust.",
  hero_subtitle: "Our integrated approach to sourcing premium local produce and animal proteins allows us to provide a comprehensive solution that best meets your health needs.",
  hero_button_text: "Explore Collection",
  hero_button_link: "/products",
  hero_stat1_value: "100%",
  hero_stat1_label: "Natural",
  hero_stat2_value: "50+",
  hero_stat2_label: "Products",
  hero_stat3_value: "24/7",
  hero_stat3_label: "Support",
  hero_image1: "/images/Black-Pepper.jpeg",
  hero_image2: "/images/10-of-the-Healthiest-Vegetables-You-Can-Eat.jpeg",
  about_label: "Our Mission",
  about_title: "Leading the way in Global Commodity Trade.",
  about_text_p1: "Footprints Energy is a leading commodity trader , specializing in agricultural produce, animal protein and energy derivatives.",
  about_text_p2: "We supply commodities such as Sugar (IC45, VHP) , Animal Protein (Chicken, Bovine and Swine) and Grains (Soy, Corn and Coffee). We also facilitate trade of petroleum derivates such as Jet A4, AGO and PMS.",
  about_quote: "At Footprints, we understand our markets, follow trends and proactively take measures to act in the best interest of our customers.",
  about_image: "/images/Potentiel-dune-enzyme-eliminant-lexces-de-sucre-pour-le-traitement-du-diabete.jpeg",
  about_accent_title: "Global",
  about_accent_subtitle: "Trading Network",
  value_props_label: "The Advantage",
  value_props_title: "Why Choose Footprints Energy?",
  value_props_desc: "Trusted globally for reliable supply, competitive pricing, and seamless delivery. At Footprints Energy, we combine market expertise with strong partnerships to serve you better every time.",
  value_props_list: [
    { title: "Global Network", desc: "Direct access to top-tier producers and suppliers worldwide, ensuring quality at the source." },
    { title: "Timely Logistics", desc: "Robust supply chain management and logistics partnerships ensure your shipments arrive on time." },
    { title: "Flexible Terms", desc: "Tailored trade agreements and financial instruments designed to meet your specific needs." },
    { title: "Full Transparency", desc: "End-to-end documentation and transparent communication throughout the entire trade lifecycle." },
    { title: "Exceptional Support", desc: "Dedicated account management from initial inquiry to final delivery and beyond." }
  ],
  process_label: "The Lifecycle",
  process_title: "How We Work",
  process_steps_list: [
    { id: "01", title: "LOI (Letter of Intent)", desc: "To get started, please send a Letter of Intent outlining product specifications, quantity, and destination. We'll promptly provide a formal offer." },
    { id: "02", title: "FCO (Full Corporate Offer)", desc: "Our Full Corporate Offer will be tailored specifically to your request and will remain valid for a limited period, reflecting global market prices." },
    { id: "03", title: "SPA & Delivery", desc: "To finalize, a Sales and Purchase Agreement (SPA) must be executed. Footprints Energy operates under Incoterms and is based in the USA." }
  ],
  contact_phone_primary: "+1 (555) 000-0000",
  contact_phone_secondary: "+234 810 568 2872",
  contact_email_primary: "trade@footprintsenergy.com",
  contact_email_secondary: "info@footprintsenergy.com",
  contact_address_line1: "USA | Head Office",
  contact_address_line2: "Mainland Business Park, Tower 2"
};

export async function getLandingSettings(): Promise<LandingSettings> {
  try {
    const { data, error } = await supabaseAdmin
      .from("landing_page_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      console.warn("Could not load landing settings, using defaults:", error?.message);
      return DEFAULT_LANDING_SETTINGS;
    }

    let value_props_list = data.value_props_list;
    if (typeof value_props_list === "string") {
      try {
        value_props_list = JSON.parse(value_props_list);
      } catch (_) {}
    }

    let process_steps_list = data.process_steps_list;
    if (typeof process_steps_list === "string") {
      try {
        process_steps_list = JSON.parse(process_steps_list);
      } catch (_) {}
    }

    return {
      ...DEFAULT_LANDING_SETTINGS,
      ...data,
      value_props_list: Array.isArray(value_props_list) ? value_props_list : DEFAULT_LANDING_SETTINGS.value_props_list,
      process_steps_list: Array.isArray(process_steps_list) ? process_steps_list : DEFAULT_LANDING_SETTINGS.process_steps_list,
    };
  } catch (err) {
    console.error("Error fetching landing settings:", err);
    return DEFAULT_LANDING_SETTINGS;
  }
}
