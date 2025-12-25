# 🗄️ EXPLORE AI - SETUP DO BANCO DE DADOS

## ✅ **CHECKLIST DE CONFIGURAÇÃO**

### **1. Executar SQLs no Supabase** (Ordem importa!)

Acesse o [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql) e execute na ordem:

#### **Passo 1: Criar tabela `users_preferences`**
```sql
-- Arquivo: sql/create_users_preferences_table.sql
-- Copia e cola o conteúdo completo no SQL Editor
```

**Verifica:**
```sql
SELECT * FROM users_preferences LIMIT 1;
-- Deve retornar vazio (OK) ou mostrar a estrutura da tabela
```

---

#### **Passo 2: Criar tabela `explore_swipe_events`**
```sql
-- Arquivo: sql/create_explore_swipe_events_table.sql
-- Copia e cola o conteúdo completo no SQL Editor
```

**Verifica:**
```sql
SELECT * FROM explore_swipe_events LIMIT 1;
-- Deve retornar vazio (OK) ou mostrar a estrutura da tabela
```

---

#### **Passo 3: Criar função RPC `discover_nearby_therapists`**
```sql
-- Arquivo: sql/discover_nearby_therapists.sql
-- Copia e cola o conteúdo completo no SQL Editor
```

**Verifica:**
```sql
SELECT * FROM discover_nearby_therapists(
  user_lat := 32.7767,
  user_lon := -96.7970,
  radius_meters := 50000,
  limit_results := 5
);
-- Deve retornar terapeutas próximos a Dallas
```

---

### **2. Verificar Conexões no Código**

#### **a) Arquivo `.env.local` está configurado?**

No diretório `masseurmatch-nextjs/`, deve ter:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### **b) API `/api/preferences` funciona?**

Teste manual via browser:
```
http://localhost:3000/api/preferences
```

**Esperado:**
```json
{
  "preferences": null
}
```
Ou se já tiver preferências salvas:
```json
{
  "preferences": {
    "location": { "lat": 0, "lng": 0, "zipCode": "", "radius": 25 },
    "massageTypes": [],
    ...
  }
}
```

---

#### **c) API `/api/explore-ai/therapists` funciona?**

Teste com query params:
```
http://localhost:3000/api/explore-ai/therapists?mode=swipe&lat=32.7767&lng=-96.7970&radius=50&limit=10
```

**Esperado:**
```json
{
  "success": true,
  "cards": [
    {
      "id": "uuid",
      "name": "Nome do terapeuta",
      "matchScore": 85,
      "distance": 5.2,
      "photoUrl": "...",
      ...
    }
  ],
  "mode": "swipe",
  "total": 10
}
```

**Se der erro 500:**
- Verifica se a função RPC foi criada
- Verifica se tem terapeutas com `latitude` e `longitude` preenchidos
- Verifica logs do Supabase

---

#### **d) API `/api/explore-ai/swipe` funciona?**

Teste com Postman ou cURL:
```bash
curl -X POST http://localhost:3000/api/explore-ai/swipe \
  -H "Content-Type: application/json" \
  -d '{
    "therapistId": "uuid-do-terapeuta",
    "direction": "right",
    "matchScore": 85,
    "context": {
      "specialties": ["Deep Tissue"],
      "services": ["Swedish"],
      "mode": "incall"
    }
  }'
```

**Esperado:**
```json
{
  "success": true
}
```

**Se der erro 401:**
- Precisa estar logado
- Use autenticação do Supabase

---

### **3. Verificar Dados de Terapeutas**

#### **Terapeutas têm coordenadas?**

```sql
SELECT
  user_id,
  display_name,
  city,
  state,
  latitude,
  longitude
FROM therapists
WHERE status = 'active'
  AND latitude IS NOT NULL
  AND longitude IS NOT NULL
LIMIT 10;
```

**Se retornar vazio:**
- Precisa adicionar `latitude` e `longitude` nos terapeutas
- Pode usar Google Geocoding API ou adicionar manualmente

**Exemplo de update manual:**
```sql
-- Dallas: 32.7767, -96.7970
UPDATE therapists
SET
  latitude = '32.7767',
  longitude = '-96.7970'
WHERE city = 'Dallas' AND state = 'TX';
```

---

#### **Terapeutas têm campos necessários?**

```sql
SELECT
  user_id,
  display_name,
  services,
  specialties,
  massage_techniques,
  rate_60,
  rate_90,
  profile_photo,
  headline,
  about
FROM therapists
WHERE status = 'active'
LIMIT 5;
```

**Campos importantes:**
- `services` (array) - ex: `["Swedish", "Deep Tissue"]`
- `specialties` (array) - ex: `["Sports", "Relaxation"]`
- `massage_techniques` (array)
- `profile_photo` (URL da foto)
- `headline` (frase curta)
- `about` (bio completa)
- `rate_60`, `rate_90`, `rate_outcall` (preços)

---

### **4. Teste Completo do Fluxo**

#### **Passo a Passo:**

1. **Iniciar dev server:**
   ```bash
   cd masseurmatch-nextjs
   npm run dev
   ```

