# MasseurMatch - Onboarding System - Complete Index

## 📚 Documentation Files

### 1. Core Documentation
| File | Purpose | Read Time |
|------|---------|-----------|
| [ONBOARDING-SUMMARY.md](./ONBOARDING-SUMMARY.md) | ⭐ **START HERE** - Executive summary and overview | 5 min |
| [ONBOARDING-COMPLETE-FLOW.md](./ONBOARDING-COMPLETE-FLOW.md) | Complete flow details, rules, and states | 15 min |
| [ONBOARDING-IMPLEMENTATION-GUIDE.md](./ONBOARDING-IMPLEMENTATION-GUIDE.md) | Step-by-step implementation guide | 20 min |
| [ONBOARDING-FLOW-DIAGRAM.md](./ONBOARDING-FLOW-DIAGRAM.md) | Visual flowcharts and diagrams | 10 min |
| [ONBOARDING-TESTING.md](./ONBOARDING-TESTING.md) | Complete testing guide | 15 min |
| [ONBOARDING-INDEX.md](./ONBOARDING-INDEX.md) | This file - navigation index | 2 min |

### 2. API Documentation
| File | Purpose |
|------|---------|
| [app/api/onboarding/README.md](./masseurmatch-nextjs/app/api/onboarding/README.md) | API endpoints documentation |

---

## 💾 Database Files

### SQL Schema
| File | Purpose | Tables/Objects |
|------|---------|----------------|
| [sql/onboarding_schema.sql](./sql/onboarding_schema.sql) | Complete database schema | 11 enums, 4 tables, 8 triggers, 2 helper functions, RLS policies |

**What it creates:**
- ✅ Enums: identity_status, subscription_plan, auto_moderation, admin_status, publication_status, onboarding_stage, etc.
- ✅ Tables: subscriptions, media_assets, profile_rates, profile_hours
- ✅ Triggers: 33% rule validation, photo limit enforcement, auto-cover photo
- ✅ Functions: can_submit_for_review(), can_publish_profile()
- ✅ RLS: Row-level security policies

---

## 🧠 Business Logic Files

### TypeScript Libraries
| File | Purpose | Exports |
|------|---------|---------|
| [lib/onboarding/stateMachine.ts](./masseurmatch-nextjs/lib/onboarding/stateMachine.ts) | State machine logic | Types, interfaces, transitions, validators |
| [lib/onboarding/validators.ts](./masseurmatch-nextjs/lib/onboarding/validators.ts) | Field and rate validators | Display name, bio, phone, rates, 33% rule |

**Key Functions:**
- `calculateOnboardingStage()` - Determine current stage based on profile state
- `canSubmitForReview()` - Validate all submission requirements
- `canPublishProfile()` - Check if profile can go live
- `validate33PercentRule()` - Enforce rate pricing rule
- `validateProfile()` - Batch validation of all fields

---

## 🌐 API Endpoints

### Implemented Examples
| File | Method | Endpoint | Purpose |
|------|--------|----------|---------|
| [app/api/onboarding/status/route.ts](./masseurmatch-nextjs/app/api/onboarding/status/route.ts) | GET | /api/onboarding/status | Get current onboarding status |
| [app/api/onboarding/profile/submit/route.ts](./masseurmatch-nextjs/app/api/onboarding/profile/submit/route.ts) | POST | /api/onboarding/profile/submit | Submit profile for admin review |

### To Be Implemented
- [ ] POST /api/onboarding/plan - Select plan
- [ ] POST /api/stripe/setup-intent - Create payment setup
- [ ] POST /api/stripe/subscribe - Create subscription
- [ ] POST /api/stripe/identity/start - Start identity verification
- [ ] PUT /api/onboarding/profile/update - Update profile
- [ ] POST /api/onboarding/photos/upload - Upload photo
- [ ] POST /api/onboarding/rates - Create rate
- [ ] PUT /api/onboarding/hours - Update hours

---

## 🎯 Quick Start Guide

### For Product Managers
**Read first:**
1. [ONBOARDING-SUMMARY.md](./ONBOARDING-SUMMARY.md) - Understand what was built
2. [ONBOARDING-FLOW-DIAGRAM.md](./ONBOARDING-FLOW-DIAGRAM.md) - See visual flow

**Then:**
- Review pricing tiers and features
- Understand rejection/approval flows
- Check metrics and KPIs

---

### For Developers
**Read first:**
1. [ONBOARDING-SUMMARY.md](./ONBOARDING-SUMMARY.md) - Overview
2. [ONBOARDING-IMPLEMENTATION-GUIDE.md](./ONBOARDING-IMPLEMENTATION-GUIDE.md) - Implementation steps

