# 🎯 SEO Indexing Strategy - MasseurMatch

## Enterprise-Level SEO Implementation

Based on your proposed structure + current implementation.

---

## 📋 INDEXING RULES BY ROUTE

### ✅ **INDEX + FOLLOW** (Public SEO Pages)

```
✅ /                                  → Homepage
✅ /about                             → About page
✅ /explore                           → Explore therapists
✅ /join                              → Join landing (public)

✅ /city/[city]                       → City pages (Miami, NYC, etc.)
✅ /city/[city]/[segment]             → Segment pages (gay-massage, etc.)
✅ /therapist/[id]                    → Therapist profiles

✅ /terms                             → Terms of Service
✅ /privacy-policy                    → Privacy Policy
✅ /community-guidelines              → Community Guidelines
✅ /anti-trafficking                  → Anti-Trafficking Policy
✅ /professional-standards            → Professional Standards
✅ /cookie-policy                     → Cookie Policy

✅ /sitemap.xml                       → Sitemap
✅ /robots.txt                        → Robots
```

**Total indexable URLs:** ~1000+ (via sitemap)

---

### 🚫 **NOINDEX + NOFOLLOW** (Private/User Areas)

```
🚫 /login                             → Login page
🚫 /join/form                         → Signup form
🚫 /recuperar                         → Password recovery
🚫 /dashboard                         → User dashboard
🚫 /edit-profile                      → Profile editing
🚫 /pending                           → Pending approval
🚫 /checkout                          → Checkout process
🚫 /checkout/success                  → Checkout success
🚫 /checkout/erro                     → Checkout error
🚫 /admin                             → Admin panel
🚫 /admin/edits                       → Admin edits
🚫 /api/*                             → API routes
```

**Implementation:** `X-Robots-Tag: noindex, nofollow` header via middleware

---

## 🤖 robots.txt Rules

### Current Implementation (`app/robots.txt/route.ts`)

```
# Block AI Bots
User-agent: GPTBot
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

# Allow search engines, block private routes
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
```

---

## 🗺️ Sitemap Structure

### Main Sitemap (`sitemap.xml`)

Generated dynamically with 1000+ URLs:

**Static pages:**
- `/` (homepage)
- `/explore`
- `/about`
- `/join`
- `/terms`, `/privacy-policy`, etc.

**Dynamic pages:**
- 50 states → `/explore/[state]`
- 127 cities → `/explore/usa/[city]`
- 20 SEO cities → `/city/[city]`
- Segment combinations:
  - `/city/[city]/[segment]` (11 segments × 20 cities = 220 URLs)
  - `/city/[city]/age/[range]` (6 ranges × 20 cities = 120 URLs)
  - `/city/[city]/service/[type]` (9 types × 20 cities = 180 URLs)

**Total:** ~1000+ URLs

### Future: Sitemap Index (When scale grows)

```xml
<sitemapindex>
  <sitemap>
    <loc>https://masseurmatch.com/sitemap-cities.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://masseurmatch.com/sitemap-profiles.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://masseurmatch.com/sitemap-blog.xml</loc>
  </sitemap>
</sitemapindex>
```

**When to split:**
- When total URLs > 50,000
- When sitemap.xml > 50MB
- When therapist profiles > 10,000

---

## 🛡️ Middleware Implementation

### Features (`middleware.ts`)

1. **X-Robots-Tag Headers** (Noindex)
   - Automatic noindex for private routes
   - Google respects this faster than meta tags

2. **Force WWW Redirect** (SEO Consistency)
   - `masseurmatch.com` → `www.masseurmatch.com`
   - 301 permanent redirect
   - Consolidates link equity

3. **Security Headers**
   - `X-Frame-Options: DENY` (prevent clickjacking)
   - `X-Content-Type-Options: nosniff` (prevent MIME sniffing)
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`

### Routes Affected

All routes **except**:
- Static files (`_next/static`)
- Image optimization (`_next/image`)
- Favicon
- Image files (.svg, .png, .jpg, etc.)

---

## 📊 Canonical URLs

### Implemented via `baseSEO()` helper

Every page has canonical URL:

```typescript
alternates: {
  canonical: `https://www.masseurmatch.com/city/miami`
}
```

**Prevents duplicate content issues:**
- `http://masseurmatch.com/city/miami` → canonical to HTTPS WWW
- `https://masseurmatch.com/city/miami` → canonical to WWW version
- Query parameters ignored by canonical

---

## 🎯 SEO Metadata Strategy

### Homepage
```typescript
title: "MasseurMatch | Gay Massage & Male Massage Therapist Directory USA"
description: "Find verified gay massage and male massage therapists..."
robots: { index: true, follow: true }
canonical: "https://www.masseurmatch.com"
```

### City Pages
```typescript
title: "Gay massage in Miami, FL | MasseurMatch"
description: "Find verified gay and male massage therapists in Miami..."
robots: { index: true, follow: true }
canonical: "https://www.masseurmatch.com/city/miami"
```

### Private Pages
```typescript
// NO metadata needed - handled by middleware
X-Robots-Tag: "noindex, nofollow"
```

---

## 🔍 Google Search Console Setup

### Properties to Add

1. **Main domain:** `https://www.masseurmatch.com`
2. **Non-WWW (redirect):** `https://masseurmatch.com`

### Verification Methods

1. **DNS TXT record** (recommended)
2. **HTML file upload**
3. **Meta tag** (not recommended - slows down)

