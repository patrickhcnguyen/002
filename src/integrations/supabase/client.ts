import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tveorbhsokpnetvvgmsm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZW9yYmhzb2twbmV0dnZnbXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5ODc1ODYsImV4cCI6MjA1MDU2MzU4Nn0.1RA5TekWrWQTI_CSmSQvOg85C3lj5lrhXaMDioE0wjc";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);