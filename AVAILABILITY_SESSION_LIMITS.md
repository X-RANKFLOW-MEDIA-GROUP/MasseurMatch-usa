# Availability Session Limits - Tier-Based Usage Control

**Created:** 2025-12-28
**Status:** Complete
**Version:** 1.0

---

## Overview

The Availability Session Limits system controls how long and how often therapists can set their profile status to "available" based on their subscription tier. Each time a therapist clicks to become "available," it starts a **session** with a time limit.

---

## Tier-Based Limits

| Tier | Max Session Duration | Daily Uses | Daily Total Time | Auto-Expiry |
|------|---------------------|------------|------------------|-------------|
| **Free** | 30 minutes | 5 times/day | 2.5 hours max | ✅ Yes |
| **Standard** | 1 hour | 6 times/day | 6 hours max | ✅ Yes |
| **Pro** | 1 hour | Unlimited | Unlimited | ✅ Yes |
| **Elite** | 2 hours | Unlimited | Unlimited | ✅ Yes |

---

## How It Works

### 1. Starting an Availability Session

**User clicks "Set Available" → System checks:**

1. ✅ **No active session already running**
2. ✅ **Daily use limit not exceeded** (Free: 5/day, Standard: 6/day, Pro/Elite: unlimited)
3. ✅ **Valid subscription tier**

**If all checks pass:**
- Creates new session record
- Sets `availability_status` to `'available'`
- Calculates expiry time based on tier
- Profile shows green "Available Now" badge

**If checks fail:**
- Returns error message
- Profile remains offline
- Shows remaining daily uses

### 2. Session Auto-Expiry

**Cron job runs every 5 minutes:**

```sql
SELECT expire_availability_sessions();
```

**For each expired session:**
1. Marks session as `ended_at = NOW()`
2. Sets `availability_status` back to `'offline'`
3. Green badge disappears
4. Profile shows gray "Currently Offline"

### 3. Manual Session End

**User can end session early:**

```sql
SELECT end_availability_session('user-id');
```

**Result:**
- Session marked as ended
- Status returns to offline
- Doesn't count against time limit (only time actually used counts)

---

## Database Schema

### Table: `availability_sessions`

```sql
CREATE TABLE availability_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,              -- NULL while active
  tier_at_start TEXT NOT NULL,       -- Historical tracking
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Points:**
- `ended_at IS NULL` = Active session
- `expires_at > NOW()` = Not expired yet
- `tier_at_start` = Tier when session started (for analytics)

---

## Usage Examples

### Example 1: Free Tier User (5 uses/day, 30 min each)

```sql
-- User on free tier
INSERT INTO subscriptions (user_id, plan, status)
VALUES ('free-user', 'free', 'active');

-- Check if can activate (1st time today)
SELECT * FROM can_activate_availability('free-user');
-- Result: can_activate=true, daily_uses_remaining=4, max_duration_minutes=30

-- Start session
SELECT * FROM start_availability_session('free-user');
-- Result: success=true, expires_at='2026-01-01 10:30:00', message='Session started. Expires in 30 minutes'

-- Profile now shows:
-- - Green badge: "✓ Available Now"
-- - Green border around photo
-- - availability_status = 'available'

-- 30 minutes later... auto-expiry runs
SELECT expire_availability_sessions();
-- Session ends automatically
-- Profile returns to: Gray badge "○ Currently Offline"

-- Try again (2nd use)
SELECT * FROM start_availability_session('free-user');
-- ✅ Success (uses_remaining=3)

-- ... repeat 3 more times ...

-- 6th attempt (exceeds daily limit)
SELECT * FROM start_availability_session('free-user');
-- ❌ ERROR: Daily limit reached (5/5 uses)
```

### Example 2: Standard Tier (6 uses/day, 1 hour each)

```sql
-- User on standard tier
UPDATE subscriptions SET plan = 'standard' WHERE user_id = 'user-id';

-- Start session
SELECT * FROM start_availability_session('user-id');
-- expires_at: 1 hour from now

-- Check limits
SELECT * FROM can_activate_availability('user-id');
-- daily_uses_remaining=5 (if first use today)
-- max_duration_minutes=60

-- User can activate 6 times today, each session lasts 1 hour
-- Total possible "available" time: 6 hours per day
```

### Example 3: Pro Tier (Unlimited uses, 1 hour sessions)

```sql
-- Pro tier user
UPDATE subscriptions SET plan = 'pro' WHERE user_id = 'pro-user';

-- Can activate unlimited times per day
-- Each session lasts 1 hour
-- Can chain sessions all day long if desired

SELECT * FROM start_availability_session('pro-user');
-- Session 1: expires in 1 hour

