# Weekly Promotions System

**Created:** 2025-12-28
**Status:** Complete
**Version:** 1.0

---

## Overview

The Weekly Promotions system allows therapists to display time-limited promotional offers on their public profiles. Promotions appear prominently at the top of the profile content area, immediately below the therapist's name and headline.

---

## Features

- **Time-Limited Offers**: Promotions have start and end dates
- **Customizable Design**: Custom badge colors and discount text
- **Automatic Display**: Active promotions automatically appear on profiles
- **Multiple Promotions**: Support for up to 3 active promotions per therapist
- **Tracking**: View and click counts for analytics
- **Prominent Placement**: Displays at top of profile for maximum visibility

---

## Database Schema

### Table: `therapist_promotions`

```sql
CREATE TABLE public.therapist_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,

  -- Promotion details
  title TEXT NOT NULL,
  description TEXT,
  discount_text TEXT, -- e.g., "20% OFF", "$30 OFF", "FREE UPGRADE"

  -- Promotion period
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,

  -- Display
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  badge_color TEXT DEFAULT '#ef4444', -- Hex color

  -- Tracking
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Visual Design

### Promotion Card Layout

```
┌─────────────────────────────────────────────────────┐
│  [20% OFF]                    ⏰ Ends Jan 5         │
│                                                     │
│  New Year Special                                   │
│  Start 2026 relaxed! Get 20% off your first        │
│  session this week.                                 │
└─────────────────────────────────────────────────────┘
```

### Design Specs

- **Background**: Linear gradient using `badge_color`
- **Text Color**: White
- **Padding**: 1.5rem vertical, 2rem horizontal
- **Border Radius**: 1rem
- **Shadow**: `0 10px 30px rgba(239, 68, 68, 0.3)`
- **Badge**: White background with 20% opacity, rounded pill shape
- **Typography**: Title at 1.5rem bold, description at 1rem

---

## Usage

### 1. Apply Database Migration

```bash
cd masseurmatch-nextjs
npx supabase db push ../supabase/migrations/20251228_weekly_promotions.sql
```

### 2. Create a Promotion

```sql
INSERT INTO public.therapist_promotions (
  therapist_id,
  title,
  description,
  discount_text,
  start_date,
  end_date,
  badge_color
) VALUES (
  'user-id-here',
  'New Year Special',
  'Start 2026 relaxed! Get 20% off your first session this week.',
  '20% OFF',
  NOW(),
  NOW() + INTERVAL '7 days',
  '#ef4444'
);
```

### 3. View on Profile

Visit the therapist's profile page and the promotion will automatically appear at the top of the content area.

**URL Format**: `/{city-slug}/therapist/{therapist-slug}`

---

## Badge Color Options

Recommended colors for different promotion types:

| Color | Hex Code | Use Case |
|-------|----------|----------|
| Red | `#ef4444` | General discounts, urgent offers |
| Purple | `#a855f7` | Premium/VIP offers |
| Blue | `#3b82f6` | New client specials |
| Green | `#10b981` | Seasonal promotions |
| Orange | `#f97316` | Limited-time flash sales |
| Pink | `#ec4899` | Holiday specials |

---

## Promotion Display Rules

A promotion is displayed when **ALL** conditions are met:

1. ✅ `is_active = true`
2. ✅ `start_date <= NOW()`
3. ✅ `end_date >= NOW()`
4. ✅ Profile is published and active

Promotions are:
- **Sorted by**: `display_order` (ascending)
- **Limited to**: 3 promotions per profile
- **Auto-hidden**: When end_date passes

---

## Examples

### Example 1: Weekend Special

```sql
INSERT INTO therapist_promotions (
  therapist_id,
  title,
  description,
  discount_text,
  start_date,
  end_date,
  badge_color
) VALUES (
  'your-user-id',
  'Weekend Warrior Special',
  'Book a 90-minute deep tissue massage this weekend and save $40!',
  '$40 OFF',
  '2026-01-03 00:00:00',
  '2026-01-05 23:59:59',
  '#f97316'
);
```

### Example 2: New Client Offer

```sql
INSERT INTO therapist_promotions (
  therapist_id,
  title,
  description,
  discount_text,
  start_date,
  end_date,
  badge_color
) VALUES (
  'your-user-id',
  'First-Time Client Discount',
  'New to my practice? Enjoy 25% off your first session. Valid for all session types.',
  '25% OFF',
  NOW(),
  NOW() + INTERVAL '30 days',
  '#3b82f6'
);
```

