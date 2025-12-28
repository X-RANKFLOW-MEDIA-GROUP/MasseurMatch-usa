# 🔌 Next.js API Routes - MasseurMatch

Complete API routes to replace the Express backend.

---

## 📁 API Structure

```
app/api/
├── therapist/
│   ├── [id]/
│   │   └── route.ts          ← GET/PUT /api/therapist/:id
│   └── dashboard/
│       └── [id]/
│           └── route.ts      ← GET /api/therapist/dashboard/:id
└── therapists/
    └── route.ts              ← GET /api/therapists
```

---

## 🔌 Endpoints

### 1. Get Single Therapist (Public)

**Endpoint:** `GET /api/therapist/[id]`

**Purpose:** Get a single therapist's public profile

**Parameters:**
- `id` (path) - Therapist user_id (UUID)

**Example:**
```bash
curl http://localhost:3000/api/therapist/a0000000-0000-0000-0000-000000000001
```

**Response (200):**
```json
{
  "success": true,
  "therapist": {
    "user_id": "a0000000-0000-0000-0000-000000000001",
    "slug": "alex-santos-los-angeles",
    "display_name": "Alex Santos",
    "headline": "Professional Certified Massage Therapist",
    "city": "Los Angeles",
    "state": "CA",
    "rating": 4.8,
    "services": ["Deep Tissue", "Swedish"],
    ...
  }
}
```

**Response (404):**
```json
{
  "error": "Profile not found",
  "details": "No profile found with this ID"
}
```

---

### 2. Update Therapist Profile

**Endpoint:** `PUT /api/therapist/[id]`

**Purpose:** Update therapist profile information

**Authentication:** Required (TODO: implement)

**Parameters:**
- `id` (path) - Therapist user_id (UUID)

**Request Body:**
```json
{
  "headline": "New headline text",
  "city": "Miami",
  "services": ["Deep Tissue", "Sports Massage"],
  "rate_60": "$90"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/therapist/a0000000-0000-0000-0000-000000000001 \
  -H "Content-Type: application/json" \
  -d '{
    "headline": "Expert Massage Therapist",
    "phone": "+1 (555) 999-8888"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "therapist": {
    "user_id": "...",
    "headline": "Expert Massage Therapist",
    "phone": "+1 (555) 999-8888",
    "updated_at": "2025-12-22T10:30:00.000Z",
    ...
  }
}
```

**Allowed Fields:**
- Basic: `display_name`, `full_name`, `headline`, `about`, `philosophy`
- Contact: `phone`, `website`, `instagram`, `whatsapp`
- Location: `city`, `state`, `country`, `neighborhood`, `address`, `zip_code`, `latitude`, `longitude`
- Services: `services`, `massage_techniques`, `additional_services`
- Pricing: `rate_60`, `rate_90`, `rate_outcall`, `payment_methods`
- Availability: `availability`, `business_trips`
- Professional: `degrees`, `affiliations`, `massage_start_date`, `years_experience`
- Media: `profile_photo`, `gallery`

**Protected Fields** (cannot be updated via API):
- `user_id`, `status`, `plan`, `subscription_status`, `rating`, `created_at`

---

### 3. Get Dashboard Profile (Private)

**Endpoint:** `GET /api/therapist/dashboard/[id]`

**Purpose:** Get therapist's own profile with all fields (for editing)

**Authentication:** Required (TODO: implement)

**Parameters:**
- `id` (path) - Therapist user_id (UUID)

**Example:**
```bash
curl http://localhost:3000/api/therapist/dashboard/a0000000-0000-0000-0000-000000000001 \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "success": true,
  "therapist": {
    "user_id": "...",
    "email": "test@test.com",
    "phone": "+1 (555) 123-4567",
    "status": "active",
    "plan": "premium",
    ...
  }
}
```

---

### 4. Get All Therapists (Public)

**Endpoint:** `GET /api/therapists`

**Purpose:** Get list of active therapists with optional filters

**Query Parameters:**
- `city` (optional) - Filter by city (case-insensitive partial match)
- `services` (optional) - Filter by service type
- `limit` (optional, default: 50) - Number of results per page
- `offset` (optional, default: 0) - Pagination offset

