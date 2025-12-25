# API Integration Points - FASE 2

This document outlines where and how the frontend components need to be connected to backend APIs.

---

## 🎯 Onboarding Flow

### Component: `OnboardingFlow.tsx`

**Location:** [masseurmatch-nextjs/components/onboarding/OnboardingFlow.tsx](masseurmatch-nextjs/components/onboarding/OnboardingFlow.tsx:1)

**Current State:** Placeholder UI with static content

**Needs Integration With:**

#### 1. Plan Selection (Step 1)
```typescript
// POST /api/onboarding/select-plan
{
  planId: "free" | "standard" | "pro" | "elite"
}

// Response
{
  requiresPayment: boolean,
  nextStep: "payment" | "identity"
}
```

#### 2. Payment Setup (Step 2)
```typescript
// POST /api/subscription/create-setup-intent
{
  planId: string
}

// Response (Stripe)
{
  clientSecret: string,
  subscriptionId: string
}

// After Stripe confirmation
// POST /api/subscription/confirm
{
  setupIntentId: string,
  subscriptionId: string
}
```

#### 3. Identity Verification (Step 3)
```typescript
// POST /api/onboarding/create-identity-session
{
  // No body needed
}

// Response (Stripe Identity)
{
  clientSecret: string,
  sessionId: string
}

// Webhook will update users.identity_status
```

#### 4. Profile Building (Step 4)
```typescript
// POST /api/onboarding/update-profile
{
  displayName: string,
  city: string,
  state: string,
  phone: string,  // E.164 format
  languages: string[],
  services: string[],
  setups: string[],
  bio: string
}

// POST /api/onboarding/update-rates
{
  rates: {
    incall?: { duration: number, price: number }[],
    outcall?: { duration: number, price: number }[]
  }
}

// POST /api/onboarding/update-hours
{
  hours: {
    monday?: { open: string, close: string },
    // ... other days
  }
}
```

#### 5. Photo Upload (Step 5)
```typescript
// POST /api/onboarding/upload-photo
// FormData with file

// Response
{
  assetId: string,
  url: string,
  moderationStatus: "pending" | "approved" | "rejected",
  sightengineResult?: object
}

// GET /api/onboarding/photos
// Response
{
  photos: Array<{
    id: string,
    url: string,
    status: "pending" | "approved" | "rejected",
    uploadedAt: string
  }>,
  maxPhotos: number,
  currentCount: number
}
```

#### 6. Submit for Review (Step 6)
```typescript
// POST /api/onboarding/submit-for-review
// No body

// Response
{
  success: boolean,
  errors?: string[],  // If validation fails
  nextStage?: "waiting_admin"
}

// Validation checklist:
// - identity_status === "verified"
// - auto_moderation === "auto_passed"
// - All required profile fields filled
// - Rates valid (33% price/minute max)
// - At least one approved photo
// - Subscription active (for paid plans)
```

**Update Needed:**
Replace placeholder content in `renderStepContent()` function with actual form components that call these APIs.

---

## 🔍 Explore / Swipe Interface

### Component: `SwipeInterface.tsx`

**Location:** [masseurmatch-nextjs/components/explore/SwipeInterface.tsx](masseurmatch-nextjs/components/explore/SwipeInterface.tsx:1)

**Current State:** Takes therapists array as prop, no API calls

**Needs Integration With:**

```typescript
// GET /api/explore/therapists
// Query params:
{
  city?: string,
  state?: string,
  lat?: number,
  lng?: number,
  radius?: number,  // miles
  services?: string[],
  minRating?: number,
  offset?: number,
  limit?: number
}

// Response
{
  therapists: Array<{
    id: string,
    name: string,
    photo: string,
    age?: number,
    city: string,
    state: string,
    distance?: string,
    rating?: number,
    reviewCount?: number,
    services: string[],
    bio: string
  }>,
  hasMore: boolean,
  total: number
}

// POST /api/explore/like
{
  therapistId: string
}

// POST /api/explore/pass
{
  therapistId: string
}

// GET /api/explore/matches
// Response
{
  matches: Array<{
    therapistId: string,
    matchedAt: string,
    // ... therapist data
  }>
}
```

**Update Needed:**
- Add `useSWR` or `useQuery` hook to fetch therapists
- Implement infinite scroll to load more therapists
- Call like/pass endpoints on swipe
- Add loading states using `CardSkeleton`

---

## 👤 Profile View

### Component: `ProfileView.tsx`

**Location:** [masseurmatch-nextjs/components/profile/ProfileView.tsx](masseurmatch-nextjs/components/profile/ProfileView.tsx:1)

**Current State:** Takes profile data as prop

**Needs Integration With:**

