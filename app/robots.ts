import { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/admin/",
          "/api/",
          "/auth/",
          "/checkout/",
          "/edit-profile",
          "/pending",
          "/blocked",
          "/reset",
          "/recuperar",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
