"use client";

import { useTelemetry } from "@/hooks/useTelemetry";

export function BatteryGauge() {
  const { data } = useTelemetry();
  const latest = data[data.length - 1];
  const battery = Math.max(0, Math.min(100, Number(latest?.battery ?? 0)));

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Battery</h2>
      <p style={{ fontSize: "1.8rem", margin: "0.3rem 0" }}>{battery}%</p>
      <div
        style={{
          height: 10,
          borderRadius: 999,
          overflow: "hidden",
          background: "#e2e8f0",
        }}
      >
        <div
          style={{
            width: `${battery}%`,
            height: "100%",
            background: battery > 25 ? "#16a34a" : "#dc2626",
            transition: "width 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}
