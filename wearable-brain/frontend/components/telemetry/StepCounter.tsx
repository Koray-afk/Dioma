"use client";

import { FootprintsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  value?: number;
};

export function StepCounter({ value }: Props) {
  const target = Math.max(0, Number(value ?? 0));
  const [displayValue, setDisplayValue] = useState<number>(target);
  const prev = useRef<number>(target);

  useEffect(() => {
    const start = prev.current;
    const end = target;
    const durationMs = 450;
    const startTime = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayValue(current);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    prev.current = end;

    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <div className="telemetry-card">
      <header className="telemetry-card-header">
        <div className="telemetry-card-title">
          <FootprintsIcon size={16} />
          <span>Step Counter</span>
        </div>
        <span className="value-badge value-badge-numeric">{target.toLocaleString()}</span>
      </header>

      <p className="step-value value-badge-numeric step-animate">{displayValue.toLocaleString()}</p>
      <p className="step-subtitle">steps today</p>
    </div>
  );
}
