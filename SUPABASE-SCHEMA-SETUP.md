# Supabase Schema Setup Guide

## Quick Setup (10 minutes)

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Schema

1. Open the file: `sql/onboarding_schema_supabase.sql`
2. Copy the **entire contents** of the file
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press `Ctrl+Enter`)

### Step 3: Verify Tables Were Created

Run this verification query:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles',
    'subscriptions',
    'media_assets',
    'profile_rates',
    'profile_hours'
  )
ORDER BY table_name;
```

You should see:
```
✅ media_assets
✅ profile_hours
✅ profile_rates
✅ profiles
✅ subscriptions
```

### Step 4: Verify Enums Were Created

```sql
SELECT typname
FROM pg_type
WHERE typtype = 'e'
  AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY typname;
```

You should see:
```
✅ admin_status_enum
✅ auto_moderation_enum
✅ identity_status_enum
✅ media_status_enum
✅ media_type_enum
✅ onboarding_stage_enum
✅ publication_status_enum
✅ rate_context_enum
✅ subscription_plan_enum
✅ subscription_status_enum
✅ user_role_enum
```

### Step 5: Create a Test Profile

After a user signs up with Supabase Auth, create their profile:

```sql
-- Replace YOUR_USER_ID with actual auth.users id
INSERT INTO public.profiles (id, user_id, display_name)
VALUES (
  'YOUR_USER_ID',
  'YOUR_USER_ID',
  'Test User'
);
```

### Step 6: Verify Triggers Work

Test the 33% rate rule:

```sql
-- Insert a base rate
INSERT INTO public.profile_rates (profile_id, context, duration_minutes, price_cents)
VALUES ('YOUR_PROFILE_ID', 'incall', 60, 15000); -- $150 for 60min = $2.50/min

-- This should succeed (within 33%)
INSERT INTO public.profile_rates (profile_id, context, duration_minutes, price_cents)
VALUES ('YOUR_PROFILE_ID', 'incall', 90, 29925); -- $299.25 for 90min = $3.325/min (133%)

-- This should FAIL (exceeds 33%)
INSERT INTO public.profile_rates (profile_id, context, duration_minutes, price_cents)
VALUES ('YOUR_PROFILE_ID', 'incall', 120, 50000); -- $500 for 120min = $4.17/min (166%)
```

### Step 7: Verify publication gating

The schema now requires paid profiles to keep an active/trialing subscription before `can_publish_profile` can return `TRUE`. Use real profile UUIDs to confirm each scenario:

```sql
SELECT can_publish_profile('<profile_with_active_or_trialing_subscription>');    -- should return true
SELECT can_publish_profile('<profile_with_canceled_plan>');                       -- should return false
SELECT can_publish_profile('<free_profile_without_subscription_history>');        -- should return true
```

If the second query still returns `true`, ensure the profile either reactivates their plan or is moved back into admin review before publishing.

## What Gets Created

### Tables (5)
- `profiles` - User profiles with onboarding states
- `subscriptions` - Stripe subscriptions
- `media_assets` - Photos and videos
- `profile_rates` - Pricing for services
- `profile_hours` - Operating hours

### Enums (11)
- `identity_status_enum` - pending, verified, failed
- `subscription_plan_enum` - standard, pro, elite
- `subscription_status_enum` - trialing, active, past_due, canceled, incomplete
- `auto_moderation_enum` - draft, auto_passed, auto_flagged, auto_blocked
- `admin_status_enum` - pending_admin, approved, rejected, changes_requested
- `publication_status_enum` - private, public
- `onboarding_stage_enum` - 11 stages (start → live)
- `media_status_enum` - pending, approved, flagged, rejected
- `media_type_enum` - photo, video
- `rate_context_enum` - incall, outcall, event
- `user_role_enum` - user, admin

### Triggers (8)
- `update_*_updated_at` - Auto-update timestamps (5 triggers)
- `trigger_validate_rate_33_rule` - Enforce 33% pricing rule
- `trigger_validate_photo_limit` - Enforce photo limits by plan
- `trigger_auto_set_cover_photo` - Auto-set first photo as cover

### Functions (2)
- `can_submit_for_review(profile_uuid)` - Check submission requirements
- `can_publish_profile(profile_uuid)` - Check publication requirements

### Row Level Security (RLS)
- ✅ Enabled on all tables
- Users can only read/write their own data
- Public can read published profiles
- Service role bypasses RLS (for API operations)

## Key Differences from Original Schema

### ✅ Fixed for Supabase
1. **Uses `auth.users`** instead of `public.users`
2. **Profile extensions** in `public.profiles` table
3. **RLS policies** properly configured with `auth.uid()`
4. **No ALTER TABLE on auth.users** (read-only, managed by Supabase)

### ✅ Additional Features
- `incomplete` status added to subscriptions (for Stripe incomplete payments)
- `flagged` status added to media (for manual review)
- `event` context added to rates (third service type)
- Proper foreign key constraints to `auth.users(id)`

## Troubleshooting

### Error: "type X already exists"
This is OK! It means the enum is already created. The script uses `CREATE TYPE IF NOT EXISTS`.

### Error: "table X already exists"
This is OK! It means the table is already created. The script uses `CREATE TABLE IF NOT EXISTS`.

### Error: "relation auth.users does not exist"
Make sure you're running this in your Supabase project, not a local PostgreSQL instance. Supabase automatically creates the `auth` schema.

### Error: "permission denied"
Make sure you're logged into your Supabase project dashboard and running the SQL in the SQL Editor (which uses the service role).

## Next Steps

After schema is applied:

1. ✅ Configure environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_STANDARD=price_...
   STRIPE_PRICE_PRO=price_...
   STRIPE_PRICE_ELITE=price_...

   SIGHTENGINE_API_USER=...
   SIGHTENGINE_API_SECRET=...
   ```

2. ✅ Create Stripe products/prices in Stripe Dashboard

3. ✅ Configure Supabase Storage bucket: `profile-photos`

4. ✅ Test API endpoints with Postman or curl

5. ✅ Build frontend components

## Storage Bucket Setup

Create the `profile-photos` bucket in Supabase:

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name: `profile-photos`
4. Public bucket: **Yes** (photos need to be publicly accessible)
5. Click **Create bucket**

Then set the bucket policy to allow authenticated uploads:

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Allow users to read their own photos
CREATE POLICY "Users can read own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Allow public to read approved photos from published profiles
CREATE POLICY "Public can read published photos"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'profile-photos'
);
```

## Complete! 🎉

Your database is now ready for the onboarding system.

All API endpoints will work with this schema:
- ✅ `/api/onboarding/rates`
- ✅ `/api/onboarding/hours`
- ✅ `/api/onboarding/photos`
- ✅ `/api/stripe/*`
