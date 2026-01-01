# 🚀 Next.js App Router Migration Guide

## Decision: Replace Express Backend with Next.js

You've decided to use **Next.js App Router** instead of the separate Express backend. This is a great choice for:

✅ Better SEO (server-side rendering)
✅ Faster page loads
✅ Simpler deployment (one app instead of two)
✅ Built-in API routes

---

## 📦 What Changes

### Before (Current Setup)

```
React Frontend (Vite)  →  Express Backend  →  Supabase
     Port 3000              Port 4000
```

### After (Next.js)

```
Next.js (Frontend + Backend)  →  Supabase
       Port 3000
```

---

## 🗂️ New Project Structure

```
masseurmatch-nextjs/          ← New Next.js project
├── app/
│   ├── layout.tsx            ← Root layout
│   ├── page.tsx              ← Home page
│   ├── therapist/
│   │   └── [slug]/
│   │       └── page.tsx      ← /therapist/alex-santos
│   ├── city/
│   │   ├── [city]/
│   │   │   └── page.tsx      ← /city/los-angeles
│   │   └── [city]/
│   │       └── [segment]/
│   │           └── page.tsx  ← /city/los-angeles/deep-tissue
│   └── api/
│       └── therapist/
│           └── [id]/
│               └── route.ts  ← API fallback (optional)
├── lib/
│   ├── supabase.ts           ← Supabase client
│   ├── seo.ts                ← SEO helpers
│   └── queries.ts            ← Database queries
├── data/
│   ├── cityMap.ts            ← City configurations
│   └── segmentConfig.ts      ← Segment configurations
├── components/
│   ├── TherapistProfile.tsx
│   └── CityLandingPage.tsx
└── public/
```

---

## 🛠️ Setup Steps

### 1. Create New Next.js Project

```bash
npx create-next-app@latest masseurmatch-nextjs --typescript --tailwind --app

# Options:
# ✅ TypeScript: Yes
# ✅ ESLint: Yes
# ✅ Tailwind CSS: Yes
# ✅ src/ directory: No
# ✅ App Router: Yes
# ✅ Customize import alias: No
```

### 2. Install Dependencies

```bash
cd masseurmatch-nextjs
npm install @supabase/supabase-js
npm install @supabase/ssr  # For server-side auth
npm install next-seo       # For SEO
```

### 3. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ijsdpozjfjjufjsoexod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📄 Core Files

### lib/supabase.ts

```typescript
import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Client-side Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase client (for Server Components)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );
}

// Admin client (for server-only operations with service role key)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

### lib/seo.ts

```typescript
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.masseurmatch.com';

export function absUrl(path: string) {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function stripHtml(html?: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function truncate(s: string, max = 160) {
  return s.length > max ? s.slice(0, max - 1).trim() + '…' : s;
}
```

### data/cityMap.ts

```typescript
export type CityInfo = {
  slug: string;
  name: string;
  state?: string;
  country?: string;
  neighbors?: string[];
};

export const cityMap: Record<string, CityInfo> = {
  'los-angeles': {
    slug: 'los-angeles',
    name: 'Los Angeles',
    state: 'CA',
    country: 'US',
    neighbors: ['glendale', 'burbank', 'pasadena']
  },
  'miami': {
    slug: 'miami',
    name: 'Miami',
    state: 'FL',
    country: 'US',
    neighbors: ['miami-beach', 'coral-gables']
  },
  'new-york': {
    slug: 'new-york',
    name: 'New York',
    state: 'NY',
    country: 'US',
    neighbors: ['brooklyn', 'queens', 'manhattan']
  },
  'dallas': {
    slug: 'dallas',
    name: 'Dallas',
    state: 'TX',
    country: 'US',
    neighbors: ['irving', 'plano', 'arlington']
  },
};
```

### data/segmentConfig.ts

```typescript
export type SegmentConfig = {
  slug: string;
  titleTemplate: (cityName: string, state?: string) => string;
  descriptionTemplate: (cityName: string, state?: string) => string;
  narrative: (cityName: string) => string;
};

export const segmentConfig: Record<string, SegmentConfig> = {
  'deep-tissue': {
    slug: 'deep-tissue',
    titleTemplate: (c, s) =>
      `Deep Tissue Massage in ${c}${s ? `, ${s}` : ''} | MasseurMatch`,
    descriptionTemplate: (c, s) =>
      `Find professional deep tissue massage therapists in ${c}${s ? `, ${s}` : ''}. Compare profiles, reviews, and availability.`,
    narrative: (c) =>
      `Deep tissue massage in ${c} for tension relief, muscle recovery, and targeted pain management.`,
  },
  'gay-massage': {
    slug: 'gay-massage',
    titleTemplate: (c, s) =>
      `Gay Massage in ${c}${s ? `, ${s}` : ''} | MasseurMatch`,
    descriptionTemplate: (c, s) =>
      `Explore gay massage therapists in ${c}${s ? `, ${s}` : ''} with verified professionals. Read reviews and book appointments.`,
    narrative: (c) =>
      `Professional gay massage in ${c} with personalized, discreet services focused on your well-being.`,
  },
  'sports-massage': {
    slug: 'sports-massage',
    titleTemplate: (c, s) =>
      `Sports Massage in ${c}${s ? `, ${s}` : ''} | MasseurMatch`,
    descriptionTemplate: (c, s) =>
      `Find sports massage therapists in ${c}${s ? `, ${s}` : ''} specializing in athletic recovery and performance.`,
    narrative: (c) =>
      `Sports massage in ${c} for athletes and active individuals seeking enhanced performance and recovery.`,
  },
};
```

---

## 📝 Route Implementation

I'll create the implementation files in the next response. The structure will be:

1. **app/therapist/[slug]/page.tsx** - Therapist profile with slug redirects
2. **app/city/[city]/page.tsx** - City landing page
3. **app/city/[city]/[segment]/page.tsx** - City + segment filtered page

Would you like me to create these files now?

---

## 🔄 Migration Checklist

- [ ] Create new Next.js project
- [ ] Copy database setup SQL (already done)
- [ ] Implement routing structure
- [ ] Migrate existing components
- [ ] Add therapist slug system to database
- [ ] Create slug redirect table
- [ ] Test all routes
- [ ] Deploy to Vercel

---

## ⚠️ What About the Express Backend?

You can **keep it** for:
- Mobile app API
- Third-party integrations
- Webhook endpoints

Or **delete it** if you only need the website.

---

**Ready to implement the routes?** Let me know and I'll create all the page files!
