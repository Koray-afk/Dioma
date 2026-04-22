"use client";

import { useState } from "react";
import clsx from "clsx";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { postData } from "@/lib/api";
import { SCENARIO_PAYLOADS } from "@/lib/constants";

type ScenarioKey = "emergency" | "lowBatteryNav" | "meditation";
type ScenarioStatus = "idle" | "loading" | "success" | "error";

const SCENARIOS: Array<{
  key: ScenarioKey;
  label: string;
  emoji: string;
  style: "danger" | "warning" | "primary";
}> = [
  {
    key: "emergency",
    label: "Inject Emergency",
    emoji: "🚨",
    style: "danger",
  },
  {
    key: "lowBatteryNav",
    label: "Inject Low Battery + Nav",
    emoji: "🔋",
    style: "warning",
  },
  {
    key: "meditation",
    label: "Inject Meditation",
    emoji: "🧘",
    style: "primary",
  },
];

export function InjectButtons() {
  const [statusByScenario, setStatusByScenario] = useState<Record<ScenarioKey, ScenarioStatus>>({
    emergency: "idle",
    lowBatteryNav: "idle",
    meditation: "idle",
  });

  const isAnyLoading = Object.values(statusByScenario).includes("loading");

  const runScenario = async (key: ScenarioKey) => {
    const payload = SCENARIO_PAYLOADS[key];

    setStatusByScenario((prev) => ({
      ...prev,
      [key]: "loading",
    }));

    try {
      await postData(payload);
      setStatusByScenario((prev) => ({
        ...prev,
        [key]: "success",
      }));
    } catch (error) {
      console.error("Failed to post scenario payload", error);
      setStatusByScenario((prev) => ({
        ...prev,
        [key]: "error",
      }));
    } finally {
      window.setTimeout(() => {
        setStatusByScenario((prev) => ({
          ...prev,
          [key]: "idle",
        }));
      }, 500);
    }
  };

  return (
    <section className="inject-card">
      <header className="inject-card-header">
        <h2 className="inject-title">Inject Scenario</h2>
        <p className="inject-subtitle">Simulate sensor payloads to test Arbiter decisions</p>
      </header>

      <div className="inject-button-row">
        {SCENARIOS.map((scenario) => {
          const status = statusByScenario[scenario.key];
          const payload = SCENARIO_PAYLOADS[scenario.key];

          return (
            <button
              key={scenario.key}
              type="button"
              className={clsx(
                "inject-pill",
                `inject-pill-${scenario.style}`,
                status === "success" && "inject-pill-success",
                status === "error" && "inject-pill-error"
              )}
              onClick={() => void runScenario(scenario.key)}
              disabled={isAnyLoading}
              aria-label={scenario.label}
            >
              <span className="inject-pill-content">
                {status === "loading" ? (
                  <Loader2Icon size={16} className="inject-spin" />
                ) : status === "success" ? (
                  <CheckIcon size={16} />
                ) : status === "error" ? (
                  <XIcon size={16} />
                ) : (
                  <span>{scenario.emoji}</span>
                )}
                <span>{scenario.label}</span>
              </span>

              <span className="inject-tooltip" role="tooltip">
                <pre>{JSON.stringify(payload, null, 2)}</pre>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
