// API Helper Functions - Safe fetch utilities with error handling

import { supabase } from "./supabase";

export type FormattedSupabaseError = {
  message?: string | null;
  details?: string | null;
  hint?: string | null;
  code?: string | number | null;
  status?: number | null;
};

export type FormattedFetchError = {
  message: string;
  name?: string;
  stack?: string;
};

export type SafeFetchResult<T> = {
  data: T | null;
  error: FormattedFetchError | { message: string; [key: string]: unknown } | null;
  status: number;
};

export type TherapistRecord = {
  user_id: string;
  slug: string;
  display_name: string | null;
  latitude: number | null;
  longitude: number | null;
  services: string[] | null;
  profile_photo: string | null;
  zip_code: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  status: string | null;
  created_at: string | null;
};

/**
 * Safe error formatter for Supabase errors
 * Extracts only useful fields to avoid logging sensitive data
 */
export const formatSupabaseError = (err: unknown): FormattedSupabaseError | null => {
  if (!err || typeof err !== "object") return null;

  const possibleError = err as {
    message?: string | null;
    details?: string | null;
    hint?: string | null;
    code?: string | number | null;
    status?: number | null;
  };

  const { message, details, hint, code, status } = possibleError;

  if (!message && !details && !hint && !code && !status) {
    return null;
  }

  return { message: message ?? null, details: details ?? null, hint: hint ?? null, code: code ?? null, status: status ?? null };
};

/**
 * Safe error formatter for API fetch errors
 */
export const formatFetchError = (err: unknown): FormattedFetchError => {
  if (!err) return { message: "Unknown error" };

  if (err instanceof Error) {
    return {
      message: err.message,
      name: err.name,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    };
  }

  return { message: String(err) };
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    try {
      return await response.text();
    } catch {
      return null;
    }
  }
};

const buildAbortController = (timeout: number, externalSignal?: AbortSignal): { controller: AbortController; timeoutId: ReturnType<typeof setTimeout> } => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  return { controller, timeoutId };
};

/**
 * Generic safe fetch function for client-side API calls
 * Returns { data, error, status } instead of throwing
 */
export async function safeFetch<T = unknown>(
  url: string,
  options?: RequestInit & { timeout?: number }
): Promise<SafeFetchResult<T>> {
  const { timeout = 30000, ...fetchOptions } = options || {};

  const { controller, timeoutId } = buildAbortController(timeout, fetchOptions.signal);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await parseResponseBody(response);

    if (!response.ok) {
      const messageFromBody = typeof data === "object" ? (data as { error?: string; message?: string }).error ?? (data as { message?: string }).message : undefined;
      return {
        data: null,
        error: {
          message: messageFromBody || (typeof data === "string" ? data : "Request failed"),
          details: typeof data === "object" && data ? (data as { details?: unknown }).details : undefined,
          code: typeof data === "object" && data ? (data as { code?: unknown }).code : response.status,
          rawBody: data,
        },
        status: response.status,
      };
    }

    return {
      data: data as T,
      error: null,
      status: response.status,
    };
  } catch (err) {
    clearTimeout(timeoutId);

    if ((err as { name?: string }).name === "AbortError") {
      return {
        data: null,
        error: { message: fetchOptions.signal?.aborted ? "Request aborted" : "Request timeout", code: fetchOptions.signal?.aborted ? "ABORTED" : "TIMEOUT" },
        status: fetchOptions.signal?.aborted ? 499 : 408,
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
}): Promise<{ data: TherapistRecord[]; error: FormattedSupabaseError | null; status: number }> {
  const { limit = 100, offset = 0, status = "active", city, services } = opts || {};

  try {
    const selectCols = [
      "user_id",
      "slug",
      "display_name",
      "latitude",
      "longitude",
      "services",
      "profile_photo",
      "zip_code",
      "phone",
      "city",
      "state",
      "status",
      "created_at",
    ].join(",");

    let query = supabase
      .from("therapists")
      .select(selectCols)
      .eq("status", status)
      .range(offset, offset + limit - 1);

    if (city) {
      query = query.ilike("city", `%${city}%`);
    }

    if (services && services.length > 0) {
      query = query.overlaps("services", services);
    }

    const { data: payload, error, status: statusCode } = await query;

    if (error) {
      console.error("Supabase error fetching therapists:", formatSupabaseError(error));
      return { data: [], error: formatSupabaseError(error), status: statusCode ?? 500 };
    }

    return { data: (payload as TherapistRecord[]) ?? [], error: null, status: statusCode ?? 200 };
  } catch (err) {
    console.error("Unexpected error in fetchTherapistsSafe:", err);
    return { data: [], error: formatSupabaseError(err), status: 500 };
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
}): Promise<{
  therapists: TherapistRecord[];
  total: number;
  error: SafeFetchResult<unknown>["error"] | null;
  status: number;
}> {
  const { limit = 100, offset = 0, city, services } = opts || {};

  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  if (city) params.set("city", city);
  if (services) params.set("services", services);

  const url = `/api/therapists?${params.toString()}`;

  const { data: body, error, status } = await safeFetch<{
    success: boolean;
    therapists: TherapistRecord[];
    total: number;
    limit: number;
    offset: number;
  }>(url);

  if (error || !body?.success) {
    console.error("API error fetching therapists:", {
      status,
      body: body ?? null,
      error,
    });
    return {
      therapists: [],
      total: 0,
      error: error || { message: "Unknown error", rawBody: body ?? null },
      status,
    };
  }

  return {
    therapists: body.therapists,
    total: body.total,
    error: null,
    status,
  };
}

/**
 * Retry wrapper for any async function
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts?: {
    retries?: number;
    backoff?: number;
    onRetry?: (attempt: number, error: unknown) => void;
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

      onRetry?.(attempt + 1, err);

      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt += 1;
      delay *= 2;
    }
  }

  throw new Error("Max retries exceeded");
}
