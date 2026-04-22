"use client";

import { useEffect, useState } from "react";
import { fetchDecisions } from "@/lib/api";
import { POLL_INTERVAL_MS } from "@/lib/constants";
import type { DecisionItem } from "@/lib/types";

export function useDecisions() {
  const [data, setData] = useState<DecisionItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const rows = await fetchDecisions();
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
