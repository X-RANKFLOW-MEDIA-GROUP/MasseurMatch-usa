import { MetadataRoute } from 'next';
import { legalDocuments } from '@/lib/legal-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://masseurmatch.com';

  // Static routes
  const routes = [
    '',
    '/legal',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic legal document routes
  const documentRoutes = legalDocuments.map((doc) => ({
    url: `${baseUrl}/legal/${doc.slug}`,
    lastModified: new Date().toISOString(), // In real app, use doc.lastUpdated
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...documentRoutes];
}
