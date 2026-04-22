"use client";

import { useEffect, useState } from "react";
import { fetchTelemetry } from "@/lib/api";
import { POLL_INTERVAL_MS } from "@/lib/constants";
import type { TelemetryPoint } from "@/lib/types";

export function useTelemetry() {
  const [data, setData] = useState<TelemetryPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const rows = await fetchTelemetry();
        if (mounted) {
          setData(rows);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      }
    };

    void load();
    const timer = setInterval(() => void load(), POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return { data, error };
}
