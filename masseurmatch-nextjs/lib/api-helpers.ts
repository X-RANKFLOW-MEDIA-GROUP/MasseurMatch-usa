// =============================================================================
// API Helper Functions - Safe fetch utilities with error handling
// =============================================================================

import { supabase } from './supabase';

/**
 * Safe error formatter for Supabase errors
 * Extracts only useful fields to avoid logging sensitive data
 */
export const formatSupabaseError = (err: any) => {
  if (!err) return null;
  const { message, details, hint, code, status } = err;
  return { message, details, hint, code, status };
};

/**
 * Safe error formatter for API fetch errors
 */
export const formatFetchError = (err: any) => {
  if (!err) return null;
  if (err instanceof Error) {
    return {
      message: err.message,
      name: err.name,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    };
  }
  return { message: String(err) };
};

/**
 * Generic safe fetch function for client-side API calls
 * Returns { data, error, status } instead of throwing
 */
export async function safeFetch<T = any>(
  url: string,
  options?: RequestInit & { timeout?: number }
): Promise<{ data: T | null; error: any; status: number }> {
  const { timeout = 30000, ...fetchOptions } = options || {};

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Attempt JSON parse, fallback to text, else null
    let data: any = null;
    try {
      data = await response.json();
    } catch {
      try {
        data = await response.text();
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      return {
        data: null,
        error: {
          message: (typeof data === 'object' && (data?.error || data?.message)) || (typeof data === 'string' ? data : 'Request failed'),
          details: data?.details ?? undefined,
          code: data?.code ?? response.status,
          rawBody: data,
        },
        status: response.status,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return {
        data: null,
        error: { message: 'Request timeout', code: 'TIMEOUT' },
        status: 408,
      };
    }

    return {
      data: null,
      error: formatFetchError(err),
      status: 0,
    };
  }
}

/**
 * Safe Supabase query function
 * Returns { data, error } instead of throwing
 */
export async function fetchTherapistsSafe(opts?: {
  limit?: number;
  offset?: number;
  status?: string;
  city?: string;
  services?: string[];
}) {
  const {
    limit = 100,
    offset = 0,
    status = 'active',
    city,
    services,
  } = opts || {};

  try {
    // Request only columns that exist on therapists table
    const selectCols = [
      'user_id',
      'slug',
      'display_name',
      'latitude',
      'longitude',
      'services',
      'profile_photo',
      'zip_code',
      'phone',
      'city',
      'state',
      'status',
      'created_at',
    ].join(',');

    let query = supabase
      .from('therapists')
      .select(selectCols)
      .eq('status', status)
      .range(offset, offset + limit - 1);

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (services && services.length > 0) {
      query = query.overlaps('services', services);
    }

    const { data: payload, error, status: statusCode } = await query;

    if (error) {
      // Log concise info and return controlled error
      console.error('Supabase error fetching therapists:', formatSupabaseError(error));
      return { data: [], error, status: statusCode };
    }

    console.log(`✅ Fetched ${payload?.length || 0} therapists`);
    return { data: payload ?? [], error: null, status: 200 };
  } catch (err) {
    console.error('Unexpected error in fetchTherapistsSafe:', err);
    return { data: [], error: formatFetchError(err), status: 500 };
  }
}

/**
 * Fetch therapists via API route (client-side)
 * Uses safeFetch internally
 */
export async function fetchTherapistsAPI(opts?: {
  limit?: number;
  offset?: number;
  city?: string;
  services?: string;
  excludeGender?: string;
}) {
  const { limit = 100, offset = 0, city, services, excludeGender } = opts || {};

  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (offset) params.set('offset', String(offset));
  if (city) params.set('city', city);
  if (services) params.set('services', services);
  if (excludeGender) params.set('excludeGender', excludeGender);

  const url = `/api/therapists${params.toString() ? `?${params.toString()}` : ''}`;

  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);

    let body: any = null;
    try {
      body = await response.json();
    } catch (parseErr) {
      console.warn('Failed to parse therapists API response as JSON.', parseErr);
    }

    console.log('Raw API response body:', body);

    const hasBodyError =
      Boolean(body?.error) || (typeof body?.success === 'boolean' && body.success === false);
    if (!response.ok || hasBodyError) {
      const shapedError =
        body?.error ||
        (body?.details
          ? { message: body.details, code: body.code ?? response.status }
          : { message: `Request failed with status ${response.status}`, code: response.status });

      console.error('API error fetching therapists:', {
        status: response.status,
        body,
        error: shapedError,
      });
      return {
        therapists: [],
        total: 0,
        error: shapedError,
        status: response.status,
      };
    }

    const therapists = Array.isArray(body?.therapists)
      ? body.therapists
      : Array.isArray(body?.data)
      ? body.data
      : [];

    const total =
      typeof body?.total === 'number'
        ? body.total
        : Array.isArray(therapists)
        ? therapists.length
        : 0;

    return {
      therapists,
      total,
      error: null,
      status: response.status,
    };
  } catch (err) {
    console.error('Fetch error:', err);
    return {
      therapists: [],
      total: 0,
      error: formatFetchError(err),
      status: 0,
    };
  }
}

/**
 * Retry wrapper for any async function
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts?: {
    retries?: number;
    backoff?: number;
    onRetry?: (attempt: number, error: any) => void;
  }
): Promise<T> {
  const { retries = 2, backoff = 300, onRetry } = opts || {};

  let attempt = 0;
  let delay = backoff;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) {
        throw err;
      }

      if (onRetry) {
        onRetry(attempt + 1, err);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt += 1;
      delay *= 2;
    }
  }

  throw new Error('Max retries exceeded');
}
