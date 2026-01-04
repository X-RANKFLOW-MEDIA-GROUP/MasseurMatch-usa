# Bruno Santos Profile Scripts

This directory contains scripts to check for and create the Bruno Santos therapist profile.

## Profile Information

- **Name**: Bruno Santos
- **Phone**: 762-334-5300
- **Location**: Dallas, TX (Visiting from Rio de Janeiro, Brazil)
- **Dates**: January 4-7, 2026
- **Specialties**: Therapeutic & Sports Massage, Deep Tissue, Brazilian Massage
- **Experience**: 8 years
- **Languages**: English, Portuguese

## Available Scripts

### 1. `setup-bruno-santos.js` (Recommended)

**All-in-one script** that checks if the profile exists and creates it if needed.

```bash
node scripts/setup-bruno-santos.js
```

**What it does:**
- Checks if Bruno Santos profile already exists (by phone, name, or slug)
- If found: displays profile information
- If not found: creates complete profile with all fields
- Adds Dallas as visitor city (Jan 4-7, 2026)
- Displays next steps

**Output:**
- ✅ Profile found → Shows existing profile details
- ❌ Profile not found → Creates new profile automatically

---

### 2. `check-bruno-profile.js`

**Check-only script** that searches for existing Bruno Santos profile.

```bash
node scripts/check-bruno-profile.js
```

**What it does:**
- Searches by name: "Bruno Santos"
- Searches by phone: 762-334-5300 (multiple formats)
- Shows all matching profiles
- Lists therapists in Dallas or Rio

**Use when:**
- You want to verify if profile exists without creating
- You need to find profile details
- You want to check for duplicates

---

### 3. `create-bruno-santos-profile.js`

**Create-only script** that creates the Bruno Santos profile.

```bash
node scripts/create-bruno-santos-profile.js
```

**What it does:**
- Checks for existing profile first (prevents duplicates)
- Creates new profile with complete information
- Adds visitor city record
- Displays success message with profile URL

**Use when:**
- You've already verified no profile exists
- You want to create the profile manually
- You need more control over the creation process

---

## Prerequisites

Before running any script, you need to configure Supabase credentials:

### Option 1: Environment Variables

```bash
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
# or for admin operations:
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### Option 2: .env.local File (Recommended)

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Profile Details

The profile is created with these comprehensive fields:

### Basic Information
- Display name, full name, phone, email
- Location: Dallas, TX
- Visiting from: Rio de Janeiro, Brazil
- Profile slug: `bruno-santos-dallas-tx`

### Professional Details
- 8 years of experience
- Verified badge enabled
- Status: Active and Available

### Services & Techniques
- Deep Tissue Massage
- Swedish Massage
- Sports Massage
- Therapeutic Massage
- Myofascial Release
- Trigger Point Therapy
- Brazilian Massage

### Specialties
- Sports Recovery
- Pain Relief
- Muscle Tension
- Flexibility Enhancement
- Stress Reduction

### Pricing
- 60 minutes: $120
- 90 minutes: $170
- 120 minutes: $220
- Accepts tips: Yes

### Payment Methods
- Cash
- Venmo
- Zelle
- Credit Card

### Service Details
- Type: Mobile/Outcall only
- Accepts couples: Yes
- Accepts walk-ins: No
- Languages: English, Portuguese
- Contact: Phone/WhatsApp preferred

### Availability
- Mon-Fri: 9:00 AM - 9:00 PM
- Saturday: 10:00 AM - 8:00 PM
- Sunday: 10:00 AM - 6:00 PM

### Visitor Information
- City: Dallas, TX
- Dates: January 4, 2026 to January 7, 2026
- Home base: Rio de Janeiro, Brazil

## Troubleshooting

### "Supabase credentials not configured"

**Problem:** The script can't find your Supabase credentials.

**Solution:**
1. Create `.env.local` file in project root
2. Add your Supabase URL and keys (see Prerequisites above)
3. Make sure the file is not in a subdirectory

### "Profile already exists"

**Problem:** A profile with this phone number or slug already exists.

**Solution:**
1. Run `check-bruno-profile.js` to see existing profile
2. Use the existing profile or update it
3. If it's a different person, change the phone or slug

### "Cannot find module '@supabase/supabase-js'"

**Problem:** Required npm packages not installed.

**Solution:**
```bash
npm install @supabase/supabase-js
```

## Next Steps After Profile Creation

1. **Upload Photos**
   - Professional headshot
   - Studio/workspace photos (if applicable)
   - Credential certificates

2. **Verify Profile**
   - Visit `/therapist/bruno-santos-dallas-tx`
   - Check all information displays correctly
   - Test contact buttons

3. **SEO & Visibility**
   - Profile is automatically searchable
   - Appears in Dallas therapist listings
   - Shows as "Visiting" therapist

4. **Update as Needed**
   - Use the profile editor to make changes
   - Update availability status
   - Add client reviews

## Profile URL

Once created, the profile will be accessible at:

```
https://yourdomain.com/therapist/bruno-santos-dallas-tx
```

## Support

If you encounter any issues:
1. Check that Supabase credentials are correct
2. Verify database schema supports all fields
3. Check console logs for detailed error messages
4. Ensure you have write permissions to the database
