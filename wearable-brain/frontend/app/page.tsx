import { TelemetryChart } from "@/components/telemetry/TelemetryChart";
import { BatteryGauge } from "@/components/telemetry/BatteryGauge";
import { StepCounter } from "@/components/telemetry/StepCounter";
import { DecisionFeed } from "@/components/decisions/DecisionFeed";
import { InjectButtons } from "@/components/inject/InjectButtons";

export default function Home() {
  return (
    <div className="dashboard-grid">
      <article className="panel chart-panel">
        <TelemetryChart />
      </article>
      <article className="panel">
        <BatteryGauge />
      </article>
      <article className="panel">
        <StepCounter />
      </article>
      <article className="panel decision-panel">
        <DecisionFeed />
      </article>
      <article className="panel inject-panel">
        <InjectButtons />
      </article>
    </div>
  );
}
