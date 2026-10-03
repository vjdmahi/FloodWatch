import React from "react";

export default function WaterLevelGauge({ waterLevel = 0, status = "SAFE" }) {
  const numericLevel = Number(waterLevel) || 0;
  // Visual scale caps at 6.0m
  const maxScale = 6.0;
  const percentage = Math.min(Math.max((numericLevel / maxScale) * 100, 0), 100);

  // Status-driven styling
  const isDanger = numericLevel >= 4.0 || status === "DANGER";
  const isWarning = (numericLevel >= 3.0 && numericLevel < 4.0) || status === "WARNING";

  const barColor = isDanger
    ? "var(--color-danger)"
    : isWarning
    ? "var(--color-warning)"
    : "var(--color-safe)";

  return (
    <div className="water-gauge">
      <div className="water-gauge-header">
        <span className="water-gauge-label">WATER LEVEL</span>
        <div className="water-gauge-value font-mono">
          <span className="level-number" style={{ color: barColor }}>
            {numericLevel.toFixed(2)}
          </span>
          <span className="level-unit">m</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="water-gauge-track" title={`Water Level: ${numericLevel}m`}>
        {/* Fill Bar */}
        <div
          className="water-gauge-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
            boxShadow: isDanger
              ? "0 0 12px var(--color-danger)"
              : isWarning
              ? "0 0 10px var(--color-warning)"
              : "0 0 8px var(--color-safe)",
          }}
        />

        {/* Warning Threshold Marker (3m = 50%) */}
        <div
          className="gauge-marker marker-warning"
          style={{ left: "50%" }}
          title="Warning Threshold (3.0m)"
        >
          <span className="marker-line" />
        </div>

        {/* Danger Threshold Marker (4m = 66.7%) */}
        <div
          className="gauge-marker marker-danger"
          style={{ left: "66.67%" }}
          title="Danger Threshold (4.0m)"
        >
          <span className="marker-line" />
        </div>
      </div>

      {/* Scale Labels */}
      <div className="water-gauge-scale font-mono">
        <span className="scale-point">0.0m</span>
        <span className="scale-point warning-tag" style={{ left: "50%" }}>
          3.0m WARN
        </span>
        <span className="scale-point danger-tag" style={{ left: "66.67%" }}>
          4.0m CRIT
        </span>
        <span className="scale-point max-tag">6.0m+</span>
      </div>
    </div>
  );
}
