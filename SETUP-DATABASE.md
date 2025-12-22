# 📊 Database Setup Guide - MasseurMatch

## 🎯 Quick Setup (3 Steps)

### Step 1: Create Database Tables (2 minutes)

1. Go to https://app.supabase.com/
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy/paste the entire contents of: **`sql/setup_therapists_table.sql`**
6. Click **Run** (or press Ctrl+Enter)

✅ You should see: "Success. No rows returned"

---

### Step 2: Create Test User (1 minute)

**Option A: Via Supabase Dashboard (EASIEST)**

1. Go to **Authentication** → **Users** (left sidebar)
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email:** `test@test.com`
   - **Password:** `123456`
   - **Auto Confirm User:** ✅ **YES** (enable this!)
4. Click **"Create user"**
5. **Copy the UUID** shown (looks like: `a1b2c3d4-...`)

**Option B: Via SQL (Advanced)**

If you want a specific UUID (`a0000000-0000-0000-0000-000000000001`), you can create the user programmatically using Supabase Admin API, but Dashboard is simpler.

---

### Step 3: Create Therapist Profile (1 minute)

1. Still in **SQL Editor**
2. Open the file: **`sql/seed_simple_therapist.sql`**
3. **IMPORTANT:** At line 23, replace the UUID:
   ```sql
   test_user_id uuid := 'YOUR-UUID-HERE'::uuid; -- Paste the UUID you copied!
   ```
4. Paste the entire modified SQL into SQL Editor
5. Click **Run**

✅ You should see:
```
✅ Test therapist profile created successfully!
📧 Email: test@test.com
🔑 Password: 123456
👤 Name: Alex Santos
```

---

## 🧪 Test It Works

### Test 1: Login to Your Site

Try logging in with:
- **Email:** test@test.com
- **Password:** 123456

### Test 2: Check Database

In Supabase, go to **Table Editor** → `therapists`:
- You should see 1 row with "Alex Santos"

### Test 3: Test Backend API

```bash
cd ia-backend
npm run dev
```

In another terminal:
```bash
node test-endpoints.js
```

✅ Should show:
```
✅ Public profile fetched successfully
   Name: Alex Santos
   City: Los Angeles, CA
```

---

## 🆘 Troubleshooting

### "User does not exist!"

**Problem:** You didn't create the user in Step 2, or the UUID doesn't match.

**Solution:**
1. Go to **Authentication** → **Users** in Supabase
2. Check if `test@test.com` exists
3. Copy the exact UUID
4. Update it in `seed_simple_therapist.sql` at line 23

### "Table 'therapists' does not exist"

**Problem:** You skipped Step 1.

**Solution:** Run `sql/setup_therapists_table.sql` first.

### "Column 'email' is a generated column"

**Problem:** You're trying to run the old `seed_fake_therapist.sql`.

**Solution:** Use `seed_simple_therapist.sql` instead.

---

## 📁 Which Files To Use

| File | When to Use | Purpose |
|------|------------|---------|
| `setup_therapists_table.sql` | ✅ **ALWAYS FIRST** | Creates tables, indexes, RLS policies |
| `seed_simple_therapist.sql` | ✅ **RECOMMENDED** | Creates test therapist (after creating user manually) |
| ~~`seed_fake_therapist.sql`~~ | ❌ Don't use | Old version with auth.users issues |

---

## 🔐 Creating More Test Users

Want to add more therapists?

### Method 1: Via Supabase Dashboard

1. **Authentication** → **Users** → **Add user**
2. Create user (e.g., `therapist2@test.com`)
3. Copy the UUID
4. Modify `seed_simple_therapist.sql` with new data
5. Run it

### Method 2: Via API (Programmatic)

```javascript
// In your frontend or a script
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign up a new user
const { data, error } = await supabase.auth.signUp({
  email: 'therapist2@test.com',
  password: 'password123',
});

console.log('User created:', data.user.id);
// Use this ID to insert into therapists table
```

---

## 🗄️ Database Structure

After setup, you'll have:

```
auth.users (managed by Supabase)
  ↓
public.profiles (optional user metadata)
  ↓
public.therapists (main therapist profiles)
  ↓
public.reviews (therapist reviews)
```

---

## 🚀 Next Steps

After database is set up:

1. ✅ Test the backend: `cd ia-backend && npm run dev`
2. ✅ Test endpoints: `node test-endpoints.js`
3. 🔨 Build React components to display profiles
4. 🔨 Create edit forms
5. 🚀 Deploy!

---

## 📖 Additional Resources

- **Backend API:** [ia-backend/README.md](ia-backend/README.md)
- **API Reference:** [ia-backend/API-DOCUMENTATION.md](ia-backend/API-DOCUMENTATION.md)
- **Quick Start:** [QUICK-START.md](QUICK-START.md)

---

**Last Updated:** 2025-12-22
**Status:** ✅ Simplified setup ready
