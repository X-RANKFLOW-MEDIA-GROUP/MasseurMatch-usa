import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/legal/'],
      disallow: ['/api/', '/admin/', '/_next/', '/private/', '/staging/'],
    },
    sitemap: 'https://masseurmatch.com/sitemap.xml',
  };
}
