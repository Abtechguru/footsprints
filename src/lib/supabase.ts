import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is the client to be used on the client-side (browser) or for public reads
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// This is the admin client to be used ONLY on the server side (Server Actions / Route Handlers)
// It bypasses RLS and allows insert/update/delete
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
