import React from "react";

export default function HeroStatus({
  systemOnline = true,
  lastUpdated = new Date(),
  locationCount = 0,
  hasActiveDanger = false,
}) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  return (
    <section className="hero-status-card">
      <div className="hero-status-content">
        <div className="hero-brand-section">
          <div className="hero-eyebrow font-mono">
            <span className="eyebrow-radar" />
            <span>CENTRAL TELEMETRY & COMMAND</span>
          </div>
          <h1 className="hero-title">
            FLOOD<span className="highlight-cyan">WATCH</span>
          </h1>
          <p className="hero-tagline">
            Real-Time Flood Monitoring & Emergency Operations Control Center
          </p>
        </div>

        {/* Status Badges Group */}
        <div className="hero-stats-group">
          {/* System Status */}
          <div className="hero-metric-tile">
            <span className="tile-label font-mono">SYSTEM STATUS</span>
            <div className="tile-value-row">
              <span className={`status-indicator-dot ${systemOnline ? "dot-online" : "dot-degraded"}`} />
              <strong className={`tile-status-text font-mono ${systemOnline ? "text-online" : "text-degraded"}`}>
                {systemOnline ? "ONLINE" : "DEGRADED"}
              </strong>
            </div>
            <span className="tile-subtext font-mono">
              {systemOnline ? "All telemetry microservices synchronized" : "Connection disrupted"}
            </span>
          </div>

          {/* Last Updated */}
          <div className="hero-metric-tile">
            <span className="tile-label font-mono">LAST TELEMETRY SYNC</span>
            <div className="tile-value-row font-mono">
              <span className="tile-sync-icon">⏱️</span>
              <strong className="tile-time-text">{formattedTime}</strong>
            </div>
            <span className="tile-subtext font-mono">Auto-polling every 5 seconds</span>
          </div>

          {/* Monitored Locations */}
          <div className="hero-metric-tile">
            <span className="tile-label font-mono">MONITORED BASINS</span>
            <div className="tile-value-row font-mono">
              <span className="tile-sync-icon">📡</span>
              <strong className="tile-count-text">{locationCount} Locations</strong>
            </div>
            <span className="tile-subtext font-mono">
              {hasActiveDanger ? "⚠️ Flood alert active" : "✓ Operating within thresholds"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
