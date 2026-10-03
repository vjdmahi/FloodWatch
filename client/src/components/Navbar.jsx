import React from "react";

export default function Navbar({
  isLive = true,
  isRefreshing = false,
  onRefresh = () => {},
  activeSection = "dashboard",
  onNavClick = () => {},
  onOpenAuth = () => {},
  hasToken = false,
}) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "#dashboard" },
    { id: "monitoring", label: "Live Monitoring", href: "#monitoring" },
    { id: "alerts", label: "Alerts", href: "#alerts" },
    { id: "history", label: "History", href: "#history" },
    { id: "system", label: "System", href: "#system" },
  ];

  const handleLinkClick = (e, item) => {
    e.preventDefault();
    onNavClick(item.id);
    const el = document.getElementById(item.id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="top-navigation-bar">
      <div className="nav-container">
        {/* Brand Group */}
        <div className="nav-brand-group">
          <div className="brand-radar-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 0 0-7.07 17.07l1.41-1.41A8 8 0 0 1 12 4v-2z" />
              <path d="M12 6a6 6 0 0 0-4.24 10.24l1.41-1.41A4 4 0 0 1 12 8V6z" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <span className="brand-title">FLOOD<span className="brand-cyan">WATCH</span></span>
              <span className="brand-env-badge font-mono">OPERATIONS</span>
            </div>
            <span className="brand-subtitle">Emergency Monitoring Network</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links" aria-label="Main Navigation">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`nav-link ${activeSection === item.id ? "active-nav-link" : ""}`}
              onClick={(e) => handleLinkClick(e, item)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Live Indicator + Refresh Action + Auth Trigger */}
        <div className="nav-actions-group">
          {/* Live System Indicator */}
          <div className={`live-telemetry-badge font-mono ${isLive ? "telemetry-active" : "telemetry-offline"}`}>
            <span className="live-pulsar-dot" />
            <span>{isLive ? "● LIVE" : "● OFFLINE"}</span>
          </div>

          {/* Sync Trigger Button */}
          <button
            className={`btn-sync-telemetry ${isRefreshing ? "refreshing" : ""}`}
            onClick={onRefresh}
            title="Force immediate telemetry poll"
            disabled={isRefreshing}
          >
            <svg
              className={`sync-icon ${isRefreshing ? "spin-animation" : ""}`}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span className="sync-text font-mono">{isRefreshing ? "SYNCING..." : "SYNC"}</span>
          </button>

          {/* Auth Key Button */}
          <button
            className="btn-nav-auth font-mono"
            onClick={onOpenAuth}
            title="Manage Gateway Authorization Token"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1.5-1.5L8 9 3 14v7h7l5-5 1.5 1.5L18 16l1.5-1.5L21 16l2-2-4.5-4.5z" />
            </svg>
            <span>{hasToken ? "AUTH KEY ✓" : "AUTHENTICATE"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
