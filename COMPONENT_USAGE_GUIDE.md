# Component Usage Guide

This guide shows how to use the newly created components in MasseurMatch.

---

## 🎨 Design System

### CSS Variables & Utility Classes

```tsx
// Gradient backgrounds
<div className="gradient-primary">Primary gradient (purple to pink)</div>
<div className="gradient-accent">Accent gradient (cyan to purple)</div>

// Gradient text
<h1 className="text-gradient">Gradient Text</h1>

// Glass effect cards
<div className="glass-effect">Glass morphism card</div>

// Animations
<div className="animate-fade-in">Fades in</div>
<div className="animate-slide-in">Slides in from left</div>
<div className="animate-pulse-glow">Pulsing glow effect</div>
```

---

## 🔄 Onboarding Components

### OnboardingFlow

Complete multi-step onboarding with progress tracking.

```tsx
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  return <OnboardingFlow initialStep={0} />;
}
```

**Features:**
- 6-step process with animations
- Progress bar and step indicator
- Glass-effect UI
- Back/Next navigation

### StepIndicator

Visual progress indicator for multi-step processes.

```tsx
import { StepIndicator } from "@/components/onboarding/StepIndicator";

const steps = [
  { id: "step1", label: "Account", description: "Create your account" },
  { id: "step2", label: "Profile", description: "Build your profile" },
  { id: "step3", label: "Review", description: "Review and submit" },
];

<StepIndicator steps={steps} currentStep={1} />
```

---

## 🔍 Explore Components

### SwipeInterface

Complete Tinder-style swipe interface for exploring therapists.

```tsx
import { SwipeInterface } from "@/components/explore/SwipeInterface";

const therapists = [
  {
    id: "1",
    name: "John Doe",
    photo: "/photos/john.jpg",
    age: 28,
    city: "San Francisco",
    state: "CA",
    distance: "2.5 mi",
    rating: 4.8,
    reviewCount: 124,
    services: ["Swedish Massage", "Deep Tissue", "Sports Massage"],
    bio: "Certified massage therapist with 5 years of experience...",
  },
  // ... more therapists
];

<SwipeInterface
  therapists={therapists}
  onLike={(therapist) => console.log("Liked:", therapist)}
  onPass={(therapist) => console.log("Passed:", therapist)}
  onMatchesClick={() => router.push("/matches")}
  matchCount={5}
/>
```

### SwipeCard

Individual swipeable card (used by SwipeInterface).

```tsx
import { SwipeCard } from "@/components/explore/SwipeCard";

<SwipeCard
  therapist={therapistData}
  onSwipe={(direction, therapist) => {
    console.log(`Swiped ${direction}:`, therapist);
  }}
/>
```

---

## 👤 Profile Components

### ProfileView

Complete profile display with tabs, photos, and actions.

```tsx
import { ProfileView } from "@/components/profile/ProfileView";

const profileData = {
  id: "123",
  name: "John Doe",
  age: 28,
  photos: ["/photo1.jpg", "/photo2.jpg", "/photo3.jpg"],
  city: "San Francisco",
  state: "CA",
  rating: 4.8,
  reviewCount: 124,
  bio: "Certified massage therapist...",
  services: ["Swedish Massage", "Deep Tissue", "Hot Stone"],
  languages: ["English", "Spanish"],
  availability: {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    hours: "9 AM - 6 PM",
  },
  rates: {
    incall: "$80/hour",
    outcall: "$120/hour",
  },
  certifications: ["State Licensed", "NCBTMB Certified"],
  experience: "5 years",
  specialties: ["Sports Massage", "Pain Relief"],
};

<ProfileView
  profile={profileData}
  isOwner={false}
  onContact={() => console.log("Contact clicked")}
  onLike={() => console.log("Like clicked")}
  onShare={() => console.log("Share clicked")}
/>
```

---

## 📊 Dashboard Components

### AnalyticsDashboard

Analytics dashboard with stats, charts, and insights.

```tsx
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";

const analyticsData = {
  views: 1234,
  viewsChange: 12.5,
  likes: 89,
  likesChange: -5.2,
  calls: 23,
  callsChange: 18.3,
  messages: 45,
  messagesChange: 8.1,
  topCities: [
    { city: "San Francisco, CA", count: 234 },
    { city: "Los Angeles, CA", count: 189 },
    { city: "San Diego, CA", count: 145 },
  ],
  weeklyViews: [
    { day: "monday", count: 145 },
    { day: "tuesday", count: 178 },
    { day: "wednesday", count: 234 },
    { day: "thursday", count: 198 },
    { day: "friday", count: 267 },
    { day: "saturday", count: 123 },
    { day: "sunday", count: 89 },
  ],
};

<AnalyticsDashboard data={analyticsData} period="week" />
```

