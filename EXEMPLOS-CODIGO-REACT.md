# Exemplos de Código React - Fluxo Completo

## 🔐 1. Componente de Login

```typescript
// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log('✅ Login realizado com sucesso!');
      console.log('User ID:', data.user?.id);

      // Redirecionar para dashboard
      router.push('/dashboard');

    } catch (error: any) {
      console.error('❌ Erro ao fazer login:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@test.com"
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Botão para testar com credenciais fake */}
      <button
        onClick={() => {
          setEmail('test@test.com');
          setPassword('123456');
        }}
        className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      >
        🧪 Usar credenciais de teste
      </button>
    </div>
  );
}
```

---

## 👤 2. Componente de Perfil

```typescript
// components/TherapistProfileView.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface TherapistProfile {
  user_id: string;
  full_name: string;
  display_name: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  services_headline: string;
  specialties_headline: string;
  massage_techniques: string[];
  rate_60: string;
  rate_90: string;
  rate_outcall: string;
  rating: number;
  override_reviews_count: number;
  profile_photo: string;
  gallery: string[];
  plan: string;
  status: string;
}

export default function TherapistProfileView() {
  const [profile, setProfile] = useState<TherapistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Pegar usuário logado
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar perfil do therapist
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      console.log('✅ Perfil carregado:', data);

    } catch (error: any) {
      console.error('❌ Erro ao carregar perfil:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando perfil...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Erro: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return <div>Perfil não encontrado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Foto de Perfil */}
          <div className="flex-shrink-0">
            {profile.profile_photo ? (
              <Image
                src={profile.profile_photo}
                alt={profile.full_name}
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[150px] h-[150px] rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-400">👤</span>
              </div>
            )}
          </div>

          {/* Informações Básicas */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profile.display_name}</h1>
            <p className="text-xl text-gray-600 mb-3">{profile.headline}</p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center">
                <span className="text-yellow-500 text-xl mr-1">⭐</span>
                <span className="font-semibold">{profile.rating}</span>
                <span className="text-gray-500 ml-1">
                  ({profile.override_reviews_count} avaliações)
                </span>
              </div>

              <div className="flex items-center">
                <span className="mr-1">📍</span>
                <span>{profile.city}, {profile.state}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                profile.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profile.status === 'active' ? '✅ Ativo' : 'Inativo'}
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                💎 {profile.plan}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Serviços */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Serviços</h2>
        <p className="text-lg mb-4">{profile.services_headline}</p>

        <h3 className="font-semibold mb-2">Técnicas:</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.massage_techniques?.map((technique, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {technique}
            </span>
          ))}
        </div>

        <h3 className="font-semibold mb-2">Especialidades:</h3>
        <p className="text-gray-700">{profile.specialties_headline}</p>
      </div>

      {/* Preços */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Preços</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500 mb-1">60 minutos</div>
            <div className="text-2xl font-bold text-green-600">{profile.rate_60}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500 mb-1">90 minutos</div>
            <div className="text-2xl font-bold text-green-600">{profile.rate_90}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Atendimento móvel</div>
            <div className="text-2xl font-bold text-green-600">{profile.rate_outcall}</div>
          </div>
        </div>
      </div>

      {/* Galeria */}
      {profile.gallery && profile.gallery.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Galeria</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profile.gallery.map((photo, index) => (
              <div key={index} className="relative h-48">
                <Image
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contato */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Contato</h2>
        <div className="space-y-2">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Telefone:</strong> {profile.phone}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## ✏️ 3. Componente de Edição de Perfil

```typescript
// components/EditTherapistProfile.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function EditTherapistProfile() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    headline: '',
    phone: '',
    city: '',
    state: '',
    services_headline: '',
    specialties_headline: '',
    rate_60: '',
    rate_90: '',
    rate_outcall: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setFormData({
        full_name: data.full_name || '',
        headline: data.headline || '',
        phone: data.phone || '',
        city: data.city || '',
        state: data.state || '',
        services_headline: data.services_headline || '',
        specialties_headline: data.specialties_headline || '',
        rate_60: data.rate_60 || '',
        rate_90: data.rate_90 || '',
        rate_outcall: data.rate_outcall || ''
      });

    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error.message);
      setMessage('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      const { error } = await supabase
        .from('therapists')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setMessage('✅ Perfil atualizado com sucesso!');
      console.log('✅ Perfil salvo!');

    } catch (error: any) {
      console.error('Erro ao salvar:', error.message);
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Editar Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome Completo */}
        <div>
          <label className="block text-sm font-medium mb-2">Nome Completo</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Headline */}
        <div>
          <label className="block text-sm font-medium mb-2">Título Profissional</label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            placeholder="Ex: Massagista Certificado - Especialista em Relaxamento"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium mb-2">Telefone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Localização */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cidade</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estado</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="CA"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Serviços */}
        <div>
          <label className="block text-sm font-medium mb-2">Serviços Oferecidos</label>
          <input
            type="text"
            name="services_headline"
            value={formData.services_headline}
            onChange={handleChange}
            placeholder="Massagem Terapêutica, Relaxante, Desportiva"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Especialidades */}
        <div>
          <label className="block text-sm font-medium mb-2">Especialidades</label>
          <input
            type="text"
            name="specialties_headline"
            value={formData.specialties_headline}
            onChange={handleChange}
            placeholder="Deep Tissue, Swedish, Hot Stone"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Preços */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Preço 60min</label>
            <input
              type="text"
              name="rate_60"
              value={formData.rate_60}
              onChange={handleChange}
              placeholder="$80"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Preço 90min</label>
            <input
              type="text"
              name="rate_90"
              value={formData.rate_90}
              onChange={handleChange}
              placeholder="$110"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Outcall</label>
            <input
              type="text"
              name="rate_outcall"
              value={formData.rate_outcall}
              onChange={handleChange}
              placeholder="$150"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Mensagem de Feedback */}
        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('✅')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Botão Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
