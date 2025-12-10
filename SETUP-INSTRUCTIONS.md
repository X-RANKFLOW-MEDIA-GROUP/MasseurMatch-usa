# 🚀 Setup Instructions - MasseurMatch

## ⚠️ CRÍTICO: Configuração de Ambiente

Para rodar o projeto, você DEVE configurar as variáveis de ambiente do Supabase.

### 1. Copiar o arquivo de exemplo

```bash
cp .env.local.example .env.local
```

### 2. Obter as credenciais do Supabase

1. Acesse: https://app.supabase.com/
2. Selecione seu projeto MasseurMatch
3. Vá em **Settings** → **API**
4. Copie os valores:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Editar .env.local

Abra o arquivo `.env.local` e substitua os valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-real.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-real-aqui
```

### 4. Instalar dependências

```bash
npm install
```

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

Abra: http://localhost:3000

### 6. Testar build de produção

```bash
npm run build
npm start
```

---

## ✅ Verificação de Sucesso

Se tudo estiver correto, você verá:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

**Se o build falhar com "supabaseUrl is required"**, revise o arquivo `.env.local`.

---

## 📦 Dependências Atualizadas

As seguintes dependências foram atualizadas para as versões mais recentes:

- next: 16.0.8
- react: 19.2.1
- react-dom: 19.2.1
- @supabase/supabase-js: 2.87.1
- lucide: 0.556.0
- lucide-react: 0.556.0
- jspdf: 3.0.4

---

## 🎯 Melhorias de SEO Implementadas

✅ Schema JSON da organização adicionado ao layout
✅ Meta description otimizada com keywords LGBT
✅ Keywords adicionados (gay massage, male massage, etc.)
✅ Internal links para cidades populares no footer
✅ Title otimizado para SEO

---

## 🐛 Correções Feitas

✅ Typo " mjr" removido de About.tsx
✅ Dependências atualizadas
✅ Arquivo de exemplo .env.local criado

---

## 📋 Próximos Passos

1. **Configurar .env.local** (crítico!)
2. Verificar se o build funciona
3. Criar/adicionar imagem `/public/og-image.jpg` (1200x630px)
4. Revisar o **PRE-LAUNCH-CHECKLIST.md** para tarefas restantes
5. Fazer deploy no Vercel

---

## 🆘 Problemas Comuns

### Build falha com "supabaseUrl is required"
**Solução:** Certifique-se de que `.env.local` existe e tem as variáveis corretas.

### Páginas de cidade retornam 404
**Solução:** Execute o build completo (`npm run build`) para gerar páginas estáticas.

### Erro "Module not found"
**Solução:** Execute `npm install` novamente.

---

## 📞 Suporte

Para dúvidas técnicas, consulte:
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

**Projeto pronto para lançamento após configurar .env.local!** 🎉