---

## ⏳ Loading States

### Skeleton Components

Pre-built skeleton loaders for different layouts.

```tsx
import {
  Skeleton,
  CardSkeleton,
  ProfileCardSkeleton,
  DashboardStatsSkeleton,
  ListSkeleton,
} from "@/components/ui/loading-skeleton";

// Basic skeleton
<Skeleton className="h-8 w-32" />

// Card skeleton
<CardSkeleton />

// Profile card skeleton
<ProfileCardSkeleton />

// Dashboard stats skeleton
<DashboardStatsSkeleton />

// List skeleton (with custom count)
<ListSkeleton count={5} />
```

---

## ⚠️ Empty & Error States

### EmptyState

Display when there's no content.

```tsx
import { EmptyState } from "@/components/ui/empty-state";
import { Heart } from "lucide-react";

<EmptyState
  icon={Heart}
  title="No Favorites Yet"
  description="Start exploring therapists and add your favorites here."
  action={{
    label: "Explore Now",
    onClick: () => router.push("/explore"),
  }}
/>
```

### ErrorState

Display when something goes wrong.

```tsx
import { ErrorState } from "@/components/ui/error-state";

<ErrorState
  title="Failed to Load"
  description="We couldn't load this content. Please try again."
  onRetry={() => refetch()}
/>
```

---

## ♿ Accessibility

### Skip Links

```tsx
import { SkipToMain, SkipLink } from "@/components/ui/skip-link";

// Add at the top of your page
<SkipToMain />

// Custom skip link
<SkipLink href="#section-id">Skip to section</SkipLink>

// Mark your main content
<main id="main-content">
  {/* Your content */}
</main>
```

### Accessibility Utilities

```tsx
import {
  generateAriaLabel,
  handleKeyboardNavigation,
  announceToScreenReader,
  prefersReducedMotion,
} from "@/lib/accessibility";

// Generate ARIA labels
const label = generateAriaLabel("Edit Profile", "for John Doe");

// Handle keyboard events
<div
  onClick={handleAction}
  onKeyDown={(e) => handleKeyboardNavigation(e, handleAction)}
  tabIndex={0}
>
  Clickable div
</div>

// Announce to screen readers
announceToScreenReader("Profile updated successfully", "polite");

// Check for reduced motion preference
const shouldAnimate = !prefersReducedMotion();
```

---

## 🎯 Common Patterns

### Loading State Pattern

```tsx
function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  if (loading) return <CardSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!data) return <EmptyState icon={Inbox} title="No Data" description="..." />;

  return <div>{/* Render data */}</div>;
}
```

### Responsive Grid Pattern

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map((item) => (
    <Card key={item.id} className="glass-effect border-slate-800">
      {/* Card content */}
    </Card>
  ))}
</div>
```

### Animated Card Entry Pattern

```tsx
import { motion } from "framer-motion";

{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card>{/* Content */}</Card>
  </motion.div>
))}
```

---

## 🎨 Color Usage Guide

```tsx
// Backgrounds
className="bg-slate-950"          // Main background
className="bg-slate-900"          // Cards
className="bg-purple-500/10"      // Subtle purple tint

// Text
className="text-white"            // Primary text
className="text-slate-400"        // Secondary text
className="text-purple-400"       // Accent text

// Borders
className="border-slate-800"      // Card borders
className="border-purple-500/20"  // Subtle accent borders

// Buttons
className="bg-gradient-to-r from-purple-500 to-pink-500"  // Primary action
className="bg-white/5 border border-slate-700"             // Secondary action
```

---

## 📱 Mobile Optimization

All components are mobile-first and responsive:

```tsx
// Mobile: 1 column, Desktop: 4 columns
className="grid grid-cols-1 lg:grid-cols-4 gap-4"

// Hide on mobile, show on desktop
className="hidden md:block"

// Different padding on mobile/desktop
className="px-4 md:px-8"

// Touch-friendly sizing
className="h-12 px-6"  // Minimum 44x44px touch target
```

---

**Need help?** All components include TypeScript types and are fully documented with JSDoc comments.
