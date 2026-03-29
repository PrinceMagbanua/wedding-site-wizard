import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/wedding";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
      "Add them to your .env file before using Supabase features."
  );
}

export const supabase = createClient<Database>(supabaseUrl ?? "", supabaseAnonKey ?? "");
