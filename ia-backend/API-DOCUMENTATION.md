# MasseurMatch API Documentation

## Base URL
```
http://localhost:4000 (development)
```

## Authentication
Most endpoints require authentication via Supabase Auth JWT token in the `Authorization` header:
```
Authorization: Bearer <supabase_jwt_token>
```

**Note:** Authentication middleware is currently in TODO state. Add before production.

---

## Endpoints

### 1. Health Check
**GET** `/`

Simple health check to verify the backend is running.

**Response:**
```json
{
  "status": "ok",
  "message": "IA backend is running 🚀"
}
```

---

### 2. Get Public Therapist Profile
**GET** `/api/therapist/:user_id`

Get a single therapist's public profile. Only returns profiles with `status = "active"`.

**Parameters:**
- `user_id` (path) - UUID of the therapist

**Example:**
```bash
curl http://localhost:4000/api/therapist/a0000000-0000-0000-0000-000000000001
```

**Success Response (200):**
```json
{
  "success": true,
  "therapist": {
    "user_id": "a0000000-0000-0000-0000-000000000001",
    "display_name": "Alex Santos",
    "full_name": "Alex Santos - Teste",
    "headline": "Professional Massage Therapist...",
    "city": "Los Angeles",
    "state": "CA",
    "services": ["Deep Tissue", "Swedish"],
    "rating": 4.8,
    ...
  }
}
```

**Error Response (404):**
```json
{
  "error": "Profile not found",
  "details": "No profile found with this ID"
}
```

**Use Cases:**
- Public profile page: `/therapist/[user_id]`
- SEO-friendly URLs
- Social media sharing

---

### 3. Get Dashboard Profile (Private)
**GET** `/api/therapist/dashboard/:user_id`

Get a therapist's own profile with all fields (including private data).

**🔒 Requires Authentication**

**Parameters:**
- `user_id` (path) - UUID of the therapist

**Example:**
```bash
curl http://localhost:4000/api/therapist/dashboard/a0000000-0000-0000-0000-000000000001 \
  -H "Authorization: Bearer <token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "therapist": {
    "user_id": "...",
    "email": "test@test.com",
    "phone": "+1 (555) 123-4567",
    ...
  }
}
```

**Use Cases:**
- Dashboard edit page
- Profile management
- Account settings

---

### 4. Update Therapist Profile
**PUT** `/api/therapist/update/:user_id`

Update a therapist's profile information.

**🔒 Requires Authentication**

**Parameters:**
- `user_id` (path) - UUID of the therapist

**Request Body:**
```json
{
  "display_name": "New Name",
  "headline": "Updated headline",
  "city": "Miami",
  "services": ["Deep Tissue", "Sports Massage"],
  "rate_60": "$90"
}
```

**Allowed Fields:**
- Basic Info: `display_name`, `full_name`, `headline`, `about`, `philosophy`
- Contact: `phone`, `website`, `instagram`, `whatsapp`
- Location: `city`, `state`, `country`, `neighborhood`, `address`, `zip_code`, `latitude`, `longitude`
- Services: `services`, `massage_techniques`, `additional_services`
- Studio: `studio_amenities`, `mobile_extras`, `products_used`
- Pricing: `rate_60`, `rate_90`, `rate_outcall`, `payment_methods`
- Availability: `availability`, `business_trips`
- Professional: `degrees`, `affiliations`, `massage_start_date`, `years_experience`
- Media: `profile_photo`, `gallery`
- And more (see [ia-backend/index.js:251-297](ia-backend/index.js#L251-L297) for full list)

**Example:**
```bash
curl -X PUT http://localhost:4000/api/therapist/update/a0000000-0000-0000-0000-000000000001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "headline": "Expert Massage Therapist",
    "phone": "+1 (555) 999-8888"
  }'
```

**Success Response (200):**
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

**Error Response (400):**
```json
{
  "error": "Failed to update profile",
  "details": "Column 'invalid_field' does not exist"
}
```

**Security Features:**
- Field whitelist (only allowed fields can be updated)
- Cannot update: `user_id`, `status`, `plan`, `subscription_status`, etc.
- Automatic `updated_at` timestamp

---

### 5. Get All Therapists (Public)
**GET** `/api/therapists`

Get a paginated list of all active therapists with optional filters.

**Query Parameters:**
- `city` (optional) - Filter by city (case-insensitive partial match)
- `services` (optional) - Filter by service type
- `limit` (optional, default: 50) - Number of results per page
- `offset` (optional, default: 0) - Pagination offset

**Examples:**
```bash
# Get first 10 therapists
curl "http://localhost:4000/api/therapists?limit=10"

# Get therapists in Los Angeles
curl "http://localhost:4000/api/therapists?city=Los Angeles"

# Get therapists offering Deep Tissue massage
curl "http://localhost:4000/api/therapists?services=Deep Tissue"

# Pagination (get results 20-40)
curl "http://localhost:4000/api/therapists?limit=20&offset=20"
```

**Success Response (200):**
```json
{
  "success": true,
  "therapists": [
    {
      "user_id": "...",
      "display_name": "Alex Santos",
      "city": "Los Angeles",
      "state": "CA",
      ...
    },
    ...
  ],
  "total": null,
  "limit": 50,
  "offset": 0
}
```

**Use Cases:**
- Search results page
- Browse therapists
- City landing pages: `/city/los-angeles`
- Service pages: `/services/deep-tissue`

---

### 6. AI Chat with DeepSeek
**POST** `/deepseek`

Chat with the AI assistant to get therapist recommendations.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "I need a massage therapist in Los Angeles who speaks Spanish"
    }
  ]
}
```

**Response:**
```json
{
  "reply": "Based on your request, I found these therapists in Los Angeles who speak Spanish:\n\n1. Alex Santos - Los Angeles, CA\n   Services: Deep Tissue, Swedish Massage\n   Languages: English, Spanish, Portuguese\n   Contact: +1 (555) 123-4567"
}
```

**Use Cases:**
- AI-powered search
- Natural language queries
- Personalized recommendations

---

## Testing

### Run Test Script
```bash
cd ia-backend
node test-endpoints.js
```

### Test with cURL

**1. Get public profile:**
```bash
curl http://localhost:4000/api/therapist/a0000000-0000-0000-0000-000000000001
```

**2. Update profile:**
```bash
curl -X PUT http://localhost:4000/api/therapist/update/a0000000-0000-0000-0000-000000000001 \
  -H "Content-Type: application/json" \
  -d '{"headline": "Test Update"}'
