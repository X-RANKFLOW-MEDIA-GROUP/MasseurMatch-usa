# MasseurMatch - Complete Onboarding Flow

## Overview
Este documento define o fluxo completo de onboarding desde a seleção de planos até a publicação do anúncio (Ad Live).

---

## 1. Database Schema

### 1.1 Users Table
```sql
-- Campos essenciais para onboarding
identity_status: ENUM('pending', 'verified', 'failed')
role: ENUM('user', 'admin')
stripe_customer_id: VARCHAR
stripe_identity_session_id: VARCHAR
created_at: TIMESTAMP
```

### 1.2 Subscriptions Table
```sql
id: UUID PRIMARY KEY
user_id: UUID FK → users
plan: ENUM('standard', 'pro', 'elite')  -- Free não tem subscription
status: ENUM('trialing', 'active', 'past_due', 'canceled')
stripe_subscription_id: VARCHAR
stripe_payment_method_id: VARCHAR
trial_end: TIMESTAMP
current_period_start: TIMESTAMP
current_period_end: TIMESTAMP
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### 1.3 Profiles Table
```sql
-- Estados de moderação e publicação
auto_moderation: ENUM('draft', 'auto_passed', 'auto_flagged', 'auto_blocked')
admin_status: ENUM('pending_admin', 'approved', 'rejected', 'changes_requested')
publication_status: ENUM('private', 'public')
onboarding_stage: ENUM('start', 'needs_plan', 'needs_payment', 'needs_identity',
                       'build_profile', 'upload_photos', 'fix_moderation',
                       'submit_admin', 'waiting_admin', 'live', 'blocked')

-- Timestamps
approved_at: TIMESTAMP
submitted_at: TIMESTAMP
admin_notes: TEXT
```

### 1.4 Media Assets Table
```sql
id: UUID PRIMARY KEY
profile_id: UUID FK → profiles
status: ENUM('pending', 'approved', 'rejected')
type: ENUM('photo', 'video')
position: INT
sightengine_response: JSONB
rejection_reason: TEXT
created_at: TIMESTAMP
```

### 1.5 Profile Rates Table
```sql
id: UUID PRIMARY KEY
profile_id: UUID FK → profiles
context: ENUM('incall', 'outcall')
duration_minutes: INT  -- 60, 90, 120
price_cents: INT
currency: VARCHAR(3)  -- USD
created_at: TIMESTAMP

-- Constraint: 33% rule per minute
```

---

## 2. Pricing Plans

### Free - $0/mês
- Perfil público após verificação (ID + moderação + aprovação admin)
- Serviços + Rates visíveis
- 1 foto
- Listagem padrão (sem destaque)
- **CTA**: "Começar Grátis"

### Standard - $29/mês
- Tudo do Free
- 4 fotos
- SEO completo (FAQ + Schema)
- Melhor posição na busca
- **CTA**: "Assinar Standard"

### Pro - $59/mês (7 dias trial)
- Tudo do Standard
- 8 fotos
- Spike Insights (básico)
- Destaque maior na busca
- **CTA**: "Testar Pro por 7 dias"
- **Microcopy**: "Cartão obrigatório. Cancele antes do fim e não paga."

### Elite - $119/mês (7 dias trial)
- Tudo do Pro
- 12 fotos
- Spike Predictor completo
- Topo da busca (inventário limitado por cidade)
- **CTA**: "Testar Elite por 7 dias"
- **Microcopy**: "Cartão obrigatório. Cancele antes do fim e não paga."

---

## 3. Onboarding Stages & UI

| Stage | UI Display | Enabled Buttons | Blocks |
|-------|------------|----------------|---------|
| `needs_plan` | Tela de planos | "Escolher plano" | — |
| `needs_payment` | Checkout Stripe (cartão) | "Confirmar pagamento" | Não avança sem cartão OK |
| `needs_identity` | Tela Stripe Identity | "Iniciar verificação" | Não pode publicar nem enviar ao admin |
| `build_profile` | Form do perfil + Rates + Hours | "Salvar" | "Enviar p/ aprovação" desabilitado até mínimos |
| `upload_photos` | Upload + status Sightengine | "Enviar fotos" | Não envia ao admin sem 1 foto aprovada |
| `fix_moderation` | Alertas do Sightengine | "Corrigir e reenviar" | Sem correção, sem admin |
| `submit_admin` | Checklist final + botão envio | "Enviar para aprovação" | Só habilita se requisitos OK |
| `waiting_admin` | Status "em análise" | "Editar" (limitado) | Não público |
| `live` | "Seu ad está no ar" + link público | "Editar" | Edits podem exigir nova aprovação |
| `blocked` | Motivo + suporte | "Editar" (se allowed) | Sem publicação |

---

## 4. Validation Rules - "Submit for Admin Review"

### O botão só habilita se TODOS os requisitos forem atendidos:

#### A) Identidade
```typescript
users.identity_status === 'verified'
```

#### B) Moderação Automática
```typescript
profiles.auto_moderation === 'auto_passed'
```

#### C) Campos Mínimos do Perfil
```typescript
- display_name: NOT NULL
- city_slug: NOT NULL
- city_name: NOT NULL
- region_code: NOT NULL
- country_code: NOT NULL
- phone_public_e164: NOT NULL
- languages: COUNT >= 1
- services: COUNT >= 1
- setups: COUNT >= 1
- hours: 7 dias preenchidos (ou pelo menos 1)
```

#### D) Rates Obrigatórias
```typescript
IF incall_enabled === true:
  - Pelo menos 1 rate com context='incall'