```

---

## 📸 4. Componente de Upload de Fotos

```typescript
// components/PhotoUploader.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function PhotoUploader() {
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [message, setMessage] = useState('');

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setMessage('');

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Selecione um arquivo para upload');
      }

      const file = event.target.files[0];

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione uma imagem');
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Imagem muito grande. Máximo 5MB');
      }

      // Pegar usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Gerar nome único
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`;

      console.log('📤 Fazendo upload:', fileName);

      // Upload para Storage
      const { error: uploadError } = await supabase.storage
        .from('therapist-uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('therapist-uploads')
        .getPublicUrl(fileName);

      setPhotoUrl(publicUrl);
      console.log('✅ Upload concluído:', publicUrl);

      // Atualizar perfil com nova foto
      const { error: updateError } = await supabase
        .from('therapists')
        .update({ profile_photo: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setMessage('✅ Foto atualizada com sucesso!');

    } catch (error: any) {
      console.error('❌ Erro no upload:', error.message);
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Foto de Perfil</h2>

      {/* Preview da foto */}
      {photoUrl && (
        <div className="mb-4">
          <Image
            src={photoUrl}
            alt="Profile"
            width={200}
            height={200}
            className="rounded-full mx-auto object-cover"
          />
        </div>
      )}

      {/* Input de upload */}
      <div className="mb-4">
        <label
          htmlFor="photo-upload"
          className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-md cursor-pointer hover:bg-blue-700"
        >
          {uploading ? 'Fazendo upload...' : 'Escolher Foto'}
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={uploadPhoto}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`p-3 rounded-md ${
          message.includes('✅')
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Instruções */}
      <div className="mt-4 text-sm text-gray-600">
        <p>• Formatos aceitos: JPG, PNG, GIF</p>
        <p>• Tamanho máximo: 5MB</p>
        <p>• Recomendado: Imagem quadrada (500x500px ou maior)</p>
      </div>
    </div>
  );
}
```

---

## 🔒 5. Componente de Proteção de Rota (Auth Guard)

```typescript
// components/AuthGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setAuthenticated(true);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}

// Uso:
// <AuthGuard>
//   <DashboardPage />
// </AuthGuard>
```

---

**Última atualização:** 2025-12-20
