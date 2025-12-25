import { cityMap } from "@/app/data/cities";
import { expansionCities } from "@/app/data/expansionCities";

const baseUrl = "https://www.masseurmatch.com";

const segmentSlugs = [
  "gay-massage",
  "male-massage",
  "m4m-massage",
  "lgbt-massage",
  "gay-friendly-massage",
  "men-only-massage",
  "gay-spa",
  "gay-bodywork",
  "deep-tissue",
  "sports-massage",
  "relaxation",
  "thai-massage",
  "stress-relief",
  "back-pain",
  "neck-pain",
  "hotel-massage",
  "mobile-massage",
  "late-night-massage",
];

const citySlugs = Array.from(
  new Set([...Object.keys(cityMap), ...Object.keys(expansionCities)])
);

export async function GET() {
  const lastmod = new Date().toISOString();

  const urls = citySlugs.flatMap((city) =>
    segmentSlugs.map((segment) => ({
      loc: `${baseUrl}/city/${city}/${segment}`,
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