**Examples:**
```bash
# Get first 10 therapists
curl "http://localhost:3000/api/therapists?limit=10"

# Get therapists in Los Angeles
curl "http://localhost:3000/api/therapists?city=Los%20Angeles"

# Get therapists offering Deep Tissue
curl "http://localhost:3000/api/therapists?services=Deep%20Tissue"

# Pagination (get results 20-40)
curl "http://localhost:3000/api/therapists?limit=20&offset=20"

# Combined filters
curl "http://localhost:3000/api/therapists?city=Miami&services=Sports%20Massage&limit=5"
```

**Response (200):**
```json
{
  "success": true,
  "therapists": [
    {
      "user_id": "...",
      "slug": "alex-santos-los-angeles",
      "display_name": "Alex Santos",
      "city": "Los Angeles",
      "state": "CA",
      "rating": 4.8,
      ...
    },
    ...
  ],
  "total": 127,
  "limit": 50,
  "offset": 0
}
```

---

## 🔒 Authentication (TODO)

### Current State
Authentication checks are commented out with TODO markers.

### How to Add Authentication

1. **Install Supabase Auth helpers:**
```bash
npm install @supabase/auth-helpers-nextjs
```

2. **Create auth utility:**

```typescript
// lib/auth.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getSession() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
```

3. **Add auth check to protected routes:**

```typescript
// app/api/therapist/[id]/route.ts
import { getSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // Check authentication
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check authorization (user owns this profile)
  if (session.user.id !== params.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ... rest of code
}
```

---

## 🧪 Testing

### Test with cURL

```bash
# Get therapist
curl http://localhost:3000/api/therapist/a0000000-0000-0000-0000-000000000001

# Update therapist
curl -X PUT http://localhost:3000/api/therapist/a0000000-0000-0000-0000-000000000001 \
  -H "Content-Type: application/json" \
  -d '{"headline": "Test Update"}'

# Get therapists by city
curl "http://localhost:3000/api/therapists?city=Los%20Angeles"
```

### Test with JavaScript/TypeScript

```typescript
// Get therapist
const response = await fetch('/api/therapist/a0000000-0000-0000-0000-000000000001');
const data = await response.json();
console.log(data.therapist);

// Update therapist
const response = await fetch('/api/therapist/a0000000-0000-0000-0000-000000000001', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    headline: 'New headline',
    city: 'Miami'
  })
});
const data = await response.json();

// Get therapists
const response = await fetch('/api/therapists?city=Los Angeles&limit=10');
const data = await response.json();
console.log(data.therapists);
```

---

## 🆚 Comparison with Express Backend

| Feature | Express Backend | Next.js API Routes |
|---------|----------------|-------------------|
| **Location** | `ia-backend/index.js` | `app/api/**/route.ts` |
| **Server** | Separate Express server | Built into Next.js |
| **Port** | 4000 | 3000 (same as frontend) |
| **CORS** | Required | Not needed (same origin) |
| **Deployment** | Separate (Render/Railway) | Same as frontend (Vercel) |
| **Hot Reload** | nodemon | Next.js built-in |
| **TypeScript** | Requires setup | Built-in |

---

## 🚀 Deployment

### Vercel (Automatic)
API routes are automatically deployed with your Next.js app.

### Self-Hosted
```bash
npm run build
npm run start
```

API routes will be available at: `https://yourdomain.com/api/*`

---

## 📊 Error Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid data or query parameters |
| 401 | Unauthorized | Missing or invalid auth token |
| 403 | Forbidden | User doesn't own resource |
| 404 | Not Found | Profile doesn't exist |
| 500 | Internal Server Error | Server error |

---

## ✅ Migration from Express

If you're migrating from the Express backend:

1. ✅ Copy these API route files to your Next.js project
2. ✅ Update frontend API calls from `http://localhost:4000` to `/api`
3. ✅ Test all endpoints
4. ✅ Add authentication (see above)
5. ✅ Deploy to Vercel
6. ❌ Delete Express backend (or keep for mobile apps)

---

## 📝 Next Steps

1. ✅ API routes created
2. 🔨 Add authentication
3. 🔨 Add input validation
4. 🔨 Add rate limiting
5. 🔨 Add request logging
6. 🚀 Deploy

---

**Your Next.js API routes are complete and ready to use!** 🎉
