# 🗺️ Frontend Routing Guide - MasseurMatch

## Architecture Overview

You have a **separate backend and frontend**:

```
┌─────────────────────────────────┐
│ Frontend: React + Vite          │
│ - Client-side routing           │
│ - Makes API calls to backend    │
│ - Routes: /therapist/:id, /city │
└────────────┬────────────────────┘
             │ HTTP API calls
             ↓
┌─────────────────────────────────┐
│ Backend: Node.js + Express      │
│ - API endpoints                 │
│ - Business logic                │
│ - Database queries              │
└────────────┬────────────────────┘
             │ SQL queries
             ↓
┌─────────────────────────────────┐
│ Database: Supabase PostgreSQL   │
└─────────────────────────────────┘
```

---

## 🚀 Setup React Router

### 1. Install React Router

```bash
cd dashboard-vite
npm install react-router-dom
```

### 2. Create Route Structure

```
dashboard-vite/src/
├── App.tsx                   ← Main app with router
├── pages/
│   ├── TherapistProfile.tsx  ← /therapist/:userId
│   ├── CityPage.tsx          ← /city/:city
│   ├── CitySegmentPage.tsx   ← /city/:city/:segment
│   └── HomePage.tsx          ← /
├── components/
│   ├── TherapistCard.tsx
│   └── Header.tsx
└── lib/
    ├── api.ts                ← API client functions
    └── seo.ts                ← SEO helpers
```

---

## 📄 Implementation

### Main App Router

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TherapistProfile from './pages/TherapistProfile';
import CityPage from './pages/CityPage';
import CitySegmentPage from './pages/CitySegmentPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/therapist/:userId" element={<TherapistProfile />} />
        <Route path="/city/:city" element={<CityPage />} />
        <Route path="/city/:city/:segment" element={<CitySegmentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### API Client

```typescript
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface Therapist {
  user_id: string;
  display_name: string;
  full_name: string;
  headline: string;
  about: string;
  city: string;
  state: string;
  services: string[];
  rating: number;
  phone: string;
  email: string;
  profile_photo: string;
  // ... add other fields
}

// Get single therapist by user_id
export async function getTherapist(userId: string): Promise<Therapist> {
  const response = await fetch(`${API_URL}/api/therapist/${userId}`);
  if (!response.ok) {
    throw new Error('Therapist not found');
  }
  const data = await response.json();
  return data.therapist;
}

// Get all therapists with optional filters
export async function getTherapists(filters?: {
  city?: string;
  services?: string;
  limit?: number;
  offset?: number;
}): Promise<Therapist[]> {
  const params = new URLSearchParams();
  if (filters?.city) params.set('city', filters.city);
  if (filters?.services) params.set('services', filters.services);
  if (filters?.limit) params.set('limit', filters.limit.toString());
  if (filters?.offset) params.set('offset', filters.offset.toString());

  const response = await fetch(`${API_URL}/api/therapists?${params}`);
  const data = await response.json();
  return data.therapists;
}

// Update therapist profile (authenticated)
export async function updateTherapist(
  userId: string,
  updates: Partial<Therapist>,
  token: string
): Promise<Therapist> {
  const response = await fetch(`${API_URL}/api/therapist/update/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  const data = await response.json();
  return data.therapist;
}
```

### Therapist Profile Page

```tsx
// src/pages/TherapistProfile.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTherapist, Therapist } from '../lib/api';
import { Helmet } from 'react-helmet-async';

