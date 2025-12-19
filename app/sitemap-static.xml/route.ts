const baseUrl = "https://www.masseurmatch.com";

const staticRoutes = [
  "/",
  "/about",
  "/explore",
  "/join",
  "/trust",
  "/professional-standards",
  "/community-guidelines",
  "/anti-trafficking",
  "/privacy-policy",
  "/cookie-policy",
  "/terms",
  "/blog",
  "/legal",
];

export async function GET() {
  const lastmod = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (path) => `  <url>
    <loc>${baseUrl}${path === "/" ? "" : path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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
