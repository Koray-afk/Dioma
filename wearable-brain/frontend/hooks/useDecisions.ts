"use client";

import { useEffect, useState } from "react";
import { getDecisions } from "@/lib/api";
import { POLL_INTERVAL } from "@/lib/constants";
import type { DecisionItem } from "@/lib/types";

export function useDecisions() {
  const [data, setData] = useState<DecisionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (mounted) {
        setLoading(true);
      }

      try {
        const rows = await getDecisions();
        if (mounted) {
          setData(rows);
          setError(null);
          setLastUpdated(new Date().toISOString());
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();
    const timer = setInterval(() => void load(), POLL_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return { data, loading, error, lastUpdated };
}