**Then:**
```bash
# 1. Setup database
psql $DATABASE_URL -f sql/onboarding_schema.sql

# 2. Install dependencies
npm install stripe @stripe/stripe-js sightengine

# 3. Configure environment
cp .env.example .env.local
# Add: STRIPE_SECRET_KEY, SIGHTENGINE_API_USER, etc.

# 4. Run migrations
npm run db:migrate

# 5. Start dev server
npm run dev
```

**Next:**
- Implement remaining API endpoints
- Build frontend components
- Setup Stripe webhooks
- Configure Sightengine

---

### For QA Engineers
**Read first:**
1. [ONBOARDING-TESTING.md](./ONBOARDING-TESTING.md) - Complete testing guide

**Then:**
```bash
# Run tests
npm run test              # Unit tests
npm run test:integration  # Integration tests
npm run test:e2e          # E2E tests

# Load testing
artillery run artillery/onboarding-load.yml
```

**Test scenarios:**
- Free plan flow
- Pro plan flow (with trial)
- Error cases (rejection, invalid data)
- Edge cases (payment failures, rate violations)

---

### For DevOps
**Setup required:**
1. Database: PostgreSQL 15+ (via Supabase)
2. Storage: Supabase Storage bucket `profile-photos`
3. Stripe: Products, prices, webhooks
4. Sightengine: API credentials
5. CI/CD: GitHub Actions (see [ONBOARDING-TESTING.md](./ONBOARDING-TESTING.md))

**Environment variables:**
```env
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
SIGHTENGINE_API_USER=
SIGHTENGINE_API_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 📊 Feature Breakdown

### Phase 1: Core Onboarding ✅
- [x] Database schema
- [x] State machine logic
- [x] Field validators
- [x] 33% rate rule
- [x] Photo limits by plan
- [ ] API endpoints (2/15 implemented)

### Phase 2: Integrations ⏳
- [ ] Stripe Customer + Payment
- [ ] Stripe Subscriptions (with/without trial)
- [ ] Stripe Identity verification
- [ ] Sightengine text moderation
- [ ] Sightengine image moderation
- [ ] Webhook handlers (Stripe + Sightengine)

### Phase 3: Frontend ⏳
- [ ] Onboarding dashboard
- [ ] Progress indicator
- [ ] Plan selector
- [ ] Payment form (Stripe Elements)
- [ ] Identity verification flow
- [ ] Profile builder (multi-step form)
- [ ] Rate manager component
- [ ] Photo uploader component
- [ ] Admin review queue

### Phase 4: Admin Panel ⏳
- [ ] Pending profiles queue
- [ ] Profile review interface
- [ ] Approve/Reject/Request Changes actions
- [ ] Admin notes system
- [ ] Bulk actions
- [ ] Analytics dashboard

### Phase 5: Testing & QA ⏳
- [ ] Unit tests (validators, state machine)
- [ ] Integration tests (API, database)
- [ ] E2E tests (Playwright)
- [ ] Load tests (Artillery)
- [ ] Security tests (RLS, XSS)
- [ ] Manual testing (all flows)

### Phase 6: Launch Prep ⏳
- [ ] Email notifications
- [ ] SMS notifications (Twilio)
- [ ] Error monitoring (Sentry)
- [ ] Analytics (PostHog/Mixpanel)
- [ ] Performance monitoring
- [ ] Documentation (user guides)

---

## 🔑 Key Concepts

### States & Stages
- **11 onboarding stages**: start → needs_plan → needs_payment → ... → live
- **3 moderation states**: auto_passed, auto_flagged, auto_blocked
- **4 admin states**: pending_admin, approved, rejected, changes_requested
- **2 publication states**: private, public

### Rules
1. **Identity Verification**: Required for ALL users (free + paid)
2. **33% Rate Rule**: No rate can have price/min > 133% of base rate
3. **Photo Limits**: Free: 1, Standard: 4, Pro: 8, Elite: 12
4. **Sensitive Edits**: Editing photos/bio/rates after live = back to admin review
5. **Payment Gates**: Paid plans must maintain active/trialing subscription

### Pricing
- **Free**: $0/mo, 1 photo, basic features
- **Standard**: $29/mo, 4 photos, SEO
- **Pro**: $59/mo, 8 photos, 7-day trial, Spike Insights
- **Elite**: $119/mo, 12 photos, 7-day trial, Spike Predictor

---

## 📈 Success Metrics

### Conversion Funnel
- Signup → Identity Started: Target 85%
- Identity Verified: Target 90% of started
- Profile Submitted: Target 80% of verified
- Admin Approved: Target 90% of submitted
- Active 7 Days: Target 80% of approved

### Time Metrics
- Identity Verification: < 10 min (avg)
- Profile Completion: < 20 min (avg)
- Admin Review: < 48 hours (max)
- Total Time to Live: < 3 days

### Quality Metrics
- Identity Fail Rate: < 5%
- Sightengine Block Rate: < 10%
- Admin Rejection Rate: < 15%
- User Satisfaction: > 4.5/5

---

## 🆘 Troubleshooting

### Common Issues

#### "Can't submit for review"
**Check:**
1. Identity verified? `users.identity_status = 'verified'`
2. Content passed moderation? `profiles.auto_moderation = 'auto_passed'`
3. All required fields filled?
4. At least 1 approved photo?
5. Rates added for enabled contexts?

#### "Photo upload fails"
**Check:**
1. File type (JPEG, PNG, WebP only)
2. File size (< 10MB)
3. Photo limit for plan not exceeded
4. Supabase Storage bucket exists and is public
5. RLS policies allow upload

#### "Rate rejected - 33% violation"
**Check:**
1. Calculate base rate price/min
2. New rate price/min must be ≤ base × 1.33
3. Example: If base is $2.50/min, max is $3.33/min

---

## 📞 Support & Resources

### Documentation
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Identity](https://stripe.com/docs/identity)
- [Sightengine API](https://sightengine.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Internal
- [API Endpoint Docs](./masseurmatch-nextjs/app/api/onboarding/README.md)
- [Database Schema](./sql/onboarding_schema.sql)
- [Testing Guide](./ONBOARDING-TESTING.md)

### External Tools
- Stripe Dashboard: https://dashboard.stripe.com
- Sightengine Dashboard: https://sightengine.com/dashboard
- Supabase Dashboard: https://app.supabase.com

---

## 🗂️ File Tree

```
MasseurMatch-usa/
├── README.md
├── ONBOARDING-INDEX.md              ← This file
├── ONBOARDING-SUMMARY.md            ← Start here
├── ONBOARDING-COMPLETE-FLOW.md      ← Detailed flow
├── ONBOARDING-IMPLEMENTATION-GUIDE.md ← Step-by-step guide
├── ONBOARDING-FLOW-DIAGRAM.md       ← Visual diagrams
├── ONBOARDING-TESTING.md            ← Testing guide
│
├── sql/
│   └── onboarding_schema.sql        ← Database schema
│
├── masseurmatch-nextjs/
│   ├── app/
│   │   └── api/
│   │       └── onboarding/
│   │           ├── README.md        ← API docs
│   │           ├── status/
│   │           │   └── route.ts     ← GET status
│   │           └── profile/
│   │               └── submit/
│   │                   └── route.ts ← POST submit
│   │
│   └── lib/
│       └── onboarding/
│           ├── stateMachine.ts      ← State logic
│           └── validators.ts        ← Validators
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## ✅ Checklist for Implementation

