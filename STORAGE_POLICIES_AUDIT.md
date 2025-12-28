# Storage Policies Audit

**Date:** 2025-12-25
**Bucket:** `profiles`
**Status:** 🔴 **17 duplicate policies found** → ✅ Consolidated to 5 policies

---

## Summary

Found **17 duplicate storage policies** on `storage.objects` for the `profiles` bucket:
- **4 DELETE policies** (should be 1)
- **5 INSERT policies** (should be 1)
- **4 UPDATE policies** (should be 1)
- **4 SELECT policies** (should be 2: one for authenticated, one for public)

---

## Detailed Policy Inventory

### DELETE Policies (4 duplicates → 1)

| Policy Name | Role | USING Clause | Status |
|-------------|------|--------------|--------|
| `profiles-user-delete` | authenticated | `bucket_id = 'profiles' AND split_part(name, '/', 1) = auth.uid()::text` | ❌ Duplicate |
| `profiles_delete_own` | authenticated | `bucket_id = 'profiles' AND split_part(name, '/', 1) = auth.uid()::text` | ❌ Duplicate |
| `user can delete own folder` | authenticated | `bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text` | ❌ Duplicate |
| `profiles_objects_delete_own` | authenticated | `bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text` | ❌ Duplicate |
| **`profiles_delete`** | authenticated | `bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text` | ✅ **NEW** |

---

### INSERT Policies (5 duplicates → 1)

| Policy Name | Role | WITH CHECK Clause | Status |
|-------------|------|-------------------|--------|
| `profiles-user-insert` | authenticated | `bucket_id = 'profiles' AND split_part(name, '/', 1) = auth.uid()::text` | ❌ Duplicate |
| `profiles_insert_own` | authenticated | `bucket_id = 'profiles' AND split_part(name, '/', 1) = auth.uid()::text` | ❌ Duplicate |
| `user can upload to own folder` | authenticated | `bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text` | ❌ Duplicate |
| `profiles_objects_insert_own` | authenticated | `bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text` | ❌ Duplicate |
| `objects_insert_owner_only` | authenticated | `bucket_id = 'YOUR_BUCKET_ID' AND owner = auth.uid()` | ❌ Generic template |
| **`profiles_insert`** | authenticated | `bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text` | ✅ **NEW** |

---

### UPDATE Policies (4 duplicates → 1)

| Policy Name | Role | USING + WITH CHECK Clause | Status |
|-------------|------|---------------------------|--------|
| `profiles-user-update` | authenticated | `bucket_id = 'profiles' AND split_part(name, '/', 1) = auth.uid()::text` | ❌ Duplicate |
| `profiles_update_own` | authenticated | `bucket_id = 'profiles' AND split_part(name, '/', 1) = auth.uid()::text` (USING only) | ❌ Duplicate |
| `user can update own folder` | authenticated | `bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text` | ❌ Duplicate |
| `profiles_objects_update_own` | authenticated | `bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text` | ❌ Duplicate |
| **`profiles_update`** | authenticated | `bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text` | ✅ **NEW** |

---

### SELECT Policies (4 duplicates → 2)

| Policy Name | Role | USING Clause | Status |
|-------------|------|--------------|--------|
| `profiles_read_public` | (not specified) | `bucket_id = 'profiles'` | ❌ Duplicate |
| `public read` | (not specified) | `bucket_id = 'profiles'` | ❌ Duplicate |
| `profiles-public-read` | (not specified) | `bucket_id = 'profiles'` | ❌ Duplicate |
| `objects_select_public_or_owner` | authenticated | `bucket_id = 'YOUR_BUCKET_ID' AND (name ~~ 'public/%' OR owner = auth.uid())` | ❌ Generic template |
| **`profiles_select_own`** | authenticated | `bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text` | ✅ **NEW** |
| **`profiles_select_public`** | public | `bucket_id = 'profiles'` | ✅ **NEW** |

---

## Issues Found

### 1. Generic Template Policies Left in Production

Two policies still reference `YOUR_BUCKET_ID` (placeholder):
- `objects_insert_owner_only`
- `objects_select_public_or_owner`

