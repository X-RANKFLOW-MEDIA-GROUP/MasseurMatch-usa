import { NextResponse } from "next/server";

export async function GET() {
  const base = "https://www.masseurmatch.com";
  const today = new Date().toISOString();

  //  TODOS os 50 estados dos EUA
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

  //  LISTA GRANDE DE CIDADES (alta busca + agregadas)
  const cities = [
    "albany","albuquerque","allentown","amarillo","anaheim","anchorage","arlington",
    "atlanta","austin","bakersfield","baltimore","baton-rouge","birmingham",
    "boise","boston","buffalo","burlington","charleston","charlotte","chattanooga",
    "chesapeake","chicago","cincinnati","cleveland","colorado-springs","columbia",
    "columbus","dallas","dayton","daytona-beach","denver","des-moines","detroit",
    "el-paso","erich","fayetteville","fort-lauderdale","fort-worth","fresno",
    "grand-rapids","greensboro","greenville","hartford","honolulu","houston",
    "indianapolis","jackson","jacksonville","jersey-city","kansas-city","knoxville",
    "las-vegas","lexington","lincoln","little-rock","los-angeles","louisville",
    "lubbock","madison","memphis","mesa","miami","milwaukee","minneapolis",
    "mobile","modesto","montgomery","nashville","new-orleans","new-york",
    "norfolk","oakland","oklahoma-city","omaha","orlando","pasadena","philadelphia",
    "phoenix","pittsburgh","plano","portland","providence","raleigh","reno",
    "richmond","rochester","sacramento","salt-lake-city","san-antonio","san-diego",
    "san-francisco","san-jose","santa-ana","sarasota","savannah","seattle",
    "shreveport","spokane","springfield","st-louis","st-paul","stockton",
    "syracuse","tallahassee","tampa","tucson","tulsa","virginia-beach","wichita",
    "winston-salem","washington-dc"
  ];

  // PÁGINAS PRINCIPAIS DO SITE
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

  // MONTA TODAS AS URLS
  const urls = [
    ...staticPages.map((p) => `${base}/${p}`),

    // explore/state
    ...states.map((s) => `${base}/explore/${s}`),

    // explore/usa/city
    ...cities.map((c) => `${base}/explore/usa/${c}`)
  ];

  //  GERA O XML FINAL
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
