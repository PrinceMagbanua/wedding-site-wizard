import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { WeddingConfig } from "@/types/wedding";

export function useWeddingSite(slug: string) {
  return useQuery({
    queryKey: ["wedding-site", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wedding_sites")
        .select("config, published")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Site not found");

      return data.config as WeddingConfig;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
