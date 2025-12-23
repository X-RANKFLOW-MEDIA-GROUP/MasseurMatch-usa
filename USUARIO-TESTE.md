# Usuário de Teste - MasseurMatch USA

## 🎯 Acesso Rápido

**Email:** test@test.com
**Senha:** 123456

---

## 📝 Como Criar o Perfil Fake

### Opção 1: Script Node.js (Mais Fácil) ⭐

```bash
node scripts/seed-fake-therapist.js
```

**Requisitos:**
- Arquivo `.env.local` deve estar configurado com as credenciais do Supabase
- Node.js instalado

### Opção 2: SQL Editor do Supabase

1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Vá em **SQL Editor**
3. Abra e execute o arquivo `sql/seed_fake_therapist.sql`

---

## 👤 Dados do Perfil Criado

**Nome:** Alex Santos - Teste
**Localização:** Los Angeles, CA (West Hollywood)
**Endereço:** 123 Wellness Street, Suite 456, 90069
**Telefone:** +1 (555) 123-4567

### Especialidades
- Deep Tissue
- Swedish Massage
- Sports Massage
- Trigger Point Therapy
- Myofascial Release
- Hot Stone
- Aromatherapy

### Preços
- 60 minutos: $80
- 90 minutos: $110
- Atendimento móvel: $150 (+ taxa de deslocamento)

### Horários
- Segunda a Quinta: 9:00 AM - 8:00 PM
- Sexta: 9:00 AM - 6:00 PM
- Sábado: 10:00 AM - 4:00 PM
- Domingo: Fechado

### Plano
- **Tipo:** Premium Plan
- **Status:** Ativo
- **Valor:** $49.99/mês
- **Válido até:** 30 dias a partir da criação

### Avaliações
- **Rating:** 4.8 ⭐
- **Total de avaliações:** 127 (5 reviews fake criadas)

---

## 📂 Arquivos Criados

1. **[scripts/seed-fake-therapist.js](scripts/seed-fake-therapist.js)** - Script Node.js para criar o perfil
2. **[sql/seed_fake_therapist.sql](sql/seed_fake_therapist.sql)** - Script SQL alternativo
3. **[scripts/README-SEED.md](scripts/README-SEED.md)** - Documentação completa

---

## 🗑️ Como Remover o Perfil Fake

### Via Supabase Dashboard
1. **Authentication → Users** → Procure `test@test.com` → Delete User
2. O perfil na tabela `therapists` será deletado automaticamente (CASCADE)

### Via SQL
```sql
DELETE FROM auth.users WHERE email = 'test@test.com';
```

---

## 📸 Fotos do Perfil

As fotos são da Unsplash e são públicas:

- **Foto de Perfil:** [Unsplash Link](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d)
- **Galeria:** 4 imagens de espaços de massagem/bem-estar

---

## ✅ Checklist Pós-Criação

Após executar o script, verifique:

- [ ] Login funciona com test@test.com / 123456
- [ ] Perfil aparece completo no dashboard
- [ ] Status mostra como "Active"
- [ ] Plano mostra como "Premium"
- [ ] Fotos de perfil e galeria carregam corretamente
- [ ] Avaliações aparecem (5 reviews)
- [ ] Rating mostra 4.8 estrelas

---

## 🔧 Troubleshooting

### Erro ao executar o script
- Verifique se `.env.local` existe e tem as variáveis corretas
- Confirme que `SUPABASE_SERVICE_ROLE_KEY` está configurada
- Verifique a conexão com internet

### Usuário já existe
- Execute o script novamente (ele deleta e recria automaticamente)
- Ou delete manualmente via Supabase Dashboard

### Erro de login
- Verifique se o email foi confirmado (deve estar confirmado automaticamente)
- Tente resetar a senha via Supabase Dashboard

---

**Última atualização:** 2025-12-20
