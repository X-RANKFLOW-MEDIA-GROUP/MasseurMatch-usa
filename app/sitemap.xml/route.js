import { NextResponse } from "next/server";

export async function GET() {
  const base = "https://www.masseurmatch.com";
  const today = new Date().toISOString();

  // Páginas reais do seu site
  const staticPages = [
    "", 
    "explore",
    "waitlist",
    "login",
    "join",
    "privacy-policy",
    "terms",
    "sms-consent"
  ];

  // Estados reais para futuras páginas locais
  const states = [
    "alabama","alaska","arizona","arkansas","california","colorado","connecticut",
    "delaware","florida","georgia","hawaii","idaho","illinois","indiana","iowa",
    "kansas","kentucky","louisiana","maine","maryland","massachusetts","michigan",
    "minnesota","mississippi","missouri","montana","nebraska","nevada",
    "new-hampshire","new-jersey","new-mexico","new-york","north-carolina",
    "north-dakota","ohio","oklahoma","oregon","pennsylvania","rhode-island",
    "south-carolina","south-dakota","tennessee","texas","utah","vermont",
    "virginia","washington","west-virginia","wisconsin","wyoming"
  ];

  // Cidades com maior volume de busca — ótimo para pré-SEO
  const cities = [
    "atlanta","austin","boston","chicago","cleveland","columbus","dallas","denver",
    "detroit","houston","indianapolis","jacksonville","kansas-city","las-vegas",
    "los-angeles","memphis","miami","minneapolis","nashville","new-orleans",
    "new-york","oklahoma-city","orlando","philadelphia","phoenix","pittsburgh",
    "portland","raleigh","sacramento","salt-lake-city","san-antonio","san-diego",
    "san-francisco","san-jose","seattle","st-louis","tampa","washington-dc"
  ];

  // Monta URLs
  const urls = [
    ...staticPages.map((p) => `${base}/${p}`),

    // Pagina de explore/state
    ...states.map((s) => `${base}/explore/${s}`),

    // Pagina explore/state/city
    ...cities.map((c) => `${base}/explore/usa/${c}`)
  ];

  // Gera XML
  const xml = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          (u) => `
        <url>
          <loc>${u}</loc>
          <lastmod>${today}</lastmod>
          <changefreq>daily</changefreq>
          <priority>${u === base ? "1.0" : "0.7"}</priority>
        </url>`
        )
        .join("")}
    </urlset>
  `;

  return new NextResponse(xml.trim(), {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
