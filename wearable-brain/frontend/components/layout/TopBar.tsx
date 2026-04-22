"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { API_BASE, POLL_INTERVAL } from "@/lib/constants";

function getRelativeTime(value: Date | null): string {
  if (!value) {
    return "Waiting for data";
  }

  const diffMs = Date.now() - value.getTime();
  const seconds = Math.max(0, Math.floor(diffMs / 1000));
  return `Updated ${seconds}s ago`;
}

export function TopBar() {
  const pathname = usePathname();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(0);

  const pageTitle = useMemo(() => {
    if (pathname === "/telemetry") {
      return "Telemetry";
    }
    if (pathname === "/decisions") {
      return "Decisions";
    }
    return "Dashboard";
  }, [pathname]);

  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/telemetry`, { cache: "no-store" });
        if (!active) {
          return;
        }

        if (res.ok) {
          setConnected(true);
          setLastUpdated(new Date());
        } else {
          setConnected(false);
        }
      } catch {
        if (active) {
          setConnected(false);
        }
      }
    };

    const updateTick = setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    void poll();
    const polling = setInterval(() => {
      void poll();
    }, POLL_INTERVAL);

    return () => {
      active = false;
      clearInterval(polling);
      clearInterval(updateTick);
    };
  }, []);

  return (
    <header className="app-topbar">
      <div>
        <h1 className="topbar-title">{pageTitle}</h1>
      </div>
      <div className="topbar-meta">
        <span className="live-badge">
          <span className="live-dot" />
          Live
        </span>
        <span className="topbar-muted">{getRelativeTime(lastUpdated)}</span>
        <span className={`connection-status ${connected ? "ok" : "down"}`}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>
      <span style={{ display: "none" }}>{tick}</span>
    </header>
  );
}