IF outcall_enabled === true:
  - Pelo menos 1 rate com context='outcall'

// Trigger 33% rule already applied
```

#### E) Fotos
```typescript
COUNT(media_assets WHERE status='approved') >= 1
```

#### F) Plano Pago (se não for Free)
```typescript
IF user has subscription:
  subscription.status IN ('trialing', 'active')
```

---

## 5. Publication Rules - "Ad Live"

### Um perfil só fica `public` se:

```typescript
users.identity_status === 'verified'
AND profiles.auto_moderation === 'auto_passed'
AND profiles.admin_status === 'approved'
AND profiles.publication_status === 'public'
AND (
  user.plan === 'free'
  OR subscription.status IN ('trialing', 'active')
)
```

### Quando ficar público:
- Liberar indexação (robots, sitemap)
- Injetar JSON-LD no HTML
- Entrar nos rankings/feeds
- Habilitar Favoritar e contagens públicas
- CTAs Call/Text ativos para visitantes

---

## 6. State Transitions (Workflows)

### WF-1: Após Sign Up
```typescript
Create User {
  identity_status: 'pending'
}
Create Profile {
  auto_moderation: 'draft',
  admin_status: 'pending_admin',
  publication_status: 'private',
  onboarding_stage: 'needs_plan'
}
```

### WF-2: Selecionou Plano
```typescript
IF plan === 'free':
  onboarding_stage = 'needs_identity'
ELSE:
  Create Stripe Customer
  Save stripe_customer_id
  onboarding_stage = 'needs_payment'
```

### WF-3: Pagamento OK (Stripe SetupIntent succeeded)
```typescript
Attach payment method to customer
Create Subscription {
  IF plan === 'standard':
    status: 'active'
  ELSE IF plan IN ('pro', 'elite'):
    status: 'trialing',
    trial_end: NOW() + 7 days
}
onboarding_stage = 'needs_identity'
```

### WF-4: Stripe Identity Verified (webhook)
```typescript
users.identity_status = 'verified'

IF profile incomplete:
  onboarding_stage = 'build_profile'
ELSE IF profile complete AND has approved photos:
  onboarding_stage = 'submit_admin'
```

### WF-5: Salvar Perfil (cada save de texto)
```typescript
Run Sightengine Text Moderation (bio, custom_desc)

IF result === 'block':
  profiles.auto_moderation = 'auto_blocked'
  onboarding_stage = 'fix_moderation'
ELSE IF result === 'flag':
  profiles.auto_moderation = 'auto_flagged'
  onboarding_stage = 'fix_moderation'
ELSE IF result === 'pass':
  profiles.auto_moderation = 'auto_passed'
  IF has approved photos:
    onboarding_stage = 'submit_admin'
```

### WF-6: Upload Foto
```typescript
Create media_assets { status: 'pending' }
Run Sightengine Image Moderation

IF result === 'pass':
  media_assets.status = 'approved'
ELSE:
  media_assets.status = 'rejected'
  Store rejection_reason

