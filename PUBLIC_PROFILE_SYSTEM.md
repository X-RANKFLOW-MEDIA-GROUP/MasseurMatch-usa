# Public Profile System - SEO-Focused Implementation

**Created:** 2025-12-28
**Status:** Complete
**Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Database View](#database-view)
5. [SEO Features](#seo-features)
6. [Usage](#usage)
7. [Photo Limits](#photo-limits)
8. [Indexability Rules](#indexability-rules)
9. [Schema Markup](#schema-markup)
10. [Testing](#testing)

---

## Overview

The Public Profile System provides SEO-optimized, public-facing pages for massage therapists. The system includes:

- **Clean URLs**: `/{city-slug}/therapist/{therapist-slug}`
- **Comprehensive SEO**: Meta tags, Open Graph, Twitter Cards, Schema.org markup
- **Photo Limits**: Enforced by subscription plan tier
- **Publication Gates**: Only verified, approved, paid profiles are indexed
- **Performance**: Static generation with ISR (Incremental Static Regeneration)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Database View: public_therapist_profiles       │
│  - Joins profiles, users, subscriptions, media  │
│  - Applies publication gates                    │
│  - Aggregates related data                      │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│  Next.js Page: /[city]/therapist/[slug]/page.tsx│
│  - Fetches profile data                         │
│  - Generates metadata (SEO)                     │
│  - Static generation + ISR                      │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│  ProfilePage Component                          │
│  - Renders public profile                       │
│  - Includes Schema.org markup                   │
│  - Breadcrumbs, Photos, Contact, FAQ            │
└─────────────────────────────────────────────────┘
```

---

## File Structure

```
masseurmatch-nextjs/
├── app/
│   └── [city]/
│       └── therapist/
│           └── [slug]/
│               └── page.tsx                    # Main profile page (SSG + ISR)
├── components/
│   └── profile/
│       ├── ProfilePage.tsx                     # Main layout component
│       └── parts/
│           ├── Breadcrumbs.tsx                 # Navigation breadcrumbs
│           ├── ContactCard.tsx                 # Contact options card
│           ├── FAQBlock.tsx                    # FAQ section with schema
│           ├── PhotoGrid.tsx                   # Photo gallery with limits
│           ├── SchemaBlocks.tsx                # Schema.org JSON-LD
│           └── ServicesList.tsx                # Services/modalities tags
├── lib/
│   └── profile.ts                              # Helper functions & types
└── supabase/
    └── migrations/
        └── 20251228_public_therapist_profiles_view.sql  # Database view
```

---

## Database View

### View Name

`public.public_therapist_profiles`

### Key Features

1. **Automatic Filtering**: Only includes profiles with required fields (slug, display_name, city_slug)
2. **Publication Status**: Calculates if profile is "published" or "draft" based on gates
3. **Aggregated Data**: Joins services, modalities, languages, photos, service areas
4. **Privacy**: Hides contact info for draft profiles
5. **Plan-Based Limits**: Includes plan_tier for photo limit enforcement

### Sample Query

```sql
SELECT * FROM public.public_therapist_profiles
WHERE slug = 'john-doe-nyc'
  AND status = 'published';
```

---

## SEO Features

### 1. Dynamic Metadata

```typescript
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProfile(params.city, params.slug);

  return {
    title: seoTitle(p),                    // "John Doe - Massage Therapist in New York, NY | MasseurMatch"
    description: seoDescription(p),        // Includes bio, services, modes
    alternates: { canonical: canonicalUrl(p) },
    robots: isIndexable(p) ? { index: true } : { index: false },
    openGraph: { ... },
    twitter: { ... },
    keywords: [ ... ]
  };
}
```

### 2. Indexability Rules

A profile is indexable if **ALL** conditions are met:

- ✅ Has `slug`
- ✅ Has `display_name`
- ✅ Has `city_slug`, `city_name`, `state_code`
- ✅ Has `short_bio`
- ✅ Has `published_at` date
- ✅ Has at least one service mode (`incall_enabled` OR `outcall_enabled`)
- ✅ `status = 'published'`

If any condition fails, the page is rendered with `robots: { index: false }`.

### 3. Canonical URLs

```
https://masseurmatch.com/{city-slug}/therapist/{therapist-slug}
```

- **City Slug Redirect**: If user visits wrong city slug, automatic redirect to canonical
- **Example**: `/los-angeles/therapist/john-doe` → `/new-york-ny/therapist/john-doe` (if John is in NYC)

---

## Photo Limits

### Plan Tiers

| Plan     | Max Photos |
|----------|-----------|
| Free     | 1         |
| Standard | 6         |
| Pro      | 12        |
| Elite    | 24        |

### Enforcement

```typescript
const limit = planPhotoLimit(profile.plan_tier);
const visible = photos.slice(0, limit);
const hiddenCount = photos.length - visible.length;
```

- Photos beyond the limit are **not displayed**
- A notice shows how many photos are hidden: *"5 additional photos available on higher plans"*
- Photo alt text is auto-generated for SEO: `${name} profile photo in ${city}, ${state}`

---

## Schema Markup

### Included Schemas

1. **HealthAndBeautyBusiness** (Schema.org)
   - Name, URL, Image, Description
   - Address (addressLocality, addressRegion, addressCountry)
   - Area served (array of cities)
   - Price range
   - Languages known
   - Offer catalog (services)

2. **Person** (Schema.org)
   - Name, URL, Image, Job Title
   - Work location

3. **FAQPage** (Schema.org)
   - 4-6 common questions with answers
   - Helps with rich snippets in search results

4. **ImageObject** (Schema.org)
   - For each visible photo
   - Includes contentUrl, caption, description

### Example Output

```json
{
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "name": "John Doe Massage Therapy",
  "url": "https://masseurmatch.com/new-york-ny/therapist/john-doe",
  "image": "https://...",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "addressCountry": "US"
  },
  "priceRange": "USD 80 to 150",
  "knowsLanguage": ["English", "Spanish"],
  "hasOfferCatalog": { ... }
}
```

---

## Usage

### 1. Apply Database Migration

```bash
supabase db push supabase/migrations/20251228_public_therapist_profiles_view.sql
```

### 2. Access Profile Page

```
https://masseurmatch.com/{city-slug}/therapist/{therapist-slug}
```

### 3. Check SEO

Use Google's Rich Results Test:
```
https://search.google.com/test/rich-results
```

Paste your profile URL to validate Schema.org markup.

---

## Indexability Rules (Detailed)

### Publication Gates

A profile's `status` is calculated as:

```sql
CASE
  WHEN p.publication_status = 'public'
    AND p.admin_status = 'approved'
    AND u.identity_status = 'verified'
    AND (
      s.status IN ('trialing', 'active')
      OR s.plan = 'free'
      OR NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = p.user_id)
    )
  THEN 'published'
  ELSE 'draft'
END as status
```

### Robots Meta Tag

```typescript
robots: indexable
  ? { index: true, follow: true }
  : { index: false, follow: true }
```

- **Indexable profiles**: `index, follow`
- **Draft profiles**: `noindex, follow` (allows crawling links, but doesn't index page)

---

## Components Breakdown

### 1. ProfilePage

Main layout component. Organizes:
- Header (name, city, badges)
- Contact card
- Photo grid
- Content sections (about, services, rates, availability, FAQ)
- Sidebar (quick links, support)

### 2. PhotoGrid

- Displays photos up to plan limit
- Lazy loading (first photo eager, rest lazy)
- Hover effects
- Shows hidden count if over limit

### 3. ContactCard

- Phone (tel: link)
- Email (mailto: link)
- Website (external link)
- Instagram (external link)
- Normalizes URLs (adds https:// if missing)

### 4. ServicesList

- Displays services/modalities as badge tags
- Deduplicates and limits to 40 items
- Empty state message if no services

### 5. Breadcrumbs

- Home → City → Therapist
- Includes Schema.org BreadcrumbList markup
- Accessible navigation

### 6. FAQBlock

- 4-6 common questions
- `<details>` HTML for expand/collapse
- Schema.org Question/Answer markup

### 7. SchemaBlocks

- Injects JSON-LD scripts into `<head>`
- Multiple schema types for rich results
- Auto-generates from profile data

---

## Testing Checklist

### SEO Testing

- [ ] Open profile in browser
- [ ] View page source, verify `<title>` and `<meta>` tags
- [ ] Check canonical URL in `<link rel="canonical">`
- [ ] Verify `robots` meta tag (index/noindex)
- [ ] Test with Google Rich Results Test
- [ ] Validate Schema.org markup with validator
- [ ] Check Open Graph preview (Facebook Sharing Debugger)
- [ ] Check Twitter Card preview (Twitter Card Validator)

### Functional Testing

- [ ] Profile loads without errors
- [ ] Photos display correctly (up to plan limit)
- [ ] Contact card shows correct info
- [ ] Breadcrumbs navigate properly
- [ ] FAQ section expands/collapses
- [ ] Service badges display
- [ ] City slug redirect works
- [ ] 404 for invalid slug

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader announces content properly
- [ ] Alt text on images
- [ ] ARIA labels on interactive elements
- [ ] Semantic HTML (h1, h2, nav, main, etc.)

### Performance Testing

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

---

## Helper Functions

### `planPhotoLimit(plan: PlanTier): number`
Returns max photos for a plan tier.

### `isIndexable(p: PublicProfile): boolean`
Checks if profile meets all indexability requirements.

### `safeAlt(p: PublicProfile, photo: PublicPhoto, index: number): string`
Generates SEO-friendly alt text for photos.

### `moneyRange(p: PublicProfile): string | null`
Formats price range for display: "USD 80 to 150" or "USD from 80".

### `canonicalUrl(p: PublicProfile): string`
Generates canonical URL: `https://masseurmatch.com/{city}/{slug}`.

### `seoTitle(p: PublicProfile): string`
Generates page title: "{Name} - Massage Therapist in {City}, {State} | MasseurMatch".

### `seoDescription(p: PublicProfile): string`
Generates meta description with bio, services, and modes.

---

## Deployment

### 1. Build Static Pages

```bash
npm run build
```

This pre-generates the top 100 profiles at build time.

### 2. ISR (Incremental Static Regeneration)

```typescript
export const revalidate = 3600; // 1 hour
```

Pages are regenerated every hour, ensuring fresh data without full rebuilds.

### 3. On-Demand Revalidation (Optional)

```typescript
// In webhook or admin action
await fetch(`https://masseurmatch.com/api/revalidate?path=/${city}/therapist/${slug}`);
```

---

## Troubleshooting

### Profile Not Showing

1. Check if profile exists in view:
   ```sql
   SELECT * FROM public_therapist_profiles WHERE slug = 'your-slug';
   ```

2. Verify `status = 'published'`

3. Check publication gates:
   - `publication_status = 'public'`
   - `admin_status = 'approved'`
   - `identity_status = 'verified'`
   - Subscription active or free plan

### Photos Not Displaying

1. Check `media_assets` table:
   ```sql
   SELECT * FROM media_assets WHERE profile_id = '{id}' AND status = 'approved';
   ```

2. Verify photo limit not exceeded for plan

3. Check if `public_url` is set

### Schema Errors

1. Use [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Validate JSON-LD with [Schema.org Validator](https://validator.schema.org/)
3. Check browser console for JSON parse errors

---

## Future Enhancements

- [ ] Reviews & ratings section
- [ ] Booking calendar integration
- [ ] Video support (beyond photos)
- [ ] Multi-language support (i18n)
- [ ] AMP (Accelerated Mobile Pages) version
- [ ] Progressive Web App features

---

## Support

For questions or issues:

- **Technical:** support@masseurmatch.com
- **Billing:** billing@masseurmatch.com
- **Legal:** legal@masseurmatch.com

---

**Last Updated:** 2025-12-28
**Author:** Claude Sonnet 4.5
**Version:** 1.0
