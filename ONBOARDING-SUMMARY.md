# MasseurMatch - Onboarding System Summary

## 🎯 O Que Foi Criado

Estrutura completa de onboarding para o MasseurMatch, desde a seleção de planos até a publicação do anúncio (Ad Live).

---

## 📦 Arquivos Criados

### 1. Documentação
- **`ONBOARDING-COMPLETE-FLOW.md`** - Fluxo completo detalhado (planos, estados, transições, regras)
- **`ONBOARDING-IMPLEMENTATION-GUIDE.md`** - Guia step-by-step de implementação
- **`ONBOARDING-SUMMARY.md`** - Este arquivo (resumo executivo)

### 2. Database
- **`sql/onboarding_schema.sql`** - Schema completo:
  - 11 enums (estados, planos, status)
  - 4 tabelas novas (subscriptions, media_assets, profile_rates, profile_hours)
  - Triggers (33% rule, photo limits, auto-cover)
  - Helper functions (can_submit_for_review, can_publish_profile)
  - RLS policies

### 3. Backend Logic
- **`lib/onboarding/stateMachine.ts`** - State machine:
  - 11 estágios de onboarding
  - 15 transições de estado
  - Validações de publicação
  - Cálculo de progresso

- **`lib/onboarding/validators.ts`** - Validadores:
  - Display name, bio, phone
  - Rates (33% rule)
  - Photos (tipo, tamanho)
  - Batch validation

### 4. API Endpoints
- **`app/api/onboarding/README.md`** - Documentação completa da API
- **`app/api/onboarding/status/route.ts`** - GET status do onboarding
- **`app/api/onboarding/profile/submit/route.ts`** - POST submit para admin

---

## 🔄 Fluxo Completo (Timeline)

```
1. PRICING PAGE (escolhe plano)
   ↓
2. SIGN UP (cria conta)
   ↓
3. PAYMENT (se plano pago)
   - Stripe SetupIntent (coleta cartão)
   - Subscription (com/sem trial)
   ↓
4. IDENTITY VERIFICATION (todos os planos)
   - Stripe Identity (documento + selfie)
   ↓
5. BUILD PROFILE (formulário guiado)
   - Dados básicos
   - Serviços, Setup, Idiomas
   - Rates (com regra 33%)
   - Horários
   ↓
6. UPLOAD PHOTOS (Sightengine moderation)
   - Mínimo 1 foto
   - Limites por plano (Free: 1, Standard: 4, Pro: 8, Elite: 12)
   ↓
7. SUBMIT FOR ADMIN REVIEW
   - Valida todos os requisitos
   - Marca como pending_admin
   ↓
8. ADMIN REVIEW
   - Approve → Ad Live
   - Request Changes → volta para edição
   - Reject → Blocked
   ↓
9. AD LIVE 🎉
   - Perfil público
   - Indexação SEO
   - JSON-LD habilitado
```

---

## 📊 Estados do Sistema

### User States
- `identity_status`: `pending` | `verified` | `failed`

### Profile States
- `auto_moderation`: `draft` | `auto_passed` | `auto_flagged` | `auto_blocked`
- `admin_status`: `pending_admin` | `approved` | `rejected` | `changes_requested`
- `publication_status`: `private` | `public`
- `onboarding_stage`: 11 estágios (start → live)

### Subscription States
- `status`: `trialing` | `active` | `past_due` | `canceled`

---

## ✅ Regras de Validação

### Para Enviar ao Admin (Submit)
- [x] Identity verified
- [x] Auto moderation passed
- [x] Display name preenchido
- [x] Cidade selecionada
- [x] Telefone válido (E.164)
- [x] Pelo menos 1 idioma
- [x] Pelo menos 1 serviço
- [x] Pelo menos 1 setup
- [x] Rates: mínimo 1 incall (se enabled) e 1 outcall (se enabled)
- [x] Pelo menos 1 foto aprovada
- [x] Assinatura ativa (se plano pago)

### Para Publicar (Go Live)
- [x] Identity verified
- [x] Auto moderation = auto_passed
- [x] Admin status = approved
- [x] Publication status = public
- [x] Subscription ativa (se pago)

---

## 💰 Planos

| Plano | Preço | Trial | Fotos | Features |
|-------|-------|-------|-------|----------|
| **Free** | $0/mês | — | 1 | Perfil básico, verificação obrigatória |
| **Standard** | $29/mês | — | 4 | SEO completo, melhor posição |
| **Pro** | $59/mês | 7 dias | 8 | Spike Insights, destaque maior |
| **Elite** | $119/mês | 7 dias | 12 | Spike Predictor, topo da busca |

---

## 🔐 Integrações

### Stripe
- **Customer Management**: Criação automática de customer
- **Payment Methods**: SetupIntent para coleta de cartão
- **Subscriptions**: Com/sem trial, webhooks para updates
- **Identity**: Verificação de documento obrigatória para todos

### Sightengine
- **Text Moderation**: Bio, descrições customizadas
- **Image Moderation**: Fotos (nudity, offensive, weapons, drugs)
- **Scores**: Thresholds configuráveis (pass/flag/block)

