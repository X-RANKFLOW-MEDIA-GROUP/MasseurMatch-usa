# Subscription Business Rules & Automation

**Created:** 2025-12-28
**Status:** Complete
**Version:** 1.0

---

## Overview

This document defines the business rules for promotions, availability status, and travel dates based on subscription tiers. The system automatically enforces these rules through database constraints and triggers.

---

## Subscription Tiers

| Tier | Promotions | Max Duration | Availability Features |
|------|-----------|--------------|----------------------|
| **Free** | 0 active | N/A | Manual status only |
| **Standard** | 1 active | 7 days max | Manual + auto travel status |
| **Pro** | 2 active | 7 days max | Manual + auto travel status |
| **Elite** | 3 active | 7 days max | Manual + auto travel status |

---

## Promotion Rules

### 1. Maximum Duration: 7 Days

**All promotions are limited to 7 days maximum**, regardless of subscription tier.

**Database Constraint:**
```sql
ALTER TABLE therapist_promotions
ADD CONSTRAINT valid_promo_duration
CHECK (end_date <= start_date + INTERVAL '7 days');
```

**Example:**
```sql
-- ✅ VALID: 7 days
INSERT INTO therapist_promotions (therapist_id, title, start_date, end_date)
VALUES ('user-id', 'Week Special', NOW(), NOW() + INTERVAL '7 days');

-- ❌ INVALID: 8 days (will fail)
INSERT INTO therapist_promotions (therapist_id, title, start_date, end_date)
VALUES ('user-id', 'Long Special', NOW(), NOW() + INTERVAL '8 days');
```

### 2. Subscription-Based Limits

**Promotion limits are enforced based on active subscription tier:**

```sql
CREATE FUNCTION check_subscription_promotion_limit()
```

**Logic:**
1. Query user's active subscription from `subscriptions` table
2. Determine max allowed promotions based on tier
3. Count existing active promotions
4. Reject if limit would be exceeded

**Example Scenarios:**

#### Free Tier (0 Promotions)
```sql
-- User on free tier tries to create promotion
INSERT INTO therapist_promotions (therapist_id, title, is_active)
VALUES ('free-user-id', 'Special', true);

-- ❌ ERROR: Subscription tier "free" allows maximum of 0 active promotion(s)
```

#### Standard Tier (1 Promotion)
```sql
-- First promotion: OK
INSERT INTO therapist_promotions (therapist_id, title, is_active)
VALUES ('standard-user-id', 'First Promo', true);  -- ✅ Success

-- Second promotion: REJECTED
INSERT INTO therapist_promotions (therapist_id, title, is_active)
VALUES ('standard-user-id', 'Second Promo', true);  -- ❌ ERROR
```

#### Pro Tier (2 Promotions)
```sql
-- Can have 2 active promotions simultaneously
INSERT INTO therapist_promotions (therapist_id, title, is_active)
VALUES ('pro-user-id', 'Promo 1', true);  -- ✅ Success

INSERT INTO therapist_promotions (therapist_id, title, is_active)
VALUES ('pro-user-id', 'Promo 2', true);  -- ✅ Success

INSERT INTO therapist_promotions (therapist_id, title, is_active)
VALUES ('pro-user-id', 'Promo 3', true);  -- ❌ ERROR: Max 2
```

#### Elite Tier (3 Promotions)
```sql
-- Can have 3 active promotions simultaneously
-- All 3 can overlap in time
```

### 3. Overlapping Promotions

**Promotions can overlap in time** as long as the tier limit isn't exceeded.

**Example (Pro tier - 2 promotions):**
```sql
-- Promo 1: Jan 1-7
INSERT INTO therapist_promotions (therapist_id, title, start_date, end_date)
VALUES ('pro-id', 'New Year', '2026-01-01', '2026-01-07');

-- Promo 2: Jan 5-12 (overlaps with Promo 1)
INSERT INTO therapist_promotions (therapist_id, title, start_date, end_date)
VALUES ('pro-id', 'Mid-Week', '2026-01-05', '2026-01-12');  -- ✅ OK (2 active)
```

