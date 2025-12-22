# 🚀 QUICK START - Lançar HOJE em 3 Horas

Este guia te leva do estado atual até o site ONLINE em produção.

**Tempo total estimado:** 3-4 horas
**Pré-requisitos:** Conta Supabase criada

---

## ⏱️ FASE 1: CONFIGURAÇÃO INICIAL (30 min)

### Passo 1.1: Clonar e Instalar (5 min) ✅ FEITO
```bash
cd /home/user/MasseurMatch-usa
npm install  # ✅ Já executado - 647 pacotes instalados
```

### Passo 1.2: Configurar Variáveis de Ambiente (15 min) ⚠️ **VOCÊ PRECISA FAZER ISSO**

```bash
# 1. Copiar o template
cp .env.local.example .env.local

# 2. Abrir o arquivo
nano .env.local
# ou
code .env.local
```

**3. Obter credenciais do Supabase:**

Acesse: https://app.supabase.com/

1. Selecione seu projeto MasseurMatch
2. Vá em **Settings** → **API**
3. Copie:
   - **Project URL** → colar em `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → colar em `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → colar em `SUPABASE_SERVICE_ROLE_KEY`

4. (Opcional) DeepSeek API:
   - Acesse: https://platform.deepseek.com/api_keys
   - Crie uma chave → colar em `DEEPSEEK_API_KEY`

**Seu `.env.local` deve ficar assim:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
DEEPSEEK_API_KEY=sk-...
```

### Passo 1.3: Criar Imagem OG (10 min) ⚠️ **VOCÊ PRECISA FAZER ISSO**

**Opção Rápida (Canva):**
1. Acesse: https://www.canva.com/
2. Custom size: 1200 x 630 px
3. Adicione:
   - Logo MasseurMatch (se tiver)
   - Texto: "Gay Massage & Male Massage Directory"
   - Fundo LGBT-friendly
4. Download como JPG
5. Salvar como: `/home/user/MasseurMatch-usa/public/og-image.jpg`

**Veja detalhes:** `public/OG-IMAGE-REQUIREMENTS.md`

---

## ⏱️ FASE 2: VERIFICAR BANCO DE DADOS (30-60 min)

### Passo 2.1: Verificar Schema (15 min)

No Supabase Dashboard:

1. **Table Editor** → Verificar se existem:
   - ✅ `therapists` (tabela principal)
   - ✅ `therapist_redirects` (redirects)
   - ✅ Tabelas de autenticação (criadas automaticamente)

2. **Se tabela `therapists` não existe**, criar com SQL Editor:

```sql
-- Execute no SQL Editor do Supabase
CREATE TABLE therapists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Basic Info
  full_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  headline TEXT,
  about TEXT,
  philosophy TEXT,

  -- Location
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Contact
  email TEXT,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  whatsapp TEXT,

  -- Media
  profile_photo TEXT,
  gallery TEXT[],

  -- Ratings
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  override_reviews_count INTEGER,

  -- Status
  status TEXT DEFAULT 'pending',
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,

  -- Pricing
  rate_60min INTEGER,
  rate_90min INTEGER,
  outcall_available BOOLEAN DEFAULT false,

  -- Add other fields as needed based on your ProfileContext type

  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Indexes
CREATE INDEX idx_therapists_city ON therapists(city);
CREATE INDEX idx_therapists_state ON therapists(state);
CREATE INDEX idx_therapists_slug ON therapists(slug);
CREATE INDEX idx_therapists_status ON therapists(status);

-- RLS (Row Level Security)
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved therapists
CREATE POLICY "Public therapists are viewable by everyone"
  ON therapists FOR SELECT
  USING (approved = true);

-- Policy: Authenticated users can insert
CREATE POLICY "Authenticated users can insert"
  ON therapists FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Users can update their own profiles
CREATE POLICY "Users can update own profile"
  ON therapists FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

### Passo 2.2: Adicionar Dados de Teste (15-30 min)

**Opção A: Dados Mínimos (5 perfis rápidos)**