2. **Abrir homepage:**
   ```
   http://localhost:3000
   ```

3. **Clicar em "Find Your Match":**
   - Modal deve abrir
   - Se primeira vez: mostra Onboarding Quiz
   - Se já tem preferências: mostra Swipe Mode direto

4. **Completar Onboarding (se aparecer):**
   - 8 steps de preferências
   - No step de Location, permitir geolocalização
   - Preencher massage types, pressure, etc.
   - Clicar "Complete"

5. **Swipe Mode deve carregar:**
   - Ver cards de terapeutas
   - Match score badge no canto
   - Botões de swipe embaixo (❌ ⭐ ❤️)

6. **Testar swipes:**
   - Swipe left → card sai pela esquerda
   - Swipe right → card sai pela direita + salva em Matches
   - Swipe up → card sai pra cima + Super Like

7. **Ver Matches:**
   - Clicar na tab "Matches"
   - Ver terapeutas que você curtiu
   - Ordenar por match %, distância, recentes

8. **Testar Recommendations:**
   - Clicar na tab "For You"
   - Ver 8 cards recomendados por AI
   - Clicar "Swipe This" → volta pro deck

9. **Testar Toggle:**
   - Clicar em "Grid View" no header
   - Ver modo tradicional com filtros
   - Clicar em "AI Match"
   - Voltar pro swipe mode

---

### **5. Troubleshooting**

#### **Problema: Onboarding não salva preferências**

**Causa:** Tabela `users_preferences` não existe ou usuário não está logado

**Solução:**
```sql
-- Verificar se tabela existe
SELECT * FROM users_preferences LIMIT 1;

-- Se não existe, executar:
-- sql/create_users_preferences_table.sql
```

---

#### **Problema: Swipe Mode não carrega cards**

**Possíveis causas:**

1. **Função RPC não existe:**
   ```sql
   -- Verificar
   SELECT * FROM discover_nearby_therapists(32.7767, -96.7970, 50000, 5);

   -- Se erro, executar:
   -- sql/discover_nearby_therapists.sql
   ```

2. **Terapeutas sem coordenadas:**
   ```sql
   SELECT COUNT(*) FROM therapists
   WHERE status = 'active'
     AND latitude IS NOT NULL
     AND longitude IS NOT NULL;

   -- Se 0, adicionar coordenadas
   ```

3. **Raio muito pequeno:**
   - Aumentar raio nas preferências
   - Ou adicionar mais terapeutas próximos

---

#### **Problema: Match score sempre 0 ou muito baixo**

**Causa:** Terapeutas não têm `services` ou `specialties` preenchidos

**Solução:**
```sql
UPDATE therapists
SET
  services = ARRAY['Swedish', 'Deep Tissue', 'Sports'],
  specialties = ARRAY['Relaxation', 'Pain Relief'],
  massage_techniques = ARRAY['Swedish', 'Deep Tissue']
WHERE status = 'active';
```

---

#### **Problema: Fotos não aparecem**

**Causa:** `profile_photo` vazio ou URL inválida

**Solução:**
```sql
-- Adicionar foto placeholder
UPDATE therapists
SET profile_photo = 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=800'
WHERE profile_photo IS NULL OR profile_photo = '';
```

---

### **6. Dados de Teste**

Se quiser popular com dados de teste:

```sql
-- Inserir preferências de teste
INSERT INTO users_preferences (
  user_id,
  latitude,
  longitude,
  radius,
  massage_types,
  pressure,
  gender,
  mode,
  availability,
  budget_min,
  budget_max
) VALUES (
  'seu-user-id-aqui',
  32.7767,
  -96.7970,
  50,
  ARRAY['Swedish', 'Deep Tissue'],
  'medium',
  'any',
  'any',
  'anytime',
  80,
  200
) ON CONFLICT (user_id) DO UPDATE SET
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;
```

---

## ✅ **CHECKLIST FINAL**

Antes de considerar pronto, verificar:

- [ ] Tabela `users_preferences` criada
- [ ] Tabela `explore_swipe_events` criada
- [ ] Função RPC `discover_nearby_therapists` criada
- [ ] Pelo menos 5 terapeutas com `latitude` e `longitude`
- [ ] Terapeutas têm `services` e `specialties` preenchidos
- [ ] Terapeutas têm fotos (`profile_photo`)
- [ ] API `/api/preferences` retorna sem erro
- [ ] API `/api/explore-ai/therapists` retorna cards
- [ ] API `/api/explore-ai/swipe` salva eventos
- [ ] Modal abre na homepage
- [ ] Onboarding funciona e salva
- [ ] Swipe Mode carrega cards
- [ ] Match score aparece nos cards
- [ ] Swipes salvam no banco
- [ ] Matches aparecem na tab
- [ ] Toggle AI ↔ Grid funciona

---

## 🎉 **TUDO PRONTO!**

Quando todos os checks acima estiverem ✅, o Explore AI está 100% funcional e conectado ao banco!

**Próximos passos:**
- Adicionar mais terapeutas com coordenadas
- Melhorar algoritmo de match score
- Adicionar fotos reais dos terapeutas
- Implementar chat entre matches
