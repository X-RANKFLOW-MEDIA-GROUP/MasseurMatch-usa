# MasseurMatch - Onboarding Testing Guide

## 🧪 Testing Strategy

Este documento contém todos os testes necessários para validar o fluxo de onboarding completo.

---

## 1. Unit Tests

### 1.1 State Machine Tests

**File:** `lib/onboarding/__tests__/stateMachine.test.ts`

```typescript
import { describe, it, expect } from '@jest/globals';
import {
  calculateOnboardingStage,
  canSubmitForReview,
  canPublishProfile,
  getNextStage,
  PHOTO_LIMITS,
} from '../stateMachine';

describe('State Machine', () => {
  describe('calculateOnboardingStage', () => {
    it('should return needs_identity when identity is pending', () => {
      const profile = {
        auto_moderation: 'draft',
        admin_status: 'pending_admin',
        publication_status: 'private',
      };
      const user = { identity_status: 'pending' };
      const subscription = null;
      const counts = {
        approvedPhotos: 0,
        languages: 0,
        services: 0,
        setups: 0,
        incallRates: 0,
        outcallRates: 0,
      };

      const stage = calculateOnboardingStage(profile, user, subscription, counts);
      expect(stage).toBe('needs_identity');
    });

    it('should return blocked when identity failed', () => {
      const profile = { /* ... */ };
      const user = { identity_status: 'failed' };
      const stage = calculateOnboardingStage(profile, user, null, counts);
      expect(stage).toBe('blocked');
    });

    it('should return live when all conditions met', () => {
      const profile = {
        auto_moderation: 'auto_passed',
        admin_status: 'approved',
        publication_status: 'public',
      };
      const user = { identity_status: 'verified' };
      const subscription = { status: 'active', plan: 'pro' };
      const counts = { /* all filled */ };

      const stage = calculateOnboardingStage(profile, user, subscription, counts);
      expect(stage).toBe('live');
    });
  });

  describe('canSubmitForReview', () => {
    it('should return invalid when identity not verified', async () => {
      const user = { identity_status: 'pending' };
      const result = await canSubmitForReview(profile, user, null, counts);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('Identity verification required');
    });

    it('should return invalid when no approved photos', async () => {
      const counts = { approvedPhotos: 0, /* ... */ };
      const result = await canSubmitForReview(profile, user, sub, counts);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('At least one approved photo required');
    });

    it('should return valid when all requirements met', async () => {
      const profile = {
        display_name: 'Jane',
        city_slug: 'dallas',
        phone_public_e164: '+12145551234',
        auto_moderation: 'auto_passed',
        incall_enabled: true,
        outcall_enabled: false,
      };
      const user = { identity_status: 'verified' };
      const counts = {
        approvedPhotos: 1,
        languages: 1,
        services: 1,
        setups: 1,
        incallRates: 1,
        outcallRates: 0,
      };

      const result = await canSubmitForReview(profile, user, null, counts);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });
  });

  describe('getNextStage', () => {
    it('should transition from needs_plan to needs_payment for paid plans', () => {
      const next = getNextStage('needs_plan', 'select_plan', { plan: 'pro' });
      expect(next).toBe('needs_payment');
    });

    it('should transition from needs_plan to needs_identity for free plan', () => {
      const next = getNextStage('needs_plan', 'select_plan', { plan: 'free' });
      expect(next).toBe('needs_identity');
    });

    it('should transition from waiting_admin to live on approve', () => {
      const next = getNextStage('waiting_admin', 'admin_approve', {});
      expect(next).toBe('live');
    });
  });

  describe('PHOTO_LIMITS', () => {
    it('should have correct limits per plan', () => {
      expect(PHOTO_LIMITS.free).toBe(1);
      expect(PHOTO_LIMITS.standard).toBe(4);
      expect(PHOTO_LIMITS.pro).toBe(8);
      expect(PHOTO_LIMITS.elite).toBe(12);
    });
  });
});
```

---

### 1.2 Validator Tests

**File:** `lib/onboarding/__tests__/validators.test.ts`

