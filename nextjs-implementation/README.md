# 🚀 MasseurMatch - Next.js Implementation

Complete Next.js App Router implementation with SEO, slug redirects, and city/segment filtering.

---

## 📁 Project Structure

```
nextjs-implementation/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── therapist/
│   │   └── [slug]/
│   │       └── page.tsx          ← /therapist/alex-santos-los-angeles
│   └── city/
│       ├── [city]/
│       │   └── page.tsx          ← /city/los-angeles
│       └── [city]/[segment]/
│           └── page.tsx          ← /city/los-angeles/deep-tissue
│
├── components/
│   ├── TherapistProfile.tsx      ← Profile display component
│   └── CityLandingPage.tsx       ← City landing with filters
│
├── lib/
│   ├── supabase.ts               ← Supabase clients (client/server/admin)
│   └── seo.ts                    ← SEO helper functions
│
└── data/
    ├── cityMap.ts                ← City configurations
    └── segmentConfig.ts          ← Segment configurations (deep-tissue, etc.)
```

---

## 🛠️ Setup Instructions

### 1. Create Next.js Project

```bash
npx create-next-app@latest masseurmatch-nextjs --typescript --tailwind --app

cd masseurmatch-nextjs
```

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 3. Copy Implementation Files

Copy all files from `nextjs-implementation/` to your new Next.js project:

```bash
# Copy all files while preserving structure
cp -r nextjs-implementation/* masseurmatch-nextjs/
```

### 4. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ijsdpozjfjjufjsoexod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Setup Database

The database setup is already done! Just run these in Supabase SQL Editor:

1. Run: `sql/setup_therapists_table.sql`
2. Create test user via Supabase Dashboard (Authentication → Users)
3. Run: `sql/seed_simple_therapist.sql` (with your user UUID)

**Additional step for slug support:**

Add a `slug` column to therapists table:

```sql
-- Add slug column
ALTER TABLE public.therapists ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Create index
CREATE INDEX IF NOT EXISTS idx_therapists_slug ON public.therapists(slug);

-- Generate slugs for existing therapists
UPDATE public.therapists
SET slug = LOWER(
  REGEXP_REPLACE(
    display_name || '-' || city,
    '[^a-zA-Z0-9]+',
    '-',
    'g'
  )
)
WHERE slug IS NULL;

-- Create slug redirects table
CREATE TABLE IF NOT EXISTS public.therapist_slug_redirects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  old_slug text UNIQUE NOT NULL,
  therapist_id uuid REFERENCES public.therapists(user_id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_slug_redirects_old_slug
  ON public.therapist_slug_redirects(old_slug);
```

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## 🗺️ Routes

### 1. Therapist Profile
**URL:** `/therapist/[slug]`

**Examples:**
- `/therapist/alex-santos-los-angeles`
- `/therapist/john-smith-miami`

**Features:**
- ✅ SEO-friendly slugs
- ✅ 301 redirects for old slugs
- ✅ Dynamic metadata (title, description, OG tags)
- ✅ Canonical URLs
- ✅ Static generation for top 100 therapists

**How it works:**
1. Tries to find therapist by current slug
2. If not found, checks `therapist_slug_redirects` table
3. If redirect exists, fetches therapist by ID
4. If current slug ≠ canonical slug → 301 redirect
5. Renders `TherapistProfile` component

### 2. City Landing Page
**URL:** `/city/[city]`

**Examples:**
- `/city/los-angeles`
- `/city/miami`
- `/city/new-york`

**Features:**
- ✅ Dynamic metadata per city
- ✅ Lists all therapists in city
- ✅ Shows neighboring cities
- ✅ Static generation for all cities in cityMap

**How it works:**
1. Looks up city in `cityMap`
2. Fetches therapists WHERE city ILIKE city.name
3. Renders `CityLandingPage` with segment=null

### 3. City + Segment Page
**URL:** `/city/[city]/[segment]`

**Examples:**
- `/city/los-angeles/deep-tissue`
- `/city/miami/gay-massage`
- `/city/dallas/sports-massage`

**Features:**
- ✅ Dynamic metadata from segmentConfig
- ✅ Custom narratives per segment
- ✅ Filters therapists by service type
- ✅ Static generation for all city×segment combinations

**How it works:**
1. Looks up city in `cityMap` + segment in `segmentConfig`
2. Fetches therapists WHERE city ILIKE city.name AND services @> [segment]
3. Renders `CityLandingPage` with segment data

---

## 🎨 Components

### TherapistProfile

