import type { MetadataRoute } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = supabaseServer();

  const { data: therapists } = await supabase
    .from("therapists")
    .select("slug,updated_at,is_published")
    .eq("is_published", true)
    .limit(50000);

  const items: MetadataRoute.Sitemap = [{ url: SITE_URL, lastModified: new Date() }];

  for (const t of therapists ?? []) {
    items.push({
      url: `${SITE_URL}/therapist/${t.slug}`,
      lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
    });
  }

  return items;
}