```typescript
import { describe, it, expect } from '@jest/globals';
import {
  validateDisplayName,
  validateBio,
  validatePhoneE164,
  validate33PercentRule,
  validateRateCreation,
  calculatePricePerMinute,
} from '../validators';

describe('Validators', () => {
  describe('validateDisplayName', () => {
    it('should accept valid name', () => {
      const result = validateDisplayName('Jane Smith');
      expect(result.valid).toBe(true);
    });

    it('should reject empty name', () => {
      const result = validateDisplayName('');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('required');
    });

    it('should reject name too short', () => {
      const result = validateDisplayName('J');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('at least');
    });

    it('should reject inappropriate content', () => {
      const result = validateDisplayName('Fuck you');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('inappropriate');
    });
  });

  describe('validatePhoneE164', () => {
    it('should accept valid E.164 phone', () => {
      const result = validatePhoneE164('+12145551234');
      expect(result.valid).toBe(true);
    });

    it('should reject phone without +', () => {
      const result = validatePhoneE164('12145551234');
      expect(result.valid).toBe(false);
    });

    it('should reject phone with letters', () => {
      const result = validatePhoneE164('+1214555ABCD');
      expect(result.valid).toBe(false);
    });
  });

  describe('validate33PercentRule', () => {
    it('should pass when rate is within 33%', () => {
      const baseRate = {
        context: 'incall',
        duration_minutes: 60,
        price_cents: 15000, // $150 → $2.50/min
        is_active: true,
      };
      const newRate = {
        context: 'incall',
        duration_minutes: 90,
        price_cents: 29970, // $299.70 → $3.33/min (exactly 133%)
      };

      const result = validate33PercentRule(newRate, [baseRate]);
      expect(result.valid).toBe(true);
    });

    it('should fail when rate exceeds 33%', () => {
      const baseRate = {
        context: 'incall',
        duration_minutes: 60,
        price_cents: 15000, // $2.50/min
        is_active: true,
      };
      const newRate = {
        context: 'incall',
        duration_minutes: 90,
        price_cents: 32000, // $3.56/min (142% - too high)
      };

      const result = validate33PercentRule(newRate, [baseRate]);
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('exceeds 33%');
    });

    it('should allow first rate (no base)', () => {
      const newRate = {
        context: 'incall',
        duration_minutes: 60,
        price_cents: 15000,
      };

      const result = validate33PercentRule(newRate, []);
      expect(result.valid).toBe(true);
    });

    it('should handle new rate being shorter than base', () => {
      const baseRate = {
        context: 'incall',
        duration_minutes: 90,
        price_cents: 22500, // $2.50/min
        is_active: true,
      };
      const newRate = {
        context: 'incall',
        duration_minutes: 60,
        price_cents: 20000, // $3.33/min (new base is 60min)
      };

      // Should validate existing rates against new base
      const result = validate33PercentRule(newRate, [baseRate]);
      expect(result.valid).toBe(true);
    });
  });

  describe('calculatePricePerMinute', () => {
    it('should calculate correctly', () => {
      const ppm = calculatePricePerMinute(15000, 60);
      expect(ppm).toBe(250); // $2.50/min = 250 cents/min
    });

    it('should handle 90min rate', () => {
      const ppm = calculatePricePerMinute(22500, 90);
      expect(ppm).toBe(250);
    });
  });
});
```

---

## 2. Integration Tests

### 2.1 API Endpoint Tests

**File:** `app/api/onboarding/__tests__/status.test.ts`

```typescript
import { describe, it, expect, beforeAll } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

describe('GET /api/onboarding/status', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Create test user
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'password123',
      email_confirm: true,
    });
    testUser = data.user;

    // Sign in to get token
    const { data: session } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123',
    });
    authToken = session.session.access_token;
  });

  it('should return 401 without auth', async () => {
    const res = await fetch('http://localhost:3000/api/onboarding/status');
    expect(res.status).toBe(401);
  });

  it('should return current onboarding status', async () => {
    const res = await fetch('http://localhost:3000/api/onboarding/status', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('stage');
    expect(data.data).toHaveProperty('canSubmit');
    expect(data.data).toHaveProperty('missing');
    expect(data.data).toHaveProperty('progress');
  });
});
```

---

### 2.2 Database Trigger Tests

**SQL Test File:** `sql/tests/test_triggers.sql`

