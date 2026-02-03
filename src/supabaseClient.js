// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

let supabase = null;

export const getSupabase = () => {
  if (!supabase) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Safety check to ensure .env is actually loading
    if (!supabaseUrl || !supabaseKey) {
      console.error("Vite failed to load .env variables. Check your naming!");
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};
