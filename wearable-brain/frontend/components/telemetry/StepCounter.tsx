"use client";

import { useTelemetry } from "@/hooks/useTelemetry";

export function StepCounter() {
  const { data } = useTelemetry();
  const latest = data[data.length - 1];

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Step Counter</h2>
      <p style={{ fontSize: "1.8rem", margin: "0.3rem 0" }}>
        {Number(latest?.steps ?? 0).toLocaleString()}
      </p>
      <p style={{ color: "#64748b", margin: 0 }}>Latest observed value</p>
    </div>
  );
}
