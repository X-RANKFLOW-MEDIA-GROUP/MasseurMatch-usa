# MasseurMatch - Onboarding Implementation Guide

## 📋 Overview

Este guia fornece um roadmap completo para implementar o fluxo de onboarding do MasseurMatch, desde a escolha de planos até a publicação do anúncio.

## 📦 Estrutura de Arquivos Criados

```
MasseurMatch-usa/
├── ONBOARDING-COMPLETE-FLOW.md          # Documentação completa do fluxo
├── ONBOARDING-IMPLEMENTATION-GUIDE.md   # Este arquivo
├── sql/
│   └── onboarding_schema.sql            # Schema completo do banco
└── masseurmatch-nextjs/
    ├── lib/
    │   └── onboarding/
    │       ├── stateMachine.ts          # Lógica de estados e transições
    │       └── validators.ts            # Validações de campos e rates
    └── app/
        └── api/
            └── onboarding/
                ├── README.md            # Documentação dos endpoints
                ├── status/
                │   └── route.ts         # GET status do onboarding
                └── profile/
                    └── submit/
                        └── route.ts     # POST submeter para admin
```

## 🚀 Passos de Implementação

### Phase 1: Database Setup ✅

#### 1.1 Executar Migrations

```bash
# Execute o schema SQL
psql $DATABASE_URL -f sql/onboarding_schema.sql
```

**O que isso cria:**
- Enums para todos os estados
- Tabelas: `subscriptions`, `media_assets`, `profile_rates`, `profile_hours`
- Colunas novas em `users` e `profiles`
- Triggers para validação (33% rule, photo limits, etc.)
- Funções helper (`can_submit_for_review`, `can_publish_profile`)
- Row Level Security (RLS) policies

#### 1.2 Verificar Tabelas Existentes

Certifique-se que estas tabelas já existem:
- `users`
- `profiles`
- `profile_languages` (junction)
- `profile_services` (junction)
- `profile_setups` (junction)

Se não existirem, crie-as primeiro.

---

### Phase 2: Stripe Integration 🔐

#### 2.1 Configurar Stripe

```bash
# Install Stripe SDK
npm install stripe @stripe/stripe-js
```

**Variáveis de ambiente (.env.local):**
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_IDENTITY_VERIFICATION_SESSION_URL=https://verify.stripe.com
```

#### 2.2 Criar Produtos e Preços no Stripe Dashboard

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá em Products → Create Product

**Standard - $29/mês:**
```
Name: Standard Plan
Price: $29.00 USD/month
Billing Period: Monthly
```

**Pro - $59/mês (7 dias trial):**
```
Name: Pro Plan
Price: $59.00 USD/month
Billing Period: Monthly
Trial Period: 7 days
```

**Elite - $119/mês (7 dias trial):**
```
Name: Elite Plan
Price: $119.00 USD/month
Billing Period: Monthly
Trial Period: 7 days
```

Copie os Price IDs (começam com `price_...`).

#### 2.3 Configurar Stripe Identity

1. Vá em Identity → Settings
2. Ative o Identity verification
3. Configure os tipos de documento aceitos (Passport, Driver's License, etc.)
4. Configure o webhook endpoint

#### 2.4 Implementar Endpoints de Pagamento

Crie estes endpoints:

**`app/api/stripe/setup-intent/route.ts`**
```typescript
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Create or get customer
  let customerId = user.user_metadata?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;

    // Save to database
    await supabase.from('users').update({
      stripe_customer_id: customerId
    }).eq('id', user.id);
  }

  // Create SetupIntent
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  });

  return Response.json({
    clientSecret: setupIntent.client_secret,
    customerId,
  });
}
```

**`app/api/stripe/subscribe/route.ts`**
```typescript
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS = {
  standard: 'price_standard_...',  // Substitua pelos IDs reais
  pro: 'price_pro_...',
  elite: 'price_elite_...',
};