```sql
-- Inserir 5 terapeutas de teste em cidades principais
INSERT INTO therapists (full_name, slug, headline, city, state, rating, review_count, approved, profile_photo) VALUES
('John Massage', 'john-massage-miami', 'Licensed Massage Therapist in Miami', 'Miami', 'FL', 4.8, 24, true, 'https://i.pravatar.cc/300?img=1'),
('David Wellness', 'david-wellness-nyc', 'Deep Tissue Specialist - Manhattan', 'New York', 'NY', 4.9, 42, true, 'https://i.pravatar.cc/300?img=2'),
('Michael Therapy', 'michael-therapy-la', 'Swedish & Sports Massage - Los Angeles', 'Los Angeles', 'CA', 4.7, 18, true, 'https://i.pravatar.cc/300?img=3'),
('Alex Bodywork', 'alex-bodywork-sf', 'Certified Bodywork Professional', 'San Francisco', 'CA', 5.0, 56, true, 'https://i.pravatar.cc/300?img=4'),
('Chris Healing', 'chris-healing-chicago', 'Holistic Massage Therapist', 'Chicago', 'IL', 4.6, 31, true, 'https://i.pravatar.cc/300?img=5');
```

**Opção B: Usar seus dados reais** (se já tiver terapeutas cadastrados)

---

## ⏱️ FASE 3: TESTAR BUILD (15 min)

### Passo 3.1: Build de Produção

```bash
npm run build
```

**✅ Sucesso esperado:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (54 routes)
✓ Finalizing page optimization
```

**❌ Se falhar:**
- Verifique `.env.local` está preenchido corretamente
- Verifique tabela `therapists` existe no Supabase
- Veja logs de erro

### Passo 3.2: Testar Localmente

```bash
npm run dev
```

Abra: http://localhost:3000

**Testar:**
- [ ] Homepage carrega
- [ ] `/explore` mostra terapeutas
- [ ] `/city/miami` carrega (se tiver dados)
- [ ] `/login` funciona
- [ ] Sem erros no console

---

## ⏱️ FASE 4: DEPLOY PARA VERCEL (30-45 min)

### Passo 4.1: Preparar Repositório

```bash
# Commitar mudanças
git add .
git commit -m "Configure environment and production settings"
git push -u origin claude/review-repo-readiness-lwUfs
```

### Passo 4.2: Deploy no Vercel

**Opção A: Via Vercel Dashboard (Mais fácil)**

1. Acesse: https://vercel.com/
2. **New Project**
3. Import do GitHub → Selecionar repositório
4. **Configure:**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Environment Variables:**
   Adicionar:
   ```
   NEXT_PUBLIC_SUPABASE_URL = (valor do seu .env.local)
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (valor do seu .env.local)
   DEEPSEEK_API_KEY = (valor do seu .env.local)
   SUPABASE_SERVICE_ROLE_KEY = (valor do seu .env.local)
   ```

6. **Deploy!**

**Opção B: Via CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configurar env vars quando solicitado
```

### Passo 4.3: Configurar Domínio (se tiver)

1. Vercel Dashboard → Seu projeto → **Settings** → **Domains**
2. Adicionar: `www.masseurmatch.com`
3. Configurar DNS conforme instruções

---

## ⏱️ FASE 5: SEO & ANALYTICS (45-60 min)

### Passo 5.1: Google Search Console (20 min)

1. Acesse: https://search.google.com/search-console
2. **Add Property** → `https://www.masseurmatch.com`
3. Verificar propriedade:
   - Opção 1: DNS (TXT record)
   - Opção 2: HTML tag (adicionar em `app/layout.tsx`)
4. **Sitemaps** → Adicionar: `https://www.masseurmatch.com/sitemap.xml`
5. **URL Inspection** → Solicitar indexação:
   - Homepage
   - `/city/miami`
   - `/city/new-york`
   - `/city/los-angeles`
   - Outras páginas importantes

### Passo 5.2: Google Analytics (25 min)

1. Acesse: https://analytics.google.com/
2. **Create Account** → Create Property
3. Copiar **Measurement ID** (formato: G-XXXXXXXXXX)

4. Instalar pacote:
```bash
npm install @next/third-parties
```

