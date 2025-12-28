# MasseurMatch Backend API

Node.js/Express backend for the MasseurMatch platform with Supabase PostgreSQL database.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd ia-backend
npm install
```

### 2. Setup Environment Variables
Create a `.env` file (already created):
```env
SUPABASE_URL=https://ijsdpozjfjjufjsoexod.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DEEPSEEK_API_KEY=your-deepseek-api-key
PORT=4000
```

### 3. Setup Database
**IMPORTANT:** You need to run the SQL setup scripts in Supabase first:

1. Go to https://app.supabase.com/
2. Select your project
3. Go to **SQL Editor**
4. Run these SQL files in order:

   a. **First, create the table structure:**
   ```sql
   -- Copy and paste contents of: sql/setup_therapists_table.sql
   ```

   b. **Then, create test data:**
   ```sql
   -- Copy and paste contents of: sql/seed_fake_therapist.sql
   ```

### 4. Start the Backend
```bash
npm run dev
```

You should see:
```
✅ IA backend running on http://localhost:4000

📌 Available endpoints:
   GET  /api/therapist/:user_id          - View public profile
   GET  /api/therapist/dashboard/:user_id - View own profile (auth required)
   PUT  /api/therapist/update/:user_id   - Update profile (auth required)
   GET  /api/therapists                   - List all therapists
```

### 5. Test the API
```bash
node test-endpoints.js
```

Expected output:
```
✅ Public profile fetched successfully
   Name: Alex Santos
   City: Los Angeles, CA
   Headline: Professional Massage Therapist...
```

---

## 📚 Architecture Overview

### Your Stack (NOT PHP!)

```
Frontend (React/Vite)
        ↓
Node.js/Express Backend (this folder)
        ↓
Supabase PostgreSQL Database
```

**You are NOT using PHP.** Your project uses:
- **Frontend:** React with Vite
- **Backend:** Node.js with Express
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **AI:** DeepSeek API

### Why Not PHP?

The PHP code you received won't work because:
1. You're using **Supabase** (cloud PostgreSQL), not local MySQL/phpMyAdmin
2. Your frontend is **React** (client-side), not PHP server-side rendering
3. You already have a **Node.js backend** infrastructure
4. Your auth is **Supabase Auth**, not PHP sessions

---

## 🗂️ File Structure

```
ia-backend/
├── index.js                 # Main server file with all API routes
├── .env                     # Environment variables (DO NOT commit)
├── test-endpoints.js        # Test script for API endpoints
├── API-DOCUMENTATION.md     # Complete API documentation
├── README.md               # This file
└── package.json            # Dependencies

sql/
├── setup_therapists_table.sql  # Database schema (run in Supabase)
└── seed_fake_therapist.sql     # Test data (run in Supabase)
```

---

## 🔌 API Endpoints

### Public Endpoints (No Auth Required)

#### 1. View Public Profile
```bash
GET /api/therapist/:user_id
```

**Example:**
```bash
curl http://localhost:4000/api/therapist/a0000000-0000-0000-0000-000000000001
```

**Response:**
```json
{
  "success": true,
  "therapist": {
    "user_id": "a0000000-0000-0000-0000-000000000001",
    "display_name": "Alex Santos",
    "city": "Los Angeles",
    "state": "CA",
    "services": ["Deep Tissue", "Swedish"],
    "rating": 4.8,
    ...
  }
}
```

#### 2. List All Therapists
```bash
GET /api/therapists?city=Los Angeles&limit=10
```

**Response:**
```json
{
  "success": true,
  "therapists": [...],
  "total": null,
  "limit": 10,
  "offset": 0
}
```

### Private Endpoints (Auth Required - TODO)

#### 3. View Own Profile (Dashboard)
```bash
GET /api/therapist/dashboard/:user_id
Authorization: Bearer <supabase_jwt>
```

#### 4. Update Profile
```bash
PUT /api/therapist/update/:user_id
Authorization: Bearer <supabase_jwt>
Content-Type: application/json

{
  "headline": "New headline",
  "phone": "+1 (555) 999-8888",
  "services": ["Deep Tissue", "Sports Massage"]
}
```

---

## 🧪 Testing

### Test Script
```bash
node test-endpoints.js
```

### Manual Testing with cURL

**Get public profile:**
```bash
curl http://localhost:4000/api/therapist/a0000000-0000-0000-0000-000000000001
```

**Update profile:**
```bash
curl -X PUT http://localhost:4000/api/therapist/update/a0000000-0000-0000-0000-000000000001 \
  -H "Content-Type: application/json" \
  -d '{"headline": "Updated Headline"}'
```

**Search by city:**
```bash
curl "http://localhost:4000/api/therapists?city=Los%20Angeles"
```

### Test User Credentials

- **Email:** test@test.com
- **Password:** 123456
- **User ID:** a0000000-0000-0000-0000-000000000001
- **Location:** Los Angeles, CA

---

## 🔒 Security (TODO)

**IMPORTANT:** Before deploying to production, you MUST add:

### 1. Authentication Middleware
```javascript
// Add to index.js
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }

  req.user = user;
  next();
}