Recalculate stage:
IF COUNT(approved photos) === 0:
  onboarding_stage = 'upload_photos'
ELSE IF COUNT(approved photos) >= 1
     AND auto_moderation === 'auto_passed'
     AND identity_status === 'verified':
  onboarding_stage = 'submit_admin'
```

### WF-7: Enviar para Admin
```typescript
profiles.admin_status = 'pending_admin'
profiles.submitted_at = NOW()
onboarding_stage = 'waiting_admin'
```

### WF-8: Admin Aprova
```typescript
profiles.admin_status = 'approved'
profiles.publication_status = 'public'
profiles.approved_at = NOW()
onboarding_stage = 'live'

Add tags: ['admin_approved', 'verified_id']
```

### WF-9: Admin Pede Mudanças
```typescript
profiles.admin_status = 'changes_requested'
profiles.publication_status = 'private'
onboarding_stage = 'build_profile'
Save admin_notes
```

### WF-10: Admin Rejeita
```typescript
profiles.admin_status = 'rejected'
profiles.publication_status = 'private'
onboarding_stage = 'blocked'
Save admin_notes
```

### WF-11: Falha de Pagamento (Stripe webhook)
```typescript
subscription.status = 'past_due'

IF profile is paid plan:
  profiles.publication_status = 'private'
  onboarding_stage = 'needs_payment'  // or 'blocked'
```

---

## 7. Post-Publication Edit Rules (CRÍTICO)

### Campos Sensíveis que requerem nova aprovação:
- Fotos (add/remove/reorder)
- Bio (short/long)
- Serviços custom
- Rates
- Incall/Outcall settings
- Raio e áreas (outcall)
- Horários

### Regra:
```typescript
IF profile.onboarding_stage === 'live'
   AND user edits sensitive field:

  profiles.publication_status = 'private'
  profiles.admin_status = 'pending_admin'
  onboarding_stage = 'waiting_admin'

// Content saved, but taken offline until re-approval
```

---

## 8. UI Microcopy

### Progress Indicator
```
Seu anúncio está privado até concluir:
✅ Conta criada
⏳ Pagamento (se plano pago)
⏳ Verificação de Identidade
⏳ Perfil completo
⏳ Fotos aprovadas
⏳ Aprovação Admin
```

### Bloqueio ID
```
⚠️ Verificação de identidade obrigatória para publicar no MasseurMatch.
```

### Sightengine
```
❌ Sua foto/texto não passou na moderação automática.
Motivo: [REASON]
Por favor, ajuste e envie novamente.
```

### Admin Review
```
⏳ Seu anúncio está em revisão.
Normalmente leva até 24-48 horas.
```

### Changes Requested
```
📝 O admin solicitou ajustes no seu anúncio:
[ADMIN_NOTES]

Por favor, corrija e reenvie para nova aprovação.
```

### Ad Live
```
🎉 Seu anúncio está no ar!
Ver anúncio público: [LINK]
```

---

## 9. API Endpoints

### Auth & Signup
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Plans & Payment
- `POST /api/plans/select`
- `POST /api/stripe/setup-intent`
- `POST /api/stripe/subscribe`
- `POST /api/stripe/webhook`

### Identity
- `POST /api/stripe/identity/start`
- `POST /api/stripe/identity/webhook`

### Profile
- `GET /api/profile/me`
- `PUT /api/profile/update`
- `POST /api/profile/upload-photo`
- `DELETE /api/profile/photo/:id`
- `POST /api/profile/submit-for-review`

### Admin
- `GET /api/admin/profiles/pending`
- `POST /api/admin/profiles/:id/approve`
- `POST /api/admin/profiles/:id/request-changes`
- `POST /api/admin/profiles/:id/reject`

---

## 10. Rates - 33% Rule

### Regra:
Nenhuma duração pode ter preço/minuto mais de 33% acima do preço/minuto da base daquele contexto.

### Implementação (Trigger ou App):
```sql
CREATE OR REPLACE FUNCTION validate_rate_33_rule()
RETURNS TRIGGER AS $$
DECLARE
  base_rate RECORD;
  base_price_per_min DECIMAL;
  new_price_per_min DECIMAL;
  max_allowed_per_min DECIMAL;
