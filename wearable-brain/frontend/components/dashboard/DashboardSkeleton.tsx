"use client";

export function DashboardSkeleton() {
  return (
    <div className="dashboard-layout">
      {/* Left Column */}
      <div className="dashboard-left">
        {/* KPI Row */}
        <div className="kpi-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="kpi-card">
              <div className="skeleton skeleton-text" style={{ width: "60%", height: "14px" }} />
              <div className="skeleton skeleton-text" style={{ width: "40%", height: "28px", marginTop: "8px" }} />
            </div>
          ))}
        </div>

        {/* HR Chart Card */}
        <article className="panel">
          <div className="chart-skeleton" />
        </article>

        {/* Battery Card */}
        <article className="panel">
          <div className="skeleton skeleton-text" style={{ width: "50%", height: "18px", marginBottom: "12px" }} />
          <div className="skeleton" style={{ height: "14px", borderRadius: "999px" }} />
        </article>

        {/* Steps Card */}
        <article className="panel">
          <div className="skeleton skeleton-text" style={{ width: "50%", height: "18px", marginBottom: "12px" }} />
          <div className="skeleton skeleton-text" style={{ width: "60%", height: "36px", marginTop: "8px" }} />
        </article>
      </div>

      {/* Right Column */}
      <div className="dashboard-right">
        {/* Inject Card */}
        <article className="panel inject-card">
          <div className="skeleton skeleton-text" style={{ width: "70%", height: "20px", marginBottom: "12px" }} />
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: "32px", width: "80px", borderRadius: "999px" }} />
            ))}
          </div>
        </article>

        {/* Decision Feed Card */}
        <article className="panel">
          <div className="skeleton skeleton-text" style={{ width: "50%", height: "20px", marginBottom: "12px" }} />
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: "72px", marginBottom: "12px", borderRadius: "12px" }} />
          ))}
        </article>
      </div>
    </div>
  );
}
