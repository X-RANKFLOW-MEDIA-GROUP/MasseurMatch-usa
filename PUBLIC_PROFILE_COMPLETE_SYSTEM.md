# Complete Public Profile System - Implementation Guide

**Created:** 2025-12-28
**Status:** Production Ready
**Version:** 1.0

---

## System Overview

The MasseurMatch public profile system includes three integrated features:

1. **Weekly Promotions** - Time-limited promotional offers
2. **Availability Status** - Real-time availability indicators
3. **Travel Dates** - Automatic status updates when traveling

All features are **subscription-tier aware** and **automatically enforced** through database constraints.

---

## Quick Start

### 1. Apply All Migrations

```bash
cd masseurmatch-nextjs

# Apply in this order:
npx supabase db push ../supabase/migrations/20251228_weekly_promotions.sql
npx supabase db push ../supabase/migrations/20251228_availability_status.sql
npx supabase db push ../supabase/migrations/20251228_travel_dates_and_subscription_rules.sql
```

### 2. Verify Installation

```sql
-- Check tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  AND tablename IN ('therapist_promotions');

-- Check columns added to profiles
SELECT column_name FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('availability_status', 'travel_city', 'travel_start_date');

-- Check triggers
SELECT tgname FROM pg_trigger
WHERE tgname IN (
  'check_subscription_promotions_limit',
  'auto_update_availability_from_travel',
  'update_profiles_status_timestamp'
);
```

### 3. Test with Sample Data

```sql
-- Create test therapist with Elite subscription
INSERT INTO subscriptions (user_id, plan, status)
VALUES ('test-user-id', 'elite', 'active');

-- Add 3 promotions (Elite max)
INSERT INTO therapist_promotions (therapist_id, title, discount_text, start_date, end_date)
VALUES
  ('test-user-id', 'Weekend Special', '20% OFF', NOW(), NOW() + INTERVAL '3 days'),
  ('test-user-id', 'New Client Offer', '$30 OFF', NOW() + INTERVAL '1 day', NOW() + INTERVAL '7 days'),
  ('test-user-id', 'Flash Sale', '15% OFF', NOW() + INTERVAL '4 days', NOW() + INTERVAL '6 days');

-- Set travel dates (visiting now)
UPDATE profiles
SET
  travel_city = 'Miami',
  travel_state = 'FL',
  travel_start_date = NOW(),
  travel_end_date = NOW() + INTERVAL '5 days'
WHERE user_id = 'test-user-id';

-- Check result
SELECT
  display_name,
  availability_status,  -- Should be 'visiting_now'
  travel_city,
  (SELECT COUNT(*) FROM therapist_promotions WHERE therapist_id = 'test-user-id' AND is_active = true) as active_promos
FROM profiles
WHERE user_id = 'test-user-id';
```

---

## Feature Details

### Feature 1: Weekly Promotions

**See:** [WEEKLY_PROMOTIONS.md](WEEKLY_PROMOTIONS.md)

**Key Points:**
- Max duration: **7 days**
- Tier limits: Free=0, Standard=1, Pro=2, Elite=3
- Can overlap in time
- Auto-displays on profile
- Gradient cards with custom colors

**Example:**
```sql
INSERT INTO therapist_promotions (therapist_id, title, description, discount_text, start_date, end_date, badge_color)
VALUES (
  'user-id',
  'New Year Special',
  'Start 2026 relaxed! Get 20% off your first session.',
  '20% OFF',
  NOW(),
  NOW() + INTERVAL '7 days',
  '#ef4444'
);
```

### Feature 2: Availability Status

**See:** [AVAILABILITY_STATUS_SYSTEM.md](AVAILABILITY_STATUS_SYSTEM.md)

**Key Points:**
- 4 states: available, visiting_now, visiting_soon, offline
- Colored borders and badges
- Auto-updates from travel dates
- Manual updates allowed

**States:**
| Status | Color | When to Use |
|--------|-------|-------------|
| `available` | Green | Ready for same-day bookings |
| `visiting_now` | Blue | Currently in another city |
| `visiting_soon` | Yellow | Traveling within 14 days |
| `offline` | Gray | Not accepting bookings |

**Example:**
```sql
UPDATE profiles
SET availability_status = 'available'
WHERE user_id = 'user-id';
```

### Feature 3: Travel Dates & Auto-Status

**See:** [SUBSCRIPTION_BUSINESS_RULES.md](SUBSCRIPTION_BUSINESS_RULES.md)

**Key Points:**
- Set travel location and dates
- **Automatically** updates availability_status
- Auto-cleanup of expired travel
- Displays travel info card on profile

**Example:**
```sql
UPDATE profiles
SET
  travel_city = 'Los Angeles',
  travel_state = 'CA',
  travel_start_date = '2026-03-15 00:00:00',
  travel_end_date = '2026-03-22 00:00:00'
WHERE user_id = 'user-id';

-- If March 15-22 is NOW: status becomes 'visiting_now'
-- If March 15 is in next 14 days: status becomes 'visiting_soon'
```

---

## Subscription Tier Rules

