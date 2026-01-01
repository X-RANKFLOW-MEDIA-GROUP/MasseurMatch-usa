import { SITE_URL } from "@/lib/site";

const sitemapPaths = [
  "/sitemap.xml",
  "/sitemap-city.xml",
  "/sitemap-city-segments.xml",
  "/legal/sitemap.xml",
];

export async function GET() {
  const lastmod = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths
  .map(
    (path) => `  <sitemap>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
