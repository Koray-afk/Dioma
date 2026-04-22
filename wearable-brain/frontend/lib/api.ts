import { API_BASE } from "@/lib/constants";
import type { Decision, TelemetryPoint } from "@/lib/types";

export async function getTelemetry(): Promise<TelemetryPoint[]> {
  try {
    const res = await fetch(`${API_BASE}/api/telemetry`, { cache: "no-store" });
    if (!res.ok) {
      return [];
    }
    return (await res.json()) as TelemetryPoint[];
  } catch {
    return [];
  }
}

export async function getDecisions(): Promise<Decision[]> {
  try {
    const res = await fetch(`${API_BASE}/api/decisions`, { cache: "no-store" });
    if (!res.ok) {
      return [];
    }
    return (await res.json()) as Decision[];
  } catch {
    return [];
  }
}

export async function postData(payload: object): Promise<void> {
  const res = await fetch(`${API_BASE}/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`POST /data failed with status ${res.status}`);
  }
}

// Backward-compatible wrappers used by current hooks/components.
export const fetchTelemetry = getTelemetry;
export const fetchDecisions = getDecisions;
export const injectTelemetry = postData;
