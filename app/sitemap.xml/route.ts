const baseUrl = "https://www.masseurmatch.com";

const sitemapPaths = [
  "/sitemap-static.xml",
  "/sitemap-legal.xml",
  "/sitemap-blog.xml",
  "/sitemap-city.xml",
  "/sitemap-city-segments.xml",
];

export async function GET() {
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths
  .map(
    (path) => `  <sitemap>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
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
