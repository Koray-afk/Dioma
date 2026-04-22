export function TopBar() {
  const now = new Date().toLocaleString();

  return (
    <header
      style={{
        border: "1px solid #dbe4f0",
        borderRadius: "16px",
        background: "#ffffff",
        padding: "0.9rem 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: "1.1rem" }}>Realtime Control Dashboard</h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
          Monitor telemetry and agent decisions
        </p>
      </div>
      <span style={{ color: "#334155", fontSize: "0.85rem" }}>{now}</span>
    </header>
  );
}
