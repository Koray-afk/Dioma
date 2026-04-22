import { API_BASE_URL } from "@/lib/constants";
import type { DecisionItem, TelemetryPoint } from "@/lib/types";

async function readJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export function fetchTelemetry() {
  return readJson<TelemetryPoint[]>("/api/telemetry");
}

export function fetchDecisions() {
  return readJson<DecisionItem[]>("/api/decisions");
}

export async function injectTelemetry(payload: TelemetryPoint) {
  const res = await fetch(`${API_BASE_URL}/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Inject failed: ${res.status}`);
  }

  return (await res.json()) as { ok: boolean };
}