-- 1 hour later, auto-expires, start again
SELECT * FROM start_availability_session('pro-user');
-- Session 2: expires in 1 hour
-- ✅ No daily limit!

-- Repeat as many times as needed throughout the day
```

### Example 4: Elite Tier (Unlimited uses, 2 hour sessions)

```sql
-- Elite tier user
UPDATE subscriptions SET plan = 'elite' WHERE user_id = 'elite-user';

-- Unlimited daily uses
-- Each session lasts 2 hours
-- Maximum flexibility

SELECT * FROM start_availability_session('elite-user');
-- expires_at: 2 hours from now

-- After 2 hours, can immediately start another 2-hour session
-- No limits on daily usage
```

---

## API Integration Example

### Frontend: Activate Button

```typescript
// components/AvailabilityToggle.tsx
async function handleActivate() {
  const response = await fetch('/api/availability/start', {
    method: 'POST'
  });

  const data = await response.json();

  if (data.success) {
    // Show success message
    alert(`You are now available! Session expires at ${new Date(data.expires_at).toLocaleTimeString()}`);
    // Update UI to show green badge
  } else {
    // Show error
    alert(data.message); // e.g., "Daily limit reached (5/5 uses)"
  }
}
```

### Backend: API Route

```typescript
// app/api/availability/start/route.ts
import { supabaseAdmin } from '@/server/supabaseAdmin';

export async function POST(req: Request) {
  const userId = req.user.id; // From auth middleware

  const { data, error } = await supabaseAdmin
    .rpc('start_availability_session', { p_user_id: userId });

  if (error) {
    return Response.json({ success: false, message: error.message }, { status: 400 });
  }

  const result = data[0];

  if (!result.success) {
    return Response.json({ success: false, message: result.message }, { status: 400 });
  }

  return Response.json({
    success: true,
    session_id: result.session_id,
    expires_at: result.expires_at,
    message: result.message
  });
}
```

### End Session Route

```typescript
// app/api/availability/end/route.ts
export async function POST(req: Request) {
  const userId = req.user.id;

  const { data } = await supabaseAdmin
    .rpc('end_availability_session', {
      p_user_id: userId,
      is_auto: false
    });

  return Response.json({ success: data });
}
```

---

## Protection Mechanisms

### 1. Prevent Manual Status Change

**Trigger blocks direct UPDATE to "available":**

```sql
-- ❌ This will FAIL:
UPDATE profiles SET availability_status = 'available' WHERE user_id = 'user-id';
-- ERROR: Cannot set status to available without an active session

-- ✅ Must use function:
SELECT start_availability_session('user-id');
```

### 2. Daily Limit Enforcement

```sql
-- Function checks daily uses before allowing activation
-- Free tier: Max 5 sessions/day
-- Standard: Max 6 sessions/day
-- Pro/Elite: Unlimited (999999 limit)
```

### 3. Single Active Session

```sql
-- Cannot start new session while one is active
-- Must wait for current session to expire or manually end it
```

---

## Monitoring & Analytics

### Check Current Active Sessions

```sql
SELECT
  p.display_name,
  s.plan as tier,
  asess.started_at,
  asess.expires_at,
  EXTRACT(MINUTE FROM (asess.expires_at - NOW())) as minutes_remaining
FROM availability_sessions asess
JOIN profiles p ON p.user_id = asess.user_id
JOIN subscriptions s ON s.user_id = asess.user_id
WHERE asess.ended_at IS NULL
  AND asess.expires_at > NOW()
  AND s.status IN ('active', 'trialing')
ORDER BY asess.expires_at;
```

### Daily Usage by Tier

```sql
SELECT
  s.plan,
  COUNT(DISTINCT asess.user_id) as active_users,
  COUNT(asess.id) as total_sessions_today,
  ROUND(AVG(sessions_per_user), 2) as avg_sessions_per_user,
  SUM(EXTRACT(EPOCH FROM (COALESCE(asess.ended_at, NOW()) - asess.started_at)) / 60) as total_minutes_used
FROM subscriptions s
LEFT JOIN (
  SELECT
    user_id,
    COUNT(*) OVER (PARTITION BY user_id) as sessions_per_user,
    id,
    started_at,
    ended_at
  FROM availability_sessions
  WHERE started_at >= CURRENT_DATE
) asess ON asess.user_id = s.user_id
WHERE s.status IN ('active', 'trialing')
GROUP BY s.plan
ORDER BY s.plan;
```

### Users Hitting Daily Limits

```sql
SELECT
  p.display_name,
  s.plan,
  COUNT(asess.id) as sessions_today,
  limits.max_daily_uses,
  CASE
    WHEN COUNT(asess.id) >= limits.max_daily_uses THEN 'LIMIT REACHED'
    ELSE 'OK'
  END as status
