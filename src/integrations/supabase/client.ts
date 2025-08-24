// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use Vite env vars (must start with VITE_ in Netlify and .env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
}

// Export ready-to-use client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