```

**3. Get therapists by city:**
```bash
curl "http://localhost:4000/api/therapists?city=Los%20Angeles"
```

---

## Test User Credentials

For testing, use the fake therapist account:

- **Email:** `test@test.com`
- **Password:** `123456`
- **User ID:** `a0000000-0000-0000-0000-000000000001`
- **Location:** Los Angeles, CA

---

## Database Schema

The `therapists` table includes these key fields:

```sql
CREATE TABLE therapists (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),

  -- Basic Info
  full_name text,
  display_name text,
  headline text,
  about text,
  philosophy text,

  -- Contact
  email text,
  phone text,
  website text,
  instagram text,
  whatsapp text,

  -- Location
  city text,
  state text,
  country text,
  neighborhood text,
  latitude text,
  longitude text,

  -- Services
  services text[],
  massage_techniques text[],

  -- Pricing
  rate_60 text,
  rate_90 text,
  rate_outcall text,

  -- Professional
  degrees text,
  years_experience integer,
  rating numeric(3,2),

  -- Status
  status text DEFAULT 'pending',
  plan text,
  subscription_status text,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

## TODO: Security Enhancements

Before production, implement:

1. **Authentication Middleware**
   ```javascript
   // Verify JWT token from Supabase Auth
   async function requireAuth(req, res, next) {
     const token = req.headers.authorization?.split('Bearer ')[1];
     // Verify with Supabase
     const { data: { user }, error } = await supabase.auth.getUser(token);
     if (error || !user) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     req.user = user;
     next();
   }
   ```

2. **Authorization Check**
   ```javascript
   // Verify user owns the profile they're editing
   if (req.user.id !== user_id) {
     return res.status(403).json({ error: 'Forbidden' });
   }
   ```

3. **Rate Limiting**
   ```javascript
   import rateLimit from 'express-rate-limit';

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });

   app.use('/api/', limiter);
   ```

4. **Input Validation**
   ```javascript
   import { body, validationResult } from 'express-validator';

   app.put('/api/therapist/update/:user_id', [
     body('email').optional().isEmail(),
     body('phone').optional().isMobilePhone(),
     ...
   ], async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     ...
   });
   ```

---

## Error Codes

- **200** - Success
- **400** - Bad Request (invalid data)
- **401** - Unauthorized (missing/invalid auth token)
- **403** - Forbidden (user doesn't own resource)
- **404** - Not Found (profile doesn't exist)
- **500** - Internal Server Error

---

## Next Steps

1. Add authentication middleware
2. Create frontend components to consume these APIs
3. Implement image upload for `profile_photo` and `gallery`
4. Add search/filter on frontend
5. Create dashboard UI for therapists to edit profiles
6. Add reviews endpoint (`/api/therapist/:user_id/reviews`)
7. Implement SEO-friendly URLs (`/therapist/alex-santos-los-angeles` instead of UUID)
