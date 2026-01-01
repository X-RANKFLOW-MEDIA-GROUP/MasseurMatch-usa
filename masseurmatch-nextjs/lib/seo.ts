import { SITE_URL as BASE_SITE_URL } from "./site";

export const SITE_URL = BASE_SITE_URL;

/**
 * Generate absolute URL from relative path
 */
export function absUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Truncate string to max length with ellipsis
 */
export function truncate(s: string, max = 160): string {
  if (!s) return '';
  return s.length > max ? s.slice(0, max - 1).trim() + '…' : s;
}

/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(...parts: (string | undefined)[]): string {
  return parts
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Format city name for display
 */
export function formatCity(city: string, state?: string, country?: string): string {
  let result = city;
  if (state) result += `, ${state}`;
  if (country && country !== 'US') result += `, ${country}`;
  return result;
}

/**
 * Extract first sentence from text
 */
export function firstSentence(text?: string): string {
  if (!text) return '';
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : text.substring(0, 100) + '...';
}
