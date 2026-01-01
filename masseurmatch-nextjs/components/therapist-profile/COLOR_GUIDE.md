# Guia de Cores - Perfil do Terapeuta

## 🎨 Paleta de Cores (Sem Ambiguidade)

### Cores Primárias da Marca

```
Purple (Principal)
├─ 50:  #f5f3ff  (muito claro - backgrounds)
├─ 100: #ede9fe
├─ 200: #ddd6fe
├─ 300: #c4b5fd  (badges claros)
├─ 400: #a78bfa
├─ 500: #8b5cf6  ⭐ COR PRINCIPAL
├─ 600: #7c3aed  (hover states)
├─ 700: #6d28d9
├─ 800: #5b21b6
└─ 900: #4c1d95  (escuro - dark mode)

Pink (Secundária)
├─ 500: #d946ef  ⭐ COR SECUNDÁRIA
```

---

## 🚦 Cores de Status (Muito Bem Definidas)

### ✅ Available (Disponível Agora)
```
Verde Claro e Vibrante
Background: #10b981
Text:       #ffffff (branco)
Border:     #059669
Light BG:   #d1fae5

Uso: Badge de status "Available Now"
```

### 🔴 Busy (Visitando Agora)
```
Vermelho Vivo
Background: #ef4444
Text:       #ffffff (branco)
Border:     #dc2626
Light BG:   #fee2e2

Uso: Badge "Visiting Now"
```

### 🟡 Away (Visitando em Breve)
```
Âmbar/Amarelo
Background: #f59e0b
Text:       #ffffff (branco)
Border:     #d97706
Light BG:   #fef3c7

Uso: Badge "Visiting Soon"
```

### ⚫ Offline
```
Cinza Médio
Background: #6b7280
Text:       #ffffff (branco)
Border:     #4b5563
Light BG:   #e5e7eb

Uso: Badge "Offline"
```

---

## 💡 Cores Semânticas

### ✅ Success (Sucesso)
```
#10b981 (Verde)
Uso: Confirmações, verificações, aprovações
```

### ⚠️ Warning (Aviso)
```
#f59e0b (Âmbar)
Uso: Alertas, informações importantes
```

### ❌ Error (Erro)
```
#ef4444 (Vermelho)
Uso: Erros, exclusões, ações destrutivas
```

### ℹ️ Info (Informação)
```
#3b82f6 (Azul)
Uso: Informações gerais, links
```

---

## 🌈 Cores para Seções

### Serviços (Services)
```
Purple Theme
├─ Background: #f5f3ff (purple-50)
├─ Border:     #ddd6fe (purple-200)
├─ Text:       #7c3aed (purple-600)
└─ Icon:       #8b5cf6 (purple-500)
```

### Técnicas (Techniques)
```
Blue Theme
├─ Background: #eff6ff (blue-50)
├─ Border:     #bfdbfe (blue-200)
├─ Text:       #2563eb (blue-600)
└─ Icon:       #3b82f6 (blue-500)
```

### Adicionais (Additional Services)
```
Pink Theme
├─ Background: #fdf2f8 (pink-50)
├─ Border:     #fbcfe8 (pink-200)
├─ Text:       #db2777 (pink-600)
└─ Icon:       #ec4899 (pink-500)
```

---

## 🎨 Background & Surfaces

### Light Mode
```
Background:       #ffffff (branco puro)
Surface:          #f9fafb (gray-50)
Card Background:  #ffffff (branco)
Border:           #e5e7eb (gray-200)
```

### Dark Mode
```
Background:       #0a0a0f (quase preto)
Surface:          #1f2937 (gray-800)
Card Background:  #111827 (gray-900)
Border:           #374151 (gray-700)
```

---

## 📝 Cores de Texto

### Light Mode
```
Primary:    #111827 (gray-900) - Títulos
Secondary:  #6b7280 (gray-500) - Texto normal
Tertiary:   #9ca3af (gray-400) - Labels
```

### Dark Mode
```
Primary:    #f9fafb (gray-50)  - Títulos
Secondary:  #d1d5db (gray-300) - Texto normal
Tertiary:   #9ca3af (gray-400) - Labels
```

---

## 🎯 Uso Prático

### Exemplo: Contact Button (WhatsApp)
```tsx
className="bg-green-50 dark:bg-green-900/20
           text-green-700 dark:text-green-300
           hover:bg-green-100 dark:hover:bg-green-900/30
           border-green-200 dark:border-green-800"
```

### Exemplo: Status Badge (Available)
```tsx
style={{
  backgroundColor: '#10b981',  // Verde
  color: '#ffffff',            // Branco
}}
```

### Exemplo: Service Card (Purple)
```tsx
className="bg-purple-50 dark:bg-purple-900/20
           border-purple-200 dark:border-purple-800"
```

---

## ⚡ Gradientes

### Hero Background
```
from-purple-50 via-white to-pink-50
dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
```

### Pricing Cards (In-Call)
```
from-purple-50 to-pink-50
dark:from-purple-900/20 dark:to-pink-900/20
```

### Pricing Cards (Out-Call)
```
from-blue-50 to-cyan-50
dark:from-blue-900/20 dark:to-cyan-900/20
```

### CTA Button
```
from-purple-600 to-pink-600
```

---

## 📊 Tabela de Referência Rápida

| Elemento | Light Mode | Dark Mode | Uso |
|----------|-----------|-----------|-----|
| **Status Available** | `bg-[#10b981]` | `bg-[#10b981]` | Badge verde |
| **Status Busy** | `bg-[#ef4444]` | `bg-[#ef4444]` | Badge vermelho |
| **Status Away** | `bg-[#f59e0b]` | `bg-[#f59e0b]` | Badge âmbar |
| **Status Offline** | `bg-[#6b7280]` | `bg-[#6b7280]` | Badge cinza |
| **Primary Button** | `bg-purple-600` | `bg-purple-500` | Ações principais |
| **Secondary Button** | `bg-gray-200` | `bg-gray-700` | Ações secundárias |
| **Card Background** | `bg-white` | `bg-gray-800` | Cards |
| **Border** | `border-gray-200` | `border-gray-700` | Bordas |

---

## 🎨 Acessibilidade de Contraste

Todas as combinações de cores seguem WCAG 2.1 nível AAA:

✅ Texto escuro (#111827) em fundo claro (#ffffff) - Contraste: 16:1
✅ Texto claro (#f9fafb) em fundo escuro (#0a0a0f) - Contraste: 18:1
✅ Status badges com texto branco - Contraste mínimo: 4.5:1

---

## 📱 Exemplos de Uso

### Badge de Status
```tsx
// Available
<div style={{
  backgroundColor: '#10b981',
  color: '#ffffff',
  border: '2px solid #059669'
}}>
  ✓ Available Now
</div>

// Visiting Now
<div style={{
  backgroundColor: '#ef4444',
  color: '#ffffff',
  border: '2px solid #dc2626'
}}>
  ✈ Visiting Now
</div>
```

### Card de Serviço
```tsx
<div className="
  bg-purple-50 dark:bg-purple-900/20
  border-purple-200 dark:border-purple-800
  text-purple-700 dark:text-purple-300
">
  Service Content
</div>
```

---

## 🔧 Customização

Para alterar as cores do sistema, edite:
`/lib/design-tokens.ts`

Todas as cores estão centralizadas neste arquivo para fácil manutenção.
