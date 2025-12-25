"use client";

import useSWR from "swr";
import type { AnalyticsData } from "@/lib/types/database";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAnalytics(period: "week" | "month" | "year" = "week") {
  const { data, error, isLoading, mutate } = useSWR<AnalyticsData>(
    `/api/analytics/overview?period=${period}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    data,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useDetailedAnalytics() {
  const { data, error, isLoading } = useSWR("/api/analytics/detailed", fetcher, {
    refreshInterval: 60000, // Refresh every minute
  });

  return {
    data,
    isLoading,
    error,
  };
}
