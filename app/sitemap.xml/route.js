import { NextResponse } from "next/server";
import { US_CITY_HUBS } from "@/src/data/usCities";
import { BLOG_POSTS } from "@/src/data/blogPosts";

export async function GET() {
  const base = "https://www.masseurmatch.com";
  const today = new Date().toISOString();

  const urlMap = new Map();
  const addUrl = (
    url,
    { lastmod = today, changefreq = "weekly", priority = "0.7" } = {}
  ) => {
    if (!urlMap.has(url)) {
      urlMap.set(url, { lastmod, changefreq, priority });
    }
  };

  addUrl(base, { changefreq: "daily", priority: "1.0" });

  const staticPages = [
    "about",
    "explore",
    "cities",
    "blog",
    "join",
    "recover",
    "trust-and-safety",
    "community-guidelines",
    "massage-etiquette",
    "privacy-policy",
    "terms",
    "sms-consent",
    "compare/masseurfinder",
    "compare/masseurpro",
    "compare/rentmasseur",
  ];

  staticPages.forEach((page) => {
    addUrl(`${base}/${page}`, { changefreq: "weekly", priority: "0.8" });
  });

  US_CITY_HUBS.forEach((city) => {
    addUrl(`${base}/cities/${city.slug}`, {
      changefreq: "weekly",
      priority: "0.7",
    });

    city.neighborhoods.forEach((hood) => {
      addUrl(`${base}/cities/${city.slug}/${hood.slug}`, {
        changefreq: "monthly",
        priority: "0.6",
      });
    });
  });

  const toIso = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? today : date.toISOString();
  };

  BLOG_POSTS.forEach((post) => {
    addUrl(`${base}/blog/${post.slug}`, {
      lastmod: toIso(post.date),
      changefreq: "monthly",
      priority: "0.6",
    });
  });

  const states = [
    "alabama",
    "alaska",
    "arizona",
    "arkansas",
    "california",
    "colorado",
    "connecticut",
    "delaware",
    "district-of-columbia",
    "florida",
    "georgia",
    "hawaii",
    "idaho",
    "illinois",
    "indiana",
    "iowa",
    "kansas",
    "kentucky",
    "louisiana",
    "maine",
    "maryland",
    "massachusetts",
    "michigan",
    "minnesota",
    "mississippi",
    "missouri",
    "montana",
    "nebraska",
    "nevada",
    "new-hampshire",
    "new-jersey",
    "new-mexico",
    "new-york",
    "north-carolina",
    "north-dakota",
    "ohio",
    "oklahoma",
    "oregon",
    "pennsylvania",
    "rhode-island",
    "south-carolina",
    "south-dakota",
    "tennessee",
    "texas",
    "utah",
    "vermont",
    "virginia",
    "washington",
    "west-virginia",
    "wisconsin",
    "wyoming",
  ];

  const massageCities = Array.from(
    new Set(US_CITY_HUBS.map((city) => city.slug))
  );

  states.forEach((state) => {
    addUrl(`${base}/massage/${state}`, {
      changefreq: "weekly",
      priority: "0.6",
    });
  });

  massageCities.forEach((city) => {
    addUrl(`${base}/massage/${city}`, {
      changefreq: "weekly",
      priority: "0.7",
    });
  });

  const xml = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${Array.from(urlMap.entries())
        .map(
          ([loc, meta]) => `
        <url>
          <loc>${loc}</loc>
          <lastmod>${meta.lastmod}</lastmod>
          <changefreq>${meta.changefreq}</changefreq>
          <priority>${meta.priority}</priority>
        </url>`
        )
        .join("")}
    </urlset>
  `;

  return new NextResponse(xml.trim(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
