import React from "react";

export default function ActiveAlerts({ alerts = [] }) {
  const hasAlerts = alerts && alerts.length > 0;

  return (
    <section id="alerts" className="panel-section alerts-container">
      <div className="section-header-row">
        <div>
          <div className="section-tag font-mono tag-danger">
            <span className="pulse-danger-dot" />
            EMERGENCY RESPONSE PROTOCOL
          </div>
          <h2 className="section-title">Active Flood Warnings & Evacuation Alerts</h2>
          <p className="section-description">
            Live alerts dispatched automatically by the Kafka alert streaming pipeline.
          </p>
        </div>

        <div className={`alerts-status-pill ${hasAlerts ? "has-danger" : "all-clear"} font-mono`}>
          {hasAlerts ? (
            <>
              <span className="siren-icon">🚨</span>
              <span>{alerts.length} ACTIVE EMERGENCY {alerts.length === 1 ? "ALERT" : "ALERTS"}</span>
            </>
          ) : (
            <>
              <span className="check-icon">✓</span>
              <span>ALL BASINS NORMAL</span>
            </>
          )}
        </div>
      </div>

      {!hasAlerts ? (
        <div className="alert-all-clear-card">
          <div className="clear-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="clear-text-content">
            <h3 className="clear-heading">Zero Active Flood Hazards</h3>
            <p className="clear-subtext">
              All monitored water levels and reservoir capacities remain below trigger thresholds. Automatic Kafka emergency dispatch is on standby.
            </p>
          </div>
          <div className="clear-meta font-mono">
            <span>STATUS: NORMAL</span>
          </div>
        </div>
      ) : (
        <div className="active-alerts-grid">
          {alerts.map((alert) => {
            const severity = (alert.severity || "HIGH").toUpperCase();
            const isCritical = severity === "HIGH" || severity === "DANGER";
            const severityClass = isCritical
              ? "alert-card-critical"
              : severity === "MEDIUM"
              ? "alert-card-warning"
              : "alert-card-advisory";

            const formattedTime = alert.timestamp
              ? new Date(alert.timestamp).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "Just now";

            return (
              <div key={alert._id || `${alert.location}-${alert.timestamp}`} className={`active-alert-card ${severityClass}`}>
                <div className="alert-top-row">
                  <div className="alert-location-group">
                    <span className="alert-marker-icon">📍</span>
                    <div>
                      <h3 className="alert-location-title">{alert.location}</h3>
                      <span className="alert-sector font-mono">IMPACT ZONE</span>
                    </div>
                  </div>

                  <span className={`alert-severity-badge font-mono ${isCritical ? "badge-critical" : "badge-warn"}`}>
                    {isCritical ? "CRITICAL " : ""}{severity} SEVERITY
                  </span>
                </div>

                <div className="alert-metrics-banner">
                  <div className="alert-level-display">
                    <span className="alert-metric-label">RECORDED WATER LEVEL</span>
                    <div className="alert-level-value font-mono">
                      <strong>{Number(alert.waterLevel || 0).toFixed(2)}</strong>
                      <span>meters</span>
                    </div>
                  </div>

                  <div className="alert-status-flag font-mono">
                    <span className="flag-dot" />
                    <span>EMERGENCY BROADCAST ACTIVE</span>
                  </div>
                </div>

                {alert.message && (
                  <div className="alert-message-box">
                    <p className="alert-message-text">{alert.message}</p>
                  </div>
                )}

                <div className="alert-card-footer font-mono">
                  <div className="alert-time-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>INCIDENT TIMESTAMP: {formattedTime}</span>
                  </div>
                  <span className="alert-dispatch-tag">AUTOMATED KAFKA DISPATCH</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
