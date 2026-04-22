"use client";

import { useState } from "react";
import clsx from "clsx";
import { injectTelemetry } from "@/lib/api";

export function InjectButtons() {
  const [status, setStatus] = useState<string>("idle");

  const injectSample = async (mode: "normal" | "stress") => {
    setStatus("sending");

    const payload =
      mode === "normal"
        ? { heart_rate: 76, stress: 22, steps: 4210, battery: 78 }
        : { heart_rate: 128, stress: 85, steps: 4222, battery: 74 };

    try {
      await injectTelemetry(payload);
      setStatus(`sent: ${mode}`);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Inject Test Data</h2>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          className={clsx("inject-btn")}
          onClick={() => void injectSample("normal")}
          type="button"
        >
          Inject Normal
        </button>
        <button
          className={clsx("inject-btn", "inject-btn-danger")}
          onClick={() => void injectSample("stress")}
          type="button"
        >
          Inject Stress
        </button>
      </div>
      <p style={{ marginBottom: 0, color: "#475569" }}>Status: {status}</p>
    </div>
  );
}
