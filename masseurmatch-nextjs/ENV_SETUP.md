# 🔐 Environment Variables Setup Guide

## Quick Start

1. Copy the example file to create your local environment file:
```bash
cp .env.example .env.local
```

2. Get your Supabase credentials and update `.env.local`

## 📋 Required Environment Variables

### 🗄️ Supabase Configuration

You need to get these 3 values from your Supabase project:

#### Step 1: Go to Supabase Dashboard
Visit: https://supabase.com/dashboard/project/ijsdpozjfjjufjsoexod/settings/api

#### Step 2: Copy the values

**Project URL:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://ijsdpozjfjjufjsoexod.supabase.co
```
✅ Already set correctly in your `.env.local`

**Anon/Public Key:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
✅ Already set correctly in your `.env.local`

**Service Role Key:** ⚠️ **THIS IS MISSING - YOU NEED TO UPDATE IT**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 🔍 How to Find Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/ijsdpozjfjjufjsoexod/settings/api
2. Scroll down to **"Project API keys"** section
3. Find **"service_role"** key (it's secret, labeled in red)
4. Click "Reveal" to show the full key
5. Copy the entire JWT token (starts with `eyJhbGci...`)
6. Paste it in your `.env.local` file:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqc2Rwb3pqZmpqdWZqc29leG9kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDg3NzM5NiwiZXhwIjoyMDUwNDUzMzk2fQ.ACTUAL_SIGNATURE_HERE
```

⚠️ **IMPORTANT**: Replace `ACTUAL_SIGNATURE_HERE` with the real signature from your Supabase dashboard!

## 🚨 Security Warnings

- **NEVER** commit `.env.local` to Git (it's already in `.gitignore`)
- **NEVER** share your `SUPABASE_SERVICE_ROLE_KEY` publicly
- The service role key bypasses Row Level Security - use with caution
- Only use `NEXT_PUBLIC_*` variables for values safe to expose in browser

## ✅ Verify Setup

After updating your `.env.local`, test if it works:

```bash
# Restart your dev server
npm run dev
```

If you see this error:
```
SUPABASE_SERVICE_ROLE_KEY is required
```

It means the key is still missing or invalid. Go back and get the real key from Supabase dashboard.

## 🎯 Next Steps

Once your environment variables are set:

1. ✅ Supabase connection working
2. ✅ Authentication (email/password, magic link, OAuth)
3. ✅ Database queries
4. ✅ File uploads (if configured)

## 📞 Need Help?

If you can't find your Service Role Key:
1. Make sure you're logged into the correct Supabase account
2. Check you're on the correct project (ijsdpozjfjjufjsoexod)
3. The service role key is in: Settings → API → Project API keys → service_role

## 🔗 Useful Links

- Supabase Dashboard: https://supabase.com/dashboard
- Your Project API Settings: https://supabase.com/dashboard/project/ijsdpozjfjjufjsoexod/settings/api
- Supabase Docs: https://supabase.com/docs
