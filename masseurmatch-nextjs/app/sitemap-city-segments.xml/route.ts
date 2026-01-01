import { cityMap } from "@/data/cityMap";
import { segmentConfig } from "@/data/segmentConfig";
import { SITE_URL } from "@/lib/site";

const segmentSlugs = Object.values(segmentConfig).map((segment) => segment.slug);

const citySlugs = Object.keys(cityMap);

export async function GET() {
  const lastmod = new Date().toISOString();

  const urls = citySlugs.flatMap((city) =>
    segmentSlugs.map((segment) => ({
      loc: `${SITE_URL}/city/${city}/${segment}`,
      lastmod,
      changefreq: "weekly",
      priority: "0.7",
    }))
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
