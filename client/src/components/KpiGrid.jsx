import React from "react";

export default function KpiGrid({ readings = [], alerts = [] }) {
  const totalLocations = readings.length;

  const dangerAlerts = alerts.filter(
    (a) => (a.severity || "").toUpperCase() === "HIGH" || (a.severity || "").toUpperCase() === "DANGER"
  ).length || alerts.length;

  const warningCount = readings.filter((r) => (r.status || "").toUpperCase() === "WARNING").length;
  const safeCount = readings.filter((r) => (r.status || "").toUpperCase() === "SAFE").length;

  // Highest water level
  let highestLevel = 0;
  let highestLocation = "None";
  if (readings.length > 0) {
    readings.forEach((r) => {
      const lvl = Number(r.waterLevel) || 0;
      if (lvl > highestLevel) {
        highestLevel = lvl;
        highestLocation = r.location || "Station";
      }
    });
  }

  const isCriticalPeak = highestLevel >= 4.0;
  const isWarningPeak = highestLevel >= 3.0 && highestLevel < 4.0;

  return (
    <section className="kpi-section" aria-label="Key Performance Indicators">
      <div className="kpi-grid">
        {/* KPI 1: Monitored Locations */}
        <div className="kpi-card kpi-blue">
          <div className="kpi-top">
            <span className="kpi-label">MONITORED LOCATIONS</span>
            <div className="kpi-icon-pill icon-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </div>
          <div className="kpi-value font-mono">
            <strong>{totalLocations}</strong>
            <span className="kpi-unit">STATIONS</span>
          </div>
          <div className="kpi-footer font-mono">
            <span className="footer-status-dot dot-blue" />
            <span>Telemetry online</span>
          </div>
        </div>

        {/* KPI 2: Active Danger Alerts */}
        <div className={`kpi-card ${dangerAlerts > 0 ? "kpi-danger danger-pulse" : "kpi-card-neutral"}`}>
          <div className="kpi-top">
            <span className="kpi-label">ACTIVE DANGER ALERTS</span>
            <div className={`kpi-icon-pill ${dangerAlerts > 0 ? "icon-red" : "icon-dim"}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
          <div className="kpi-value font-mono">
            <strong className={dangerAlerts > 0 ? "text-danger" : ""}>{dangerAlerts}</strong>
            <span className="kpi-unit">INCIDENTS</span>
          </div>
          <div className="kpi-footer font-mono">
            <span className={`footer-status-dot ${dangerAlerts > 0 ? "dot-red" : "dot-green"}`} />
            <span>{dangerAlerts > 0 ? "Immediate action required" : "Zero active emergencies"}</span>
          </div>
        </div>

        {/* KPI 3: Warning Locations */}
        <div className="kpi-card kpi-warning">
          <div className="kpi-top">
            <span className="kpi-label">WARNING LOCATIONS</span>
            <div className="kpi-icon-pill icon-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div className="kpi-value font-mono">
            <strong className={warningCount > 0 ? "text-warning" : ""}>{warningCount}</strong>
            <span className="kpi-unit">ELEVATED</span>
          </div>
          <div className="kpi-footer font-mono">
            <span className="footer-status-dot dot-orange" />
            <span>Levels between 3.0m - 4.0m</span>
          </div>
        </div>

        {/* KPI 4: Safe Locations */}
        <div className="kpi-card kpi-safe">
          <div className="kpi-top">
            <span className="kpi-label">SAFE LOCATIONS</span>
            <div className="kpi-icon-pill icon-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <div className="kpi-value font-mono">
            <strong className="text-safe">{safeCount}</strong>
            <span className="kpi-unit">NORMAL</span>
          </div>
          <div className="kpi-footer font-mono">
            <span className="footer-status-dot dot-green" />
            <span>Optimal watershed levels</span>
          </div>
        </div>

        {/* KPI 5: Highest Water Level */}
        <div className={`kpi-card ${isCriticalPeak ? "kpi-danger" : isWarningPeak ? "kpi-warning" : "kpi-cyan"}`}>
          <div className="kpi-top">
            <span className="kpi-label">HIGHEST WATER LEVEL</span>
            <div className="kpi-icon-pill icon-cyan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
          </div>
          <div className="kpi-value font-mono">
            <strong className={isCriticalPeak ? "text-danger" : isWarningPeak ? "text-warning" : "text-cyan"}>
              {highestLevel.toFixed(2)}
            </strong>
            <span className="kpi-unit">METERS</span>
          </div>
          <div className="kpi-footer font-mono">
            <span className="footer-status-dot dot-cyan" />
            <span className="kpi-subtext" title={highestLocation}>
              Peak at: {highestLocation}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
