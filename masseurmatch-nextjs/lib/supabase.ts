// src/lib/supabase.ts
import { supabase as browserSupabase } from "./supabase/client";

export const supabase = browserSupabase;

export function createBrowserSupabaseClient() {
  return browserSupabase;
}