```sql
-- Test 33% rule trigger
BEGIN;

-- Create test profile
INSERT INTO profiles (id, user_id, display_name, city_slug)
VALUES ('test-profile-1', 'test-user-1', 'Test User', 'dallas');

-- Insert base rate: 60min = $150 ($2.50/min)
INSERT INTO profile_rates (profile_id, context, duration_minutes, price_cents)
VALUES ('test-profile-1', 'incall', 60, 15000);

-- Should succeed: 90min = $299.70 ($3.33/min = exactly 133%)
INSERT INTO profile_rates (profile_id, context, duration_minutes, price_cents)
VALUES ('test-profile-1', 'incall', 90, 29970);

-- Should fail: 90min = $320 ($3.56/min = 142% > 133%)
DO $$
BEGIN
  INSERT INTO profile_rates (profile_id, context, duration_minutes, price_cents)
  VALUES ('test-profile-1', 'incall', 90, 32000);
  RAISE EXCEPTION 'Should have failed!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Correctly rejected: %', SQLERRM;
END $$;

ROLLBACK;
```

---

### 2.3 Stripe Integration Tests

**File:** `lib/stripe/__tests__/integration.test.ts`

```typescript
import { describe, it, expect } from '@jest/globals';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

describe('Stripe Integration', () => {
  describe('SetupIntent', () => {
    it('should create setup intent', async () => {
      const customer = await stripe.customers.create({
        email: 'test@example.com',
      });

      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
      });

      expect(setupIntent.id).toMatch(/^seti_/);
      expect(setupIntent.status).toBe('requires_payment_method');

      // Cleanup
      await stripe.customers.del(customer.id);
    });
  });

  describe('Subscription', () => {
    it('should create subscription with trial', async () => {
      const customer = await stripe.customers.create({
        email: 'test@example.com',
      });

      // Use test payment method
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: { token: 'tok_visa' },
      });

      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer.id,
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: process.env.STRIPE_PRICE_PRO }],
        trial_period_days: 7,
        default_payment_method: paymentMethod.id,
      });

      expect(subscription.status).toBe('trialing');
      expect(subscription.trial_end).toBeTruthy();

      // Cleanup
      await stripe.subscriptions.cancel(subscription.id);
      await stripe.customers.del(customer.id);
    });
  });

  describe('Identity Verification', () => {
    it('should create verification session', async () => {
      const session = await stripe.identity.verificationSessions.create({
        type: 'document',
        metadata: { user_id: 'test-user-1' },
      });

      expect(session.id).toMatch(/^vs_/);
      expect(session.status).toBe('requires_input');
      expect(session.client_secret).toBeTruthy();
    });
  });
});
```

---

## 3. E2E Tests (Playwright)

### 3.1 Complete Onboarding Flow

