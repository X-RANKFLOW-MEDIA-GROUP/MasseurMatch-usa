# Script de Seed - Perfil de Massagista Fake

Este diretório contém scripts para criar um perfil de massagista fake para testes e desenvolvimento.

## 📋 Dados do Usuário Fake

- **Email:** test@test.com
- **Senha:** 123456
- **Nome:** Alex Santos - Teste
- **Localização:** Los Angeles, CA
- **Plano:** Premium (ativo por 30 dias)
- **Rating:** 4.8 estrelas (127 avaliações)

## 🚀 Métodos de Execução

### Método 1: Via Script Node.js ⭐ (Recomendado)

Este método usa a API Admin do Supabase e é **mais seguro e confiável**. Ele cria o usuário de forma adequada usando a autenticação do Supabase.

**Requisitos:**
- Node.js instalado
- Arquivo `.env.local` configurado com:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

**Passos:**

1. Execute o script (as dependências já estão instaladas no projeto):
```bash
node scripts/seed-fake-therapist.js
```

2. Aguarde a mensagem de sucesso com os detalhes do perfil criado.

---

### Método 2: Via SQL Editor do Supabase

Este método executa SQL diretamente no banco de dados.

**Passos:**

1. Acesse o [Supabase Dashboard](https://app.supabase.com/)

2. Navegue até: **Seu Projeto → SQL Editor**

3. Abra o arquivo `sql/seed_fake_therapist.sql`

4. Copie todo o conteúdo do arquivo

5. Cole no SQL Editor do Supabase

6. Clique em "Run" para executar

7. Verifique a mensagem de sucesso no console

---

## 📦 O que é criado?

### 1. Usuário de Autenticação
- Email confirmado
- Senha criptografada
- Metadata básica

### 2. Perfil de Massagista Completo
- Informações pessoais e profissionais
- Endereço e localização (Los Angeles, CA)
- Serviços e especialidades
- Preços e formas de pagamento
- Disponibilidade semanal
- Certificações e afiliações
- Foto de perfil e galeria (Unsplash)
- Plano Premium ativo

### 3. Avaliações Fake (5 reviews)
- Reviews em português e inglês
- Ratings de 4 a 5 estrelas
- Datas espalhadas nos últimos 32 dias

---

## 🔍 Verificação

Após executar o script, você pode verificar se funcionou:

### Via Interface
1. Acesse a aplicação
2. Faça login com `test@test.com` / `123456`
3. Verifique se o perfil está completo

### Via Supabase Dashboard
1. Acesse **Authentication → Users**
2. Procure por `test@test.com`
3. Acesse **Table Editor → therapists**
4. Procure pelo registro com email `test@test.com`

---

## 🗑️ Limpeza

Para remover o perfil fake:

### Via Script Node.js
```javascript
// Adicione ao final do arquivo seed-fake-therapist.js
const { error } = await supabase.auth.admin.deleteUser(authData.user.id);
```

### Via SQL Editor
```sql
-- Deletar reviews
DELETE FROM public.reviews WHERE therapist_id = (
  SELECT user_id FROM public.therapists WHERE email = 'test@test.com'
);

-- Deletar perfil de massagista
DELETE FROM public.therapists WHERE email = 'test@test.com';

-- Deletar usuário de autenticação
DELETE FROM auth.users WHERE email = 'test@test.com';
```

---

## ⚠️ Avisos Importantes

1. **Ambiente de Desenvolvimento:** Use apenas em ambientes de desenvolvimento/staging
2. **Service Role Key:** Nunca exponha a chave `SUPABASE_SERVICE_ROLE_KEY` no código client-side
3. **Senha Simples:** A senha '123456' é apenas para testes. Use senhas fortes em produção
4. **UUID Fixo:** O script SQL usa um UUID fixo que pode conflitar se já existir

---

## 🐛 Troubleshooting

### Erro: "SUPABASE_SERVICE_ROLE_KEY não encontrado"
- Verifique se o arquivo `.env.local` existe na raiz do projeto
- Confirme que a variável está definida corretamente

### Erro: "duplicate key value violates unique constraint"
- O usuário já existe. Execute o script de limpeza primeiro
- Ou delete manualmente via Supabase Dashboard

### Erro: "relation 'reviews' does not exist"
- A tabela reviews não existe no seu banco de dados
- Você pode ignorar este erro, o perfil principal será criado

### Erro ao fazer login
- Verifique se o email foi confirmado (email_confirm: true)
- Tente resetar a senha via interface do Supabase

---

## 📝 Customização

Para customizar os dados do perfil fake, edite o objeto `therapistData` no arquivo `seed-fake-therapist.js`:

```javascript
const therapistData = {
  full_name: 'Seu Nome Aqui',
  city: 'Sua Cidade',
  state: 'Seu Estado',
  // ... outros campos
};
```

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs do console
2. Supabase Dashboard → Logs
3. Permissões RLS (Row Level Security) nas tabelas

---

**Última atualização:** 2025-12-20
