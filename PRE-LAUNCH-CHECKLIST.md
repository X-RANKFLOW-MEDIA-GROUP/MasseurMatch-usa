# 🚀 CHECKLIST PRÉ-LANÇAMENTO - MASSEURMATCH
## Foco: Rankear no Google ASAP

**Status atual:** ❌ BUILD QUEBRADO - não pode ser lançado
**Prioridade:** Corrigir bloqueadores → SEO → Lançar

---

## 🔴 BLOQUEADORES CRÍTICOS (Impedem lançamento)

### 1. ⚠️ BUILD QUEBRADO - Variáveis de Ambiente
**Status:** 🔴 CRÍTICO
**Tempo estimado:** 5 minutos

**Problema:**
```
Error: NEXT_PUBLIC_SUPABASE_URL is required
Error: supabaseUrl is required
```

**Solução:**
1. Criar arquivo `.env.local` na raiz do projeto
2. Adicionar:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```
3. Rodar `npm run build` para validar
4. ✅ Build deve completar sem erros

**Páginas afetadas:**
- `/city/[city]/[segment]`
- `/city/[city]`
- `/therapist/[id]`

---

### 2. 🐛 Typo no Componente About
**Status:** 🔴 CRÍTICO
**Tempo estimado:** 1 minuto
**Arquivo:** `src/components/About.tsx` linha 160

**Problema:**
```tsx
<p> mjr
  MasseurMatch does not process payments...
```

**Solução:**
Remover " mjr" da linha 160:
```tsx
<p>
  MasseurMatch does not process payments...
```

---

### 3. ⚙️ Middleware Deprecado
**Status:** 🟠 ALTA
**Tempo estimado:** 10 minutos
**Arquivo:** `middleware.ts`

**Problema:**
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

**Solução:**
- Renomear `middleware.ts` para `proxy.ts`
- Atualizar imports se necessário
- Documentação: https://nextjs.org/docs/messages/middleware-to-proxy

---

## 🎯 SEO CRÍTICO (Para rankear rápido)

### 4. 📊 Schema da Organização Não Injetado
**Status:** 🟡 MÉDIA - OPORTUNIDADE SEO
**Tempo estimado:** 5 minutos
**Arquivo:** `app/layout.tsx` linha 17-54

**Problema:**
O schema JSON está definido mas não está sendo usado no HTML.

**Solução:**
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ProfileProvider>
          <Header />
          <main>{children}</main>
        </ProfileProvider>
      </body>
    </html>
  );
}
```

**Impacto SEO:**
- ✅ Rich snippets no Google
- ✅ Knowledge Graph
- ✅ Credibilidade aumentada

---

### 5. 📝 Meta Description Genérica
**Status:** 🟡 MÉDIA - SEO
**Tempo estimado:** 2 minutos
**Arquivo:** `app/layout.tsx` linha 56-59

**Problema:**
```typescript
export const metadata: Metadata = {
  title: "MasseurMatch",
  description: "Find real massage therapists. Connect with confidence.",
};
```
❌ Não menciona "gay massage" ou "LGBT"

**Solução:**
```typescript
export const metadata: Metadata = {
  title: "MasseurMatch | Gay Massage & Male Massage Therapist Directory",
  description: "Find verified gay massage and male massage therapists across the USA. LGBT-friendly wellness directory. Connect with licensed professionals in your city.",
  keywords: ["gay massage", "male massage", "lgbt massage", "m4m massage", "gay massage therapist", "male bodywork"]
};
```

**Impacto SEO:**
- ✅ Keywords principais no title
- ✅ CTR melhorado no Google
- ✅ Relevância para termos LGBT

---

### 6. 🖼️ Verificar Open Graph Image
**Status:** 🟡 MÉDIA - SEO Social
**Tempo estimado:** 5 minutos

**Verificar:**
```bash
ls -la public/og-image.jpg
```

**Se não existir:**
1. Criar imagem 1200x630px
2. Design sugerido:
   - Logo MasseurMatch
   - Texto: "Gay Massage & Male Massage Directory"
   - Visual profissional, clean, LGBT-friendly
3. Salvar em `public/og-image.jpg`

**Impacto:**
- ✅ Compartilhamentos no Facebook/Twitter
- ✅ Profissionalismo
- ✅ Brand awareness

---

