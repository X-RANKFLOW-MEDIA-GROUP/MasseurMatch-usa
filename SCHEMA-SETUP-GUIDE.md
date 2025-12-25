# Schema Setup Guide

## Quick Setup (5 minutes)

### Step 1: Access Supabase SQL Editor

Open this URL in your browser:
```
https://app.supabase.com/project/ijsdpozjfjjufjsoexod/sql/new
```

### Step 2: Execute the Schema

Copy the entire contents of ONE of these files and paste into the SQL Editor:

**Option A: Full Schema (Recommended)**
- File: `sql/onboarding_schema.sql`
- Includes: All enums, triggers, functions, RLS

**Option B: Basic Tables Only (Faster)**
- File: `scripts/create-tables.sql`
- Includes: Just the core tables without enums/triggers

### Step 3: Click "Run"

The schema will be applied to your database.

### Step 4: Verify

Run this check script:
```bash
node scripts/setup-database.js
```

You should see:
```
✅ subscriptions
✅ media_assets
✅ profile_rates
✅ profile_hours
```

## Troubleshooting

### Error: "relation already exists"
This is OK! It means the table is already created. Continue with the remaining SQL.

### Error: "column already exists"
Also OK! Skip that statement and continue.

### Error: "permission denied"
Make sure you're using the service role key, not the anon key.

## Manual Table Creation (Alternative)

If you prefer to create tables via code:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Then use supabase.from(...).insert(...)
```

## What Gets Created

### Tables
- `subscriptions` - User subscriptions (Standard/Pro/Elite)
- `media_assets` - Photos and videos
- `profile_rates` - Pricing for services
- `profile_hours` - Operating hours

### Enums (if using full schema)
- `subscription_plan_enum`
- `subscription_status_enum`
- `auto_moderation_enum`
- `admin_status_enum`
- `publication_status_enum`
- `onboarding_stage_enum`
- `media_status_enum`
- `rate_context_enum`

### Triggers (if using full schema)
- `validate_rate_33_rule` - Enforces 33% pricing rule
- `validate_photo_limit` - Enforces photo limits by plan
- `auto_set_cover_photo` - Sets first photo as cover

### Functions (if using full schema)
- `can_submit_for_review()` - Check submission requirements
- `can_publish_profile()` - Check publication requirements

## Next Steps

After schema is applied:

1. ✅ Verify tables exist
2. ✅ Test inserting a subscription
3. ✅ Test inserting a rate
4. ✅ Start building API endpoints

