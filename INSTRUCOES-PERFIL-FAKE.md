# Instruções - Perfil de Massagista Fake

## 📧 Credenciais
- **Email:** test@test.com
- **Senha:** 123456

---

## ✅ Status Atual

O usuário `test@test.com` **JÁ FOI CRIADO** com sucesso no Supabase!

- UUID do usuário: `2581e16c-e322-456b-867b-5013f0cd2c14`
- Email confirmado: Sim
- Senha: 123456

---

## 🔐 Como fazer login

1. Acesse a aplicação
2. Use as credenciais:
   - **Email:** test@test.com
   - **Senha:** 123456

---

## 📝 Completar o Perfil Manualmente

Como o perfil do massagista ainda não foi totalmente criado (devido a incompatibilidades de schema), você pode completá-lo de duas formas:

### Opção 1: Via Interface da Aplicação (Recomendado)

1. Faça login com test@test.com / 123456
2. Vá para a página de edição de perfil
3. Preencha os dados do perfil:
   - Nome: Alex Santos - Teste
   - Cidade: Los Angeles
   - Estado: CA
   - Telefone: +1 (555) 123-4567
   - Especialidades: Deep Tissue, Swedish, Sports Massage
   - Preços: 60min = $80, 90min = $110

### Opção 2: Via Supabase Dashboard

1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Vá em **Table Editor → therapists**
3. Procure pelo `user_id`: `2581e16c-e322-456b-867b-5013f0cd2c14`
4. Edite os campos diretamente ou clique em "Insert row" se não existir
5. Preencha os campos essenciais:

```json
{
  "user_id": "2581e16c-e322-456b-867b-5013f0cd2c14",
  "full_name": "Alex Santos - Teste",
  "display_name": "Alex Santos",
  "headline": "Massagista Profissional Certificado",
  "email": "test@test.com",
  "phone": "+1 (555) 123-4567",
  "city": "Los Angeles",
  "state": "CA",
  "country": "USA",
  "rate_60": "$80",
  "rate_90": "$110",
  "rating": 4.8,
  "plan": "premium",
  "status": "active",
  "subscription_status": "active",
  "agree_terms": true
}
```

---

## 🔍 Verificar se o Usuário Existe

### Via Supabase Dashboard

1. Acesse **Authentication → Users**
2. Procure por `test@test.com`
3. Você deve ver o usuário com email confirmado

### Via SQL Editor

```sql
-- Ver usuário
SELECT id, email, created_at FROM auth.users WHERE email = 'test@test.com';

-- Ver perfil de therapist (se existir)
SELECT * FROM public.therapists WHERE email = 'test@test.com';
```

---

## 🗑️ Deletar o Usuário (se necessário)

Se quiser começar do zero:

### Via Supabase Dashboard
1. **Authentication → Users**
2. Procure `test@test.com`
3. Clique no menu (...) e selecione "Delete User"

### Via SQL Editor
```sql
DELETE FROM auth.users WHERE email = 'test@test.com';
```

---

## 🐛 Problemas Conhecidos

### "Email já registrado" ao executar script
- **Causa:** O usuário já foi criado anteriormente
- **Solução:** Use o script `update-therapist-profile.js` ou delete o usuário primeiro

### Perfil não aparece completo
- **Causa:** A tabela therapists pode ter campos diferentes dos esperados
- **Solução:** Complete o perfil manualmente via interface ou Supabase Dashboard

### Erro de schema ao inserir dados
- **Causa:** Alguns campos podem não existir na tabela atual
- **Solução:** Insira apenas os campos essenciais listados acima

---

## 📦 Arquivos Disponíveis

1. **[scripts/seed-fake-therapist.js](scripts/seed-fake-therapist.js)** - Script completo (pode ter problemas de schema)
2. **[scripts/seed-simple-therapist.js](scripts/seed-simple-therapist.js)** - Script simplificado com campos mínimos
3. **[scripts/update-therapist-profile.js](scripts/update-therapist-profile.js)** - Script para atualizar perfil existente
4. **[sql/seed_fake_therapist.sql](sql/seed_fake_therapist.sql)** - Script SQL alternativo
5. **[scripts/README-SEED.md](scripts/README-SEED.md)** - Documentação completa

---

## ✅ Checklist

- [x] Usuário criado no Supabase Auth
- [ ] Perfil completo na tabela therapists
- [ ] Login funcionando
- [ ] Dashboard acessível
- [ ] Status "Active" e plano "Premium"

---

## 💡 Próximos Passos Recomendados

1. Faça login com test@test.com / 123456
2. Teste o fluxo de edição de perfil
3. Adicione fotos e detalhes via interface
4. Verifique se tudo está salvando corretamente

Se tiver problemas, complete o perfil manualmente via Supabase Dashboard usando os dados sugeridos acima.

---

**Última atualização:** 2025-12-20