**Purpose:** Display complete therapist profile

**Props:**
```typescript
type Props = {
  therapist: Therapist;
};
```

**Renders:**
- Header with photo and headline
- About/philosophy
- Services and techniques
- Pricing
- Availability schedule
- Amenities
- Gallery
- Qualifications
- Contact info

### CityLandingPage

**Purpose:** Display therapist listings for a city (with optional segment filter)

**Props:**
```typescript
type Props = {
  city: CityInfo;
  segment: SegmentConfig | null;
};
```

**Renders:**
- Header with city/segment title
- Narrative text (if segment)
- Grid of therapist cards
- Links to neighboring cities

**Client-side features:**
- Fetches therapists on mount
- Filters by segment if provided
- Loading states

---

## 🔧 Configuration

### Adding Cities

Edit `data/cityMap.ts`:

```typescript
export const cityMap: Record<string, CityInfo> = {
  'your-city-slug': {
    slug: 'your-city-slug',
    name: 'Your City',
    state: 'XX',
    country: 'US',
    neighbors: ['neighbor-1', 'neighbor-2']
  },
};
```

### Adding Segments

Edit `data/segmentConfig.ts`:

```typescript
export const segmentConfig: Record<string, SegmentConfig> = {
  'your-segment': {
    slug: 'your-segment',
    titleTemplate: (c, s) => `Your Segment in ${c}${s ? `, ${s}` : ''} | MasseurMatch`,
    descriptionTemplate: (c, s) => `Find professionals in ${c}...`,
    narrative: (c) => `Custom narrative for ${c}...`,
  },
};
```

---

## 📊 SEO Features

### Automatic Meta Tags

Each page automatically generates:
- `<title>` tag
- `<meta name="description">`
- `<link rel="canonical">`
- OpenGraph tags (og:title, og:description, og:url, og:type)
- Twitter Card tags

### Static Site Generation (SSG)

Pages are pre-rendered at build time for:
- Top 100 therapist profiles
- All configured cities
- All city×segment combinations

**Build command:**
```bash
npm run build
```

### Revalidation

Pages revalidate every hour (3600 seconds):
```typescript
export const revalidate = 3600;
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Vercel automatically:**
- Detects Next.js
- Sets up environment variables (add in dashboard)
- Enables ISR (Incremental Static Regeneration)
- Provides CDN and edge caching

### Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (set to your production domain)

---

## 🔄 Slug Redirect System

### How It Works

1. **Initial slug:** Therapist "Alex Santos" in "Los Angeles" gets slug: `alex-santos-los-angeles`
2. **Therapist moves:** Alex moves to Miami
3. **New slug generated:** `alex-santos-miami`
4. **Old slug saved to redirects:**
   ```sql
   INSERT INTO therapist_slug_redirects (old_slug, therapist_id)
   VALUES ('alex-santos-los-angeles', 'alex-user-id');
   ```
5. **User visits old URL:** `/therapist/alex-santos-los-angeles`
6. **301 redirect to:** `/therapist/alex-santos-miami`

### Implementing Slug Changes

When therapist updates name/city:

```typescript
// In your update API route
async function updateTherapist(therapistId: string, updates: any) {
  const { data: current } = await supabase
    .from('therapists')
    .select('slug')
    .eq('user_id', therapistId)
    .single();

  // Generate new slug
  const newSlug = generateSlug(updates.display_name, updates.city);

  if (newSlug !== current.slug) {
    // Save old slug to redirects
    await supabase.from('therapist_slug_redirects').insert({
      old_slug: current.slug,
      therapist_id: therapistId,
    });
  }

  // Update therapist with new slug
  await supabase
    .from('therapists')
    .update({ ...updates, slug: newSlug })
    .eq('user_id', therapistId);
}
```

---

## 🎯 Next Steps

1. ✅ Setup database (already done)
2. ✅ Create Next.js project
3. ✅ Copy implementation files
4. ✅ Configure environment variables
5. 🔨 Add styling (Tailwind CSS)
6. 🔨 Add authentication (Supabase Auth)
7. 🔨 Add reviews system
8. 🔨 Add booking functionality
9. 🚀 Deploy to Vercel

---

## 📖 Additional Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

**Questions?** Check the main documentation:
- [NEXTJS-MIGRATION-GUIDE.md](../NEXTJS-MIGRATION-GUIDE.md)
- [SETUP-DATABASE.md](../SETUP-DATABASE.md)

---

**Status:** ✅ Complete Next.js implementation ready for use!