5. Adicionar em `app/layout.tsx`:
```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

6. Commit e redeploy:
```bash
git add .
git commit -m "Add Google Analytics"
git push
```

---

## ⏱️ FASE 6: TESTES FINAIS (30-45 min)

### Checklist de Testes Pré-Lançamento

**Funcionalidade:**
- [ ] Homepage carrega em < 3 segundos
- [ ] Páginas de cidade renderizam corretamente
- [ ] Perfis de terapeutas aparecem
- [ ] Busca/filtros funcionam
- [ ] Login/logout funciona
- [ ] Formulário de cadastro funciona
- [ ] Mobile responsivo

**SEO:**
- [ ] Sitemap acessível: `/sitemap.xml`
- [ ] Robots.txt acessível: `/robots.txt`
- [ ] Meta tags aparecem no view-source
- [ ] OG image aparece ao compartilhar link
- [ ] Lighthouse SEO score > 90

**Segurança:**
- [ ] HTTPS ativo (Vercel fornece automaticamente)
- [ ] Headers de segurança presentes (ver Network tab)
- [ ] Geo-blocking funcionando (testar com VPN se possível)

**Performance:**
- [ ] Lighthouse Performance > 70
- [ ] Imagens carregando otimizadas (WebP)
- [ ] Sem erros no console

---

## ⏱️ FASE 7: LANÇAMENTO! (15 min)

### Passo 7.1: Verificação Final

```bash
# Checar status de produção
curl -I https://www.masseurmatch.com

# Deve retornar: HTTP/2 200
```

### Passo 7.2: Anunciar

**Redes Sociais:**
- [ ] Post no Twitter/X
- [ ] Post no LinkedIn
- [ ] Grupos LGBT no Facebook
- [ ] Reddit (r/gaybros, r/lgbtq)

**Template de post:**
```
🎉 Lançamento: MasseurMatch

Encontre massagistas LGBT-friendly verificados nos EUA.

✅ Diretório completo
✅ Avaliações reais
✅ Espaço seguro e inclusivo

Confira: https://www.masseurmatch.com

#LGBT #GayMassage #Wellness
```

---

## 📊 MÉTRICAS DE SUCESSO (Primeiras 24h)

**Monitorar em Google Analytics:**
- [ ] Primeiros 100 visitantes
- [ ] Taxa de rejeição < 70%
- [ ] Tempo médio no site > 1 minuto

**Monitorar em Google Search Console:**
- [ ] Sitemap processado
- [ ] Primeiras páginas indexadas

**Monitorar erros:**
- [ ] Vercel Dashboard → Logs
- [ ] Sem erros 500
- [ ] Sem erros de banco de dados

---

## 🆘 TROUBLESHOOTING

### Build falha com "supabaseUrl is required"
```bash
# Verificar .env.local existe e está correto
cat .env.local

# Recompilar
rm -rf .next
npm run build
```

### Páginas 404 em produção
```bash
# Verificar dados no Supabase
# Tabela therapists deve ter dados com approved=true
```

### OG image não aparece
```bash
# Testar em: https://www.opengraph.xyz/
# Verificar arquivo existe: public/og-image.jpg
# Limpar cache do Facebook: https://developers.facebook.com/tools/debug/
```

---

## ✅ CHECKLIST FINAL

**Antes de considerar "LANÇADO":**

- [ ] `.env.local` configurado
- [ ] `public/og-image.jpg` criado
- [ ] Build completa sem erros
- [ ] Deploy no Vercel bem-sucedido
- [ ] Domínio configurado (se aplicável)
- [ ] Google Search Console configurado
- [ ] Google Analytics instalado
- [ ] Sitemap submetido
- [ ] 5+ perfis de terapeutas no banco
- [ ] Testes funcionais passam
- [ ] Lighthouse SEO > 90
- [ ] Post de lançamento nas redes

---

## 🎉 PARABÉNS!

Se você chegou até aqui, seu site está **ONLINE E FUNCIONAL**!

**Próximos passos (pós-lançamento):**
1. Monitorar analytics diariamente
2. Adicionar mais terapeutas
3. Criar conteúdo (blog posts)
4. Link building (diretórios LGBT)
5. Responder a feedback dos usuários

---

**Boa sorte com o lançamento! 🚀**

*Gerado em: 2025-12-22*
*Tempo total estimado: 3-4 horas*
