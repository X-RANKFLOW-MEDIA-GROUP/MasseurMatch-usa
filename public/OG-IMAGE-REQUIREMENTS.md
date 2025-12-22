# 🖼️ Open Graph Image - REQUIREMENTS

## ❌ MISSING: `og-image.jpg`

Esta imagem é **obrigatória** para compartilhamentos sociais (Facebook, Twitter, LinkedIn, WhatsApp).

---

## 📐 ESPECIFICAÇÕES TÉCNICAS

- **Nome do arquivo:** `og-image.jpg` (salvar nesta pasta: `/public/`)
- **Dimensões:** 1200x630 pixels (aspect ratio 1.91:1)
- **Formato:** JPG ou PNG
- **Tamanho:** < 1MB (otimizado)
- **Qualidade:** 80-90% (balancear qualidade vs tamanho)

---

## 🎨 DESIGN SUGERIDO

### Elementos principais:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [LOGO MASSEURMATCH]                │
│                                                 │
│      Gay Massage & Male Massage Directory      │
│                                                 │
│         Find LGBT-Friendly Therapists          │
│              Across the USA                     │
│                                                 │
│                 🏳️‍🌈 masseurmatch.com           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Cores recomendadas:
- **Fundo:** Gradiente sutil (azul/roxo LGBT-friendly)
- **Texto:** Branco ou contraste alto
- **Logo:** Destaque central
- **Ícones:** Minimalistas, profissionais

### Fontes:
- **Título:** Bold, sans-serif, moderno
- **Subtítulo:** Regular, legível
- **URL:** Menor, discreto

---

## 🛠️ FERRAMENTAS PARA CRIAR

### Opção 1: Canva (Mais fácil)
1. Acesse: https://www.canva.com/
2. Criar design → "Custom size" → 1200 x 630 px
3. Use template de "Social Media" ou crie do zero
4. Baixe como JPG (80% qualidade)

### Opção 2: Figma (Profissional)
1. Criar frame 1200x630
2. Adicionar logo + texto + background
3. Export → JPG → 2x quality

### Opção 3: Photoshop/GIMP
1. Novo arquivo 1200x630px, 72 DPI
2. Design conforme mockup acima
3. Save for Web → JPG quality 80

### Opção 4: IA Gerativa (Rápido)
```
Prompt para Midjourney/DALL-E:
"Modern professional social media banner for LGBT massage directory website,
1200x630px, clean minimalist design, gradient background in pride colors,
text 'MasseurMatch - Gay Massage Directory', professional medical wellness
theme, sans-serif typography, --ar 1.91:1"
```

---

## 📋 CHECKLIST PÓS-CRIAÇÃO

Depois de criar a imagem:

- [ ] Salvar como `og-image.jpg` em `/public/`
- [ ] Verificar tamanho do arquivo (< 1MB)
- [ ] Testar preview em: https://www.opengraph.xyz/
- [ ] Testar no Facebook Debugger: https://developers.facebook.com/tools/debug/
- [ ] Testar no Twitter Card Validator: https://cards-dev.twitter.com/validator
- [ ] Commit e push para o repositório

---

## 🔍 ONDE A IMAGEM É USADA

A imagem será automaticamente exibida quando alguém compartilhar links do site em:

- ✅ Facebook (posts, stories, messages)
- ✅ Twitter/X (tweets com preview)
- ✅ LinkedIn (posts profissionais)
- ✅ WhatsApp (preview de links)
- ✅ Telegram (preview de links)
- ✅ Slack (unfurl de URLs)
- ✅ Discord (embeds)
- ✅ iMessage (link previews)

---

## 🚨 IMPACTO DA AUSÊNCIA

**Sem esta imagem:**
- ❌ Links compartilhados parecem "quebrados"
- ❌ Menor taxa de cliques (CTR)
- ❌ Aparência não profissional
- ❌ Menos confiança dos usuários
- ❌ Menor viralidade orgânica

**Com a imagem:**
- ✅ +32% CTR em compartilhamentos (média do setor)
- ✅ Reconhecimento de marca
- ✅ Profissionalismo
- ✅ Confiabilidade

---

## 📊 EXEMPLO DE META TAG

A imagem será usada automaticamente pelos meta tags no código:

```tsx
// app/layout.tsx ou pages específicas
<meta property="og:image" content="https://www.masseurmatch.com/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://www.masseurmatch.com/og-image.jpg" />
```

---

## ⏱️ TEMPO ESTIMADO

- **Canva template:** 10-15 minutos
- **Design custom:** 30-45 minutos
- **Design profissional:** 1-2 horas

---

**PRIORIDADE:** 🟠 Alta - Necessária antes do lançamento em produção

**STATUS:** ❌ Pendente criação
