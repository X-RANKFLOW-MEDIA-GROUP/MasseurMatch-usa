# Schema Consistency Report

**Date:** 2025-12-25
**Project:** MasseurMatch USA
**Status:** Issues Identified + Fixes Created

---

## Executive Summary

Analysis of the database schema revealed **13 user-id-like columns** across `public` and `storage` schemas, with several critical inconsistencies:

1. ✅ **Duplicate `stripe_customer_id`** in both `users` and `profiles` tables
2. ✅ **Missing NOT NULL constraint** on `profiles.user_id`
3. ✅ **9 duplicate storage RLS policies** for the `profiles` bucket
4. ⚠️ **Storage schema type mismatch** - `owner_id` is `text` instead of `uuid` (Supabase limitation)

All issues except #4 have been addressed with migration files.

---

## Detailed Findings

### 1. Public Schema - User ID Columns (Expected)

| Table | Column | Type | References | Notes |
|-------|--------|------|------------|-------|
| `public.profiles` | `user_id` | `uuid` | `auth.users(id)` | ✅ Primary FK to auth |
| `public.therapists` | `user_id` | `uuid` | `auth.users(id)` | ✅ Correct FK |
| `public.subscriptions` | `user_id` | `uuid` | `auth.users(id)` | ✅ Correct FK |
| `public.users_preferences` | `user_id` | `uuid` | - | ✅ Correct type |
| `public.explore_swipe_events` | `user_id` | `uuid` | - | ✅ Correct type |

**Status:** All `public.*` tables correctly use `uuid` type for user references.

---

### 2. Storage Schema - Owner Columns (Problematic)

| Table | Column | Type | Notes |
|-------|--------|------|-------|
| `storage.buckets` | `owner` | `uuid` | ⚠️ Deprecated |
| `storage.buckets` | `owner_id` | `text` | ⚠️ Current field |
| `storage.objects` | `owner` | `uuid` | ⚠️ Deprecated |
| `storage.objects` | `owner_id` | `text` | ⚠️ Current field |

**Issue:** Supabase storage schema uses `text` for `owner_id` instead of `uuid`, causing type mismatch in joins with `auth.users(id)`.

**Workaround:** Use RLS policies with `auth.uid()::text` for path-based authentication instead of direct joins.

**Example:**
```sql
CREATE POLICY "profiles_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );
```

---

### 3. Duplicate `stripe_customer_id` (FIXED)

**Problem:** `stripe_customer_id` exists in two tables:
- `public.users.stripe_customer_id` (VARCHAR(255))
- `public.profiles.stripe_customer_id` (VARCHAR(255))

**Decision:**
- ✅ Keep in `public.users` (canonical location, 1:1 with user)
- ✅ Remove from `public.profiles` (unnecessary duplication)

**Migration:** [20251225_fix_schema_consistency.sql:42-60](supabase/migrations/20251225_fix_schema_consistency.sql#L42-L60)

---

### 4. Missing Constraints on `profiles.user_id` (FIXED)

**Problem:**
- ❌ No `NOT NULL` constraint
- ❌ No `UNIQUE` constraint (one profile per user)

**Fix:**
```sql
ALTER TABLE public.profiles
  ALTER COLUMN user_id SET NOT NULL;

CREATE UNIQUE INDEX idx_profiles_user_unique
  ON public.profiles(user_id);
```

**Migration:** [20251225_fix_schema_consistency.sql:8-30](supabase/migrations/20251225_fix_schema_consistency.sql#L8-L30)

---

### 5. Duplicate Storage RLS Policies (FIXED)

**Problem:** Found 9 duplicate policies for `storage.objects` on `profiles` bucket:

| Operation | Duplicate Policies |
|-----------|-------------------|
| DELETE | `profiles-user-delete`, `profiles_delete_own`, `user can delete own folder` |
| INSERT | `profiles-user-insert`, `profiles_insert_own`, `user can upload to own folder` |
| UPDATE | `profiles-user-update`, `profiles_update_own`, `user can update own folder` |

**Fix:** Consolidated into 4 clear policies:
- `profiles_insert`
- `profiles_select`
- `profiles_update`
- `profiles_delete`

**Migration:** [20251225_cleanup_storage_policies.sql](supabase/migrations/20251225_cleanup_storage_policies.sql)

---

## Migration Files Created

1. **[20251225_fix_schema_consistency.sql](supabase/migrations/20251225_fix_schema_consistency.sql)**
   - Adds `NOT NULL` and `UNIQUE` constraints to `profiles.user_id`
   - Migrates `stripe_customer_id` data from profiles to users
   - Drops duplicate `profiles.stripe_customer_id` column
   - Updates RLS policies to use correct `profiles.user_id` reference

2. **[20251225_cleanup_storage_policies.sql](supabase/migrations/20251225_cleanup_storage_policies.sql)**
   - Drops 9 duplicate storage RLS policies
   - Creates 4 consolidated policies using `storage.foldername()` pattern

---

## Recommendations

### Immediate Actions

1. ✅ **Apply migrations in order:**
   ```bash
   supabase db push
   ```

2. ✅ **Run validation queries** (included at bottom of migration file):
   ```sql
   SELECT
     'profiles.user_id should be UUID and reference auth.users' as check_name,
     COUNT(*) as count,
     COUNT(CASE WHEN user_id IS NULL THEN 1 END) as null_count
   FROM public.profiles;
   ```

3. ✅ **Update application code** to reference `users.stripe_customer_id` (not `profiles.stripe_customer_id`)

### Long-term Best Practices

1. **Use `profiles.user_id` for all user-related joins**
   - ✅ Correct: `JOIN profiles ON profiles.user_id = auth.uid()`
   - ❌ Wrong: `JOIN profiles ON profiles.id = auth.uid()`

2. **Avoid direct joins with storage schema**
   - Use RLS policies with `auth.uid()::text` for path-based auth
   - Don't join `storage.objects.owner_id` with `auth.users.id` (type mismatch)

3. **User metadata in jsonb**
   - ✅ OK: `users.user_metadata` (JSONB for flexible data)
   - ❌ Don't use for foreign keys or indexed lookups

4. **Check for orphaned data:**
   ```sql
   -- Profiles without valid users
   SELECT * FROM profiles WHERE user_id NOT IN (SELECT id FROM auth.users);

   -- Subscriptions without valid users
   SELECT * FROM subscriptions WHERE user_id NOT IN (SELECT id FROM auth.users);
   ```

---

## Testing Checklist

After applying migrations:

- [ ] Verify `profiles.user_id` is NOT NULL
- [ ] Verify one profile per user (UNIQUE constraint)
- [ ] Verify `users.stripe_customer_id` contains migrated data
- [ ] Verify `profiles.stripe_customer_id` column is dropped
- [ ] Test storage upload to `profiles/{user_id}/` path
- [ ] Test storage RLS policies (insert, select, update, delete)
- [ ] Check application code for references to `profiles.stripe_customer_id`
- [ ] Run full test suite

---

## Notes

- **Metadata fields (jsonb):** OK for unstructured data, not for relational queries
- **Storage schema:** Managed by Supabase, can't modify `owner_id` type
- **auth.users schema:** Extended via `public.users` table for custom fields

---

## Contact

For questions about this report, contact the database admin or reference:
- Supabase Storage Docs: https://supabase.com/docs/guides/storage
- RLS Policy Examples: https://supabase.com/docs/guides/auth/row-level-security