export async function POST(request: Request) {
  const { paymentMethodId, plan } = await request.json();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: userData } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  // Attach payment method
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: userData.stripe_customer_id,
  });

  // Set as default
  await stripe.customers.update(userData.stripe_customer_id, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  // Create subscription
  const subscriptionParams: Stripe.SubscriptionCreateParams = {
    customer: userData.stripe_customer_id,
    items: [{ price: PRICE_IDS[plan as keyof typeof PRICE_IDS] }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  };

  // Add trial for Pro/Elite
  if (plan === 'pro' || plan === 'elite') {
    subscriptionParams.trial_period_days = 7;
  }

  const subscription = await stripe.subscriptions.create(subscriptionParams);

  // Save to database
  await supabase.from('subscriptions').insert({
    user_id: user.id,
    plan,
    status: subscription.status,
    stripe_subscription_id: subscription.id,
    stripe_payment_method_id: paymentMethodId,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
  });

  return Response.json({
    subscriptionId: subscription.id,
    status: subscription.status,
    trialEnd: subscription.trial_end,
  });
}
```

**`app/api/stripe/identity/start/route.ts`**
```typescript
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const verificationSession = await stripe.identity.verificationSessions.create({
    type: 'document',
    metadata: {
      user_id: user.id,
    },
  });

  // Save session ID
  await supabase.from('users').update({
    stripe_identity_session_id: verificationSession.id,
  }).eq('id', user.id);

  return Response.json({
    sessionId: verificationSession.id,
    clientSecret: verificationSession.client_secret,
    url: verificationSession.url,
  });
}
```

#### 2.5 Configurar Webhooks

**`app/api/webhooks/stripe/route.ts`**
```typescript
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case 'identity.verification_session.verified': {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      await supabase
        .from('users')
        .update({ identity_status: 'verified' })
        .eq('stripe_identity_session_id', session.id);
      break;
    }

    case 'identity.verification_session.requires_input': {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      await supabase
        .from('users')
        .update({ identity_status: 'failed' })
        .eq('stripe_identity_session_id', session.id);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000),
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', invoice.subscription as string);
      }
      break;
    }
  }

  return Response.json({ received: true });
}
```

Configure o webhook no Stripe Dashboard:
- URL: `https://yourdomain.com/api/webhooks/stripe`
- Events: `identity.*`, `customer.subscription.*`, `invoice.payment_failed`

---

### Phase 3: Sightengine Integration 🔍

#### 3.1 Configurar Sightengine

```bash
npm install sightengine
```

**.env.local:**
```env
SIGHTENGINE_API_USER=your_user
SIGHTENGINE_API_SECRET=your_secret
```

#### 3.2 Criar Helper de Moderação

**`lib/sightengine/moderate.ts`**
```typescript
import sightengine from 'sightengine';

const client = sightengine(
  process.env.SIGHTENGINE_API_USER!,
  process.env.SIGHTENGINE_API_SECRET!
);

export async function moderateText(text: string) {
  const response = await client.check(['offensive', 'personal']).set_text(text);

  if (response.offensive.prob > 0.7 || response.personal.matches.length > 0) {
    return { status: 'auto_blocked', response };
  } else if (response.offensive.prob > 0.5) {
    return { status: 'auto_flagged', response };
  }
  return { status: 'auto_passed', response };
}

export async function moderateImage(imageUrl: string) {
  const response = await client
    .check(['nudity', 'wad', 'offensive'])
    .set_url(imageUrl);

  const { nudity, weapon, drugs, offensive } = response;

  if (nudity.raw > 0.8 || weapon > 0.7 || drugs > 0.7 || offensive.prob > 0.7) {
    return { status: 'rejected', reason: 'Content policy violation', response };
  } else if (nudity.raw > 0.6 || offensive.prob > 0.5) {
    return { status: 'rejected', reason: 'Flagged for manual review', response };
  }
  return { status: 'approved', response };
}
```

#### 3.3 Implementar Upload de Fotos