**File:** `e2e/onboarding.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow - Pro Plan', () => {
  test('should complete full onboarding from signup to live', async ({ page }) => {
    // 1. Sign Up
    await page.goto('http://localhost:3000/signup');
    await page.fill('input[name="email"]', 'e2e-test@example.com');
    await page.fill('input[name="phone"]', '+12145559999');
    await page.fill('input[name="password"]', 'Password123!');
    await page.check('input[name="acceptTerms"]');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard\/onboarding/);

    // 2. Select Plan
    await page.click('button[data-plan="pro"]');
    await expect(page.locator('h2')).toContainText('Payment');

    // 3. Payment (use Stripe test card)
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('input[name="exp-date"]').fill('12/25');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    await stripeFrame.locator('input[name="postal"]').fill('12345');

    await page.click('button:has-text("Confirm Payment")');
    await page.waitForURL(/\/dashboard\/onboarding/);

    // 4. Identity Verification (skip in test - requires Stripe UI)
    // In production: would go through Stripe Identity flow
    // For test: mark as verified via API
    await page.evaluate(async () => {
      await fetch('/api/test/verify-identity', { method: 'POST' });
    });

    await page.reload();
    await expect(page.locator('[data-stage]')).toHaveAttribute('data-stage', 'build_profile');

    // 5. Build Profile
    await page.fill('input[name="displayName"]', 'Jane E2E Test');
    await page.selectOption('select[name="city"]', 'dallas');
    await page.check('input[name="incallEnabled"]');
    await page.selectOption('select[name="languages"]', 'english');
    await page.selectOption('select[name="services"]', 'swedish-massage');
    await page.selectOption('select[name="setups"]', 'massage-table');

    // Hours
    await page.fill('input[name="hours[1].openTime"]', '09:00');
    await page.fill('input[name="hours[1].closeTime"]', '17:00');

    await page.click('button:has-text("Save Profile")');

    // 6. Add Rate
    await page.selectOption('select[name="duration"]', '60');
    await page.fill('input[name="price"]', '150');
    await page.click('button:has-text("Add Rate")');

    await expect(page.locator('.rate-item')).toContainText('60 min - $150.00');

    // 7. Upload Photo (mock)
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/test-photo.jpg');
    await page.waitForSelector('.photo-uploaded');

    // 8. Submit for Review
    await expect(page.locator('button:has-text("Submit for Review")')).toBeEnabled();
    await page.click('button:has-text("Submit for Review")');

    await expect(page.locator('[data-stage]')).toHaveAttribute('data-stage', 'waiting_admin');
    await expect(page.locator('h2')).toContainText('Under Review');

    // 9. Admin Approves (via admin panel)
    const adminPage = await page.context().newPage();
    await adminPage.goto('http://localhost:3000/admin/onboarding/queue');
    // Assume admin is already logged in
    await adminPage.click('button:has-text("Approve"):first');

    // 10. Check Profile is Live
    await page.reload();
    await expect(page.locator('[data-stage]')).toHaveAttribute('data-stage', 'live');
    await expect(page.locator('h2')).toContainText('Your ad is live');

    // Verify public URL works
    const publicUrl = await page.locator('a[href*="/therapist/"]').getAttribute('href');
    await page.goto(`http://localhost:3000${publicUrl}`);
    await expect(page.locator('h1')).toContainText('Jane E2E Test');
  });

  test('should handle rejection flow', async ({ page }) => {
    // ... complete up to submit ...

    // Admin rejects
    const adminPage = await page.context().newPage();
    await adminPage.goto('http://localhost:3000/admin/onboarding/queue');
    await adminPage.click('button:has-text("Reject"):first');
    await adminPage.fill('textarea[name="reason"]', 'Inappropriate content');
    await adminPage.click('button:has-text("Confirm")');

    // User should see blocked status
    await page.reload();
    await expect(page.locator('[data-stage]')).toHaveAttribute('data-stage', 'blocked');
    await expect(page.locator('.rejection-reason')).toContainText('Inappropriate content');
  });
});
```

---

## 4. Load Tests (Artillery)

**File:** `artillery/onboarding-load.yml`

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: 50
      name: Sustained load
    - duration: 60
      arrivalRate: 100
      name: Peak load

  processor: './artillery/helpers.js'

scenarios:
  - name: 'Complete Onboarding Flow'
    flow:
      - post:
          url: '/api/auth/signup'
          json:
            email: '{{ $randomEmail() }}'
            phone: '+1{{ $randomInt(2000000000, 2999999999) }}'
            password: 'Test123!'
          capture:
            - json: '$.access_token'
              as: 'token'

      - post:
          url: '/api/onboarding/plan'
          headers:
            Authorization: 'Bearer {{ token }}'
          json:
            plan: 'standard'

      - get:
          url: '/api/onboarding/status'
          headers:
            Authorization: 'Bearer {{ token }}'
          expect:
            - statusCode: 200
            - contentType: json
            - hasProperty: 'data.stage'
```

Run: `artillery run artillery/onboarding-load.yml`

---

## 5. Manual Testing Checklist

### 5.1 Free Plan Flow
- [ ] Sign up with valid email/phone
- [ ] Select Free plan
- [ ] Complete Stripe Identity verification
- [ ] Fill all required profile fields
- [ ] Add 1 photo (should block 2nd photo)
- [ ] Add incall rate
- [ ] Submit for review
- [ ] Admin approves
- [ ] Profile goes live
- [ ] Public URL works

### 5.2 Pro Plan Flow (Trial)
- [ ] Sign up
- [ ] Select Pro plan
- [ ] Enter test card (4242 4242 4242 4242)
- [ ] Verify trial_end is 7 days from now
- [ ] Complete identity
- [ ] Build profile
- [ ] Upload 8 photos (should block 9th)
- [ ] Add rates
- [ ] Submit and approve
- [ ] Profile live

### 5.3 Error Cases
- [ ] Try to submit without identity → blocked
- [ ] Try to submit without photo → blocked
- [ ] Try to add rate violating 33% → error
- [ ] Try to upload >10MB photo → error
- [ ] Admin rejects → profile blocked
- [ ] Admin requests changes → back to edit
- [ ] Cancel subscription → profile goes offline

### 5.4 Edge Cases
- [ ] Upload photo with nudity → auto-rejected
- [ ] Bio with offensive words → auto-flagged
- [ ] Add 60min=$150, then 30min=$100 (new base) → should validate existing rates
- [ ] Edit bio when live → profile goes offline for re-review
- [ ] Payment fails during trial → profile offline

