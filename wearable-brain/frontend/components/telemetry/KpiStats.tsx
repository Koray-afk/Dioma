"use client";

import { HeartHandshake, Zap, Footprints } from "lucide-react";
import type { TelemetryPoint } from "@/lib/types";

type Props = {
  latest: TelemetryPoint | undefined;
};

export function KpiStats({ latest }: Props) {
  const stats = [
    {
      label: "Heart Rate",
      value: latest?.heart_rate ? `${Math.round(Number(latest.heart_rate))}` : "—",
      unit: "bpm",
      icon: HeartHandshake,
      color: "#fb7185",
    },
    {
      label: "Battery",
      value: latest?.battery ? `${Math.round(Number(latest.battery))}` : "—",
      unit: "%",
      icon: Zap,
      color: "#f59e0b",
    },
    {
      label: "Steps",
      value: latest?.steps ? `${Math.round(Number(latest.steps))}` : "—",
      unit: "steps",
      icon: Footprints,
      color: "#4f98a3",
    },
  ];

  return (
    <div className="kpi-grid">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="kpi-card">
            <div className="kpi-header">
              <Icon size={18} style={{ color: stat.color, opacity: 0.8 }} />
              <span className="kpi-label">{stat.label}</span>
            </div>
            <div className="kpi-content">
              <div className="kpi-value">{stat.value}</div>
              <div className="kpi-unit">{stat.unit}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
