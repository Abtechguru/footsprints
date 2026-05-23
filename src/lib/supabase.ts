import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is the client to be used on the client-side (browser) or for public reads
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


