import { supabaseAdmin } from "@/lib/supabase-admin";
import { LandingSettings, DEFAULT_LANDING_SETTINGS } from "./landing-settings";

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