FROM profiles p
JOIN subscriptions s ON s.user_id = p.user_id
JOIN availability_sessions asess ON asess.user_id = p.user_id
CROSS JOIN LATERAL get_availability_limits(s.plan) limits
WHERE asess.started_at >= CURRENT_DATE
  AND s.status IN ('active', 'trialing')
GROUP BY p.display_name, s.plan, limits.max_daily_uses
HAVING COUNT(asess.id) >= limits.max_daily_uses
ORDER BY sessions_today DESC;
```

---

## Cron Job Setup

### Auto-Expire Sessions (Every 5 Minutes)

```sql
-- Requires pg_cron extension
SELECT cron.schedule(
  'expire-availability-sessions',
  '*/5 * * * *',  -- Every 5 minutes
  'SELECT expire_availability_sessions()'
);
```

**What it does:**
1. Finds all sessions where `expires_at <= NOW()`
2. Sets `ended_at = NOW()`
3. Updates profiles to `'offline'` (unless traveling)
4. Returns count of expired sessions

**Run manually for testing:**
```sql
SELECT expire_availability_sessions();
-- Returns: number of sessions expired
```

---

## User Experience Flow

### Setting Status to Available

```
┌─────────────────────────────────────┐
│  Therapist Dashboard                │
│                                     │
│  Current Status: Offline            │
│                                     │
│  ┌────────────────────────────┐    │
│  │  [Set Available]           │    │
│  └────────────────────────────┘    │
│                                     │
│  Daily Uses: 3 / 5 remaining       │
│  Session Duration: 30 minutes      │
└─────────────────────────────────────┘

After clicking:

┌─────────────────────────────────────┐
│  ✅ You are now Available!          │
│                                     │
│  Session expires at: 2:30 PM        │
│  Time remaining: 30 minutes         │
│                                     │
│  ┌────────────────────────────┐    │
│  │  [End Session Early]       │    │
│  └────────────────────────────┘    │
│                                     │
│  Daily Uses: 2 / 5 remaining       │
└─────────────────────────────────────┘
```

### When Limit Reached

```
┌─────────────────────────────────────┐
│  ❌ Daily Limit Reached              │
│                                     │
│  You've used all 5 available        │
│  sessions today.                    │
│                                     │
│  Upgrade to Standard for 6 uses/day │
│  or Pro/Elite for unlimited usage. │
│                                     │
│  ┌────────────────────────────┐    │
│  │  [Upgrade Plan]            │    │
│  └────────────────────────────┘    │
│                                     │
│  Resets at midnight                │
└─────────────────────────────────────┘
```

---

## Upgrade Scenarios

### Free → Standard

**Before:** 5 uses/day, 30 min each = 2.5 hours max
**After:** 6 uses/day, 1 hour each = 6 hours max

**Immediate benefit:**
- Longer sessions (2x duration)
- More uses (20% more)
- Total daily time: 2.4x increase

### Standard → Pro

**Before:** 6 uses/day, 1 hour each = 6 hours max
**After:** Unlimited uses, 1 hour each = unlimited

**Immediate benefit:**
- No daily limit
- Can be "available" all day (just restart sessions)
- Perfect for full-time therapists

### Pro → Elite

**Before:** Unlimited uses, 1 hour each
**After:** Unlimited uses, 2 hours each

**Immediate benefit:**
- Fewer session interruptions (2x longer)
- Less manual reactivation needed
- Premium experience

---

## Troubleshooting

### Session Won't Start

**Error:** "Daily limit reached (5/5 uses)"

**Solution:**
```sql
-- Check daily usage
SELECT COUNT(*) FROM availability_sessions
WHERE user_id = 'your-id' AND started_at >= CURRENT_DATE;

-- Wait until midnight for reset
-- OR upgrade subscription tier
```

### Session Won't Start - Active Session

**Error:** "Already have an active availability session"

**Solution:**
```sql
-- End current session first
SELECT end_availability_session('your-id');

-- Then start new one
SELECT start_availability_session('your-id');
```

### Session Expired But Status Still "Available"

**Issue:** Cron job may not have run yet

**Solution:**
```sql
-- Manually run expiry function
SELECT expire_availability_sessions();

-- Check cron job schedule
SELECT * FROM cron.job WHERE jobname = 'expire-availability-sessions';
```

---

## Future Enhancements

- [ ] Push notifications when session about to expire (5 min warning)
- [ ] Auto-extend session option (with confirmation)
- [ ] Session pause/resume feature
- [ ] Analytics dashboard showing usage patterns
- [ ] "Boost" feature: buy extra hours/uses for one day
- [ ] Session history timeline view

---

**Last Updated:** 2025-12-28
**Author:** Claude Sonnet 4.5
**Version:** 1.0