---

## 🎨 UI States (Por Estágio)

| Stage | UI Display | Botão Primário | Bloqueios |
|-------|------------|----------------|-----------|
| `needs_plan` | Tela de planos | "Escolher plano" | — |
| `needs_payment` | Checkout Stripe | "Confirmar pagamento" | Sem cartão OK |
| `needs_identity` | Stripe Identity | "Iniciar verificação" | Sem ID → sem publicação |
| `build_profile` | Form do perfil | "Salvar" | — |
| `upload_photos` | Upload + status | "Enviar fotos" | Sem foto aprovada |
| `fix_moderation` | Alertas Sightengine | "Corrigir" | Sem correção → sem admin |
| `submit_admin` | Checklist final | "Enviar p/ aprovação" | Só se requisitos OK |
| `waiting_admin` | "Em análise" | "Editar" (limitado) | Não público |
| `live` | "Ad no ar" + link | "Editar" | Edits sensíveis → re-aprovação |
| `blocked` | Motivo + suporte | — | Sem publicação |

---

## 🔧 Regras Especiais

### Regra 33% (Rates)
Nenhuma rate pode ter `preço/minuto` mais de 33% acima da rate base (menor duração).

**Exemplo:**
- Base: 60min = $150 → $2.50/min
- Max permitido para 90min: $2.50 × 1.33 = $3.33/min → $299.70
- Se tentar $300 (90min) → $3.33/min → ✅ OK
- Se tentar $320 (90min) → $3.56/min → ❌ ERRO

Implementado via:
- Trigger SQL: `enforce_rate_33_rule`
- Validator: `validate33PercentRule()`

### Edição Pós-Publicação
Campos sensíveis que exigem re-aprovação se editados após `live`:
- Fotos (add/remove/reorder)
- Bio (short/long)
- Serviços custom
- Rates
- Incall/Outcall settings
- Raio e áreas outcall

Ação: `publication_status = private` + `admin_status = pending_admin`

---

## 🚀 Próximos Passos de Implementação

### Phase 1: Database ✅
```bash
psql $DATABASE_URL -f sql/onboarding_schema.sql
```

### Phase 2: Stripe
1. Criar produtos/preços no Dashboard
2. Implementar endpoints (setup-intent, subscribe, identity/start)
3. Configurar webhooks

### Phase 3: Sightengine
1. Criar conta + obter credentials
2. Implementar moderação (text + image)
3. Integrar no upload de fotos

### Phase 4: Frontend
1. Dashboard de onboarding
2. Componentes por estágio (PlanSelector, PaymentForm, etc.)
3. Rate Manager component
4. Photo Uploader component

### Phase 5: Admin
1. Queue de pending reviews
2. Interface de aprovação/rejeição
3. Bulk actions

### Phase 6: Testing
1. Unit tests (validators, state machine)
2. Integration tests (API endpoints)
3. E2E tests (full flow)

---

## 📈 Métricas Importantes

### Conversão
- Signup → Identity started
- Identity verified → Profile submitted
- Profile submitted → Approved
- Approved → Active (7 dias)

### Tempo Médio
- Identity verification: ~10 min
- Profile completion: ~20 min
- Admin review: 24-48h
- Total: ~2-3 dias

### Taxas de Rejeição
- Identity failed: < 5%
- Sightengine blocked: < 10%
- Admin rejected: < 15%

---

## 🔗 Links Úteis

### Documentação Interna
- [ONBOARDING-COMPLETE-FLOW.md](./ONBOARDING-COMPLETE-FLOW.md) - Fluxo detalhado
- [ONBOARDING-IMPLEMENTATION-GUIDE.md](./ONBOARDING-IMPLEMENTATION-GUIDE.md) - Guia de implementação
- [app/api/onboarding/README.md](./masseurmatch-nextjs/app/api/onboarding/README.md) - API docs

### Documentação Externa
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Identity](https://stripe.com/docs/identity)
- [Sightengine API](https://sightengine.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

## 🎯 Resumo Executivo (TL;DR)

**O que é:**
Sistema completo de onboarding para terapeutas no MasseurMatch.

**Como funciona:**
Planos → Pagamento (Stripe) → ID (Stripe Identity) → Perfil → Fotos (Sightengine) → Admin Review → Live

**Regras principais:**
1. Verificação de ID obrigatória para todos
2. Fotos moderadas automaticamente (Sightengine)
3. Rates seguem regra 33% (nenhuma pode ter preço/min > 133% da base)
4. Admin aprova antes de publicar
5. Edições sensíveis pós-publicação exigem re-aprovação

**Stack:**
- Database: PostgreSQL (Supabase)
- Payment: Stripe (Subscriptions + Identity)
- Moderation: Sightengine
- Storage: Supabase Storage
- Backend: Next.js 14 API Routes
- Frontend: React + TypeScript

**Status:**
✅ Arquitetura definida
✅ Schema SQL pronto
✅ State machine implementada
✅ Validators criados
✅ Endpoints exemplo criados
⏳ Aguardando implementação completa

---

**Última atualização:** 2025-12-24