**Risk:** These policies may unintentionally apply to wrong buckets or fail due to invalid bucket ID.

### 2. Inconsistent Path Parsing

Found two different methods for extracting user_id from path:
- ❌ `split_part(name, '/', 1)` - older approach
- ✅ `(storage.foldername(name))[1]` - cleaner, recommended approach

**Recommendation:** Use `storage.foldername()` consistently.

### 3. Missing Role Specifications

Some SELECT policies don't specify a role (defaults to all users):
- `profiles_read_public`
- `public read`
- `profiles-public-read`

**Impact:** Works but less explicit. Better to specify `TO public` or `TO authenticated`.

### 4. Deprecated `owner` Field Usage

One policy uses `owner = auth.uid()`:
- `objects_select_public_or_owner`

**Problem:** The `owner` field (uuid) is deprecated in favor of `owner_id` (text), but `owner_id` has type mismatch with `auth.uid()` (uuid). Path-based auth is more reliable.

---

## New Consolidated Policy Set

After cleanup, you'll have **5 clean policies**:

| Policy | Operation | Role | Purpose |
|--------|-----------|------|---------|
| `profiles_insert` | INSERT | authenticated | Users upload to their own folder |
| `profiles_select_own` | SELECT | authenticated | Users view their own files |
| `profiles_select_public` | SELECT | public | Anyone can view all profile photos |
| `profiles_update` | UPDATE | authenticated | Users update their own files |
| `profiles_delete` | DELETE | authenticated | Users delete their own files |

---

## Migration Plan

1. **Backup existing policies** (already documented above)
2. **Run migration:** [20251225_cleanup_storage_policies.sql](supabase/migrations/20251225_cleanup_storage_policies.sql)
3. **Test access:**
   - Upload as authenticated user → should work
   - View own files as authenticated → should work
   - View profile photos as anonymous → should work
   - Update/delete other user's files → should fail
4. **Monitor errors** in production for 24-48h

---

## Folder Structure Recommendation

Current setup: **All files in `profiles` bucket are publicly readable**

Consider organizing files by visibility:

```
profiles/
  {user_id}/
    public/          ← Publicly accessible (profile photos)
      avatar.jpg
      photo1.jpg
    private/         ← Owner-only access (documents, drafts)
      id_verification.pdf
      draft_photo.jpg
```

To implement, update `profiles_select_public` policy:

```sql
CREATE POLICY "profiles_select_public"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[2] = 'public'
  );
```

This restricts public access to only `/public/` subfolder.

---

## Testing Checklist

After applying migration:

- [ ] Upload file as authenticated user
  ```javascript
  const { data, error } = await supabase.storage
    .from('profiles')
    .upload(`${userId}/avatar.jpg`, file);
  ```

- [ ] View own file as authenticated user
  ```javascript
  const { data } = supabase.storage
    .from('profiles')
    .getPublicUrl(`${userId}/avatar.jpg`);
  ```

- [ ] View profile photo as anonymous user (in incognito browser)
  - Navigate to public URL
  - Should see image without authentication

- [ ] Try to upload to another user's folder (should fail)
  ```javascript
  const { data, error } = await supabase.storage
    .from('profiles')
    .upload(`${otherUserId}/hack.jpg`, file);
  // Expected: error with "new row violates row-level security policy"
  ```

- [ ] Try to delete another user's file (should fail)

- [ ] Check Supabase logs for policy violations

---

## Notes

- **Migration is safe:** Uses `DROP POLICY IF EXISTS`, so no errors if policies don't exist
- **No downtime:** New policies are created immediately after old ones are dropped
- **Backwards compatible:** New policies provide same access as old ones (just consolidated)
- **Performance:** Fewer policies = faster policy evaluation

---

## References

- [Supabase Storage RLS Guide](https://supabase.com/docs/guides/storage/security/access-control)
- [storage.foldername() function](https://supabase.com/docs/reference/javascript/storage-from-list)
- Migration file: [20251225_cleanup_storage_policies.sql](supabase/migrations/20251225_cleanup_storage_policies.sql)
