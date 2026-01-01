# Guia de Troubleshooting - Migrations MasseurMatch

## Erro: "relation public.subscriptions does not exist"

### Causa
A migration `20251229_fix_onboarding_flow.sql` estava tentando conceder permissões na tabela `subscriptions` antes dela ser criada.

### Solução Aplicada
✅ A migration foi corrigida para verificar se a tabela existe antes de conceder permissões:

```sql
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'subscriptions') THEN
    GRANT SELECT ON public.subscriptions TO authenticated;
    GRANT ALL ON public.subscriptions TO service_role;
  END IF;
END $$;
```

---

## Ordem Correta de Execução das Migrations

Execute as migrations **EXATAMENTE** nesta ordem:

```bash
# 1. Base schema - Cria tabelas fundamentais
supabase migration up 20251223_base_schema.sql

# 2. Onboarding schema - Cria enums e tabela subscriptions
supabase migration up 20251224_onboarding_schema.sql

# 3. Adiciona colunas faltantes em profiles
supabase migration up 20251225_add_missing_profile_columns.sql

# 4. Cria tabelas de relacionamento (languages, services, setups)
supabase migration up 20251225_schema_updates.sql

# 5. Auto-criar users/profiles (versão corrigida SEM user_id)
supabase migration up 20251228_auto_create_user_profile.sql

# 6. Fix completo do fluxo (adiciona user_id, RLS, etc.)
supabase migration up 20251229_fix_onboarding_flow.sql
```

---

## Verificar Estado Atual do Banco

### 1. Verificar se tabelas existem

```sql
-- Verificar tabelas principais
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'profiles', 'subscriptions', 'media_assets')
ORDER BY table_name;
```

**Resultado esperado:**
```
table_name
--------------
media_assets
profiles
subscriptions
users
```

### 2. Verificar coluna user_id em profiles

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'user_id';
```

**Resultado esperado:**
```
column_name | data_type | is_nullable
------------+-----------+-------------
user_id     | uuid      | NO
```

### 3. Verificar RLS em public.users

```sql
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'users';
```

**Resultado esperado:**
```
Users can view own user record
Users can update own user record
Service role can manage all users
```

### 4. Verificar trigger

```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
  AND trigger_name = 'on_auth_user_created';
```

**Resultado esperado:**
```
trigger_name            | event_manipulation | event_object_table
-----------------------+--------------------+--------------------
on_auth_user_created   | INSERT             | users
```

---

## Erros Comuns e Soluções

### ❌ Erro: "column user_id does not exist"

**Sintoma:**
```
ERROR: column "user_id" does not exist in table "profiles"
```

**Causa:**
Migration `20251229_fix_onboarding_flow.sql` não foi executada.

**Solução:**
```bash
supabase migration up 20251229_fix_onboarding_flow.sql
```

---

### ❌ Erro: "permission denied for table users"

**Sintoma:**
```
ERROR: permission denied for table users
```

**Causa:**
RLS não configurada corretamente em `public.users`.

**Solução:**
```sql
-- Verificar se RLS está habilitada
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'users';

-- Se rowsecurity = false, executar:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Recriar políticas
DROP POLICY IF EXISTS "Users can view own user record" ON public.users;
CREATE POLICY "Users can view own user record"
  ON public.users FOR SELECT
  USING (auth.uid() = id);
```

---

### ❌ Erro: "new row violates foreign key constraint"

**Sintoma:**
```
ERROR: insert or update on table "profiles" violates foreign key constraint "profiles_user_id_fkey"
```

**Causa:**
Tentando criar profile para usuário que não existe em `public.users`.

**Solução:**
```sql
-- Verificar se usuário existe em public.users
SELECT id FROM public.users WHERE id = '<user_id>';

