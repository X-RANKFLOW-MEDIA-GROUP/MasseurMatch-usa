import { NextResponse } from "next/server";

export async function GET() {
  const base = "https://www.masseurmatch.com";

  const staticPages = [
    "",
    "explore",
    "waitlist",
    "join",
    "login",
    "terms",
    "privacy-policy",
    "sms-consent",
  ];

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

  const seoCities = [
    "miami","orlando","fort-lauderdale","new-york","los-angeles","san-francisco",
    "las-vegas","phoenix","chicago","atlanta","dallas","houston","austin",
    "san-diego","seattle","denver","washington-dc","boston","philadelphia","tampa"
  ];

  const segments = [
    "gay-massage",
    "male-massage",
    "lgbt-massage",
    "m4m",
    "deep-tissue",
    "sports-massage",
    "relaxation",
    "back-pain",
    "neck-pain",
    "anxiety",
    "sciatica",
  ];

  const ages = ["18-25","25-30","30-35","35-40","40-50","50plus"];

  const services = [
    "deep-tissue",
    "sports",
    "relaxation",
    "thai",
    "mobile",
    "outcall",
    "hotel",
    "private",
    "men-only",
  ];

  const urls = [
    ...staticPages.map((p) => `${base}/${p}`),

    ...states.map((s) => `${base}/explore/${s}`),

    ...cities.map((c) => `${base}/explore/usa/${c}`),

    ...seoCities.map((c) => `${base}/city/${c}`),

    ...seoCities.flatMap((c) =>
      segments.map((s) => `${base}/city/${c}/${s}`)
    ),

    ...seoCities.flatMap((c) =>
      ages.map((a) => `${base}/city/${c}/age/${a}`)
    ),

    ...seoCities.flatMap((c) =>
      services.map((s) => `${base}/city/${c}/service/${s}`)
    ),
  ];

  const uniqueUrls = Array.from(new Set(urls));

  const xml = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map((u) => `<url><loc>${u}</loc></url>`).join("")}
</urlset>`;

  return new NextResponse(xml.trim(), {
    headers: { "Content-Type": "application/xml" },
  });
}