### 7. 🔍 Verificar Todas as URLs do Sitemap
**Status:** 🟡 MÉDIA - SEO
**Tempo estimado:** 15 minutos

**O que fazer:**
```bash
# 1. Rodar o build
npm run build

# 2. Iniciar servidor de produção
npm start

# 3. Acessar sitemap
curl http://localhost:3000/sitemap.xml | grep -o '<loc>.*</loc>' | head -20

# 4. Testar URLs sample
curl -I http://localhost:3000/city/miami
curl -I http://localhost:3000/city/miami/gay-massage
```

**Validar:**
- ✅ Todas retornam 200 (não 404 ou 500)
- ✅ Content-Type correto
- ✅ Rendering completo (view-source)

---

## 🚀 OTIMIZAÇÕES DE SEO (Pré-Lançamento)

### 8. 📦 Atualizar Dependências
**Status:** 🟢 BAIXA
**Tempo estimado:** 5 minutos

```bash
npm update
npm audit fix
```

**Pacotes desatualizados:**
- next: 16.0.7 → 16.0.8
- react: 19.2.0 → 19.2.1
- @supabase/supabase-js: 2.81.1 → 2.87.1

---

### 9. 🗺️ Submeter Sitemap ao Google
**Status:** 🟢 BAIXA - Fazer após deploy
**Tempo estimado:** 10 minutos

