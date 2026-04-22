"use client";

import { TelemetryChart } from "@/components/telemetry/TelemetryChart";
import { BatteryGauge } from "@/components/telemetry/BatteryGauge";
import { StepCounter } from "@/components/telemetry/StepCounter";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function Home() {
  const { data } = useTelemetry();
  const latest = data[data.length - 1];

  return (
    <div className="telemetry-row">
      <article className="panel telemetry-panel-wide">
        <TelemetryChart
          data={data}
          dataKey="heart_rate"
          label="Heart Rate"
          color="#fb7185"
          unit="bpm"
        />
      </article>
      <article className="panel telemetry-panel">
        <BatteryGauge value={Number(latest?.battery ?? 0)} />
      </article>
      <article className="panel telemetry-panel">
        <StepCounter value={Number(latest?.steps ?? 0)} />
      </article>
    </div>
  );
}
