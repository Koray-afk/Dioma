"use client";

import { BatteryChargingIcon } from "lucide-react";

type Props = {
  value?: number;
};

export function BatteryGauge({ value }: Props) {
  const battery = Math.max(0, Math.min(100, Number(value ?? 0)));

  const fillColor = battery > 50 ? "#22c55e" : battery >= 20 ? "#f59e0b" : "#ef4444";

  return (
    <div className="telemetry-card">
      <header className="telemetry-card-header">
        <div className="telemetry-card-title">
          <BatteryChargingIcon size={16} />
          <span>Battery</span>
        </div>
        <span className="value-badge value-badge-numeric">{battery}%</span>
      </header>

      <div className="battery-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={battery}>
        <div className="battery-fill" style={{ width: `${battery}%`, background: fillColor }} />
      </div>

      <p className="battery-text value-badge-numeric">{battery}% remaining</p>
    </div>
  );
}