### Week 1: Foundation
- [ ] Run database migrations
- [ ] Setup Stripe products/prices
- [ ] Configure Sightengine
- [ ] Setup Supabase Storage
- [ ] Implement core API endpoints

### Week 2: Integrations
- [ ] Stripe payment flow
- [ ] Stripe Identity flow
- [ ] Sightengine moderation
- [ ] Webhook handlers
- [ ] Email notifications

### Week 3: Frontend
- [ ] Onboarding dashboard
- [ ] Plan selector + payment
- [ ] Profile builder
- [ ] Photo uploader
- [ ] Rate manager

### Week 4: Admin & Testing
- [ ] Admin review queue
- [ ] Admin actions (approve/reject)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

### Week 5: Polish & Launch
- [ ] Error handling
- [ ] Loading states
- [ ] Success messages
- [ ] Analytics tracking
- [ ] Performance optimization
- [ ] Production deploy

---

## 🎉 What You Have Now

✅ **Complete architecture** for onboarding system
✅ **Database schema** with triggers and validators
✅ **State machine** logic for all transitions
✅ **Field validators** including 33% rule
✅ **API structure** with 2 example endpoints
✅ **Comprehensive documentation** (6 files)
✅ **Testing strategy** with examples
✅ **Implementation roadmap** with timelines

## 🚀 What's Next

1. **Choose**: Start with implementation guide
2. **Setup**: Database + Stripe + Sightengine
3. **Build**: API endpoints + Frontend components
4. **Test**: All flows (free, paid, errors)
5. **Deploy**: Staging → Production
6. **Monitor**: Analytics + Error tracking
7. **Iterate**: Based on user feedback

---

**Questions?** Refer to the specific doc for your role:
- PM → [ONBOARDING-SUMMARY.md](./ONBOARDING-SUMMARY.md)
- Dev → [ONBOARDING-IMPLEMENTATION-GUIDE.md](./ONBOARDING-IMPLEMENTATION-GUIDE.md)
- QA → [ONBOARDING-TESTING.md](./ONBOARDING-TESTING.md)

**Last Updated:** 2025-12-24
**Status:** ✅ Architecture Complete, ⏳ Implementation Pending