export default function TherapistProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    getTherapist(userId)
      .then(setTherapist)
      .catch(() => setError('Therapist not found'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error || !therapist) return <div>{error || 'Not found'}</div>;

  const pageTitle = `${therapist.display_name} - ${therapist.city}, ${therapist.state} | MasseurMatch`;
  const pageDescription = therapist.headline || therapist.about?.substring(0, 160);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`https://masseurmatch.com/therapist/${userId}`} />

        {/* OpenGraph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://masseurmatch.com/therapist/${userId}`} />
        {therapist.profile_photo && <meta property="og:image" content={therapist.profile_photo} />}
      </Helmet>

      <div className="therapist-profile">
        <div className="header">
          {therapist.profile_photo && (
            <img src={therapist.profile_photo} alt={therapist.display_name} />
          )}
          <h1>{therapist.headline}</h1>
          <p className="name">{therapist.display_name}</p>
        </div>

        <div className="factoids">
          <p>📍 Based in {therapist.city}, {therapist.state}</p>
          <p>📞 Phone: {therapist.phone}</p>
          <p>⭐ Rating: {therapist.rating}</p>
        </div>

        <div className="overview">
          <h2>Overview</h2>
          <p>{therapist.about}</p>
        </div>

        <div className="services">
          <h2>Services</h2>
          <ul>
            {therapist.services?.map(service => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
```

### City Page

```tsx
// src/pages/CityPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTherapists, Therapist } from '../lib/api';
import { Helmet } from 'react-helmet-async';

const CITY_MAP: Record<string, { name: string; state: string }> = {
  'los-angeles': { name: 'Los Angeles', state: 'CA' },
  'miami': { name: 'Miami', state: 'FL' },
  'new-york': { name: 'New York', state: 'NY' },
  // Add more cities
};

export default function CityPage() {
  const { city } = useParams<{ city: string }>();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  const cityInfo = city ? CITY_MAP[city] : null;

  useEffect(() => {
    if (!cityInfo) return;

    getTherapists({ city: cityInfo.name, limit: 50 })
      .then(setTherapists)
      .finally(() => setLoading(false));
  }, [cityInfo]);

  if (!cityInfo) return <div>City not found</div>;
  if (loading) return <div>Loading...</div>;

  const pageTitle = `Massage Therapists in ${cityInfo.name}, ${cityInfo.state} | MasseurMatch`;
  const pageDescription = `Find professional massage therapists in ${cityInfo.name}, ${cityInfo.state}. Compare profiles, reviews, and availability.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`https://masseurmatch.com/city/${city}`} />
      </Helmet>

      <div className="city-page">
        <h1>Massage Therapists in {cityInfo.name}, {cityInfo.state}</h1>
        <p>Found {therapists.length} therapists</p>

        <div className="therapist-grid">
          {therapists.map(therapist => (
            <a href={`/therapist/${therapist.user_id}`} key={therapist.user_id}>
              <div className="therapist-card">
                {therapist.profile_photo && (
                  <img src={therapist.profile_photo} alt={therapist.display_name} />
                )}
                <h3>{therapist.display_name}</h3>
                <p>{therapist.headline}</p>
                <p>⭐ {therapist.rating}</p>
                <p>📍 {therapist.city}, {therapist.state}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
```

### City + Segment Page

```tsx
// src/pages/CitySegmentPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTherapists, Therapist } from '../lib/api';
import { Helmet } from 'react-helmet-async';

const CITY_MAP: Record<string, { name: string; state: string }> = {
  'los-angeles': { name: 'Los Angeles', state: 'CA' },
  // ... same as above
};

const SEGMENT_MAP: Record<string, { name: string; description: string }> = {
  'deep-tissue': {
    name: 'Deep Tissue Massage',
    description: 'Deep tissue massage for tension relief and muscle recovery'
  },
  'gay-massage': {
    name: 'Gay Massage',
    description: 'Professional gay massage therapists'
  },
  'sports-massage': {
    name: 'Sports Massage',
    description: 'Sports massage for athletes and active individuals'
  },
};

export default function CitySegmentPage() {
  const { city, segment } = useParams<{ city: string; segment: string }>();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  const cityInfo = city ? CITY_MAP[city] : null;
  const segmentInfo = segment ? SEGMENT_MAP[segment] : null;

  useEffect(() => {
    if (!cityInfo || !segmentInfo) return;

    // Convert segment to service filter
    // This assumes your services array contains these terms
    const serviceFilter = segmentInfo.name;

    getTherapists({ city: cityInfo.name, services: serviceFilter, limit: 50 })
      .then(setTherapists)
      .finally(() => setLoading(false));
  }, [cityInfo, segmentInfo]);

  if (!cityInfo || !segmentInfo) return <div>Page not found</div>;
  if (loading) return <div>Loading...</div>;

  const pageTitle = `${segmentInfo.name} in ${cityInfo.name}, ${cityInfo.state} | MasseurMatch`;
  const pageDescription = `Find ${segmentInfo.description} in ${cityInfo.name}, ${cityInfo.state}. Professional therapists with verified reviews.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`https://masseurmatch.com/city/${city}/${segment}`} />
      </Helmet>

      <div className="city-segment-page">
        <h1>{segmentInfo.name} in {cityInfo.name}</h1>
        <p>{segmentInfo.description}</p>
        <p>Found {therapists.length} therapists</p>

        <div className="therapist-grid">
          {therapists.map(therapist => (
            <a href={`/therapist/${therapist.user_id}`} key={therapist.user_id}>
              <div className="therapist-card">
                {therapist.profile_photo && (
                  <img src={therapist.profile_photo} alt={therapist.display_name} />
                )}
                <h3>{therapist.display_name}</h3>
                <p>{therapist.headline}</p>
                <p>⭐ {therapist.rating}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
```

---

## 🔧 Environment Variables

```env
# dashboard-vite/.env
VITE_API_URL=http://localhost:4000
VITE_SITE_URL=http://localhost:3000
```

---

## 📦 Additional Dependencies

```bash
npm install react-helmet-async
```

```tsx
// src/main.tsx
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
```

---

## 🚀 SEO Considerations

### Client-Side Routing Limitations

**Problem:** React Router is client-side only. Search engines see blank HTML until JavaScript loads.

**Solutions:**

1. **Pre-rendering (Recommended for you)**
   ```bash
   npm install -D vite-plugin-ssr
   ```

2. **Add meta tags to index.html**
   ```html
   <head>
     <title>MasseurMatch - Professional Massage Therapists</title>
     <meta name="description" content="Find verified massage therapists..." />
   </head>
   ```

3. **Use Helmet for dynamic meta tags** (already shown above)

---

## 🎯 Summary

Your setup:
- ✅ React Router for client-side routing
- ✅ API calls to your Node.js backend
- ✅ SEO with React Helmet
- ✅ TypeScript for type safety

This keeps your **existing backend** while adding proper routing!

---

## 📚 Next Steps

1. Install dependencies
2. Create the pages shown above
3. Update city/segment maps with your data
4. Add styling
5. Test with: `npm run dev`

**This approach works with your existing Node.js backend!** 🎉