**`app/api/onboarding/photos/upload/route.ts`**
```typescript
import { createClient } from '@/lib/supabase/server';
import { moderateImage } from '@/lib/sightengine/moderate';
import { validateImageFile } from '@/lib/onboarding/validators';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('photo') as File;

  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return Response.json({ error: validation.errors }, { status: 400 });
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  // Upload to Supabase Storage
  const fileName = `${profile.id}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file);

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName);

  // Moderate with Sightengine
  const moderation = await moderateImage(urlData.publicUrl);

  // Save to database
  const { data: mediaAsset } = await supabase
    .from('media_assets')
    .insert({
      profile_id: profile.id,
      status: moderation.status,
      storage_path: fileName,
      public_url: urlData.publicUrl,
      sightengine_response: moderation.response,
      rejection_reason: moderation.reason,
    })
    .select()
    .single();

  return Response.json({
    success: true,
    data: mediaAsset,
  });
}
```

---

### Phase 4: Frontend Components 🎨

#### 4.1 Onboarding Dashboard

**`app/dashboard/onboarding/page.tsx`**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    const res = await fetch('/api/onboarding/status');
    const data = await res.json();
    setStatus(data.data);
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span>Progress</span>
          <span>{status.progress.percentComplete}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${status.progress.percentComplete}%` }}
          />
        </div>
      </div>

      {/* Stage Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-900">{status.message}</p>
      </div>

      {/* Missing Requirements */}
      {status.missing.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Required to submit:</h3>
          <ul className="list-disc list-inside space-y-1">
            {status.missing.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Stage-specific content */}
      {renderStageContent(status.stage)}

      {/* Submit Button */}
      {status.canSubmit && (
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          Submit for Admin Review
        </button>
      )}
    </div>
  );

  function renderStageContent(stage: string) {
    switch (stage) {
      case 'needs_plan':
        return <PlanSelector />;
      case 'needs_payment':
        return <PaymentForm />;
      case 'needs_identity':
        return <IdentityVerification />;
      case 'build_profile':
        return <ProfileBuilder />;
      case 'upload_photos':
        return <PhotoUploader />;
      case 'waiting_admin':
        return <AdminWaitingMessage />;
      case 'live':
        return <LiveProfileMessage />;
      default:
        return null;
    }
  }

  async function handleSubmit() {
    const res = await fetch('/api/onboarding/profile/submit', {
      method: 'POST',
    });

    if (res.ok) {
      await fetchStatus();
    }
  }
}
```

#### 4.2 Rate Manager Component

**`components/RateManager.tsx`**
```typescript
'use client';

import { useState } from 'react';

