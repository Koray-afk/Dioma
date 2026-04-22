import type { DecisionItem } from "@/lib/types";

type Props = {
  item: DecisionItem;
};

export function DecisionCard({ item }: Props) {
  return (
    <article
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "0.8rem",
        background: "#f8fafc",
      }}
    >
      <p style={{ margin: 0, fontWeight: 600 }}>{item.action ?? "No action"}</p>
      <p style={{ margin: "0.4rem 0", color: "#475569" }}>
        {item.reason ?? "No reason provided"}
      </p>
      <small style={{ color: "#64748b" }}>
        Confidence: {Math.round((Number(item.confidence ?? 0) || 0) * 100)}%
      </small>
    </article>
  );
}
