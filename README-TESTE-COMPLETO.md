# 🧪 Setup Completo - Usuário de Teste

## 📧 Credenciais Prontas
```
Email: test@test.com
Senha: 123456
Nome: Bruno Santos
Localização: Miami, FL
```

---

## 🚀 Quick Start (3 Passos)

### 1️⃣ Execute o Script SQL

1. Abra [Supabase Dashboard](https://app.supabase.com/)
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo de [`sql/setup_test_user_complete.sql`](sql/setup_test_user_complete.sql)
4. Clique em **Run**

✅ Você verá a mensagem de sucesso com o UUID do usuário criado.

### 2️⃣ Faça Login

Acesse a aplicação e faça login com:
- **Email:** test@test.com
- **Senha:** 123456

### 3️⃣ Teste o Fluxo Completo

- ✅ Dashboard acessível
- ✅ Editar perfil
- ✅ Upload de fotos
- ✅ Visualizar perfil público

---

## 📁 Arquivos Criados

### Documentação

1. **[README-TESTE-COMPLETO.md](README-TESTE-COMPLETO.md)** (este arquivo) - Guia rápido
2. **[FLUXO-COMPLETO-TESTE.md](FLUXO-COMPLETO-TESTE.md)** - Fluxo detalhado com exemplos de código
3. **[EXEMPLOS-CODIGO-REACT.md](EXEMPLOS-CODIGO-REACT.md)** - Componentes React prontos para usar
4. **[USUARIO-TESTE.md](USUARIO-TESTE.md)** - Informações do usuário de teste
5. **[INSTRUCOES-PERFIL-FAKE.md](INSTRUCOES-PERFIL-FAKE.md)** - Instruções alternativas

### Scripts SQL

6. **[sql/setup_test_user_complete.sql](sql/setup_test_user_complete.sql)** ⭐ **PRINCIPAL** - Script completo e otimizado
7. **[sql/seed_fake_therapist.sql](sql/seed_fake_therapist.sql)** - Script alternativo

### Scripts Node.js

8. **[scripts/seed-fake-therapist.js](scripts/seed-fake-therapist.js)** - Script completo
9. **[scripts/seed-simple-therapist.js](scripts/seed-simple-therapist.js)** - Script simplificado
10. **[scripts/update-therapist-profile.js](scripts/update-therapist-profile.js)** - Atualizar perfil existente
11. **[scripts/README-SEED.md](scripts/README-SEED.md)** - Documentação dos scripts

---

## 🎯 O Que Foi Criado

### 1. Usuário de Autenticação
- ✅ Criado na tabela `auth.users`
- ✅ Email confirmado automaticamente
- ✅ Senha: 123456 (hash bcrypt)
- ✅ Identidade criada em `auth.identities`

### 2. Perfil de Massagista
- ✅ Registro completo na tabela `therapists`
- ✅ Nome: Bruno Santos
- ✅ Localização: Miami, FL (South Beach)
- ✅ Serviços: Swedish, Deep Tissue, Sports Massage, Hot Stone
- ✅ Preços: $85 (60min), $120 (90min), $160 (outcall)
- ✅ Rating: 4.9 ⭐ (89 avaliações)
- ✅ Plano: Premium (ativo por 30 dias)
- ✅ Status: Active

### 3. Reviews Fake
- ✅ 4 reviews criadas
- ✅ Ratings: 4 e 5 estrelas
- ✅ Comentários em português e inglês
- ✅ Datas distribuídas nos últimos 22 dias

### 4. Políticas de Segurança
- ✅ RLS habilitado em `storage.objects`
- ✅ Usuários podem fazer upload apenas em suas pastas
- ✅ Fotos públicas visíveis para todos
- ✅ Apenas o dono pode atualizar/deletar seus arquivos

---

## 📚 Guias de Uso

### Para Testar o Fluxo Completo

Leia: **[FLUXO-COMPLETO-TESTE.md](FLUXO-COMPLETO-TESTE.md)**

Contém:
- Como fazer login via código
- Como buscar perfil do massagista
- Como editar perfil
- Como fazer upload de fotos
- Como testar RLS
- Exemplos com cURL

### Para Implementar no Frontend

Leia: **[EXEMPLOS-CODIGO-REACT.md](EXEMPLOS-CODIGO-REACT.md)**

Componentes prontos:
- 🔐 Formulário de Login
- 👤 Visualização de Perfil
- ✏️ Edição de Perfil
- 📸 Upload de Fotos
- 🔒 Auth Guard (proteção de rotas)

---

## 🛠️ Comandos Úteis

### Via JavaScript (Supabase Client)

```javascript
// Login
await supabase.auth.signInWithPassword({
  email: 'test@test.com',
  password: '123456'
});

// Buscar perfil
const { data } = await supabase
  .from('therapists')
  .select('*')
  .eq('user_id', userId)
  .single();

// Atualizar perfil
await supabase
  .from('therapists')
  .update({ headline: 'Novo título' })
  .eq('user_id', userId);

// Upload de foto
await supabase.storage
  .from('therapist-uploads')
  .upload(`${userId}/profile.jpg`, file);
```

### Via SQL (Supabase SQL Editor)

```sql
-- Ver usuário criado
SELECT * FROM auth.users WHERE email = 'test@test.com';

-- Ver perfil do therapist
SELECT * FROM therapists WHERE email = 'test@test.com';

-- Ver reviews
SELECT * FROM reviews
WHERE therapist_id = (SELECT user_id FROM therapists WHERE email = 'test@test.com');

-- Deletar usuário (se necessário)
DELETE FROM auth.users WHERE email = 'test@test.com';
```

---

## 🔍 Verificações

### Checklist de Funcionamento

Execute após criar o usuário:

- [ ] **Login funciona** - test@test.com / 123456
- [ ] **Perfil aparece completo** - Nome, cidade, serviços
- [ ] **Reviews aparecem** - 4 reviews fake
- [ ] **Status = Active** - Usuário está ativo
- [ ] **Plano = Premium** - Plano premium ativo
- [ ] **Fotos carregam** - Profile photo e gallery
- [ ] **Edição funciona** - Consegue editar o perfil
- [ ] **Upload funciona** - Consegue fazer upload de fotos

### Queries de Verificação SQL

```sql
-- Query completa de verificação
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  t.full_name,
  t.city,
  t.state,
  t.status,
  t.plan,
  t.rating,
  COUNT(r.id) as review_count
FROM auth.users u
LEFT JOIN therapists t ON t.user_id = u.id
LEFT JOIN reviews r ON r.therapist_id = t.user_id
WHERE u.email = 'test@test.com'
GROUP BY u.id, u.email, u.email_confirmed_at, t.full_name, t.city, t.state, t.status, t.plan, t.rating;
```

---

## 🐛 Troubleshooting

### Problema: "Email já existe"
**Solução:** Delete o usuário existente primeiro
```sql
DELETE FROM auth.users WHERE email = 'test@test.com';
```

### Problema: "Perfil não aparece"
**Solução:** Verifique se o registro existe em `therapists`
```sql
SELECT * FROM therapists WHERE email = 'test@test.com';
```

### Problema: "Erro ao fazer upload"
**Soluções:**
1. Crie o bucket `therapist-uploads` no Storage
2. Verifique se as políticas RLS foram criadas
3. Confirme que o usuário está autenticado

### Problema: "Permissão negada (RLS)"
**Solução:** Verifique as políticas RLS
```sql
SELECT * FROM pg_policies WHERE tablename = 'therapists';
```

---

## 📞 Estrutura de Suporte

### Arquitetura do Sistema

```
auth.users (Autenticação)
    │
    ├─→ auth.identities (Provider: email)
    │
    └─→ therapists (Perfil do Massagista)
            │
            └─→ reviews (Avaliações)

storage.objects (Fotos)
    │
    └─→ therapist-uploads/
            └─→ {user_id}/
                    ├─→ profile-*.jpg
                    └─→ gallery-*.jpg
```

### Fluxo de Dados

```
1. Login → Supabase Auth → Session Token
2. Get Profile → therapists table (RLS check)
3. Update Profile → therapists table (RLS check)
4. Upload Photo → storage.objects (RLS check) → Update therapists.profile_photo
```

---

## ✨ Recursos Adicionais

### Bucket de Storage Recomendado

**Nome:** `therapist-uploads`
**Tipo:** Public (ou Private com signed URLs)
**Estrutura de pastas:**
```
therapist-uploads/
  └── {user_id}/
        ├── profile-{timestamp}.jpg
        ├── gallery-{timestamp}-0.jpg
        ├── gallery-{timestamp}-1.jpg
        └── ...
```

### Políticas RLS Essenciais

Já incluídas no script SQL:
- ✅ Usuários podem ler apenas seus próprios arquivos
- ✅ Usuários podem fazer upload apenas em suas pastas
- ✅ Público pode visualizar fotos (para perfis públicos)
- ✅ Apenas o dono pode atualizar/deletar

---

## 📊 Estatísticas do Perfil Criado

```
Nome: Bruno Santos
Localização: Miami, FL (South Beach)
Endereço: 456 Ocean Drive, Suite 789, 33139

Serviços: Swedish, Deep Tissue, Sports Massage, Hot Stone, Aromatherapy

Preços:
  - 60 minutos: $85
  - 90 minutos: $120
  - Atendimento móvel: $160

Experiência: 6 anos
Idiomas: Inglês, Português, Espanhol

Rating: 4.9 ⭐
Avaliações: 89 reviews (4 fake criadas)

Plano: Premium ($49.99/mês)
Status: Ativo (válido por 30 dias)

Fotos:
  - Profile photo: ✅ (Unsplash)
  - Gallery: ✅ 2 fotos (Unsplash)
```

---

## 🎓 Próximos Passos

1. ✅ **Execute o script SQL** - [sql/setup_test_user_complete.sql](sql/setup_test_user_complete.sql)
2. ✅ **Faça login** - test@test.com / 123456
3. ✅ **Teste o dashboard** - Verifique se tudo carrega
4. ✅ **Edite o perfil** - Mude alguns campos e salve
5. ✅ **Faça upload de foto** - Teste o storage
6. ✅ **Visualize perfil público** - Como outros usuários veriam

---

## 📝 Notas Importantes

- ⚠️ **Apenas para testes/desenvolvimento** - Não use em produção
- 🔑 **Senha simples** - 123456 é apenas para testes
- 🗑️ **Fácil de limpar** - Basta deletar `auth.users WHERE email = 'test@test.com'`
- 🔒 **RLS habilitado** - Políticas de segurança estão ativas
- ⏰ **Plano expira em 30 dias** - Ajuste `paid_until` se necessário

---

**Última atualização:** 2025-12-20
**Versão:** 1.0 - Setup Completo
**Status:** ✅ Pronto para uso
