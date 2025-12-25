# 🚀 MasseurMatch - Quick Start

## ⚡ 5-Minute Setup

### 1. Apply Database Schema

**Open Supabase SQL Editor:**
```
https://app.supabase.com/project/ijsdpozjfjjufjsoexod/sql/new
```

**Copy & Paste this file:**
```
supabase/migrations/20251224_onboarding_schema.sql
```

**Click "RUN"** ✅

---

### 2. Verify Installation

```bash
node scripts/setup-database.js
```

Expected output:
```
✅ profiles
✅ subscriptions
✅ media_assets
✅ profile_rates
✅ profile_hours
```

---

### 3. Start Development

```bash
cd masseurmatch-nextjs
npm run dev
```

Open: http://localhost:3000

---

## 📍 You Are Here

```
[X] Database schema applied
[ ] API endpoints implemented
[ ] Frontend components built
[ ] Tests written
[ ] Production deployment
```

---

## 🎯 Next Implementation Steps

### Phase 1: Core APIs (Now)
1. Implement `GET /api/onboarding/status`
2. Implement `POST /api/onboarding/profile/submit`
3. Implement `POST /api/onboarding/rates`
4. Implement `POST /api/onboarding/photos/upload`

### Phase 2: Integrations
1. Stripe payment setup
2. Stripe Identity verification
3. Sightengine moderation

### Phase 3: Frontend
1. Onboarding dashboard
2. Profile builder
3. Admin review queue

---

## ⚠️ Important Files

| File | Purpose |
|------|---------|
| `sql/onboarding_schema.sql` | **APPLY THIS FIRST** |
| `ONBOARDING-SUMMARY.md` | System overview |
| `ONBOARDING-IMPLEMENTATION-GUIDE.md` | Detailed guide |

---

## 🆘 Troubleshooting

**Schema errors?**
- Check you're using service role key
- Ignore "already exists" warnings

**Tables not found?**
- Schema not applied yet
- Check Supabase Dashboard > Database > Tables

**Auth errors?**
- Check `.env.local` has correct keys
- Verify Supabase URL matches

---

**Status:** Ready to implement! 🎉