### Example 3: Seasonal Promotion

```sql
INSERT INTO therapist_promotions (
  therapist_id,
  title,
  description,
  discount_text,
  start_date,
  end_date,
  badge_color
) VALUES (
  'your-user-id',
  'Spring Renewal Package',
  'Celebrate spring with our wellness package: 3 sessions for the price of 2!',
  'BUY 2 GET 1 FREE',
  '2026-03-20 00:00:00',
  '2026-04-20 23:59:59',
  '#10b981'
);
```

---

## Integration Points

### Data Fetching

The `getTherapistBySlug` function in [app/therapist/[slug]/data.ts](masseurmatch-nextjs/app/therapist/[slug]/data.ts) automatically fetches active promotions:

```typescript
async function fetchActivePromotions(userId: string): Promise<WeeklyPromotion[]> {
  const { data } = await supabaseAdmin
    .from('therapist_promotions')
    .select('id, title, description, discount_text, start_date, end_date, badge_color')
    .eq('therapist_id', userId)
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString())
    .order('display_order', { ascending: true })
    .limit(3);

  return data || [];
}
```

### Display Component

[PublicTherapistProfile.tsx](masseurmatch-nextjs/components/PublicTherapistProfile.tsx) displays promotions at line 291-356.

---

## Row Level Security (RLS)

### Public Access

```sql
CREATE POLICY "Public can view active promotions"
  ON therapist_promotions
  FOR SELECT
  USING (
    is_active = true
    AND start_date <= NOW()
    AND end_date >= NOW()
  );
```

### Therapist Management

Therapists can:
- ✅ View all their own promotions (active and inactive)
- ✅ Create new promotions
- ✅ Update their own promotions
- ✅ Delete their own promotions

---

## Future Enhancements

- [ ] Admin dashboard for creating promotions
- [ ] Promotion templates library
- [ ] A/B testing for promotion copy
- [ ] Automated promotion scheduling (e.g., "every weekend")
- [ ] Click tracking implementation
- [ ] Conversion tracking (promo view → booking)
- [ ] Email notifications when promotion ends
- [ ] Promotion performance analytics

---

## Troubleshooting

### Promotion Not Showing

**Check these in order:**

1. **Is promotion active?**
   ```sql
   SELECT * FROM therapist_promotions
   WHERE therapist_id = 'your-id' AND is_active = true;
   ```

2. **Are dates valid?**
   ```sql
   SELECT *, NOW() as current_time
   FROM therapist_promotions
   WHERE therapist_id = 'your-id';
   ```
   Ensure `start_date <= NOW()` and `end_date >= NOW()`

3. **Is profile published?**
   ```sql
   SELECT status FROM therapists WHERE user_id = 'your-id';
   ```
   Must be `'active'`

4. **Check browser cache**: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

5. **Check ISR revalidation**: Wait up to 1 hour for page to regenerate, or trigger manual revalidation

### Promotion Shows Wrong Data

- **Clear Next.js cache**: `npm run build` or delete `.next` folder
- **Check updated_at**: Ensure promotion was recently modified
- **Verify ISR**: Pages revalidate every 3600 seconds (1 hour)

---

## Analytics Queries

### Most Popular Promotions

```sql
SELECT
  p.title,
  p.discount_text,
  p.view_count,
  p.click_count,
  ROUND(p.click_count::NUMERIC / NULLIF(p.view_count, 0) * 100, 2) as ctr
FROM therapist_promotions p
WHERE p.is_active = true
ORDER BY p.click_count DESC
LIMIT 10;
```

### Active Promotions by Therapist

```sql
SELECT
  t.display_name,
  p.title,
  p.discount_text,
  p.start_date,
  p.end_date,
  EXTRACT(DAY FROM p.end_date - NOW()) as days_remaining
FROM therapist_promotions p
JOIN therapists t ON t.user_id = p.therapist_id
WHERE p.is_active = true
  AND p.start_date <= NOW()
  AND p.end_date >= NOW()
ORDER BY t.display_name, p.display_order;
```

### Promotion Performance by Date Range

```sql
SELECT
  DATE(created_at) as date,
  COUNT(*) as promotions_created,
  SUM(view_count) as total_views,
  SUM(click_count) as total_clicks
FROM therapist_promotions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## Support

For issues or questions:

- **Technical:** support@masseurmatch.com
- **Feature Requests:** Open a GitHub issue

---

**Last Updated:** 2025-12-28
**Author:** Claude Sonnet 4.5
**Version:** 1.0
