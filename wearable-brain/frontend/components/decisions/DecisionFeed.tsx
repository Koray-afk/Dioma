"use client";

import { useDecisions } from "@/hooks/useDecisions";
import { DecisionCard } from "@/components/decisions/DecisionCard";

export function DecisionFeed() {
  const { data, error } = useDecisions();

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Decision Feed</h2>
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {data.length ? (
          data.map((item, idx) => <DecisionCard key={item.id ?? idx} item={item} />)
        ) : (
          <p style={{ color: "#64748b", margin: 0 }}>No decisions yet.</p>
        )}
      </div>
    </div>
  );
}
