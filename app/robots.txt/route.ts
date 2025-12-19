export async function GET() {
  return new Response(
`User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /dashboard
Disallow: /dashboard/
Disallow: /edit-profile
Disallow: /login
Disallow: /join/form
Disallow: /checkout/
Disallow: /pending
Disallow: /recuperar
Disallow: /api/

Sitemap: https://www.masseurmatch.com/sitemap.xml
Host: www.masseurmatch.com
`,
    {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600"
      }
    }
  );
}