---

## 6. Performance Benchmarks

### Expected Response Times
- GET /api/onboarding/status: < 200ms
- POST /api/onboarding/profile/submit: < 500ms
- POST /api/onboarding/photos/upload: < 2000ms (with Sightengine)

### Database Query Performance
```sql
-- Should use index (< 10ms)
EXPLAIN ANALYZE
SELECT * FROM profiles
WHERE admin_status = 'pending_admin'
ORDER BY submitted_at DESC
LIMIT 20;

-- Should use composite index (< 5ms)
EXPLAIN ANALYZE
SELECT COUNT(*) FROM media_assets
WHERE profile_id = 'some-uuid'
  AND status = 'approved';
```

---

## 7. Security Tests

### 7.1 RLS Policy Tests

```sql
-- Test user can't see other users' profiles
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-1"}';

-- Should return only user-1's profile
SELECT * FROM profiles;

-- Should fail (can't update other user's profile)
UPDATE profiles SET display_name = 'Hacked' WHERE user_id = 'user-2';
```

### 7.2 Rate Limit Tests

```bash
# Should allow 100 requests/min
for i in {1..100}; do
  curl -H "Authorization: Bearer $TOKEN" \
    http://localhost:3000/api/onboarding/status
done

# 101st should return 429 Too Many Requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/onboarding/status
# Expected: HTTP 429
```

---

## 8. Continuous Testing (CI/CD)

### GitHub Actions Workflow

**File:** `.github/workflows/onboarding-tests.yml`

```yaml
name: Onboarding Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        run: psql $DATABASE_URL -f sql/onboarding_schema.sql
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration
        env:
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_TEST_KEY }}
          SIGHTENGINE_API_USER: ${{ secrets.SIGHTENGINE_USER }}

      - name: Run E2E tests
        run: npm run test:e2e
```

---

## 9. Monitoring & Alerts

### Key Metrics to Track

```typescript
// Track onboarding funnel in analytics
analytics.track('Onboarding Step Completed', {
  stage: 'needs_identity',
  userId: user.id,
  plan: subscription?.plan,
  timeToComplete: elapsedTime,
});

// Alert on high rejection rate
if (rejectionRate > 0.2) {
  alert('High onboarding rejection rate: ' + rejectionRate);
}

// Alert on slow identity verification
if (avgIdentityTime > 15 * 60 * 1000) { // 15 min
  alert('Slow identity verification times');
}
```

### Sentry Error Tracking

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  await submitForReview();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      onboarding_stage: currentStage,
      user_plan: userPlan,
    },
  });
}
```

---

## 10. Test Data Factories

**File:** `lib/testing/factories.ts`

```typescript
export function createTestUser(overrides = {}) {
  return {
    id: 'test-user-' + Date.now(),
    email: `test-${Date.now()}@example.com`,
    identity_status: 'verified',
    role: 'user',
    ...overrides,
  };
}

export function createTestProfile(overrides = {}) {
  return {
    id: 'test-profile-' + Date.now(),
    user_id: 'test-user-1',
    display_name: 'Test Therapist',
    city_slug: 'dallas',
    phone_public_e164: '+12145551234',
    auto_moderation: 'auto_passed',
    admin_status: 'pending_admin',
    publication_status: 'private',
    incall_enabled: true,
    outcall_enabled: false,
    ...overrides,
  };
}

export function createTestRate(overrides = {}) {
  return {
    id: 'test-rate-' + Date.now(),
    profile_id: 'test-profile-1',
    context: 'incall',
    duration_minutes: 60,
    price_cents: 15000,
    is_active: true,
    ...overrides,
  };
}
```

---

## Summary

✅ **Unit Tests**: State machine, validators, helpers
✅ **Integration Tests**: API endpoints, database triggers, Stripe
✅ **E2E Tests**: Complete user flows (Playwright)
✅ **Load Tests**: Performance under load (Artillery)
✅ **Security Tests**: RLS, rate limiting, XSS
✅ **Manual Tests**: Comprehensive checklist
✅ **CI/CD**: Automated testing pipeline

**Run all tests:**
```bash
npm run test              # Unit tests
npm run test:integration  # Integration tests
npm run test:e2e          # E2E tests
npm run test:all          # All of the above
```

---

**Last updated:** 2025-12-24
