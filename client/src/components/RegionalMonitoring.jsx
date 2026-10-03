import React, { useState, useMemo } from "react";
import SensorCard from "./SensorCard";

export default function RegionalMonitoring({ readings = [] }) {
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("DEFAULT");

  const counts = useMemo(() => {
    const danger = readings.filter((r) => r.status === "DANGER").length;
    const warning = readings.filter((r) => r.status === "WARNING").length;
    const safe = readings.filter((r) => r.status === "SAFE").length;
    return { all: readings.length, danger, warning, safe };
  }, [readings]);

  const filteredReadings = useMemo(() => {
    let result = [...readings];

    // Status Filter
    if (filter !== "ALL") {
      result = result.filter((r) => r.status === filter);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((r) => (r.location || "").toLowerCase().includes(q));
    }

    // Sorting
    if (sortBy === "LEVEL_DESC") {
      result.sort((a, b) => (Number(b.waterLevel) || 0) - (Number(a.waterLevel) || 0));
    } else if (sortBy === "SEVERITY") {
      const rank = { DANGER: 3, WARNING: 2, SAFE: 1 };
      result.sort((a, b) => (rank[b.status] || 0) - (rank[a.status] || 0));
    } else if (sortBy === "NAME") {
      result.sort((a, b) => (a.location || "").localeCompare(b.location || ""));
    }

    return result;
  }, [readings, filter, searchQuery, sortBy]);

  return (
    <section id="monitoring" className="panel-section">
      <div className="section-header-row">
        <div>
          <div className="section-tag font-mono">
            <span className="tag-dot" />
            REGIONAL SENSOR NETWORK
          </div>
          <h2 className="section-title">Live Field Telemetry & Basin Stations</h2>
          <p className="section-description">
            Real-time ultrasonic water level sensors, weather stations, and precipitation monitors.
          </p>
        </div>

        <div className="telemetry-counter-badge font-mono">
          <span>STATIONS REPORTING:</span>
          <strong>{readings.length}</strong>
        </div>
      </div>

      {/* Control Bar: Search + Filter Pills + Sort */}
      <div className="monitoring-controls-bar">
        {/* Search Input */}
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Filter by station or river basin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="filter-pills">
          <button
            className={`filter-pill ${filter === "ALL" ? "active" : ""}`}
            onClick={() => setFilter("ALL")}
          >
            All <span className="pill-count font-mono">{counts.all}</span>
          </button>
          <button
            className={`filter-pill pill-danger ${filter === "DANGER" ? "active" : ""}`}
            onClick={() => setFilter("DANGER")}
          >
            Critical <span className="pill-count font-mono">{counts.danger}</span>
          </button>
          <button
            className={`filter-pill pill-warning ${filter === "WARNING" ? "active" : ""}`}
            onClick={() => setFilter("WARNING")}
          >
            Warning <span className="pill-count font-mono">{counts.warning}</span>
          </button>
          <button
            className={`filter-pill pill-safe ${filter === "SAFE" ? "active" : ""}`}
            onClick={() => setFilter("SAFE")}
          >
            Normal <span className="pill-count font-mono">{counts.safe}</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="sort-box">
          <span className="sort-label">SORT:</span>
          <select
            className="sort-select font-mono"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="DEFAULT">Network Default</option>
            <option value="SEVERITY">Highest Threat First</option>
            <option value="LEVEL_DESC">Water Level (High → Low)</option>
            <option value="NAME">Station Name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      {filteredReadings.length === 0 ? (
        <div className="empty-state-panel">
          <div className="empty-icon">📡</div>
          <h3 className="empty-title">No matching sensor stations found</h3>
          <p className="empty-text">
            No sensor telemetry matches the current filters ({filter !== "ALL" ? `Status: ${filter}` : ""} {searchQuery ? `Query: "${searchQuery}"` : ""}).
          </p>
          <button
            className="btn-reset-filters"
            onClick={() => {
              setFilter("ALL");
              setSearchQuery("");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="sensors-grid">
          {filteredReadings.map((reading) => (
            <SensorCard key={reading._id || reading.location} reading={reading} />
          ))}
        </div>
      )}
    </section>
  );
}
