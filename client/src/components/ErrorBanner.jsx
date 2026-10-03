import React from "react";

export default function ErrorBanner({ message, onRetry, isRetrying, onOpenAuth }) {
  if (!message) return null;

  const isAuthError = message.toLowerCase().includes("token") || message.toLowerCase().includes("auth") || message.toLowerCase().includes("401");

  return (
    <div className="error-notification-banner" role="alert">
      <div className="error-banner-content">
        <div className="error-icon-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="error-text-content">
          <strong className="error-title font-mono">
            {isAuthError ? "GATEWAY AUTHENTICATION REQUIRED" : "TELEMETRY LINK DEGRADED"}
          </strong>
          <p className="error-detail">{message}</p>
        </div>
      </div>

      <div className="error-actions font-mono">
        {isAuthError && onOpenAuth && (
          <button
            className="btn-retry-sync"
            style={{ background: "rgba(6, 182, 212, 0.25)", borderColor: "var(--border-focus)", color: "#fff" }}
            onClick={onOpenAuth}
          >
            AUTHENTICATE
          </button>
        )}
        <button
          className="btn-retry-sync"
          onClick={onRetry}
          disabled={isRetrying}
          title="Retry backend connection"
        >
          {isRetrying ? "RETRYING..." : "RECONNECT"}
        </button>
      </div>
    </div>
  );
}
