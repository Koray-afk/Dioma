"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityIcon, HeartPulseIcon } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import type { TelemetryPoint } from "@/lib/types";

type Props = {
  data: TelemetryPoint[];
  dataKey: string;
  label: string;
  color: string;
  unit: string;
};

type ChartRow = {
  timestampLabel: string;
  value: number;
};

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--:--:--";
  }
  return date.toLocaleTimeString("en-GB", { hour12: false });
}

function CustomTooltip({ active, payload, label, unit }: TooltipProps<number, string> & { unit: string }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-value">
        {Number(item.value ?? 0).toFixed(0)} {unit}
      </p>
    </div>
  );
}

export function TelemetryChart({ data, dataKey, label, color, unit }: Props) {
  const [skeletonTimeoutElapsed, setSkeletonTimeoutElapsed] = useState<boolean>(false);

  useEffect(() => {
    if (data.length > 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSkeletonTimeoutElapsed(true);
    }, 1300);

    return () => clearTimeout(timer);
  }, [data.length]);

  const showSkeleton = data.length === 0 && !skeletonTimeoutElapsed;

  const chartData = useMemo<ChartRow[]>(() => {
    return data.slice(-20).map((point) => {
      const raw = point[dataKey];
      const value = Number(raw ?? 0);

      return {
        timestampLabel: formatTime(point.timestamp),
        value: Number.isFinite(value) ? value : 0,
      };
    });
  }, [data, dataKey]);

  const latest = chartData[chartData.length - 1]?.value;

  if (!chartData.length && showSkeleton) {
    return (
      <div className="telemetry-card">
        <header className="telemetry-card-header">
          <div className="telemetry-card-title">
            <HeartPulseIcon size={16} />
            <span>{label}</span>
          </div>
          <span className="value-badge">--</span>
        </header>
        <div className="chart-skeleton" />
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="telemetry-card">
        <header className="telemetry-card-header">
          <div className="telemetry-card-title">
            <HeartPulseIcon size={16} />
            <span>{label}</span>
          </div>
          <span className="value-badge">--</span>
        </header>
        <div className="telemetry-empty">
          <ActivityIcon size={18} />
          <span>Waiting for telemetry data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="telemetry-card">
      <header className="telemetry-card-header">
        <div className="telemetry-card-title">
          <HeartPulseIcon size={16} />
          <span>{label}</span>
        </div>
        <span className="value-badge">
          {latest?.toFixed(0)} {unit}
        </span>
      </header>
      <div className="chart-wrap">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="timestampLabel" tickLine={false} axisLine={false} minTickGap={32} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={42}
              domain={[(min: number) => min - Math.max(2, Math.abs(min * 0.04)), (max: number) => max + Math.max(2, Math.abs(max * 0.04))]}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              isAnimationActive
              animationDuration={550}
              dot={(props) => {
                if (props.index !== chartData.length - 1) {
                  return <></>;
                }

                return (
                  <circle
                    key={`${props.cx}-${props.cy}`}
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill={color}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