```typescript
// GET /api/therapists/:slug
// or
// GET /api/therapists/:id

// Response
{
  id: string,
  slug: string,
  name: string,
  age?: number,
  photos: string[],
  city: string,
  state: string,
  rating?: number,
  reviewCount?: number,
  bio: string,
  services: string[],
  languages: string[],
  availability?: {
    days: string[],
    hours: string
  },
  rates?: {
    incall?: string,
    outcall?: string
  },
  certifications?: string[],
  experience?: string,
  specialties?: string[],
  publicationStatus: "public" | "pending" | "draft"
}

// POST /api/therapists/:id/contact
{
  message: string
}

// POST /api/therapists/:id/favorite
// (toggle favorite)

// GET /api/therapists/:id/reviews
{
  reviews: Array<{
    id: string,
    rating: number,
    text: string,
    author: string,
    createdAt: string
  }>,
  averageRating: number,
  totalCount: number
}
```

**Update Needed:**
- Fetch profile data from API
- Implement contact/message functionality
- Add favorite toggle
- Load reviews in Reviews tab

---

## 📊 Analytics Dashboard

### Component: `AnalyticsDashboard.tsx`

**Location:** [masseurmatch-nextjs/components/dashboard/AnalyticsDashboard.tsx](masseurmatch-nextjs/components/dashboard/AnalyticsDashboard.tsx:1)

**Current State:** Takes analytics data as prop

**Needs Integration With:**

```typescript
// GET /api/analytics/overview
// Query params:
{
  period: "week" | "month" | "year",
  therapistId?: string  // If admin viewing specific therapist
}

// Response
{
  views: number,
  viewsChange: number,  // Percentage
  likes: number,
  likesChange: number,
  calls: number,
  callsChange: number,
  messages: number,
  messagesChange: number,
  topCities: Array<{
    city: string,
    count: number
  }>,
  weeklyViews: Array<{
    day: string,
    count: number
  }>
}

// GET /api/analytics/detailed
// More granular analytics for Pro/Elite plans
{
  hourlyBreakdown: Array<{ hour: number, views: number }>,
  deviceBreakdown: { mobile: number, desktop: number },
  referrerSources: Array<{ source: string, count: number }>,
  // ... Spike Insights data
}
```

**Update Needed:**
- Fetch analytics data based on selected period
- Add period selector (week/month/year)
- Implement real-time updates (polling or websocket)
- Add export functionality

---

## 🎨 Additional API Endpoints Needed

### Photo Moderation

```typescript
// Webhook: POST /api/webhooks/sightengine
// Receives Sightengine moderation results
{
  customId: string,  // media_asset.id
  status: "approved" | "rejected",
  reason?: string
}
```

### Stripe Webhooks

```typescript
// POST /api/webhooks/stripe
// Events to handle:
// - customer.subscription.created
// - customer.subscription.updated
// - customer.subscription.deleted
// - invoice.payment_succeeded
// - invoice.payment_failed
// - setup_intent.succeeded
```

### Admin Endpoints

```typescript
// GET /api/admin/pending-profiles
{
  profiles: Array<{
    id: string,
    name: string,
    submittedAt: string,
    plan: string,
    // ... profile data
  }>
}

// POST /api/admin/approve-profile/:id
{
  approved: boolean,
  reason?: string
}

// POST /api/admin/block-profile/:id
{
  reason: string
}
```

---

## 🔧 Frontend State Management Recommendations

### For Onboarding:
- Use **React Context** for onboarding state
- Persist to localStorage for resume capability
- Clear on completion

### For Explore:
- Use **SWR** or **React Query** for caching
- Implement optimistic updates for like/pass
- Prefetch next batch of therapists

### For Profile:
- Cache profile data in SWR
- Invalidate on updates
- Share cache across app

### For Dashboard:
- Poll every 30 seconds for new data
- Use **React Query** with refetch intervals
- Cache for offline viewing

---

## 📝 Example Integration (Onboarding Step 1)

**Before (Current):**
```tsx
function renderStepContent(step: number) {
  return (
    <div className="space-y-4">
      <p className="text-slate-300">Plan selection content goes here...</p>
    </div>
  );
}
```

**After (With API):**
```tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function PlanSelectionStep({ onNext }: { onNext: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plans = [
    { id: "free", name: "Free", price: "$0/month" },
    { id: "standard", name: "Standard", price: "$29/month" },
    { id: "pro", name: "Pro", price: "$59/month" },
    { id: "elite", name: "Elite", price: "$119/month" },
  ];

  const handleSelectPlan = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/select-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const data = await response.json();

      if (data.requiresPayment) {
        // Go to payment step
      } else {
        // Skip to identity
      }

      onNext();
    } catch (error) {
      console.error("Failed to select plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-800 hover:border-slate-700"
            }`}
          >
            {/* Plan details */}
          </Card>
        ))}
      </div>

      <Button
        onClick={handleSelectPlan}
        disabled={!selectedPlan || loading}
        className="w-full"
      >
        {loading ? "Selecting..." : "Continue"}
      </Button>
    </div>
  );
}
```

---

**Next Steps:**
1. CODEX: Implement all API endpoints listed above
2. CODEX: Set up webhooks for Stripe and Sightengine
3. CLAUDE: Integrate APIs into components
4. CLAUDE: Add error handling and loading states
5. CLAUDE: Add real-time features (polling/websockets)

---

**Ready for API Integration:** ✅
**All endpoints documented:** ✅
**Example integrations provided:** ✅
