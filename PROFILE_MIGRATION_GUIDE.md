# Comprehensive Profile Migration Guide

This guide explains how to apply the database migration for the new comprehensive therapist profile fields.

## Overview

The comprehensive profile editor now includes **50+ fields** across 11 major sections:

1. **Basic Information** - Full name, display name, professional title, about, philosophy
2. **Location & Service Area** - Address, city, state, zip, radius, service types
3. **Service Offerings & Techniques** - 12 massage techniques, amenities, extras, products
4. **Rates, Payment & Discounts** - Three rate tiers, payment methods, four discount types
5. **Weekly Availability Schedule** - Separate in-studio and mobile hours for each day
6. **Professional Credentials** - Degrees, experience, affiliations, languages
7. **Business Travel Schedule** - Travel dates and locations
8. **Photo Gallery** - Multiple workspace photos
9. **Social Media & Contact** - Website, Instagram, WhatsApp
10. **Client Preferences** - LGBTQ+ only, male clients only

## Migration File

**File:** `supabase_migration_comprehensive_profiles.sql`

## How to Apply Migration

### Option 1: Supabase Dashboard (Recommended)

1. Log into your Supabase project at https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase_migration_comprehensive_profiles.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the migration

### Option 2: Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push supabase_migration_comprehensive_profiles.sql
```

### Option 3: Direct PostgreSQL Connection

```bash
# Connect to your Supabase PostgreSQL database
psql "postgresql://[YOUR_CONNECTION_STRING]"

# Run the migration
\i supabase_migration_comprehensive_profiles.sql
```

## What the Migration Does

### New Columns Added

**Basic Information:**
- `full_name` (TEXT)
- `professional_title` (TEXT)
- `philosophy` (TEXT)

**Location & Service:**
- `street_address` (TEXT)
- `zip_code` (TEXT)
- `service_radius` (INTEGER)
- `in_studio` (BOOLEAN)
- `mobile_service` (BOOLEAN)
- `hotel_visits` (BOOLEAN)

**Services:**
- `massage_techniques` (TEXT[])
- `studio_amenities` (TEXT[])
- `mobile_extras` (TEXT[])
- `product_sales` (TEXT[])

**Pricing:**
- `rate_120` (TEXT) - 120-minute session rate
- `payment_methods` (TEXT[])
- `discount_new_client` (TEXT)
- `discount_multiple_sessions` (TEXT)
- `discount_referrals` (TEXT)
- `discount_group` (TEXT)

**Schedule:**
- `weekly_schedule` (JSONB) - Contains in-studio and mobile hours for all 7 days

**Credentials:**
- `degrees_certifications` (TEXT)
- `years_experience` (INTEGER)
- `professional_affiliations` (TEXT)
- `languages` (TEXT[])

**Travel:**
- `travel_schedule` (TEXT)

**Gallery:**
- `gallery_photos` (TEXT[])

**Social:**
- `website` (TEXT)
- `instagram` (TEXT)
- `whatsapp` (TEXT)

**Preferences:**
- `preference_lgbtq_only` (BOOLEAN)
- `preference_men_only` (BOOLEAN)

### Indexes Created

For optimal query performance:
- `idx_profiles_in_studio` - Quick filtering for in-studio therapists
- `idx_profiles_mobile_service` - Quick filtering for mobile therapists
- `idx_profiles_city_state` - Compound index for location searches
- `idx_profiles_massage_techniques` - GIN index for technique searches
- `idx_profiles_languages` - GIN index for language filtering

## Verification

After running the migration, verify it worked:

```sql
-- Check that new columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('full_name', 'massage_techniques', 'weekly_schedule')
ORDER BY column_name;

