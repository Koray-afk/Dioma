"use client";

import { TelemetryChart } from "@/components/telemetry/TelemetryChart";
import { BatteryGauge } from "@/components/telemetry/BatteryGauge";
import { StepCounter } from "@/components/telemetry/StepCounter";
import { KpiStats } from "@/components/telemetry/KpiStats";
import { InjectButtons } from "@/components/inject/InjectButtons";
import { DecisionFeed } from "@/components/decisions/DecisionFeed";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useDecisions } from "@/hooks/useDecisions";

export default function Home() {
  const { data: telemetry, loading: telemetryLoading } = useTelemetry();
  const { loading: decisionsLoading } = useDecisions();
  const latest = telemetry[telemetry.length - 1];

  // Show skeleton while both hooks are loading on first mount
  const isInitialLoad = telemetryLoading && decisionsLoading && telemetry.length === 0;

  if (isInitialLoad) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard-layout">
      {/* Left Column: Telemetry */}
      <div className="dashboard-left">
        {/* KPI Stats Row */}
        <KpiStats latest={latest} />

        {/* Heart Rate Chart */}
        <article className="panel">
          <TelemetryChart
            data={telemetry}
            dataKey="heart_rate"
            label="Heart Rate"
            color="#fb7185"
            unit="bpm"
          />
        </article>

        {/* Battery Gauge */}
        <article className="panel">
          <h3 style={{ margin: "0 0 var(--space-3) 0" }}>Battery</h3>
          <BatteryGauge value={Number(latest?.battery ?? 0)} />
        </article>

        {/* Step Counter */}
        <article className="panel">
          <h3 style={{ margin: "0 0 var(--space-3) 0" }}>Steps</h3>
          <StepCounter value={Number(latest?.steps ?? 0)} />
        </article>
      </div>

      {/* Right Column: Controls & Decisions */}
      <div className="dashboard-right">
        {/* Inject Buttons (Sticky) */}
        <article className="panel inject-card sticky-top">
          <InjectButtons />
        </article>

        {/* Decision Feed (Scrollable) */}
        <article className="panel decision-feed">
          <DecisionFeed />
        </article>
      </div>
    </div>
  );
}
