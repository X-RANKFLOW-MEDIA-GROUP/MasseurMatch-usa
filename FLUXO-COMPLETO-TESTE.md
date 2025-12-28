# Fluxo Completo - Usuário de Teste

## 📧 Credenciais
- **Email:** test@test.com
- **Senha:** 123456
- **Nome:** Bruno Santos
- **Localização:** Miami, FL

---

## 🚀 Passo 1: Executar o Script SQL

### Via Supabase Dashboard (Recomendado)

1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Selecione seu projeto MasseurMatch USA
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Clique em **New Query**
5. Copie todo o conteúdo de [sql/setup_test_user_complete.sql](sql/setup_test_user_complete.sql)
6. Cole no editor
7. Clique em **Run** (ou pressione `Ctrl+Enter`)
8. Aguarde as mensagens de sucesso no console

✅ Você deve ver:
```
✅ PERFIL DE MASSAGISTA CRIADO COM SUCESSO!
📧 Email: test@test.com
🔑 Senha: 123456
👤 Nome: Bruno Santos
```

---

## 🔐 Passo 2: Fazer Login

### Via Interface da Aplicação

1. Acesse a aplicação MasseurMatch
2. Clique em "Login" ou "Entrar"
3. Digite:
   - **Email:** test@test.com
   - **Senha:** 123456
4. Clique em "Entrar"

### Via Código (JavaScript/TypeScript)

```javascript
import { supabase } from '@/lib/supabase';

async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@test.com',
    password: '123456'
  });

  if (error) {
    console.error('Erro ao fazer login:', error.message);
    return;
  }

  console.log('Login realizado com sucesso!');
  console.log('Usuário:', data.user);
  console.log('Session:', data.session);

  // O user.id é o UUID que você precisa para operações
  const userId = data.user.id;
  return userId;
}
```

### Via cURL (API REST)

```bash
curl -X POST 'https://ijsdpozjfjjufjsoexod.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456"
  }'
```

---

## 👤 Passo 3: Buscar Perfil do Massagista

### Via Código (JavaScript/TypeScript)

```javascript
import { supabase } from '@/lib/supabase';

async function getTherapistProfile(userId) {
  const { data, error } = await supabase
    .from('therapists')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Erro ao buscar perfil:', error.message);
    return;
  }

  console.log('Perfil encontrado:', data);
  return data;
}

// Uso:
const userId = 'UUID-DO-USUARIO'; // obtido do login
const profile = await getTherapistProfile(userId);
```

### Via cURL

```bash
curl -X GET 'https://ijsdpozjfjjufjsoexod.supabase.co/rest/v1/therapists?user_id=eq.UUID-AQUI&select=*' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## ✏️ Passo 4: Editar Perfil

### Via Código (JavaScript/TypeScript)

```javascript
import { supabase } from '@/lib/supabase';

