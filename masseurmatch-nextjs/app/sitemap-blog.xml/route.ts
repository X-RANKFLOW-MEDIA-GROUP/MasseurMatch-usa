import { blogPosts } from "@/app/blog/data/posts";

const baseUrl = "https://www.masseurmatch.com";

export async function GET() {
  const blogHome = {
    loc: `${baseUrl}/blog`,
    lastmod: new Date().toISOString(),
    changefreq: "weekly",
    priority: "0.7",
  };

  const posts = blogPosts.map((post) => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.updatedAt ?? post.publishedAt,
    changefreq: "weekly",
    priority: "0.6",
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[blogHome, ...posts]
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
