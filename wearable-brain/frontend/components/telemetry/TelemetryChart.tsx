"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTelemetry } from "@/hooks/useTelemetry";

export function TelemetryChart() {
  const { data, error } = useTelemetry();

  const chartData = data.map((item, index) => ({
    idx: index + 1,
    heartRate: Number(item.heart_rate ?? 0),
    stress: Number(item.stress ?? 0),
  }));

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Telemetry Trend</h2>
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="idx" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="heartRate" stroke="#0f766e" strokeWidth={2} />
            <Line type="monotone" dataKey="stress" stroke="#ea580c" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
