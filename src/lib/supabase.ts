import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Null when the env vars are not configured — callers must handle that case.
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type Participant = {
  id: number;
  nama: string;
  asal_sekolah: string;
  ranking: number;
  skor: number;
};

export type GuestbookMessage = {
  id: number;
  name: string;
  message: string;
  device_id: string;
  color: string;
  created_at: string;
};
