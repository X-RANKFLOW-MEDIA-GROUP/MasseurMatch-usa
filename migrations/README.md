# Database Migrations

This directory contains SQL migration scripts for the MasseurMatch database.

## How to Run Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of the migration file
5. Click **Run** to execute

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

### Option 3: Using psql (Direct Database Access)

If you have direct database access:

```bash
psql postgresql://[user]:[password]@[host]:[port]/[database] < migrations/001_add_rating_and_availability_columns.sql
```

## Available Migrations

### 001_add_rating_and_availability_columns.sql

**Purpose**: Adds rating and availability columns to the therapists table

**Adds the following columns**:
- `rating` - Average rating (0.00 to 5.00)
- `rating_count` - Total number of ratings
- `is_highest_rated` - Auto-flag for top 10% therapists
- `has_highest_review` - Auto-flag when rating_count > 100
- `is_featured` - Featured therapist flag
- `is_available` - Current availability status
- `incall_available` - Accepts clients at therapist location
- `outcall_available` - Travels to client location
- `starting_price_usd` - Starting price for display
- `rate_60_usd`, `rate_90_usd`, `rate_120_usd` - Session pricing

**Adds automatic triggers**:
- Auto-updates `has_highest_review` when `rating_count` changes
- Auto-updates `is_featured` based on rating criteria
- Function to calculate and update `is_highest_rated` for top 10%

**Performance indexes**:
- Index on `rating` for approved therapists
- Index on `is_featured` for approved therapists
- Index on `is_available` for approved therapists

## Migration Best Practices

1. **Always backup your database** before running migrations
2. **Test in staging** environment first
3. **Review the SQL** before executing
4. **Check for existing columns** - Some migrations use `IF NOT EXISTS` to prevent errors
5. **Monitor performance** after adding indexes on large tables

## Rollback

Each migration file includes rollback instructions at the bottom. To rollback a migration:

1. Find the rollback section in the migration file
2. Copy the rollback SQL commands
3. Execute them in your SQL editor

## Checking Migration Status

To verify if a migration has been applied:

```sql
-- Check if columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'therapists'
  AND column_name IN ('rating', 'rating_count', 'is_available');

-- Check if triggers exist
SELECT trigger_name
FROM information_schema.triggers
WHERE event_object_table = 'therapists';

-- Check if functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_type = 'FUNCTION'
  AND routine_schema = 'public'
  AND routine_name LIKE '%therapist%';
```

## After Running Migrations

1. Update your TypeScript types to match new columns
2. Update application code to use new columns instead of mock data
3. Test the application thoroughly
4. Monitor database performance

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
