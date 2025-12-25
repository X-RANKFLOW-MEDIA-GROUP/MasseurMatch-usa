# Onboarding API Endpoints

## Overview
This directory contains all API endpoints related to the therapist onboarding flow, from signup to profile publication.

## Endpoint Structure

```
/api/onboarding/
├── status/              GET    - Get current onboarding status
├── plan/               POST   - Select a plan
├── payment/
│   ├── setup-intent/   POST   - Create Stripe SetupIntent
│   └── subscribe/      POST   - Create subscription
├── identity/
│   ├── start/          POST   - Start Stripe Identity verification
│   └── status/         GET    - Check verification status
├── profile/
│   ├── update/         PUT    - Update profile fields
│   ├── validate/       POST   - Validate profile completeness
│   └── submit/         POST   - Submit for admin review
├── photos/
│   ├── upload/         POST   - Upload photo
│   ├── [id]/           DELETE - Delete photo
│   └── reorder/        PUT    - Reorder photos
├── rates/
│   ├── /               GET    - Get all rates
│   ├── /               POST   - Create rate
│   ├── [id]/           PUT    - Update rate
│   └── [id]/           DELETE - Delete rate
└── hours/
    ├── /               GET    - Get all hours
    ├── /               POST   - Create hours
    └── /               PUT    - Batch update hours
```

## Authentication
All endpoints require authentication via Supabase JWT token.

```typescript
headers: {
  'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { ... }
  }
}
```

## Rate Limiting
- Authenticated users: 100 requests/minute
- Photo uploads: 10 uploads/minute

## Endpoints Detail

### GET /api/onboarding/status
Get current onboarding status and requirements.

**Response:**
```json
{
  "success": true,
  "data": {
    "stage": "build_profile",
    "canSubmit": false,
    "missing": [
      "At least one approved photo required",
      "At least one incall rate required"
    ],
    "progress": {
      "percentComplete": 60,
      "steps": [...]
    },
    "profile": { ... },
    "user": { ... },
    "subscription": { ... }
  }
}
```

### POST /api/onboarding/plan
Select a subscription plan.

**Request:**
```json
{
  "plan": "pro"  // "free" | "standard" | "pro" | "elite"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nextStage": "needs_payment",
    "requiresPayment": true
  }
}
```

### POST /api/onboarding/payment/setup-intent
Create Stripe SetupIntent for card collection.

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "seti_xxx...",
    "customerId": "cus_xxx..."
  }
}
```

### POST /api/onboarding/payment/subscribe
Create subscription after card setup.

**Request:**
```json
{
  "paymentMethodId": "pm_xxx...",
  "plan": "pro"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_xxx...",
    "status": "trialing",
    "trialEnd": "2025-12-31T23:59:59Z",
    "nextStage": "needs_identity"
  }
}
```

### POST /api/onboarding/identity/start
Start Stripe Identity verification session.

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "vs_xxx...",
    "clientSecret": "vs_xxx..._secret_xxx",
    "url": "https://verify.stripe.com/start/..."
  }
}
```

### GET /api/onboarding/identity/status
Check identity verification status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "verified",  // "pending" | "verified" | "failed"
    "nextStage": "build_profile"
  }
}
```

### PUT /api/onboarding/profile/update
Update profile fields.

**Request:**
```json
{
  "displayName": "Jane Smith",
  "bioShort": "Certified massage therapist...",
  "incallEnabled": true,
  "outcallEnabled": true,
  "outcallRadiusMiles": 15,
  "outcallAreas": "Downtown, Midtown"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": { ... },
    "autoModeration": "auto_passed",
    "nextStage": "upload_photos"
  }
}
```

### POST /api/onboarding/profile/validate
Validate if profile is ready for submission.

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": false,
    "missing": [
      "At least one approved photo required",
      "At least one incall rate required"
    ],
    "requirements": {
      "identityVerified": true,
      "moderationPassed": true,
      "hasDisplayName": true,
      "hasCity": true,
      "hasPhone": true,
      "hasLanguages": true,
      "hasServices": true,
      "hasSetups": true,
      "hasHours": true,
      "hasRates": false,
      "hasApprovedPhoto": false,
      "hasActiveSubscription": true
    }
  }
}
```

### POST /api/onboarding/profile/submit
Submit profile for admin review.

**Response:**
```json
{
  "success": true,
  "data": {
    "submittedAt": "2025-12-24T10:00:00Z",
    "nextStage": "waiting_admin",
    "estimatedReviewTime": "24-48 hours"
  }
}
```

### POST /api/onboarding/photos/upload
Upload a photo (multipart/form-data).

**Request:**
```
Content-Type: multipart/form-data

photo: [File]
position: 0
isCover: true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "status": "pending",
    "publicUrl": "https://...",
    "sightengineScore": 0.95,
    "nextStage": "submit_admin"
  }
}
```

### DELETE /api/onboarding/photos/[id]
Delete a photo.

**Response:**
```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

### PUT /api/onboarding/photos/reorder
Reorder photos.

**Request:**
```json
{
  "photoIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated": 3
  }
}
```

### POST /api/onboarding/rates
Create a rate.

**Request:**
```json
{
  "context": "incall",
  "durationMinutes": 60,
  "priceCents": 15000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "context": "incall",
    "durationMinutes": 60,
    "priceCents": 15000,
    "pricePerMinute": 250
  }
}
```

**Error (33% rule violation):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_VIOLATION",
    "message": "Price per minute ($3.00) exceeds 33% above base rate ($2.50). Maximum allowed: $3.33",
    "details": {
      "basePricePerMinute": 250,
      "newPricePerMinute": 300,
      "maxAllowedPerMinute": 333
    }
  }
}
```

### PUT /api/onboarding/hours
Batch update hours (all 7 days).

**Request:**
```json
{
  "hours": [
    { "dayOfWeek": 0, "isClosed": true },
    { "dayOfWeek": 1, "openTime": "09:00", "closeTime": "18:00" },
    { "dayOfWeek": 2, "openTime": "09:00", "closeTime": "18:00" },
    ...
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated": 7
  }
}
```

## Webhooks (handled separately)

### POST /api/webhooks/stripe
Handles Stripe webhooks:
- `payment_intent.succeeded`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `identity.verification_session.verified`
- `identity.verification_session.requires_input`
- `invoice.payment_failed`

### POST /api/webhooks/sightengine
Handles Sightengine webhooks (if using async moderation):
- Image moderation results
- Text moderation results

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Missing or invalid authentication |
| `FORBIDDEN` | User doesn't have permission |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid input data |
| `RATE_VIOLATION` | Rate doesn't meet 33% rule |
| `PHOTO_LIMIT_EXCEEDED` | Exceeded plan photo limit |
| `MODERATION_FAILED` | Content failed moderation |
| `IDENTITY_REQUIRED` | Identity verification required |
| `SUBSCRIPTION_REQUIRED` | Active subscription required |
| `PROFILE_INCOMPLETE` | Profile doesn't meet requirements |
| `ALREADY_SUBMITTED` | Profile already submitted |
| `STRIPE_ERROR` | Stripe API error |
| `STORAGE_ERROR` | File storage error |
| `INTERNAL_ERROR` | Server error |

## Testing

Use the provided test utilities:

```typescript
import { testOnboardingFlow } from '@/lib/onboarding/test-utils';

await testOnboardingFlow({
  plan: 'pro',
  skipIdentity: false,
  autoApprove: true
});
```

## Admin Endpoints

Admin-only endpoints are documented in [/api/admin/README.md](/api/admin/README.md)