| Tier | Active Promotions | Promo Duration | Features |
|------|------------------|----------------|----------|
| **Free** | 0 | N/A | Manual status, no promotions |
| **Standard** | 1 | 7 days max | 1 promo, auto travel status |
| **Pro** | 2 | 7 days max | 2 promos, auto travel status |
| **Elite** | 3 | 7 days max | 3 promos, auto travel status |

**Automatically enforced** - database will reject violations.

---

## Visual Design

### Profile Layout

```
┌────────────────────────────────────────────────┐
│  SIDEBAR (Sticky)           │  CONTENT         │
│  ┌──────────────────┐       │                  │
│  │ ✓ Available Now  │       │  [Name]          │
│  │   (Green badge)  │       │  [Headline]      │
│  └──────────────────┘       │                  │
│                              │  ┌─────────────┐ │
│  ┌──────────────────┐       │  │ 20% OFF     │ │
│  │                  │       │  │ New Year    │ │
│  │  Profile Photo   │       │  │ Special     │ │
│  │  (Green border)  │       │  └─────────────┘ │
│  │                  │       │                  │
│  └──────────────────┘       │  [Bio text]      │
│                              │  [Services]      │
│  ⭐⭐⭐⭐⭐ 4.9/5           │  [Pricing]       │
│  Based on 47 reviews        │  [Hours]         │
│                              │  [Map]           │
│  ┌──────────────────┐       │  [FAQ]           │
│  │ Years: 15.9      │       │                  │
│  │ Views: 166k      │       │                  │
│  │ Impress: 3.8M    │       │                  │
│  │ Clicks: 89       │       │                  │
│  └──────────────────┘       │                  │
│                              │                  │
│  📍 New York, NY            │                  │
│  🗣️ English, Spanish       │                  │
│                              │                  │
│  [Book a Session]           │                  │
│  [View Pricing]             │                  │
└────────────────────────────────────────────────┘
```

### When Visiting

```
┌────────────────────────────────────────────────┐
│  SIDEBAR                    │  CONTENT         │
│  ┌──────────────────┐       │                  │
│  │📍Visiting Miami,FL│       │  ┌─────────────┐ │
│  │   (Blue badge)   │       │  │ $30 OFF     │ │
│  └──────────────────┘       │  │ Welcome to  │ │
│                              │  │ Miami!      │ │
│  ┌──────────────────┐       │  └─────────────┘ │
│  │ Profile Photo    │       │                  │
│  │ (BLUE BORDER)    │       │  [Content...]    │
│  └──────────────────┘       │                  │
│                              │                  │
│  ⭐⭐⭐⭐⭐ 4.9/5           │                  │
│  [Stats grid]               │                  │
│                              │                  │
│  📍 New York, NY (Home)     │                  │
│                              │                  │
│  ┌──────────────────┐       │                  │
│  │ Currently In     │       │                  │
│  │ Miami, FL        │       │                  │
│  │ Mar 15 - Mar 22  │       │                  │
│  └──────────────────┘       │                  │
│  (Blue card)                │                  │
└────────────────────────────────────────────────┘
```

---

## Common Use Cases

### Use Case 1: Free User Upgrades to Standard

```sql
-- Before: Free tier (no promotions)
SELECT plan FROM subscriptions WHERE user_id = 'user-1';
-- Result: 'free'

-- Try to create promotion: REJECTED
INSERT INTO therapist_promotions (therapist_id, title)
VALUES ('user-1', 'Special');
-- ERROR: Subscription tier "free" allows maximum of 0 active promotion(s)

-- User upgrades to Standard
UPDATE subscriptions SET plan = 'standard' WHERE user_id = 'user-1';

-- Now can create 1 promotion
INSERT INTO therapist_promotions (therapist_id, title, discount_text, start_date, end_date)
VALUES ('user-1', 'New Client Special', '25% OFF', NOW(), NOW() + INTERVAL '7 days');
-- ✅ Success!

-- Try to create 2nd: Still rejected
INSERT INTO therapist_promotions (therapist_id, title)
VALUES ('user-1', 'Second Promo');
-- ERROR: Maximum of 1 active promotion(s)
```

### Use Case 2: Therapist Announces Travel

```sql
-- Step 1: Therapist planning trip to Miami in 10 days
UPDATE profiles
SET
  travel_city = 'Miami',
  travel_state = 'FL',
  travel_start_date = NOW() + INTERVAL '10 days',
  travel_end_date = NOW() + INTERVAL '17 days'
WHERE user_id = 'therapist-id';

-- Result: availability_status automatically becomes 'visiting_soon'
-- Profile shows yellow badge: "🗓️ Visiting Miami, FL Soon"

-- Step 2: 10 days later (travel starts)
-- Automatic: availability_status becomes 'visiting_now'
-- Profile shows blue badge: "📍 Visiting Miami, FL"
-- Travel info card displays dates

-- Step 3: Travel ends (18 days later)
-- Daily cron job runs cleanup_expired_travel_dates()
-- Clears travel fields, resets status to 'offline'
```