export function RateManager({ profileId, context }: {
  profileId: string;
  context: 'incall' | 'outcall';
}) {
  const [rates, setRates] = useState([]);
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState('');

  async function handleAddRate() {
    const res = await fetch('/api/onboarding/rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context,
        durationMinutes: duration,
        priceCents: parseFloat(price) * 100,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setRates([...rates, data.data]);
      setPrice('');
    } else {
      const error = await res.json();
      alert(error.error.message);
    }
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">{context} Rates</h3>

      {/* Existing rates */}
      <div className="space-y-2 mb-4">
        {rates.map((rate) => (
          <div key={rate.id} className="flex justify-between p-3 bg-gray-50 rounded">
            <span>{rate.duration_minutes} min</span>
            <span>${(rate.price_cents / 100).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Add new rate */}
      <div className="flex gap-2">
        <select
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="border rounded px-3 py-2"
        >
          <option value={30}>30 min</option>
          <option value={60}>60 min</option>
          <option value={90}>90 min</option>
          <option value={120}>120 min</option>
        </select>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price ($)"
          className="border rounded px-3 py-2 flex-1"
        />

        <button
          onClick={handleAddRate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
```

---

### Phase 5: Admin Dashboard 👨‍💼

#### 5.1 Admin Review Queue

**`app/admin/onboarding/queue/page.tsx`**
```typescript
'use client';

import { useEffect, useState } from 'react';

export default function AdminQueuePage() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  async function fetchPendingProfiles() {
    const res = await fetch('/api/admin/profiles/pending');
    const data = await res.json();
    setProfiles(data.data);
  }

  async function handleApprove(profileId: string) {
    await fetch(`/api/admin/profiles/${profileId}/approve`, {
      method: 'POST',
    });
    await fetchPendingProfiles();
  }

  async function handleReject(profileId: string, reason: string) {
    await fetch(`/api/admin/profiles/${profileId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    await fetchPendingProfiles();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pending Reviews</h1>

      <div className="space-y-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{profile.display_name}</h3>
                <p className="text-gray-600">{profile.city_name}, {profile.region_code}</p>
              </div>
              <div className="text-sm text-gray-500">
                Submitted: {new Date(profile.submitted_at).toLocaleDateString()}
              </div>
            </div>

            {/* Photos */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {profile.photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.public_url}
                  alt=""
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>

            {/* Rates */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Rates:</h4>
              <div className="grid grid-cols-2 gap-2">
                {profile.rates.map((rate) => (
                  <div key={rate.id} className="text-sm">
                    {rate.context}: {rate.duration_minutes}min - ${(rate.price_cents / 100).toFixed(2)}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(profile.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Reason for rejection:');
                  if (reason) handleReject(profile.id, reason);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Testing Checklist

### Database Tests
- [ ] Run migrations successfully
- [ ] All triggers fire correctly (33% rule, photo limit)
- [ ] RLS policies prevent unauthorized access
- [ ] Helper functions return correct values

### API Tests
- [ ] `/api/onboarding/status` returns correct stage
- [ ] `/api/onboarding/profile/submit` validates requirements
- [ ] Rate creation enforces 33% rule
- [ ] Photo upload validates file type/size

### Integration Tests
- [ ] Stripe payment flow (test mode)
- [ ] Stripe Identity verification (test mode)
- [ ] Sightengine moderation (text and image)
- [ ] Webhooks update database correctly

### E2E Tests
- [ ] Complete flow: Free plan → ID → Profile → Submit → Approve → Live
- [ ] Complete flow: Pro plan → Payment → Trial → ID → Profile → Submit → Live
- [ ] Rejection flow: Submit → Admin reject → Blocked
- [ ] Changes requested: Submit → Changes requested → Edit → Re-submit

---

## 🚨 Common Issues & Solutions

### Issue: 33% Rule Too Strict
**Solution:** Adjust `RATE_33_PERCENT_MULTIPLIER` in `validators.ts` to 1.5 (50%)

### Issue: Photos Not Uploading
**Check:**
1. Supabase Storage bucket exists: `profile-photos`
2. Bucket is public
3. RLS policies allow uploads

### Issue: Stripe Webhooks Not Working
**Check:**
1. Webhook URL is publicly accessible (use ngrok for local dev)
2. Webhook secret matches `.env`
3. Events are selected in Stripe Dashboard

### Issue: Identity Verification Fails Immediately
**Check:**
1. Stripe Identity is enabled in Dashboard
2. Test mode supports limited document types
3. Use production mode for full testing

---

## 📈 Next Steps

After implementing this onboarding flow:

1. **Email Notifications**
   - Welcome email on signup
   - ID verification instructions
   - Profile approved/rejected
   - Payment issues

2. **Analytics**
   - Track drop-off at each stage
   - Time to complete onboarding
   - Approval/rejection rates

3. **Optimizations**
   - Add auto-save for profile edits
   - Implement draft recovery
   - Add progress persistence

4. **Advanced Features**
   - Bulk photo upload
   - AI-powered bio suggestions
   - Competitor rate analysis
   - Availability calendar sync

---

## 📞 Support

Para dúvidas sobre implementação, consulte:
- [ONBOARDING-COMPLETE-FLOW.md](./ONBOARDING-COMPLETE-FLOW.md) - Fluxo detalhado
- [app/api/onboarding/README.md](./masseurmatch-nextjs/app/api/onboarding/README.md) - API docs
- Stripe Docs: https://stripe.com/docs
- Sightengine Docs: https://sightengine.com/docs

---

**Happy Coding! 🚀**