// Apply to protected routes
app.get('/api/therapist/dashboard/:user_id', requireAuth, async (req, res) => {
  // Verify user owns this profile
  if (req.user.id !== req.params.user_id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // ... rest of code
});
```

### 2. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});

app.use('/api/', limiter);
```

### 3. Input Validation
```bash
npm install express-validator
```

```javascript
import { body, validationResult } from 'express-validator';

app.put('/api/therapist/update/:user_id', [
  body('email').optional().isEmail(),
  body('phone').optional().isMobilePhone(),
  body('rating').optional().isFloat({ min: 0, max: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... rest of code
});
```

---

## 🌐 How to Connect Frontend to Backend

### React Component Example

```typescript
// In your React component
const BACKEND_URL = 'http://localhost:4000';

// Get therapist profile
async function getTherapist(userId: string) {
  const response = await fetch(`${BACKEND_URL}/api/therapist/${userId}`);
  const data = await response.json();
  return data.therapist;
}

// Update therapist profile
async function updateTherapist(userId: string, updates: any) {
  const token = await supabase.auth.getSession(); // Get Supabase JWT

  const response = await fetch(`${BACKEND_URL}/api/therapist/update/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.session.access_token}`
    },
    body: JSON.stringify(updates)
  });

  const data = await response.json();
  return data.therapist;
}
```

---

## 📦 Database Schema

### therapists table

Key fields:
- `user_id` (uuid, PK) - Links to auth.users
- `display_name` (text) - Public name
- `city`, `state`, `country` - Location
- `services` (text[]) - Array of services
- `rating` (numeric) - 0.0 to 5.0
- `status` - 'pending', 'active', 'inactive', 'suspended'
- `plan` - Subscription tier

See [sql/setup_therapists_table.sql](../sql/setup_therapists_table.sql) for complete schema.

---

## 🚧 TODO List

### Critical (Before Production)
- [ ] Add authentication middleware
- [ ] Add authorization checks (user can only edit own profile)
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Add proper error handling
- [ ] Add logging (Winston/Pino)

### Features
- [ ] Image upload endpoint (profile_photo, gallery)
- [ ] Reviews CRUD endpoints
- [ ] Search/filter improvements (full-text search)
- [ ] Geolocation search (find nearby therapists)
- [ ] Email notifications
- [ ] Webhook for Stripe payments

### SEO Enhancements
- [ ] SEO-friendly URLs (slug-based instead of UUID)
- [ ] Sitemap generation endpoint
- [ ] OpenGraph metadata
- [ ] Schema.org structured data

---

## 🆘 Troubleshooting

### Backend won't start
```
❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing
```
**Fix:** Make sure `.env` file exists in `ia-backend/` folder

### Tests failing
```
❌ Failed to fetch profile: Profile not found
```
**Fix:** Run the SQL setup scripts in Supabase (see step 3 above)

### Can't connect to database
```
Could not find the table 'public.therapists'
```
**Fix:** Run `sql/setup_therapists_table.sql` in Supabase SQL Editor

---

## 📖 Additional Documentation

- **API Docs:** [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)
- **Database Setup:** [../sql/setup_therapists_table.sql](../sql/setup_therapists_table.sql)
- **URL Strategy:** [../DOCS-URL-STRATEGY-ANALYSIS.md](../DOCS-URL-STRATEGY-ANALYSIS.md)

---

## 🎯 Key Differences from PHP Approach

| Aspect | PHP Approach (Won't Work) | Your Stack (Correct) |
|--------|-------------------------|---------------------|
| **Server** | Apache/Nginx with PHP | Node.js with Express |
| **Database** | MySQL with phpMyAdmin | Supabase (PostgreSQL) |
| **Database Connection** | PDO or mysqli | @supabase/supabase-js |
| **Auth** | PHP sessions | Supabase Auth (JWT) |
| **Frontend** | PHP server-side rendering | React (client-side) |
| **API** | Direct PHP pages | RESTful API endpoints |

**Bottom Line:** Don't follow PHP tutorials. Your project is a modern **JAMstack** application (JavaScript, APIs, Markup) with Node.js backend.

---

## 💡 Next Steps

1. **✅ Backend is ready** - You just created it!
2. **Create Frontend Components** - Build React components to display therapist profiles
3. **Connect Frontend to Backend** - Use fetch/axios to call the API endpoints
4. **Add Authentication UI** - Login/signup forms
5. **Build Dashboard** - UI for therapists to edit their profiles
6. **Deploy** - Deploy backend to Render/Railway/Vercel

---

## 📞 Support

If you have questions:
1. Check [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)
2. Review the code in [index.js](./index.js)
3. Run test script: `node test-endpoints.js`
4. Check Supabase logs: https://app.supabase.com/

---

**Last Updated:** 2025-12-22
**Status:** ✅ Backend implemented and ready for testing
