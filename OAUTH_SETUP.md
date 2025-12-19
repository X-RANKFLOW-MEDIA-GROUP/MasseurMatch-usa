# OAuth Setup Guide - Google & Apple Sign In

## Overview

This guide will help you configure Google and Apple OAuth providers in your Supabase project to enable Social Login functionality.

---

## 🔐 Supabase Configuration

### 1. Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**

---

## 🔵 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in:
   - App name: `MasseurMatch`
   - User support email: `your-email@domain.com`
   - Developer contact: `your-email@domain.com`
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Save and continue

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `MasseurMatch Web App`
5. Add **Authorized redirect URIs**:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
   ⚠️ **Replace** `your-project-ref` with your actual Supabase project reference

6. Click **Create**
7. Copy:
   - **Client ID**
   - **Client Secret**

### Step 4: Configure in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** provider
3. Enable it
4. Paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
5. Add to **Authorized Client IDs** (optional for mobile):
   ```
   your-ios-bundle-id
   your-android-package-name
   ```
6. Click **Save**

---

## 🍎 Apple Sign In Setup

### Step 1: Apple Developer Account

1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with your Apple ID
3. Enroll in Apple Developer Program (requires $99/year)

### Step 2: Register App ID

1. Go to **Certificates, Identifiers & Profiles**
2. Click **Identifiers** → **+** (Add)
3. Select **App IDs** → Continue
4. Choose type: **App**
5. Fill in:
   - Description: `MasseurMatch`
   - Bundle ID: `com.masseurmatch.app` (or your domain)
6. Enable **Sign in with Apple**
7. Click **Continue** → **Register**

### Step 3: Create Service ID

1. Go to **Identifiers** → **+** (Add)
2. Select **Services IDs** → Continue
3. Fill in:
   - Description: `MasseurMatch Web`
   - Identifier: `com.masseurmatch.service`
4. Enable **Sign in with Apple**
5. Click **Configure**
6. Add domains and redirect URLs:
   - **Domains**: `your-project-ref.supabase.co`
   - **Return URLs**: `https://your-project-ref.supabase.co/auth/v1/callback`
7. Save → Continue → Register

### Step 4: Create Private Key

1. Go to **Keys** → **+** (Add)
2. Key Name: `MasseurMatch Sign in with Apple Key`
3. Enable **Sign in with Apple**
4. Configure → Select your **Primary App ID**
5. Save → Continue → Register
6. **Download** the `.p8` file (⚠️ Can only download once!)
7. Note the **Key ID**

### Step 5: Get Team ID

1. Go to **Membership**
2. Copy your **Team ID**

### Step 6: Configure in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Apple** provider
3. Enable it
4. Fill in:
   - **Services ID**: `com.masseurmatch.service`
   - **Team ID**: (from step 5)
   - **Key ID**: (from step 4)
   - **Secret Key**: Open the `.p8` file and paste the entire content
5. Click **Save**

---

## 🌐 Update Your Site URL

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set:
   - **Site URL**: `https://masseurmatch.com` (or your production domain)
   - **Redirect URLs**: Add:
     ```
     https://masseurmatch.com/auth/callback
     http://localhost:3000/auth/callback
     https://www.masseurmatch.com/auth/callback
     ```

---

## ✅ Testing

### Local Testing

1. Run your dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login`

3. Click **"Continue with Google"** or **"Continue with Apple"**

4. You should be redirected to the OAuth provider

5. After authentication, you'll be redirected back to `/auth/callback`

6. Finally, you'll be redirected to `/dashboard`

### Production Testing

1. Deploy your app to production
2. Ensure your **Site URL** and **Redirect URLs** are configured correctly
3. Test both providers

---

## 🔍 Troubleshooting

### Error: "redirect_uri_mismatch"

**Solution**: Make sure your redirect URI in Google Cloud Console exactly matches:
```
https://your-project-ref.supabase.co/auth/v1/callback
```

### Error: "invalid_client"

**Solution**: Double-check your Client ID and Client Secret in Supabase settings.

### Apple Sign In: "invalid_request"

**Solution**:
1. Verify your Service ID is correct
2. Ensure the `.p8` key is properly pasted
3. Check that your Team ID and Key ID match

### Callback Page Shows Error

**Solution**:
1. Check browser console for errors
2. Verify your Supabase project URL in environment variables
3. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

---

## 📝 Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🎯 Next Steps

After setup is complete:

1. ✅ Test OAuth login flow
2. ✅ Verify user creation in Supabase Dashboard → **Authentication** → **Users**
3. ✅ Test on different browsers
4. ✅ Test on mobile devices
5. ✅ Monitor for errors in Supabase logs

---

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)

---

**Need help?** Check Supabase documentation or contact support.
