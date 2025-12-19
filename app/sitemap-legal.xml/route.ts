import { legalDocuments } from "@/src/lib/legal-data";

const baseUrl = "https://www.masseurmatch.com";

const normalizeDate = (value: string, fallback: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
};

export async function GET() {
  const now = new Date().toISOString();

  const legalHome = {
    loc: `${baseUrl}/legal`,
    lastmod: now,
    changefreq: "monthly",
    priority: "0.6",
  };

  const docs = legalDocuments.map((doc) => ({
    loc: `${baseUrl}/legal/${doc.slug}`,
    lastmod: normalizeDate(doc.lastUpdated, now),
    changefreq: "monthly",
    priority: "0.5",
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[legalHome, ...docs]
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
