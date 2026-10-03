import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="skeleton-dashboard-wrapper">
      {/* Skeleton Topbar */}
      <div className="skeleton-hero-box">
        <div className="skeleton-line skeleton-title shimmer" />
        <div className="skeleton-line skeleton-sub shimmer" />
        <div className="skeleton-stats-row">
          <div className="skeleton-box skeleton-stat-tile shimmer" />
          <div className="skeleton-box skeleton-stat-tile shimmer" />
          <div className="skeleton-box skeleton-stat-tile shimmer" />
        </div>
      </div>

      {/* Skeleton KPI Grid */}
      <div className="skeleton-kpi-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-box skeleton-kpi-card shimmer">
            <div className="skeleton-line skeleton-kpi-label" />
            <div className="skeleton-line skeleton-kpi-val" />
          </div>
        ))}
      </div>

      {/* Skeleton Cards Grid */}
      <div className="skeleton-section-header shimmer" />
      <div className="skeleton-sensors-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-box skeleton-sensor-card shimmer">
            <div className="skeleton-line skeleton-card-title" />
            <div className="skeleton-box skeleton-gauge-bar" />
            <div className="skeleton-metrics-row">
              <div className="skeleton-box skeleton-metric-item" />
              <div className="skeleton-box skeleton-metric-item" />
              <div className="skeleton-box skeleton-metric-item" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