---

## Availability Status Rules

### 1. Manual Status Updates

**All tiers can manually update availability_status:**

```sql
UPDATE profiles
SET availability_status = 'available'
WHERE user_id = 'any-tier-user-id';  -- ✅ OK
```

**Valid statuses:**
- `available` - Ready to accept bookings now
- `offline` - Not accepting bookings
- Can manually set `visiting_now` or `visiting_soon` (but auto-updates override)

### 2. Automatic Status from Travel Dates

**When travel dates are set, availability_status is AUTOMATICALLY updated:**

#### Visiting Now (Currently Traveling)
```sql
-- Set travel dates (Jan 10-17)
UPDATE profiles
SET
  travel_city = 'Miami',
  travel_state = 'FL',
  travel_start_date = '2026-01-10',
  travel_end_date = '2026-01-17'
WHERE user_id = 'therapist-id';

-- If TODAY is between Jan 10-17:
-- → availability_status automatically becomes 'visiting_now'

-- Profile will show:
-- Badge: "📍 Visiting Miami, FL"
-- Border: Blue
-- Travel Info Card: "Currently In Miami, FL" + dates
```

#### Visiting Soon (Upcoming Travel)
```sql
-- If TODAY is before Jan 10 (but within 14 days):
-- → availability_status automatically becomes 'visiting_soon'

-- Profile will show:
-- Badge: "🗓️ Visiting Miami, FL Soon"
-- Border: Yellow
-- Travel Info Card: "Visiting Soon: Miami, FL" + dates
```

#### Auto-Cleanup (Past Travel)
```sql
-- Daily cron job runs:
SELECT cleanup_expired_travel_dates();

-- Removes travel dates older than 1 day
-- Resets availability_status to 'offline'
```

### 3. Status Priority

**Automatic travel status OVERRIDES manual status:**

```sql
-- 1. User manually sets status
UPDATE profiles SET availability_status = 'available';

-- 2. User adds travel dates for NOW
UPDATE profiles
SET travel_start_date = NOW(), travel_end_date = NOW() + INTERVAL '7 days';

-- Result: availability_status becomes 'visiting_now' (auto-override)
```

---

## Travel Dates System

### 1. Setting Travel Dates

**All fields must be set together:**

```sql
-- ✅ VALID: All fields provided
UPDATE profiles
SET
  travel_city = 'Los Angeles',
  travel_state = 'CA',
  travel_start_date = '2026-02-15 00:00:00',
  travel_end_date = '2026-02-22 00:00:00'
WHERE user_id = 'therapist-id';

-- ❌ INVALID: Missing end_date (constraint violation)
UPDATE profiles
SET
  travel_city = 'Los Angeles',
  travel_start_date = '2026-02-15'
WHERE user_id = 'therapist-id';
```

### 2. Constraints

```sql
ALTER TABLE profiles
ADD CONSTRAINT valid_travel_dates CHECK (
  (travel_start_date IS NULL AND travel_end_date IS NULL) OR
  (travel_start_date IS NOT NULL AND travel_end_date IS NOT NULL
   AND travel_end_date > travel_start_date)
);
```

### 3. Clearing Travel Dates

**Set all to NULL to clear:**

```sql
UPDATE profiles
SET
  travel_city = NULL,
  travel_state = NULL,
  travel_start_date = NULL,
  travel_end_date = NULL
WHERE user_id = 'therapist-id';

-- Availability status will no longer auto-update from travel
```

---

## Visual Display Rules

### Profile Photo Border Colors

| Status | Color | Hex |
|--------|-------|-----|
| Available | Green | #10b981 |
| Visiting Now | Blue | #3b82f6 |
| Visiting Soon | Yellow | #f59e0b |
| Offline | Gray | #6b7280 |

