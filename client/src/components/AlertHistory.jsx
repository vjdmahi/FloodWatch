import React, { useState, useMemo } from "react";

export default function AlertHistory({ alertHistory = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, RESOLVED

  const filteredHistory = useMemo(() => {
    let list = [...alertHistory];

    if (statusFilter === "ACTIVE") {
      list = list.filter((a) => a.active === true);
    } else if (statusFilter === "RESOLVED") {
      list = list.filter((a) => a.active === false);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (a) =>
          (a.location || "").toLowerCase().includes(q) ||
          (a.message || "").toLowerCase().includes(q) ||
          (a.severity || "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [alertHistory, statusFilter, searchTerm]);

  return (
    <section id="history" className="panel-section">
      <div className="section-header-row">
        <div>
          <div className="section-tag font-mono">
            <span className="tag-dot" />
            HISTORICAL AUDIT TRAIL
          </div>
          <h2 className="section-title">Flood Incident History & Resolution Log</h2>
          <p className="section-description">
            Complete historical log of detected threshold violations and mitigation resolutions.
          </p>
        </div>

        <div className="history-count-badge font-mono">
          <span>ARCHIVED RECORDS:</span>
          <strong>{alertHistory.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="history-controls-bar">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search incident history by location, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
              ×
            </button>
          )}
        </div>

        <div className="filter-pills">
          <button
            className={`filter-pill ${statusFilter === "ALL" ? "active" : ""}`}
            onClick={() => setStatusFilter("ALL")}
          >
            All Logs ({alertHistory.length})
          </button>
          <button
            className={`filter-pill pill-danger ${statusFilter === "ACTIVE" ? "active" : ""}`}
            onClick={() => setStatusFilter("ACTIVE")}
          >
            Active ({alertHistory.filter((a) => a.active).length})
          </button>
          <button
            className={`filter-pill pill-safe ${statusFilter === "RESOLVED" ? "active" : ""}`}
            onClick={() => setStatusFilter("RESOLVED")}
          >
            Resolved ({alertHistory.filter((a) => !a.active).length})
          </button>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="empty-state-panel">
          <div className="empty-icon">📜</div>
          <h3 className="empty-title">No Incident Records Found</h3>
          <p className="empty-text">No alert logs match your current filter criteria.</p>
        </div>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr className="font-mono">
                <th>LOCATION</th>
                <th>INCIDENT STATUS</th>
                <th>SEVERITY</th>
                <th>WATER LEVEL</th>
                <th>INCIDENT MESSAGE</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, idx) => {
                const isActive = item.active === true;
                const severity = (item.severity || "LOW").toUpperCase();
                const isHigh = severity === "HIGH" || severity === "DANGER";
                const isMedium = severity === "MEDIUM";

                const formattedDate = item.timestamp
                  ? new Date(item.timestamp).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "N/A";

                return (
                  <tr key={item._id || idx} className={isActive ? "row-active-incident" : ""}>
                    <td className="cell-location">
                      <div className="location-name-cell">
                        <span className="table-pin">📍</span>
                        <strong>{item.location || "Unknown Station"}</strong>
                      </div>
                    </td>

                    <td>
                      <span className={`status-badge font-mono ${isActive ? "badge-incident-active" : "badge-incident-resolved"}`}>
                        <span className="dot-mini" />
                        {isActive ? "ACTIVE" : "RESOLVED"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`severity-pill font-mono ${
                          isHigh ? "pill-high" : isMedium ? "pill-med" : "pill-low"
                        }`}
                      >
                        {severity}
                      </span>
                    </td>

                    <td className="cell-water font-mono">
                      <strong className={isHigh ? "text-danger" : isMedium ? "text-warning" : "text-cyan"}>
                        {Number(item.waterLevel || 0).toFixed(2)}
                      </strong>
                      <span className="unit-label"> m</span>
                    </td>

                    <td className="cell-message">
                      <span className="message-text" title={item.message}>
                        {item.message || "—"}
                      </span>
                    </td>

                    <td className="cell-time font-mono">
                      <span className="time-display">{formattedDate}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
