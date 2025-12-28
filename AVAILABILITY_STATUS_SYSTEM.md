# Availability Status System

**Created:** 2025-12-28
**Status:** Complete
**Version:** 1.0

---

## Overview

The Availability Status System allows therapists to display their current availability status on their public profiles. The status is visually represented through a colored badge and border around the profile photo, making it immediately clear to potential clients when a therapist is available.

---

## Features

- **Real-Time Status Display**: Four availability states with distinct visual styles
- **Dynamic Colored Borders**: Profile photo border changes color based on status
- **Status Badge**: Prominent badge showing current availability
- **Automatic Timestamp**: Tracks when status was last updated
- **Visual Indicators**: Icons and colors for quick recognition

---

## Availability States

| Status | Label | Color | Icon | Use Case |
|--------|-------|-------|------|----------|
| `available` | Available Now | Green (#10b981) | ✓ | Ready to accept bookings immediately |
| `visiting_now` | Visiting Now | Blue (#3b82f6) | 📍 | Currently traveling/visiting a location |
| `visiting_soon` | Visiting Soon | Yellow (#f59e0b) | 🗓️ | Upcoming travel plans announced |
| `offline` | Currently Offline | Gray (#6b7280) | ○ | Not currently accepting bookings |

---

## Visual Design

### Status Badge
- **Position**: Top of profile sidebar, above profile photo
- **Style**: Pill-shaped badge with icon and label
- **Shadow**: Colored shadow matching the status color
- **Animation**: Smooth transitions when status changes

### Profile Photo Border
- **Border Width**: 4px
- **Border Color**: Matches current status color
- **Shadow**: Colored shadow (20px blur, 50px spread)
- **Transition**: 0.3s ease for smooth color changes

---

## Database Schema

### Column: `availability_status`

Added to `public.profiles` table:

```sql
ALTER TABLE public.profiles
ADD COLUMN availability_status TEXT DEFAULT 'offline'
CHECK (availability_status IN ('available', 'visiting_now', 'visiting_soon', 'offline'));
```

### Column: `last_status_update`

Tracks when the status was last changed:

```sql
ALTER TABLE public.profiles
ADD COLUMN last_status_update TIMESTAMPTZ DEFAULT NOW();
```

### Automatic Timestamp Updates

Trigger automatically updates `last_status_update` when status changes:

```sql
CREATE OR REPLACE FUNCTION update_last_status_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.availability_status IS DISTINCT FROM NEW.availability_status THEN
    NEW.last_status_update = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_status_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_last_status_update();
```

---

## Implementation

### 1. Apply Database Migration

```bash
cd masseurmatch-nextjs
npx supabase db push ../supabase/migrations/20251228_availability_status.sql
```

### 2. Type Definitions

[app/therapist/[slug]/data.ts](masseurmatch-nextjs/app/therapist/[slug]/data.ts):

```typescript
export type AvailabilityStatus = 'available' | 'visiting_now' | 'visiting_soon' | 'offline';

export type TherapistRecord = {
  // ... other fields
  availability_status?: AvailabilityStatus | null;
  last_status_update?: string | null;
};
```

### 3. Profile Display

[PublicTherapistProfile.tsx](masseurmatch-nextjs/components/PublicTherapistProfile.tsx) automatically displays the availability status with:

- Colored badge showing current status
- Profile photo border matching status color
- Icon indicator for quick recognition
- Shadow effects for visual emphasis

---

## Usage

### Update Therapist Status

```sql
-- Set therapist as available
UPDATE public.profiles
SET availability_status = 'available'
WHERE user_id = 'therapist-user-id';

-- Set therapist as visiting now
UPDATE public.profiles
SET availability_status = 'visiting_now'
WHERE user_id = 'therapist-user-id';

-- Set therapist as visiting soon
UPDATE public.profiles
SET availability_status = 'visiting_soon'
WHERE user_id = 'therapist-user-id';

-- Set therapist as offline
UPDATE public.profiles
SET availability_status = 'offline'
WHERE user_id = 'therapist-user-id';
```

### Query Available Therapists

```sql
-- Find all currently available therapists
SELECT display_name, city, state, slug
FROM public.profiles
WHERE availability_status = 'available'
  AND publication_status = 'public'
ORDER BY last_status_update DESC;

-- Find therapists visiting a specific city soon
SELECT display_name, city, state, slug, last_status_update
FROM public.profiles
WHERE availability_status = 'visiting_soon'
  AND city = 'New York'
ORDER BY last_status_update DESC;
```

---

## Integration with Promotions

The availability status system integrates with the weekly promotions system. You can create promotions that prioritize available therapists:

```sql
-- Create a promotion that boosts available therapists
INSERT INTO therapist_promotions (
  therapist_id,
  title,
  description,
  discount_text,
  priority_for_available,
  start_date,
  end_date
) VALUES (
  'therapist-id',
  'Book Me Now - Available Today!',
  'I''m available for same-day bookings. Book now and save 15%!',
  '15% OFF',
  true,
  NOW(),
  NOW() + INTERVAL '1 day'
);
```

---

## API Endpoint (Future Enhancement)

For therapists to update their own status, create an API endpoint:

```typescript
// pages/api/profile/status.ts
import { supabaseAdmin } from '@/server/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { status } = req.body;
  const userId = req.user?.id; // From auth middleware

  const validStatuses = ['available', 'visiting_now', 'visiting_soon', 'offline'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ availability_status: status })
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    status,
    updated_at: new Date().toISOString()
  });
}
```

---

## Visual Examples

### Available (Green)
```
┌─────────────────────────────┐
│  ✓ Available Now            │  ← Green badge
├─────────────────────────────┤
│ ╔═══════════════════════╗   │
│ ║                       ║   │  ← Green border (4px)
│ ║   Profile Photo       ║   │
│ ║                       ║   │
│ ╚═══════════════════════╝   │
└─────────────────────────────┘
```

### Visiting Now (Blue)
```
┌─────────────────────────────┐
│  📍 Visiting Now            │  ← Blue badge
├─────────────────────────────┤
│ ╔═══════════════════════╗   │
│ ║                       ║   │  ← Blue border (4px)
│ ║   Profile Photo       ║   │
│ ║                       ║   │
│ ╚═══════════════════════╝   │
└─────────────────────────────┘
```

### Visiting Soon (Yellow)
```
┌─────────────────────────────┐
│  🗓️ Visiting Soon           │  ← Yellow badge
├─────────────────────────────┤
│ ╔═══════════════════════╗   │
│ ║                       ║   │  ← Yellow border (4px)
│ ║   Profile Photo       ║   │
│ ║                       ║   │
│ ╚═══════════════════════╝   │
└─────────────────────────────┘
```

### Offline (Gray)
```
┌─────────────────────────────┐
│  ○ Currently Offline        │  ← Gray badge
├─────────────────────────────┤
│ ╔═══════════════════════╗   │
│ ║                       ║   │  ← Gray border (4px)
│ ║   Profile Photo       ║   │
│ ║                       ║   │
│ ╚═══════════════════════╝   │
└─────────────────────────────┘
```

---

## Analytics & Insights

### Status Change Frequency

```sql
-- Track how often therapists update their status
SELECT
  user_id,
  display_name,
  COUNT(*) as status_changes,
  MAX(last_status_update) as last_change
FROM profiles
WHERE last_status_update >= NOW() - INTERVAL '30 days'
GROUP BY user_id, display_name
ORDER BY status_changes DESC;
```

### Availability Distribution

```sql
-- See how many therapists are in each status
SELECT
  availability_status,
  COUNT(*) as therapist_count,
  ROUND(COUNT(*)::NUMERIC / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM profiles
WHERE publication_status = 'public'
GROUP BY availability_status
ORDER BY therapist_count DESC;
```

### Most Active Travelers

```sql
-- Find therapists who frequently update to "visiting" status
SELECT
  display_name,
  city as home_city,
  state,
  COUNT(*) as visiting_updates
FROM profiles
WHERE availability_status IN ('visiting_now', 'visiting_soon')
  AND last_status_update >= NOW() - INTERVAL '90 days'
GROUP BY display_name, city, state
ORDER BY visiting_updates DESC
LIMIT 20;
```

---

## Best Practices

### For Therapists

1. **Keep Status Current**: Update status at least once per day
2. **"Available Now" = Same Day**: Only use when accepting bookings for today
3. **"Visiting Soon" → "Visiting Now"**: Update when you arrive at destination
4. **Return to Offline**: Change to offline when taking a break or going to sleep

### For Platform

1. **Auto-Offline**: Consider auto-setting to offline after 24 hours of inactivity
2. **Status Notifications**: Send reminders to update status
3. **Status Analytics**: Track conversion rates by status (available vs offline)
4. **Promote Available**: Boost "available" therapists in search results

---

## Future Enhancements

- [ ] Mobile app toggle for quick status updates
- [ ] Scheduled status changes (e.g., "auto-available" at 9am)
- [ ] Status history log for analytics
- [ ] Push notifications when therapist becomes available
- [ ] "Notify me when available" feature for clients
- [ ] Geolocation-based "visiting now" auto-detection
- [ ] Calendar integration for automatic status updates

---

## Troubleshooting

### Status Not Updating

1. **Check database connection**:
   ```sql
   SELECT availability_status, last_status_update
   FROM profiles
   WHERE user_id = 'your-id';
   ```

2. **Verify trigger is active**:
   ```sql
   SELECT tgname, tgenabled
   FROM pg_trigger
   WHERE tgname = 'update_profiles_status_timestamp';
   ```

3. **Clear cache**: ISR pages revalidate every hour; wait or trigger manual revalidation

### Border Not Showing

- Ensure `availability_status` is not null
- Check that component is receiving the field from database
- Verify inline styles are not being overridden

---

## Support

For issues or questions:

- **Technical:** support@masseurmatch.com
- **Feature Requests:** Open a GitHub issue

---

**Last Updated:** 2025-12-28
**Author:** Claude Sonnet 4.5
**Version:** 1.0