-- Check indexes were created
SELECT indexname
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexname LIKE 'idx_profiles_%';
```

## Data Structure Examples

### Weekly Schedule JSONB Structure

```json
{
  "Monday": {
    "studio_start": "9:00 AM",
    "studio_end": "6:00 PM",
    "mobile_start": "7:00 AM",
    "mobile_end": "9:00 PM"
  },
  "Tuesday": {
    "studio_start": "9:00 AM",
    "studio_end": "6:00 PM",
    "mobile_start": "",
    "mobile_end": ""
  }
  // ... remaining days
}
```

### Array Fields Examples

```sql
-- Massage techniques
massage_techniques = ARRAY['Swedish Massage', 'Deep Tissue', 'Sports Massage']

-- Languages
languages = ARRAY['English', 'Spanish', 'French']

-- Payment methods
payment_methods = ARRAY['Cash', 'Credit/Debit Card', 'Venmo', 'Zelle']

-- Gallery photos
gallery_photos = ARRAY['https://...photo1.jpg', 'https://...photo2.jpg']
```

## Rollback (If Needed)

If you need to undo this migration:

```sql
-- WARNING: This will delete data in these columns
ALTER TABLE profiles
DROP COLUMN IF EXISTS full_name,
DROP COLUMN IF EXISTS professional_title,
DROP COLUMN IF EXISTS philosophy,
DROP COLUMN IF EXISTS street_address,
DROP COLUMN IF EXISTS zip_code,
DROP COLUMN IF EXISTS service_radius,
DROP COLUMN IF EXISTS in_studio,
DROP COLUMN IF EXISTS mobile_service,
DROP COLUMN IF EXISTS hotel_visits,
DROP COLUMN IF EXISTS massage_techniques,
DROP COLUMN IF EXISTS studio_amenities,
DROP COLUMN IF EXISTS mobile_extras,
DROP COLUMN IF EXISTS product_sales,
DROP COLUMN IF EXISTS rate_120,
DROP COLUMN IF EXISTS payment_methods,
DROP COLUMN IF EXISTS discount_new_client,
DROP COLUMN IF EXISTS discount_multiple_sessions,
DROP COLUMN IF EXISTS discount_referrals,
DROP COLUMN IF EXISTS discount_group,
DROP COLUMN IF EXISTS weekly_schedule,
DROP COLUMN IF EXISTS degrees_certifications,
DROP COLUMN IF EXISTS years_experience,
DROP COLUMN IF EXISTS professional_affiliations,
DROP COLUMN IF EXISTS languages,
DROP COLUMN IF EXISTS travel_schedule,
DROP COLUMN IF EXISTS gallery_photos,
DROP COLUMN IF EXISTS website,
DROP COLUMN IF EXISTS instagram,
DROP COLUMN IF EXISTS whatsapp,
DROP COLUMN IF EXISTS preference_lgbtq_only,
DROP COLUMN IF EXISTS preference_men_only;

-- Drop indexes
DROP INDEX IF EXISTS idx_profiles_in_studio;
DROP INDEX IF EXISTS idx_profiles_mobile_service;
DROP INDEX IF EXISTS idx_profiles_city_state;
DROP INDEX IF EXISTS idx_profiles_massage_techniques;
DROP INDEX IF EXISTS idx_profiles_languages;
```

## Row-Level Security (RLS)

**Important:** Review and update your RLS policies if needed. The migration does not modify RLS policies, so existing policies will apply to new columns.

Typical policies you may want:

```sql
-- Allow users to read all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Support

If you encounter issues:
1. Check Supabase logs for error messages
2. Verify your database user has ALTER TABLE permissions
3. Ensure the `profiles` table exists before running migration
4. Check for conflicting column names if migration fails

## Notes

- All new fields are **nullable** by default (except booleans which default to `false`)
- Array fields default to empty arrays `'{}'`
- The `weekly_schedule` JSONB field has a default structure with all days
- Indexes are created with `IF NOT EXISTS` to allow re-running the migration safely
- Migration is **idempotent** - safe to run multiple times

## Next Steps

After migration:
1. Test the edit-profile page at `/edit-profile`
2. Verify profile data saves correctly
3. Check that filtering/search works with new fields
4. Update any API endpoints that query profiles to include new fields as needed