-- Se não existe, criar manualmente
INSERT INTO public.users (id, identity_status, role)
VALUES ('<user_id>', 'pending', 'user')
ON CONFLICT (id) DO NOTHING;
```

---

### ❌ Erro: "duplicate key value violates unique constraint"

**Sintoma:**
```
ERROR: duplicate key value violates unique constraint "profiles_pkey"
```

**Causa:**
Tentando criar profile que já existe.

**Solução:**
Use `ON CONFLICT` nas queries:
```sql
INSERT INTO public.profiles (id, user_id, email)
VALUES (...)
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  email = EXCLUDED.email;
```

---

## Resetar Banco para Teste (⚠️ CUIDADO)

**ATENÇÃO:** Isso vai **APAGAR TODOS OS DADOS**!

```sql
-- 1. Desabilitar triggers temporariamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Limpar tabelas
TRUNCATE TABLE public.media_assets CASCADE;
TRUNCATE TABLE public.profile_rates CASCADE;
TRUNCATE TABLE public.profile_languages CASCADE;
TRUNCATE TABLE public.profile_services CASCADE;
TRUNCATE TABLE public.profile_setups CASCADE;
TRUNCATE TABLE public.subscriptions CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.users CASCADE;
DELETE FROM auth.users WHERE email LIKE '%test%';

-- 3. Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## Testar Fluxo Completo

### 1. Criar novo usuário de teste

```typescript
const { data, error } = await supabase.auth.signUp({
  email: "teste@example.com",
  password: "senha123456",
});

console.log("User ID:", data.user?.id);
```

### 2. Verificar criação automática

```sql
-- Verificar em public.users
SELECT * FROM public.users WHERE id = '<user_id>';

-- Verificar em public.profiles
SELECT * FROM public.profiles WHERE id = '<user_id>';
```

**Resultado esperado:**
- ✅ Registro existe em `public.users` com `identity_status = 'pending'`
- ✅ Registro existe em `public.profiles` com `user_id` preenchido

### 3. Testar API de select-plan

```bash
curl -X POST http://localhost:3000/api/onboarding/select-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"planId": "free"}'
```

**Resultado esperado:**
```json
{
  "success": true,
  "plan": "free",
  "requiresPayment": false,
  "message": "FREE plan activated. Please complete identity verification."
}
```

### 4. Verificar subscription criada

```sql
SELECT * FROM public.subscriptions WHERE user_id = '<user_id>';
```

**Resultado esperado:**
- ✅ `plan = 'free'`
- ✅ `status = 'trialing'`
- ✅ `trial_end` definido

---

## Logs Úteis para Debug

### Verificar logs do Supabase

```bash
# Logs em tempo real
supabase logs --level debug

# Filtrar por erros
supabase logs --level error

# Logs de SQL
supabase db logs
```

### Ativar debug no cliente Supabase

```typescript
const supabase = createClient(url, key, {
  auth: {
    debug: true,
  },
});
```

---

## Checklist Pós-Migration

Após executar todas as migrations, verificar:

- [ ] ✅ Tabela `public.users` existe e tem RLS habilitada
- [ ] ✅ Tabela `public.profiles` existe e tem coluna `user_id`
- [ ] ✅ Tabela `subscriptions` existe
- [ ] ✅ Trigger `on_auth_user_created` está ativo
- [ ] ✅ Função `handle_new_user()` tem `SECURITY DEFINER`
- [ ] ✅ Políticas RLS criadas em todas as tabelas
- [ ] ✅ Permissões concedidas para `service_role`
- [ ] ✅ Teste de cadastro cria users + profiles automaticamente
- [ ] ✅ API de onboarding funciona sem erros

---

## Suporte

Se os problemas persistirem:

1. **Verificar versão do Supabase CLI:**
   ```bash
   supabase --version
   ```
   Versão mínima: `1.123.4`

2. **Verificar conexão com banco:**
   ```bash
   supabase db ping
   ```

3. **Resetar migrations locais (dev only):**
   ```bash
   supabase db reset
   ```

4. **Ver diff do schema:**
   ```bash
   supabase db diff
   ```

---

## Arquivos de Referência

- 📄 [ONBOARDING_FLOW_FIXES.md](./ONBOARDING_FLOW_FIXES.md) - Documentação completa de erros e soluções
- 📄 [20251229_fix_onboarding_flow.sql](./supabase/migrations/20251229_fix_onboarding_flow.sql) - Migration consolidada
- 📄 [20251228_auto_create_user_profile.sql](./supabase/migrations/20251228_auto_create_user_profile.sql) - Auto-criação de users/profiles

---

**Última atualização:** 29/12/2024