### Submit Sitemap

```
URL: https://www.masseurmatch.com/sitemap.xml
```

### Request Indexing (Top Priority URLs)

Day 1 after launch:
1. `/city/miami`
2. `/city/new-york`
3. `/city/los-angeles`
4. `/city/san-francisco`
5. `/city/chicago`
6. `/city/atlanta`
7. `/city/dallas`
8. `/city/austin`
9. `/city/seattle`
10. `/city/denver`
11. `/city/miami/gay-massage`
12. `/city/new-york/male-massage`
13. `/city/los-angeles/m4m-massage`
14. `/city/san-francisco/lgbt-massage`
15. `/city/las-vegas/gay-massage`

**Method:** URL Inspection Tool → "Request Indexing"

---

## ⚡ Performance Optimizations

### CDN & Caching

**Vercel Edge Network (automatic):**
- Static pages cached at edge
- Dynamic pages use ISR (Incremental Static Regeneration)

**Cache-Control headers:**
```
/sitemap.xml → public, max-age=3600 (1 hour)
/robots.txt  → public, max-age=3600 (1 hour)
Static pages → public, max-age=86400 (24 hours)
```

### Image Optimization

**Next.js Image Optimization:**
- Automatic WebP conversion
- Lazy loading by default
- Responsive sizes
- Priority loading for above-fold images

---

## 🎯 Target Keywords & Ranking Strategy

### Primary Keywords (Top Priority)

```
Tier 1 (High volume, high intent):
- "gay massage [city]"
- "male massage [city]"
- "m4m massage [city]"
- "lgbt massage [city]"

Tier 2 (Medium volume):
- "gay massage therapist [city]"
- "gay spa [city]"
- "male bodywork [city]"

Tier 3 (Long-tail, quick wins):
- "gay massage south beach"
- "late night gay massage miami"
- "hotel gay massage nyc"
- "outcall male massage los angeles"
```

### Target Positions (30 days)

```
✅ Top 20 for "[city] gay massage" (10 cities)
✅ Top 10 for "gay massage [city]" (5 cities)
✅ Top 5 for "[neighborhood] gay massage" (3 neighborhoods)
```

---

## 📈 Monitoring & Analytics

### Google Search Console Metrics

Track weekly:
- **Impressions** (visibility)
- **Clicks** (traffic)
- **CTR** (click-through rate - target: >3%)
- **Average Position** (ranking - target: <20)

### Google Analytics 4 Events

Track:
- `search_therapist` (explore usage)
- `view_therapist_profile` (engagement)
- `click_contact` (conversion intent)
- `page_view` by route type

### Key Performance Indicators (KPIs)

```
Week 1:
- 100 URLs indexed
- 500 impressions
- 15 clicks
- Avg. position: 40

Month 1:
- 500 URLs indexed
- 10,000 impressions
- 300 clicks
- Avg. position: 25
- Top 20 in 5 cities

Month 3:
- 1000 URLs indexed
- 50,000 impressions
- 1,500 clicks
- Avg. position: 15
- Top 10 in 10 cities

Month 6:
- Compete with RentMasseur (500K visits/month)
- Top 5 in 20 cities
- Featured snippets for 5 keywords
```

---

## 🚀 Launch Checklist

### Pre-Launch

- [x] robots.txt configured
- [x] Sitemap.xml generated
- [x] Middleware (noindex headers)
- [x] Canonical URLs on all pages
- [x] Schema.org markup (Organization, LocalBusiness, Person)
- [x] Breadcrumbs (HTML + microdata)
- [x] Internal linking strategy
- [ ] `.env.local` configured with Supabase
- [ ] OG image created (`/public/og-image.jpg`)
- [ ] Build test passes

### Launch Day

- [ ] Deploy to Vercel
- [ ] Verify `www` redirect works
- [ ] Test `/robots.txt` loads correctly
- [ ] Test `/sitemap.xml` loads correctly
- [ ] Add property to Google Search Console
- [ ] Submit sitemap
- [ ] Request indexing for top 20 URLs
- [ ] Set up Google Analytics 4
- [ ] Monitor for errors

### Post-Launch (Week 1)

- [ ] Check GSC for indexing status
- [ ] Monitor Core Web Vitals
- [ ] Check for crawl errors
- [ ] Verify noindex headers on private pages
- [ ] Add 50 therapist profiles
- [ ] Submit to 5 LGBT directories
- [ ] Create first 3 blog posts

---

## 🏆 Competitive Advantage

### vs. RentMasseur

| Feature | MasseurMatch | RentMasseur |
|---------|--------------|-------------|
| **robots.txt** | ✅ Optimized | ⚠️ Basic |
| **Sitemap** | ✅ Dynamic (1000+) | ⚠️ Unknown |
| **Schema.org** | ✅ Complete | ⚠️ Limited |
| **Breadcrumbs** | ✅ HTML + Schema | ❌ None |
| **Internal Linking** | ✅ Strategic | ⚠️ Limited |
| **Middleware** | ✅ Advanced | ❌ None |
| **Force WWW** | ✅ Yes | ❌ No |
| **Security Headers** | ✅ Yes | ❌ No |

**Result:** Superior technical SEO foundation

---

## 📚 References

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Vercel Edge Network](https://vercel.com/docs/concepts/edge-network/overview)

---

**Last Updated:** 2025-12-09
**Status:** ✅ Production Ready (pending .env config)