### Status Badge Display

**Badge text changes based on travel location:**

```typescript
// No travel set:
"Available Now"
"Visiting Now"
"Visiting Soon"
"Currently Offline"

// Travel set (Miami, FL):
"Available Now"
"Visiting Miami, FL"        // Blue badge
"Visiting Miami, FL Soon"   // Yellow badge
"Currently Offline"
```

### Travel Info Card

**Only displays when:**
- `availability_status` is `visiting_now` OR `visiting_soon`
- AND `travel_city` is set
- AND `travel_start_date` and `travel_end_date` are set

**Appearance:**
- Background color matches status color (blue/yellow)
- White text
- Shows location and date range
- Positioned in sidebar below location card

---

## Implementation Examples

### Example 1: Free Tier User Tries Promotion

```sql
-- User on free plan
INSERT INTO subscriptions (user_id, plan, status)
VALUES ('user-1', 'free', 'active');

-- Tries to create promotion
INSERT INTO therapist_promotions (therapist_id, title, is_active)
VALUES ('user-1', 'Special Offer', true);

-- ❌ ERROR: Subscription tier "free" allows maximum of 0 active promotion(s)
```

### Example 2: Pro User with 2 Promotions + Travel

```sql
-- Pro tier subscription
INSERT INTO subscriptions (user_id, plan, status)
VALUES ('user-2', 'pro', 'active');

-- Create 2 promotions (max for Pro)
INSERT INTO therapist_promotions (therapist_id, title, start_date, end_date)
VALUES
  ('user-2', 'Weekend Special', NOW(), NOW() + INTERVAL '3 days'),
  ('user-2', 'New Client Discount', NOW() + INTERVAL '2 days', NOW() + INTERVAL '7 days');

-- Set travel dates
UPDATE profiles
SET
  travel_city = 'New York',
  travel_state = 'NY',
  travel_start_date = NOW(),
  travel_end_date = NOW() + INTERVAL '5 days',
  availability_status = 'available'  -- User tries to set manual status
WHERE user_id = 'user-2';

-- Result:
-- - availability_status automatically becomes 'visiting_now' (overrides manual)
-- - Profile shows blue border
-- - Badge: "📍 Visiting New York, NY"
-- - Travel card displays in sidebar
-- - Both promotions show on profile
```

### Example 3: Standard User Upgrades to Pro

```sql
-- Initially on Standard (1 promotion max)
UPDATE subscriptions
SET plan = 'standard', status = 'active'
WHERE user_id = 'user-3';

-- Has 1 promotion
INSERT INTO therapist_promotions (therapist_id, title)
VALUES ('user-3', 'First Promo');

-- Tries to add 2nd: REJECTED
INSERT INTO therapist_promotions (therapist_id, title)
VALUES ('user-3', 'Second Promo');  -- ❌ ERROR

-- User upgrades to Pro
UPDATE subscriptions
SET plan = 'pro'
WHERE user_id = 'user-3';

-- Now can add 2nd promotion
INSERT INTO therapist_promotions (therapist_id, title)
VALUES ('user-3', 'Second Promo');  -- ✅ Success!
```

---

## Database Triggers Summary

| Trigger | Table | Function | Purpose |
|---------|-------|----------|---------|
| `check_subscription_promotions_limit` | `therapist_promotions` | `check_subscription_promotion_limit()` | Enforces tier-based promotion limits |
| `auto_update_availability_from_travel` | `profiles` | `update_availability_from_travel()` | Auto-sets visiting status from travel dates |
| `update_profiles_status_timestamp` | `profiles` | `update_last_status_update()` | Tracks when status was last changed |
| `update_therapist_promotions_updated_at` | `therapist_promotions` | `update_updated_at_column()` | Tracks promotion modifications |

---

## Maintenance & Monitoring

### Daily Cleanup (Cron Job)

