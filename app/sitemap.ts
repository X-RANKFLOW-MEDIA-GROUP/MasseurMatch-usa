import { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/site";
import { getAllCities } from "@/src/data/cities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/explore",
    "/join",
    "/login",
    "/about",
    "/terms",
    "/privacy-policy",
    "/cookie-policy",
    "/community-guidelines",
    "/professional-standards",
    "/trust",
    "/anti-trafficking",
    "/legal",
    "/blog",
    "/ai",
    "/therapist",
  ];

  const segments = [
    "deep-tissue",
    "swedish",
    "sports",
    "hot-stone",
    "thai",
    "prenatal",
    "couples",
    "gay-massage",
    "gay-massage-therapist",
    "gay-massage-for-men",
    "lgbt-gay-massage",
    "male-gay-massage",
  ];

  const cities = getAllCities();
  const cityPages = cities.flatMap((city) => [
    { url: `${SITE_URL}/city/${city.slug}`, lastModified: new Date(), priority: 0.8 },
    ...segments.map((segment) => ({
      url: `${SITE_URL}/city/${city.slug}/${segment}`,
      lastModified: new Date(),
      priority: 0.7,
    })),
  ]);

  const blogPosts = [
    "benefits-of-regular-massage",
    "choosing-right-massage-type",
    "massage-for-athletes",
    "self-massage-techniques",
  ].map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [
    ...staticPages.map((page) => ({
      url: `${SITE_URL}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    })),
    ...cityPages,
    ...blogPosts,
  ];
}
