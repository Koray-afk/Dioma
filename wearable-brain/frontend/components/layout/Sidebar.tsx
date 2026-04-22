import { Brain, Activity, Gauge, ListChecks } from "lucide-react";

const items = [
  { label: "Overview", icon: Activity },
  { label: "Telemetry", icon: Gauge },
  { label: "Decisions", icon: ListChecks },
];

export function Sidebar() {
  return (
    <aside
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        color: "#e2e8f0",
        padding: "1.25rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Brain size={22} />
        <strong>Wearable Brain</strong>
      </div>
      <nav style={{ marginTop: "2rem", display: "grid", gap: "0.5rem" }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 0.75rem",
              borderRadius: "10px",
              background: "rgba(148, 163, 184, 0.12)",
            }}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
