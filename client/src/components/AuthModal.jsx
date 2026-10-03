import React, { useState } from "react";
import axios from "axios";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [email, setEmail] = useState("operator@floodwatch.com");
  const [password, setPassword] = useState("OperatorPassword123!");
  const [manualToken, setManualToken] = useState("");
  const [mode, setMode] = useState("LOGIN"); // LOGIN or MANUAL
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem("floodwatch_token", response.data.token);
        if (response.data.user) {
          localStorage.setItem("floodwatch_user", JSON.stringify(response.data.user));
        }
        onAuthSuccess();
        onClose();
      } else {
        setAuthError("No token received from authentication service.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      const msg = err.response?.data?.message || "Invalid credentials or user service unavailable.";
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleManualSave = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      setAuthError("Please enter a valid JWT token string.");
      return;
    }
    localStorage.setItem("floodwatch_token", manualToken.trim());
    onAuthSuccess();
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("floodwatch_token");
    localStorage.removeItem("floodwatch_user");
    onAuthSuccess();
    onClose();
  };

  const hasToken = Boolean(localStorage.getItem("floodwatch_token"));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">🔐</span>
            <div>
              <h3 className="modal-title">Telemetry Access & Gateway Auth</h3>
              <span className="modal-subtitle font-mono">JWT Bearer Authorization Protocol</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${mode === "LOGIN" ? "active" : ""}`}
            onClick={() => {
              setMode("LOGIN");
              setAuthError("");
            }}
          >
            Operator Login
          </button>
          <button
            className={`modal-tab ${mode === "MANUAL" ? "active" : ""}`}
            onClick={() => {
              setMode("MANUAL");
              setAuthError("");
            }}
          >
            Direct Token Key
          </button>
        </div>

        {authError && (
          <div className="modal-alert-error font-mono">
            <span>⚠️ {authError}</span>
          </div>
        )}

        {mode === "LOGIN" ? (
          <form onSubmit={handleLogin} className="modal-form">
            <div className="form-field">
              <label className="form-label font-mono">OPERATOR EMAIL</label>
              <input
                type="email"
                className="form-input font-mono"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@floodwatch.com"
              />
            </div>

            <div className="form-field">
              <label className="form-label font-mono">PASSWORD</label>
              <input
                type="password"
                className="form-input font-mono"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>

            <div className="modal-hint font-mono">
              <span>Demo credentials pre-filled: operator@floodwatch.com</span>
            </div>

            <div className="modal-actions">
              {hasToken && (
                <button type="button" className="btn-modal-secondary font-mono" onClick={handleLogout}>
                  Clear Token
                </button>
              )}
              <button
                type="submit"
                className="btn-modal-primary font-mono"
                disabled={authLoading}
              >
                {authLoading ? "AUTHENTICATING..." : "AUTHENTICATE GATEWAY"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleManualSave} className="modal-form">
            <div className="form-field">
              <label className="form-label font-mono">JWT ACCESS TOKEN</label>
              <textarea
                className="form-textarea font-mono"
                rows="4"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
              />
            </div>
            <div className="modal-hint font-mono">
              <span>Token will be saved to localStorage (floodwatch_token) for all API calls.</span>
            </div>
            <div className="modal-actions">
              {hasToken && (
                <button type="button" className="btn-modal-secondary font-mono" onClick={handleLogout}>
                  Clear Token
                </button>
              )}
              <button type="submit" className="btn-modal-primary font-mono">
                SAVE TOKEN
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