async function updateTherapistProfile(userId, updates) {
  const { data, error } = await supabase
    .from('therapists')
    .update({
      headline: updates.headline,
      phone: updates.phone,
      services_headline: updates.services_headline,
      rate_60: updates.rate_60,
      rate_90: updates.rate_90,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar perfil:', error.message);
    return;
  }

  console.log('Perfil atualizado com sucesso!', data);
  return data;
}

// Uso:
const updates = {
  headline: 'Massagista Especializado em Relaxamento Profundo',
  phone: '+1 (555) 888-7777',
  services_headline: 'Massagem Terapêutica Premium',
  rate_60: '$90',
  rate_90: '$125'
};

await updateTherapistProfile(userId, updates);
```

### Exemplo Completo com Form

```javascript
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

function EditProfileForm() {
  const [formData, setFormData] = useState({
    headline: '',
    phone: '',
    city: '',
    state: '',
    rate_60: '',
    rate_90: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pegar usuário logado
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Você precisa estar logado!');
      return;
    }

    // Atualizar perfil
    const { data, error } = await supabase
      .from('therapists')
      .update({
        headline: formData.headline,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        rate_60: formData.rate_60,
        rate_90: formData.rate_90,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Erro:', error.message);
      alert('Erro ao atualizar perfil!');
      return;
    }

    console.log('Perfil atualizado:', data);
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Headline"
        value={formData.headline}
        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
      />
      <input
        type="text"
        placeholder="Telefone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      {/* ... outros campos ... */}
      <button type="submit">Salvar Alterações</button>
    </form>
  );
}
```

---

## 📸 Passo 5: Upload de Fotos

### Configurar Bucket no Supabase

1. Acesse **Storage** no Supabase Dashboard
2. Clique em **New Bucket**
3. Nome: `therapist-uploads`
4. Marque como **Public** (ou private, dependendo das suas necessidades)
5. Clique em **Create Bucket**

### Via Código (JavaScript/TypeScript)

```javascript
import { supabase } from '@/lib/supabase';

async function uploadProfilePhoto(file) {
  // Pegar usuário logado
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Gerar nome único para o arquivo
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`;

  // Upload do arquivo
  const { data, error } = await supabase.storage
    .from('therapist-uploads')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Erro ao fazer upload:', error.message);
    throw error;
  }

  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('therapist-uploads')
    .getPublicUrl(fileName);

  console.log('Upload realizado! URL:', publicUrl);

  // Atualizar perfil com a nova URL
  await supabase
    .from('therapists')
    .update({ profile_photo: publicUrl })
    .eq('user_id', user.id);

  return publicUrl;
}

// Uso com input file:
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const url = await uploadProfilePhoto(file);
    console.log('Foto atualizada:', url);
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

### Upload de Múltiplas Fotos (Galeria)

```javascript
async function uploadGalleryPhotos(files) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const uploadPromises = files.map(async (file, index) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/gallery-${Date.now()}-${index}.${fileExt}`;

    const { error } = await supabase.storage
      .from('therapist-uploads')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('therapist-uploads')
      .getPublicUrl(fileName);

    return publicUrl;
  });

  const urls = await Promise.all(uploadPromises);

  // Atualizar galeria no perfil
  await supabase
    .from('therapists')
    .update({ gallery: urls })
    .eq('user_id', user.id);

  return urls;
}
```

---

## 🔍 Passo 6: Visualizar Perfil Público

### Via Código

```javascript
async function viewPublicProfile(userId) {
  const { data, error } = await supabase
    .from('therapists')
    .select(`
      *,
      reviews (
        id,
        reviewer_name,
        rating,
        comment,
        date
      )
    `)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Erro:', error.message);
    return;
  }

  console.log('Perfil completo:', data);
  console.log('Reviews:', data.reviews);
  return data;
}
```

---

## 🔒 Verificações de Segurança (RLS)

### Testar se RLS está funcionando

```javascript
// 1. Verificar se usuário pode ver apenas seu próprio perfil
async function testRLS() {
  const { data: { user } } = await supabase.auth.getUser();

  // Tentar buscar todos os perfis (deve retornar apenas o próprio)
  const { data, error } = await supabase
    .from('therapists')
    .select('*');

  console.log('Perfis acessíveis:', data);
  // Deve retornar apenas o perfil do usuário logado
}

// 2. Tentar atualizar perfil de outro usuário (deve falhar)
async function testUpdateRestriction() {
  const otherUserId = 'UUID-DE-OUTRO-USUARIO';

  const { data, error } = await supabase
    .from('therapists')
    .update({ headline: 'Tentando hackear!' })
    .eq('user_id', otherUserId);

  if (error) {
    console.log('✅ RLS funcionando! Erro esperado:', error.message);
  } else {
    console.log('❌ PROBLEMA DE SEGURANÇA! Conseguiu atualizar outro perfil!');
  }
}
```

---

## 📊 Queries Úteis

### Buscar todos os massagistas em uma cidade

```javascript
const { data } = await supabase
  .from('therapists')
  .select('*')
  .eq('city', 'Miami')
  .eq('status', 'active')
  .order('rating', { ascending: false });
```

### Buscar massagistas por técnica

```javascript
const { data } = await supabase
  .from('therapists')
  .select('*')
  .contains('massage_techniques', ['Deep Tissue']);
```

### Buscar com reviews

```javascript
const { data } = await supabase
  .from('therapists')
  .select(`
    *,
    reviews (*)
  `)
  .eq('user_id', userId)
  .single();
```

---

## 🐛 Troubleshooting

### Login não funciona
- Verifique se o script SQL foi executado com sucesso
- Confirme que o email foi confirmado (campo `email_confirmed_at`)
- Verifique se a senha está correta: `123456`

### Perfil não aparece
- Verifique se a tabela `therapists` tem um registro com o `user_id` correto
- Execute: `SELECT * FROM therapists WHERE email = 'test@test.com';`

### Upload falha
- Certifique-se de que o bucket `therapist-uploads` existe
- Verifique as políticas RLS no Storage
- Confirme que o usuário está autenticado

### Erro de permissão (RLS)
- Verifique se as políticas RLS foram criadas corretamente
- Execute: `SELECT * FROM pg_policies WHERE tablename = 'therapists';`
- Certifique-se de que o usuário está autenticado antes de fazer queries

---

## ✅ Checklist Final

Após executar o script e testar:

- [ ] Usuário criado no Auth (`auth.users`)
- [ ] Identidade criada (`auth.identities`)
- [ ] Perfil criado na tabela `therapists`
- [ ] Reviews fake adicionadas
- [ ] Login funciona com test@test.com / 123456
- [ ] Dashboard acessível
- [ ] Edição de perfil funciona
- [ ] Upload de fotos funciona
- [ ] Status = "active" e Plano = "premium"
- [ ] RLS impede acesso a perfis de outros usuários

---

**Última atualização:** 2025-12-20
