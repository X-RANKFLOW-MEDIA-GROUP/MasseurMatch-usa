# Perfil Público do Terapeuta - Versão Melhorada

Sistema modular de componentes para exibir perfis públicos de terapeutas no MasseurMatch.

## 🎨 Características

- ✅ **Cores bem definidas** - Sistema de design tokens sem ambiguidade
- ✅ **Design moderno** - Interface limpa e profissional
- ✅ **Componentes modulares** - Fácil manutenção e reutilização
- ✅ **Tailwind CSS puro** - Estilização consistente
- ✅ **Responsivo** - Mobile-first design
- ✅ **Acessível** - Seguindo WCAG 2.1
- ✅ **SEO otimizado** - Schema.org e metadata
- ✅ **Performance** - Otimizado com Next.js Image

## 📦 Componentes

### `ImprovedTherapistProfile`
Componente principal que integra todos os outros.

### `ProfileHero`
Seção hero com foto, nome, rating, e status de disponibilidade.

### `AboutSection`
Biografia, filosofia, especialidades e idiomas.

### `ServicesSection`
Serviços oferecidos, técnicas de massagem e serviços adicionais.

### `PricingSection`
Preços para serviços in-call e out-call.

### `GallerySection`
Galeria de fotos com lightbox.

### `ContactSection`
Informações de contato, localização e horário de funcionamento.

## 🎨 Sistema de Cores

### Cores Primárias
- **Purple (Principal)**: `#8b5cf6`
- **Pink (Secundária)**: `#d946ef`

### Cores de Status
- **Available (Verde)**: `#10b981` - Disponível agora
- **Busy (Vermelho)**: `#ef4444` - Visitando agora
- **Away (Âmbar)**: `#f59e0b` - Visitando em breve
- **Offline (Cinza)**: `#6b7280` - Offline

### Cores Semânticas
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`
- **Info**: `#3b82f6`

## 📖 Uso

### Importação Simples

```tsx
import { ImprovedTherapistProfile } from "@/components/therapist-profile";

export default function TherapistPage({ therapist }) {
  return <ImprovedTherapistProfile {...therapist} />;
}
```

### Componentes Individuais

```tsx
import {
  ProfileHero,
  AboutSection,
  ServicesSection
} from "@/components/therapist-profile";

export default function CustomProfile({ therapist }) {
  return (
    <div>
      <ProfileHero {...therapist} />
      <AboutSection {...therapist} />
      <ServicesSection {...therapist} />
    </div>
  );
}
```

## 📝 Exemplo de Dados

```typescript
const therapistData = {
  // Basic Info
  displayName: "Alex Santos",
  headline: "Certified Massage Therapist - Deep Tissue Specialist",
  about: "With over 10 years of experience...",
  philosophy: "I believe in holistic healing...",

  // Media
  profilePhoto: "/images/therapists/alex-santos.jpg",
  gallery: [
    "/images/gallery/1.jpg",
    "/images/gallery/2.jpg",
  ],

  // Location
  city: "New York",
  state: "NY",
  address: "123 Massage St",
  zipCode: "10001",
  latitude: 40.7128,
  longitude: -74.0060,

  // Contact
  phone: "+1 (555) 123-4567",
  email: "alex@example.com",
  website: "https://alexsantos.com",
  instagram: "alexsantostherapist",
  whatsapp: "+15551234567",

  // Services
  services: ["Deep Tissue", "Swedish", "Sports Massage"],
  massageTechniques: ["Trigger Point", "Myofascial Release"],
  specialties: ["Back Pain", "Athletes", "Stress Relief"],

  // Pricing
  rate60: "120",
  rate90: "165",
  rate120: "200",
  rateOutcall: "150",
  incallEnabled: true,
  outcallEnabled: true,
  mobileServiceRadius: 15,

  // Professional
  languages: ["English", "Spanish", "Portuguese"],
  massageStartDate: "2014-01-01",

  // Status
  rating: 4.9,
  reviewCount: 127,
  status: "available",

  // Business Hours
  businessHours: {
    monday: { open: "09:00", close: "18:00" },
    tuesday: { open: "09:00", close: "18:00" },
    wednesday: { open: "09:00", close: "18:00" },
    thursday: { open: "09:00", close: "18:00" },
    friday: { open: "09:00", close: "18:00" },
    saturday: { open: "10:00", close: "16:00" },
  },
};
```

## 🎯 Status de Disponibilidade

O componente suporta 4 status:

1. **`available`** - Verde - Disponível agora
2. **`visiting_now`** - Vermelho - Visitando outra cidade agora
3. **`visiting_soon`** - Âmbar - Vai visitar outra cidade em breve
4. **`offline`** - Cinza - Offline

## 🔧 Customização

### Cores Personalizadas

Edite `lib/design-tokens.ts` para personalizar o sistema de cores.

### Layout

Cada componente pode ser usado independentemente para criar layouts customizados.

### Temas

Suporta dark mode automaticamente via Tailwind CSS.

## 📱 Responsividade

- **Mobile**: Layout de coluna única
- **Tablet**: Grid de 2 colunas
- **Desktop**: Grid de 3 colunas com sidebar

## ♿ Acessibilidade

- Semantic HTML
- ARIA labels
- Navegação por teclado
- Contraste de cores WCAG AAA
- Alt text em imagens

## 🚀 Performance

- Next.js Image para otimização automática
- Lazy loading de imagens
- Code splitting automático
- CSS-in-JS otimizado (Tailwind)

## 📄 Licença

Propriedade de MasseurMatch © 2025