**Run daily at 2 AM:**
```sql
SELECT cron.schedule(
  'cleanup-travel-dates',
  '0 2 * * *',
  'SELECT cleanup_expired_travel_dates()'
);
```

**What it does:**
- Removes travel dates that ended more than 1 day ago
- Resets `availability_status` to `offline` for those profiles

### Monitoring Queries

#### Check Promotion Distribution by Tier
```sql
SELECT
  s.plan,
  COUNT(DISTINCT p.therapist_id) as therapists_with_promos,
  COUNT(p.id) as total_active_promos,
  ROUND(AVG(promo_count), 2) as avg_promos_per_therapist
FROM subscriptions s
LEFT JOIN (
  SELECT therapist_id, COUNT(*) as promo_count
  FROM therapist_promotions
  WHERE is_active = true
  GROUP BY therapist_id
) p ON p.therapist_id = s.user_id
WHERE s.status IN ('active', 'trialing')
GROUP BY s.plan;
```

#### Find Users Over Limit (Shouldn't exist)
```sql
SELECT
  s.user_id,
  s.plan,
  COUNT(p.id) as active_promos,
  CASE s.plan
    WHEN 'free' THEN 0
    WHEN 'standard' THEN 1
    WHEN 'pro' THEN 2
    WHEN 'elite' THEN 3
  END as allowed_promos
FROM subscriptions s
JOIN therapist_promotions p ON p.therapist_id = s.user_id
WHERE p.is_active = true
  AND s.status IN ('active', 'trialing')
GROUP BY s.user_id, s.plan
HAVING COUNT(p.id) > CASE s.plan
  WHEN 'free' THEN 0
  WHEN 'standard' THEN 1
  WHEN 'pro' THEN 2
  WHEN 'elite' THEN 3
END;
```

#### Current Travelers
```sql
SELECT
  display_name,
  city as home_city,
  state as home_state,
  travel_city,
  travel_state,
  travel_start_date,
  travel_end_date,
  availability_status
FROM profiles
WHERE availability_status IN ('visiting_now', 'visiting_soon')
ORDER BY travel_start_date;
```

---

## Troubleshooting

### Promotion Won't Create

**Error:** "Subscription tier X allows maximum of Y active promotion(s)"

**Check:**
1. Current subscription tier
2. Number of existing active promotions
3. Overlapping date ranges

```sql
-- Check tier
SELECT plan, status FROM subscriptions WHERE user_id = 'user-id';

-- Check active promotions
SELECT id, title, start_date, end_date
FROM therapist_promotions
WHERE therapist_id = 'user-id' AND is_active = true;
```

### Availability Status Won't Update

**Check travel dates trigger:**
```sql
SELECT
  availability_status,
  travel_city,
  travel_start_date,
  travel_end_date,
  NOW() as current_time,
  CASE
    WHEN travel_start_date <= NOW() AND travel_end_date >= NOW()
    THEN 'Should be visiting_now'
    WHEN travel_start_date > NOW() AND travel_start_date <= NOW() + INTERVAL '14 days'
    THEN 'Should be visiting_soon'
    ELSE 'No auto-status'
  END as expected_status
FROM profiles
WHERE user_id = 'user-id';
```

### Promotion Duration Too Long

**Error:** "new row for relation violates check constraint valid_promo_duration"

**Fix:**
```sql
-- Reduce duration to 7 days or less
UPDATE therapist_promotions
SET end_date = start_date + INTERVAL '7 days'
WHERE id = 'promo-id';
```

---

## Future Enhancements

- [ ] Email notifications when promotion limit increases (upgrade)
- [ ] Auto-suggest optimal promotion timing based on analytics
- [ ] Travel itinerary feature (multiple cities in sequence)
- [ ] "Notify me when available" for offline therapists
- [ ] Promotion templates library per tier
- [ ] A/B testing for promotion effectiveness

---

**Last Updated:** 2025-12-28
**Author:** Claude Sonnet 4.5
**Version:** 1.0
