import { cityMap } from "@/app/data/cities";
import { expansionCities } from "@/app/data/expansionCities";

const baseUrl = "https://www.masseurmatch.com";

const citySlugs = Array.from(
  new Set([...Object.keys(cityMap), ...Object.keys(expansionCities)])
);

export async function GET() {
  const lastmod = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${citySlugs
  .map(
    (slug) => `  <url>
    <loc>${baseUrl}/city/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
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
