import React from "react";
import WaterLevelGauge from "./WaterLevelGauge";

export default function SensorCard({ reading }) {
  const {
    location = "Unknown Station",
    waterLevel = 0,
    rainfall = 0,
    temperature = 0,
    humidity = 0,
    status = "SAFE",
    severity = "LOW",
    message = "Normal conditions",
    timestamp,
  } = reading;

  const normalizedStatus = (status || "SAFE").toUpperCase();
  const normalizedSeverity = (severity || "LOW").toUpperCase();

  const isDanger = normalizedStatus === "DANGER";
  const isWarning = normalizedStatus === "WARNING";

  const statusClass = isDanger ? "status-danger" : isWarning ? "status-warning" : "status-safe";
  const severityClass =
    normalizedSeverity === "HIGH"
      ? "badge-danger"
      : normalizedSeverity === "MEDIUM"
      ? "badge-warning"
      : "badge-safe";

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Live";

  return (
    <div className={`sensor-card ${statusClass}`}>
      {/* Station Card Header */}
      <div className="sensor-card-header">
        <div className="sensor-title-group">
          <div className="sensor-pin-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <h3 className="sensor-name">{location}</h3>
            <span className="sensor-meta font-mono">TELEMETRY NODE</span>
          </div>
        </div>

        {/* Status & Severity Badges */}
        <div className="sensor-badges">
          <span className={`status-pill ${statusClass}`}>
            <span className="pulse-dot" />
            {normalizedStatus}
          </span>
        </div>
      </div>

      {/* Water Level Gauge Component */}
      <div className="sensor-gauge-wrapper">
        <WaterLevelGauge waterLevel={waterLevel} status={normalizedStatus} />
      </div>

      {/* Environmental Metrics Grid */}
      <div className="sensor-metrics-grid">
        {/* Rainfall */}
        <div className="metric-box">
          <div className="metric-header">
            <span className="metric-icon">🌧️</span>
            <span className="metric-label">RAINFALL</span>
          </div>
          <div className="metric-value font-mono">
            <strong>{rainfall}</strong>
            <span className="metric-unit">mm</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="metric-box">
          <div className="metric-header">
            <span className="metric-icon">🌡️</span>
            <span className="metric-label">TEMP</span>
          </div>
          <div className="metric-value font-mono">
            <strong>{temperature}</strong>
            <span className="metric-unit">°C</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="metric-box">
          <div className="metric-header">
            <span className="metric-icon">💦</span>
            <span className="metric-label">HUMIDITY</span>
          </div>
          <div className="metric-value font-mono">
            <strong>{humidity}</strong>
            <span className="metric-unit">%</span>
          </div>
        </div>
      </div>

      {/* Advisory Message */}
      {message && (
        <div className="sensor-advisory">
          <span className="advisory-icon">{isDanger ? "🚨" : isWarning ? "⚠️" : "ℹ️"}</span>
          <span className="advisory-text">{message}</span>
        </div>
      )}

      {/* Card Footer */}
      <div className="sensor-card-footer">
        <span className={`severity-tag ${severityClass}`}>
          {normalizedSeverity} SEVERITY
        </span>
        <div className="sensor-timestamp font-mono">
          <span>UPDATED:</span>
          <strong>{formattedTime}</strong>
        </div>
      </div>
    </div>
  );
}