### Use Case 3: Elite User with Multiple Promotions + Travel

```sql
-- Elite user can have 3 promotions
INSERT INTO therapist_promotions (therapist_id, title, discount_text, start_date, end_date, badge_color)
VALUES
  ('elite-id', 'Weekend Warrior', '20% OFF', NOW(), NOW() + INTERVAL '3 days', '#ef4444'),
  ('elite-id', 'Midweek Relaxation', '$40 OFF', NOW() + INTERVAL '2 days', NOW() + INTERVAL '5 days', '#f97316'),
  ('elite-id', 'New Client Welcome', '25% OFF', NOW() + INTERVAL '4 days', NOW() + INTERVAL '7 days', '#3b82f6');

-- Set current travel
UPDATE profiles
SET
  travel_city = 'Austin',
  travel_state = 'TX',
  travel_start_date = NOW(),
  travel_end_date = NOW() + INTERVAL '6 days'
WHERE user_id = 'elite-id';

-- Profile will show:
-- - Blue border and badge: "Visiting Austin, TX"
-- - Travel info card in sidebar
-- - ALL 3 promotions displayed prominently
-- - Overlapping promotions create urgency
```

---

## API Integration (Future)

### Example API Endpoint Structure

```typescript
// POST /api/profile/travel
export async function POST(req: Request) {
  const { city, state, start_date, end_date } = await req.json();
  const userId = req.user.id;

  const { error } = await supabase
    .from('profiles')
    .update({
      travel_city: city,
      travel_state: state,
      travel_start_date: start_date,
      travel_end_date: end_date
    })
    .eq('user_id', userId);

  // Trigger automatically updates availability_status

  return Response.json({ success: !error });
}

// POST /api/promotions
export async function POST(req: Request) {
  const { title, description, discount_text, duration_days } = await req.json();
  const userId = req.user.id;

  // Check will be enforced by database trigger
  const { error } = await supabase
    .from('therapist_promotions')
    .insert({
      therapist_id: userId,
      title,
      description,
      discount_text,
      start_date: new Date(),
      end_date: new Date(Date.now() + duration_days * 24 * 60 * 60 * 1000)
    });

  if (error) {
    // Will contain subscription tier limit error if exceeded
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ success: true });
}
```

---

## Maintenance

### Daily Tasks (Automated)

```sql
-- Set up cron job (run once)
SELECT cron.schedule(
  'cleanup-travel-dates',
  '0 2 * * *',  -- 2 AM daily
  'SELECT cleanup_expired_travel_dates()'
);
```

### Weekly Monitoring

```sql
-- Check promotion usage by tier
SELECT
  s.plan,
  COUNT(DISTINCT p.therapist_id) as users_with_promos,
  AVG(promo_count) as avg_promos_per_user
FROM subscriptions s
LEFT JOIN (
  SELECT therapist_id, COUNT(*) as promo_count
  FROM therapist_promotions
  WHERE is_active = true
  GROUP BY therapist_id
) p ON p.therapist_id = s.user_id
WHERE s.status IN ('active', 'trialing')
GROUP BY s.plan;

-- Check current travelers
SELECT
  display_name,
  travel_city,
  travel_state,
  travel_start_date,
  travel_end_date,
  availability_status
FROM profiles
WHERE availability_status IN ('visiting_now', 'visiting_soon');
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| **PUBLIC_PROFILE_COMPLETE_SYSTEM.md** (this file) | Complete overview and quick start |
| [WEEKLY_PROMOTIONS.md](WEEKLY_PROMOTIONS.md) | Detailed promotions system docs |
| [AVAILABILITY_STATUS_SYSTEM.md](AVAILABILITY_STATUS_SYSTEM.md) | Availability status and visual design |
| [SUBSCRIPTION_BUSINESS_RULES.md](SUBSCRIPTION_BUSINESS_RULES.md) | Business rules and tier enforcement |

---

## Support & Troubleshooting

### Common Issues

#### Promotion Won't Create
- Check subscription tier limits
- Verify promotion duration ≤ 7 days
- Check for overlapping active promotions

#### Status Not Updating
- Verify travel dates are set correctly
- Check trigger is active: `SELECT * FROM pg_trigger WHERE tgname = 'auto_update_availability_from_travel'`
- Ensure dates are in correct format

#### Travel Card Not Showing
- Must have `availability_status` = 'visiting_now' or 'visiting_soon'
- Must have `travel_city` set
- Must have both `travel_start_date` and `travel_end_date`

### Getting Help

- **Technical Issues:** support@masseurmatch.com
- **Business Rules:** See [SUBSCRIPTION_BUSINESS_RULES.md](SUBSCRIPTION_BUSINESS_RULES.md)
- **Feature Requests:** Open GitHub issue

---

## Version History

- **v1.0 (2025-12-28):** Initial release
  - Weekly promotions with 7-day max
  - Availability status with 4 states
  - Travel dates with auto-status
  - Subscription tier enforcement
  - Complete visual integration

---

**Last Updated:** 2025-12-28
**Author:** Claude Sonnet 4.5
**Production Ready:** ✅ Yes