BEGIN
  -- Get base rate (shortest duration for this context)
  SELECT * INTO base_rate
  FROM profile_rates
  WHERE profile_id = NEW.profile_id
    AND context = NEW.context
  ORDER BY duration_minutes ASC
  LIMIT 1;

  IF base_rate IS NULL THEN
    -- This is the first rate, allow it
    RETURN NEW;
  END IF;

  -- Calculate price per minute
  base_price_per_min := base_rate.price_cents::DECIMAL / base_rate.duration_minutes;
  new_price_per_min := NEW.price_cents::DECIMAL / NEW.duration_minutes;
  max_allowed_per_min := base_price_per_min * 1.33;

  IF new_price_per_min > max_allowed_per_min THEN
    RAISE EXCEPTION 'Price per minute (%) exceeds 33%% above base rate (%). Max allowed: %',
      new_price_per_min, base_price_per_min, max_allowed_per_min;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_rate_33_rule
  BEFORE INSERT OR UPDATE ON profile_rates
  FOR EACH ROW
  EXECUTE FUNCTION validate_rate_33_rule();
```

---

## 11. Photo Limits by Plan

| Plan | Max Photos |
|------|------------|
| Free | 1 |
| Standard | 4 |
| Pro | 8 |
| Elite | 12 |

### Validation:
```typescript
const photoLimits = {
  free: 1,
  standard: 4,
  pro: 8,
  elite: 12
}

async function canUploadPhoto(userId: string): Promise<boolean> {
  const user = await getUser(userId)
  const plan = user.subscription?.plan || 'free'
  const currentPhotoCount = await countPhotos(userId)

  return currentPhotoCount < photoLimits[plan]
}
```

---

## 12. Sightengine Integration

### Text Moderation
```typescript
async function moderateText(text: string) {
  const response = await sightengine.check(['offensive', 'personal'])
    .set_text(text)

  if (response.offensive.prob > 0.7 || response.personal.matches.length > 0) {
    return 'block'
  } else if (response.offensive.prob > 0.5) {
    return 'flag'
  }
  return 'pass'
}
```

### Image Moderation
```typescript
async function moderateImage(imageUrl: string) {
  const response = await sightengine.check(['nudity', 'wad', 'offensive'])
    .set_url(imageUrl)

  // Define your thresholds
  const { nudity, weapon, drugs, offensive } = response

  if (nudity.raw > 0.8 || weapon > 0.7 || drugs > 0.7 || offensive.prob > 0.7) {
    return { status: 'reject', reason: 'Content policy violation' }
  } else if (nudity.raw > 0.6 || offensive.prob > 0.5) {
    return { status: 'flag', reason: 'Needs manual review' }
  }
  return { status: 'pass' }
}
```

---

## 13. Timeline Summary

```
Planos → Criar conta → (Pagos: Cartão/Trial) → ID Verification
→ Montar perfil (opções + rates + horários) → Upload (Sightengine)
→ Enviar para admin → Aprovado → Ad Live
```

### Tempo estimado (usuário ativo):
- Sign up: 2 min
- Plano + Pagamento: 3 min
- ID Verification: 5-10 min
- Perfil + Rates: 10-15 min
- Upload fotos: 5 min
- **Total: ~30 min** (espera admin: 24-48h)

---

## 14. Admin Dashboard Requirements

### Pending Review Queue
- Mostrar lista ordenada por `submitted_at`
- Filtros: cidade, plano, tempo de espera
- Highlight: fotos flagged pelo Sightengine

### Review Interface
Mostrar:
- ✅/❌ Identity verified
- Sightengine scores (texto e imagens)
- Perfil completo (todos os campos)
- Rates + serviços + horários
- Flags de risco (spam, repetição, etc.)

### Actions:
- **Approve**: Publica imediatamente
- **Request Changes**: Adiciona notas + volta para build_profile
- **Reject**: Bloqueia + adiciona motivo

---

## Próximos Passos de Implementação

1. ✅ Database migrations (tables + enums + triggers)
2. ✅ Stripe integration (Customer, SetupIntent, Subscription, Identity)
3. ✅ Sightengine integration (text + image moderation)
4. ✅ API endpoints (seguindo a lista acima)
5. ✅ Frontend components (por stage)
6. ✅ Admin dashboard
7. ✅ Email notifications (aprovado, rejected, changes requested)
8. ✅ Testing (unit + integration + E2E)

