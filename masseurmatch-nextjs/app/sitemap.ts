import type { MetadataRoute } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

const STATIC_PAGES: Array<{
  path: string;
  priority: number;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}> = [
  { path: "", priority: 1, changefreq: "daily" },
  { path: "join", priority: 0.9, changefreq: "daily" },
  { path: "login", priority: 0.8, changefreq: "weekly" },
  { path: "forgot-password", priority: 0.7, changefreq: "monthly" },
  { path: "explore", priority: 0.8, changefreq: "weekly" },
  { path: "ai", priority: 0.6, changefreq: "monthly" },
  { path: "dashboard", priority: 0.6, changefreq: "weekly" },
  { path: "blog", priority: 0.7, changefreq: "weekly" },
  { path: "trust", priority: 0.6, changefreq: "monthly" },
  { path: "about", priority: 0.6, changefreq: "monthly" },
  { path: "community-guidelines", priority: 0.5, changefreq: "monthly" },
  { path: "legal", priority: 0.5, changefreq: "monthly" },
  { path: "privacy-policy", priority: 0.5, changefreq: "monthly" },
  { path: "cookie-policy", priority: 0.5, changefreq: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await supabaseServer();
  const lastModified = new Date();

  const staticItems: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${SITE_URL}/${page.path}`.replace(/\/$/, ""),
    priority: page.priority,
    changefreq: page.changefreq,
    lastModified,
  }));

  const { data: therapists } = await supabase
    .from("therapists")
    .select("slug,updated_at,is_published")
    .eq("is_published", true)
    .limit(50000);

  const dynamicTherapists: MetadataRoute.Sitemap = (therapists ?? []).map(
    (therapist) => ({
      url: `${SITE_URL}/therapist/${therapist.slug}`,
      lastModified: therapist.updated_at
        ? new Date(therapist.updated_at)
        : lastModified,
      changefreq: "weekly",
      priority: 0.7,
    })
  );

  return [...staticItems, ...dynamicTherapists];
}