**Passos:**
1. Deploy do site em produção
2. Acessar [Google Search Console](https://search.google.com/search-console)
3. Adicionar propriedade: `https://www.masseurmatch.com`
4. Verificar propriedade (DNS ou HTML tag)
5. Ir em "Sitemaps" → Adicionar `https://www.masseurmatch.com/sitemap.xml`
6. Clicar "Enviar"

**Impacto:**
- ✅ Indexação mais rápida (1-7 dias vs 2-4 semanas)
- ✅ 1000+ URLs descobertas pelo Google imediatamente

---

### 10. 📊 Configurar Google Analytics 4
**Status:** 🟢 BAIXA - Essencial para tracking
**Tempo estimado:** 15 minutos

**Implementação:**

1. Criar conta GA4: https://analytics.google.com/
2. Copiar Measurement ID (ex: `G-XXXXXXXXXX`)
3. Instalar:
```bash
npm install @next/third-parties
```

4. Adicionar em `app/layout.tsx`:
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

**Impacto:**
- ✅ Tracking de visitas, conversões
- ✅ Dados para otimizar SEO
- ✅ Entender comportamento do usuário

---

## 🎯 CONTENT SEO (Primeiros 7 dias pós-lançamento)

### 11. 🌆 Seed de Conteúdo - Cidades Prioritárias
**Status:** 🟢 PÓS-LANÇAMENTO
**Tempo estimado:** 2-3 horas

**20 cidades SEO prioritárias do sitemap:**
Miami, Orlando, Fort Lauderdale, New York, Los Angeles, San Francisco, Las Vegas, Phoenix, Chicago, Atlanta, Dallas, Houston, Austin, San Diego, Seattle, Denver, Washington DC, Boston, Philadelphia, Tampa

**Para cada cidade, garantir:**
- ✅ Página `/city/[city]` renderiza com conteúdo único
- ✅ Pelo menos 3 perfis de terapeutas (seed ou reais)
- ✅ FAQs específicas da cidade
- ✅ Schema JSON correto

**Prioridade de criação:**
1. **Tier 1:** Miami, NYC, LA, SF, Las Vegas (5 cidades)
2. **Tier 2:** Chicago, Atlanta, Dallas, Austin, Seattle (5 cidades)
3. **Tier 3:** Restantes (10 cidades)

---

### 12. 🔗 Internal Linking Estratégico
**Status:** 🟢 PÓS-LANÇAMENTO
**Tempo estimado:** 30 minutos

**Adicionar links internos em:**

**Homepage (`app/page.tsx`):**
```tsx
<p>
  Explore <a href="/city/miami">gay massage in Miami</a>,
  <a href="/city/new-york">male massage in NYC</a>, or
  <a href="/city/los-angeles">LGBT massage in LA</a>.
</p>
```

**Footer (`src/components/Footer.tsx`):**
Adicionar seção "Popular Cities":
```tsx
<div>
  <h4>Popular Cities</h4>
  <ul>
    <li><Link href="/city/miami">Miami Gay Massage</Link></li>
    <li><Link href="/city/new-york">NYC Male Massage</Link></li>
    <li><Link href="/city/los-angeles">LA LGBT Massage</Link></li>
    <li><Link href="/city/san-francisco">SF Gay Massage</Link></li>
    <li><Link href="/city/las-vegas">Vegas Gay Massage</Link></li>
  </ul>
</div>
```

**Impacto SEO:**
- ✅ Distribui PageRank interno
- ✅ Ajuda Google descobrir páginas
- ✅ Melhora UX (navegação)

---

## 🔗 LINK BUILDING (Primeiras 2 semanas)

### 13. 📢 Submeter a Diretórios LGBT
**Status:** 🟢 PÓS-LANÇAMENTO
**Tempo estimado:** 2-3 horas

**Diretórios para submeter:**

**Tier 1 (Alta autoridade):**
- [ ] Gay.com business directory
- [ ] Pink News business listings
- [ ] OutTraveler.com (travel + wellness)
- [ ] LGBT Chamber of Commerce directories
- [ ] Human Rights Campaign resources

**Tier 2 (Niche relevante):**
- [ ] GayWebPages.com
- [ ] GayWired.com
- [ ] Damron.com (travel guide)
- [ ] Gay Cities directory
- [ ] Queerty business features

**Tier 3 (Gerais mas úteis):**
- [ ] Yelp (categoria: massage, LGBT-friendly)
- [ ] Google Business Profile
- [ ] Bing Places
- [ ] Yellow Pages
- [ ] Manta.com

**Template de descrição:**
```
MasseurMatch is the leading LGBT-friendly massage therapist directory in the USA. Find verified gay massage and male massage professionals in your city. We connect the LGBT community with licensed, inclusive wellness providers across all 50 states. Safe, discreet, professional.
```

---

### 14. 🤝 Parcerias Estratégicas
**Status:** 🟢 PÓS-LANÇAMENTO
**Tempo estimado:** Ongoing

**Alvos para parceria:**

**Associações profissionais:**
- American Massage Therapy Association (AMTA)
- Associated Bodywork & Massage Professionals (ABMP)
- National LGBT Chamber of Commerce

**Mídia LGBT:**
- Advocate.com (guest post)
- Out.com (feature article)
- Queerty.com (press release)
- Gay Star News

**Influencers:**
- Fitness influencers gay no Instagram
- YouTubers LGBT de wellness
- TikTokers de self-care/massage education

**Proposta de valor:**
- Affiliate program (se houver)
- Featured listings grátis para early adopters
- Guest posts sobre "Benefits of gay massage"

---

## 🧪 TESTING PRÉ-LANÇAMENTO

### 15. ✅ Testes Funcionais Completos
**Status:** 🔴 CRÍTICO
**Tempo estimado:** 1-2 horas

**Fluxos a testar:**

**Cadastro de terapeuta:**
- [ ] Acessar `/join`
- [ ] Preencher formulário `/join/form`
- [ ] Upload de fotos (verificar tamanho/tipo aceito)
- [ ] Submit bem-sucedido
- [ ] Redirecionamento para `/pending`
- [ ] Email de confirmação recebido (se aplicável)

**Admin approval:**
- [ ] Login como admin em `/admin`
- [ ] Ver perfis pendentes
- [ ] Aprovar perfil
- [ ] Verificar perfil aparece em `/explore`
- [ ] Testar rejeição de perfil

**Perfil público:**
- [ ] Acessar `/therapist/[id]`
- [ ] Verificar todas as informações aparecem
- [ ] Testar botões de contato
- [ ] Verificar SEO meta tags (view-source)

**Edição de perfil:**
- [ ] Login como terapeuta
- [ ] Acessar `/edit-profile`
- [ ] Modificar informações
- [ ] Save bem-sucedido
- [ ] Admin approval de edições em `/admin/edits`

**Checkout (se aplicável):**
- [ ] Fluxo de pagamento completo
- [ ] Test card Stripe
- [ ] Redirect para `/checkout/success`
- [ ] Verificar ativação de conta

**Páginas SEO:**
- [ ] Acessar `/city/miami`
- [ ] Acessar `/city/miami/gay-massage`
- [ ] Verificar conteúdo único renderiza
- [ ] Verificar schema JSON no source

---

### 16. 🚦 Lighthouse Audit
**Status:** 🟡 MÉDIA
**Tempo estimado:** 30 minutos

**Executar:**
1. Abrir Chrome DevTools (F12)
2. Aba "Lighthouse"
3. Rodar audit para:
   - Homepage `/`
   - City page `/city/miami`
   - Therapist profile `/therapist/[id]`

**Metas mínimas:**
- ✅ Performance: 80+
- ✅ Accessibility: 90+
- ✅ Best Practices: 90+
- ✅ **SEO: 95+** (crítico!)

**Problemas comuns a corrigir:**
- Images sem alt text
- Links sem aria-labels
- Contraste de cores baixo
- Missing meta descriptions
- H1 duplicado ou ausente

---

### 17. 🌐 Cross-Browser Testing
**Status:** 🟡 MÉDIA
**Tempo estimado:** 30 minutos

**Testar em:**
- [ ] Chrome (desktop + mobile)
- [ ] Safari (macOS + iOS)
- [ ] Firefox
- [ ] Edge
- [ ] Android Chrome

**Verificar:**
- Layout não quebra
- Forms funcionam
- Mapa (Leaflet) carrega
- Mobile menu funciona
- Imagens carregam

---

## 📈 ESTRATÉGIA DE INDEXAÇÃO RÁPIDA

### 18. 🔥 Técnica: Indexação Forçada
**Status:** 🟢 FAZER NO DIA DO LANÇAMENTO
**Tempo estimado:** 1 hora

**Passo a passo para indexar em 24-48h:**

1. **Google Search Console:**
   - Ir em "Inspeção de URL"
   - Inserir: `https://www.masseurmatch.com`
   - Clicar "Solicitar indexação"
   - Repetir para top 20 URLs:
     - `/city/miami`
     - `/city/new-york`
     - `/city/los-angeles`
     - `/city/san-francisco`
     - `/city/chicago`
     - (continuar com top 20 cidades)

2. **IndexNow (Bing/Yandex):**
   ```bash
   curl -X POST "https://api.bing.com/indexnow" \
     -H "Content-Type: application/json" \
     -d '{
       "host": "www.masseurmatch.com",
       "key": "your-index-now-key",
       "urlList": [
         "https://www.masseurmatch.com/",
         "https://www.masseurmatch.com/city/miami",
         "https://www.masseurmatch.com/city/new-york"
       ]
     }'
   ```

3. **Social Signals (indexação indireta):**
   - Postar no Reddit (r/gaybros, r/lgbtq)
   - Postar no Twitter com hashtags #gaymassage #lgbtq
   - Compartilhar em grupos LGBT do Facebook
   - Google crawla links do Twitter/Reddit

---

### 19. 🎯 Long-Tail Keywords (Ganho rápido)
**Status:** 🟢 PÓS-LANÇAMENTO
**Tempo estimado:** 2 horas

**Criar páginas para queries específicas de baixa competição:**

Formato: `/city/[city]/[segment]/[long-tail]`

**Exemplos:**
- `/city/miami/gay-massage/south-beach` (neighborhood)
- `/city/miami/gay-massage/hotel-outcall` (service type)
- `/city/miami/gay-massage/late-night` (timing)
- `/city/new-york/male-massage/manhattan-financial-district`
- `/city/los-angeles/lgbt-massage/west-hollywood`

**Por que funciona:**
- ✅ Baixa competição
- ✅ Alta intenção de busca
- ✅ Rankeia em dias (não meses)
- ✅ Tráfego qualificado

**Implementação:**
Criar componente dinâmico similar a `[segment]/page.tsx` mas um nível mais profundo.

---

## 🎓 CHECKLIST FINAL DE LANÇAMENTO

### Dia -1 (Antes do Deploy)
- [ ] ✅ Todos os bloqueadores corrigidos
- [ ] ✅ Build completa sem erros
- [ ] ✅ Testes funcionais passam
- [ ] ✅ Lighthouse SEO 95+
- [ ] ✅ .env.local configurado corretamente
- [ ] ✅ OG image existe e está bonita
- [ ] ✅ Dependências atualizadas

### Dia 0 (Lançamento)
- [ ] 🚀 Deploy para produção (Vercel)
- [ ] 🌐 DNS configurado (www.masseurmatch.com)
- [ ] 🔍 Google Search Console configurado
- [ ] 📊 Google Analytics instalado
- [ ] 🗺️ Sitemap submetido
- [ ] 🔥 Top 20 URLs solicitadas para indexação
- [ ] 📱 Post de lançamento em redes sociais
- [ ] 📧 Email para early adopters (se houver lista)

### Dia 1-7 (Primeira Semana)
- [ ] 📈 Monitorar Google Analytics diariamente
- [ ] 🔍 Verificar indexação no GSC
- [ ] 🐛 Corrigir bugs críticos reportados
- [ ] 📝 Criar 3 blog posts SEO:
  - "Best Gay Massage in Miami: Complete Guide"
  - "How to Find LGBT-Friendly Massage Therapists"
  - "Benefits of Male-to-Male Massage Therapy"
- [ ] 🔗 Submeter a 10 diretórios LGBT
- [ ] 🤝 Contatar 5 sites para guest post
- [ ] 📱 Postar conteúdo diário no Instagram/TikTok

### Dia 8-14 (Segunda Semana)
- [ ] 📊 Análise de keywords que estão rankeando
- [ ] 🎯 Otimizar páginas com baixo CTR
- [ ] 🔗 Mais 10 diretórios submetidos
- [ ] 📝 Mais 2 blog posts
- [ ] 💰 Primeiros 10 terapeutas pagantes (meta)
- [ ] 🌐 Primeiras 100 visitas orgânicas do Google (meta)

---

## 🎯 MÉTRICAS DE SUCESSO (30 dias)

### SEO:
- [ ] 50+ páginas indexadas no Google
- [ ] Top 10 para "[city] gay massage" em 5 cidades
- [ ] Top 20 para "gay massage directory"
- [ ] 1.000+ impressões no Google Search Console
- [ ] 100+ clicks orgânicos

### Tráfego:
- [ ] 5.000 visitas/mês
- [ ] 50% tráfego orgânico
- [ ] Taxa de rejeição < 60%
- [ ] Tempo médio > 2 minutos

### Negócio:
- [ ] 50 terapeutas cadastrados
- [ ] 10 terapeutas pagantes
- [ ] $XXX receita recorrente
- [ ] Net Promoter Score > 50

---

## 💡 DICAS PRO PARA RANKEAR RÁPIDO

### 1. Freshness Signal
- Adicionar "Last Updated: [date]" em páginas
- Atualizar conteúdo semanalmente
- Adicionar novos terapeutas frequentemente
- Google favorece conteúdo fresco

### 2. User Signals
- Melhorar CTR com titles atrativos
- Reduzir bounce rate com conteúdo relevante
- Aumentar time on page com FAQs, vídeos
- Google usa comportamento do usuário como ranking factor

### 3. E-E-A-T (Experience, Expertise, Authority, Trust)
- Adicionar "About the Team" com credentials
- Citar fontes (AMTA, ABMP)
- Adicionar disclaimers médicos
- Reviews/testimonials de usuários reais
- Google prioriza sites com autoridade em wellness

### 4. Local SEO
- Criar Google Business Profiles para cada cidade (se aplicável)
- Adicionar schema LocalBusiness
- Incluir mapas em páginas de cidade
- Menção a landmarks locais
- "Near me" queries são 50% das buscas móveis

---

## 🆘 CONTATOS ÚTEIS

**Suporte Técnico:**
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Vercel Support: https://vercel.com/support

**SEO:**
- Google Search Console: https://search.google.com/search-console
- Google Analytics: https://analytics.google.com
- Ahrefs (keyword research): https://ahrefs.com
- Screaming Frog (SEO audit): https://www.screamingfrog.co.uk

**Legal:**
- FOSTA-SESTA compliance guide
- State massage licensing boards
- DMCA takedown process

---

## ✅ APROVAÇÃO PARA LANÇAMENTO

**Critérios mínimos:**
- [x] Build funciona sem erros
- [x] .env configurado
- [x] Typos corrigidos
- [x] SEO básico implementado
- [x] Google Search Console configurado
- [x] Google Analytics instalado
- [x] Testes funcionais passam
- [x] Lighthouse SEO > 95

**Quando todos os itens acima estiverem ✅, você está pronto para lançar! 🚀**

---

**Boa sorte com o lançamento! 🎉**

*Gerado em: 2025-12-09*
*Projeto: MasseurMatch USA*
*Objetivo: Rankear "gay massage [city]" no Google em 30 dias*
