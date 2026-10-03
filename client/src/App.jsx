import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import "./App.css";

import Navbar from "./components/Navbar";
import HeroStatus from "./components/HeroStatus";
import KpiGrid from "./components/KpiGrid";
import ActiveAlerts from "./components/ActiveAlerts";
import RegionalMonitoring from "./components/RegionalMonitoring";
import AlertHistory from "./components/AlertHistory";
import SystemServices from "./components/SystemServices";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ErrorBanner from "./components/ErrorBanner";
import AuthModal from "./components/AuthModal";

// Setup single request interceptor for JWT authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("floodwatch_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [hasToken, setHasToken] = useState(Boolean(localStorage.getItem("floodwatch_token")));

  // Track service health for SystemServices component
  const [serviceStatus, setServiceStatus] = useState({
    gateway: true,
    readings: true,
    alerts: true,
  });

  const isInitialMount = useRef(true);

  // =========================================================================
  // FETCH TELEMETRY DATA (PRESERVING EXACT API CONTRACTS)
  // =========================================================================

  const fetchTelemetryData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);

    let hasError = false;
    let authRequired = false;
    let gatewayOk = true;
    let readingsOk = true;
    let alertsOk = true;

    // 1. Fetch Latest Readings (/api/latest-readings)
    try {
      const response = await axios.get("/api/sensor/latest-readings");
      setReadings(response.data.readings || []);
      readingsOk = true;
    } catch (err) {
      console.error("Telemetry fetch error (latest-readings):", err);
      readingsOk = false;
      hasError = true;
      if (err.response?.status === 401 || err.response?.status === 403) {
        authRequired = true;
      }
    }

    // 2. Fetch Active Alerts (/api/alerts)
    try {
      const response = await axios.get("/api/alert/alerts");
      setAlerts(response.data || []);
    } catch (err) {
      console.error("Telemetry fetch error (alerts):", err);
      alertsOk = false;
      hasError = true;
      if (err.response?.status === 401 || err.response?.status === 403) {
        authRequired = true;
      }
    }

    // 3. Fetch Alert History (/api/alert/alerts)
    try {
      const response = await axios.get("/api/alert/alerts");
      setAlertHistory(response.data || []);
    } catch (err) {
      console.error("Telemetry fetch error (alert/alerts):", err);
      alertsOk = false;
      hasError = true;
      if (err.response?.status === 401 || err.response?.status === 403) {
        authRequired = true;
      }
    }

    if (authRequired) {
      setError("API Gateway authentication required. Please click Authenticate to sign in with your operator credentials or enter an access token.");
    } else if (hasError && !readingsOk && !alertsOk) {
      gatewayOk = false;
      setError("Unable to connect to FloodWatch telemetry gateway. Retrying automatically...");
    } else {
      setError("");
    }

    setServiceStatus({
      gateway: gatewayOk,
      readings: readingsOk,
      alerts: alertsOk,
    });

    setHasToken(Boolean(localStorage.getItem("floodwatch_token")));
    setLastUpdated(new Date());
    setLoading(false);
    if (isManual) setIsRefreshing(false);
  }, []);

  // =========================================================================
  // AUTO-REFRESH INTERVAL (EVERY 5 SECONDS)
  // =========================================================================

  useEffect(() => {
    if (isInitialMount.current) {
      fetchTelemetryData(false);
      isInitialMount.current = false;
    }

    const intervalId = setInterval(() => {
      fetchTelemetryData(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchTelemetryData]);

  // Derived threat conditions
  const hasActiveDanger =
    readings.some((r) => r.status === "DANGER");

  return (
    <div className="app-container" id="dashboard">
      {/* 1. TOP NAVIGATION */}
      <Navbar
        isLive={!error && serviceStatus.gateway}
        isRefreshing={isRefreshing}
        onRefresh={() => fetchTelemetryData(true)}
        activeSection={activeSection}
        onNavClick={(sectionId) => setActiveSection(sectionId)}
        onOpenAuth={() => setIsAuthOpen(true)}
        hasToken={hasToken}
      />

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        {/* 10. ERROR STATE BANNER (Non-destructive) */}
        <ErrorBanner
          message={error}
          onRetry={() => fetchTelemetryData(true)}
          isRetrying={isRefreshing}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* 11. POLISHED SKELETON / LOADING STATE */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* 2. HERO / STATUS AREA */}
            <HeroStatus
              systemOnline={!error && serviceStatus.gateway}
              lastUpdated={lastUpdated}
              locationCount={readings.length}
              hasActiveDanger={hasActiveDanger}
            />

            {/* 3. KPI CARDS */}
            <KpiGrid readings={readings}/>

            {/* 6. ACTIVE ALERTS */}
            <ActiveAlerts alerts={readings} />

            {/* 4 & 5. REGIONAL FLOOD MONITORING + WATER LEVEL VISUALIZATION */}
            <RegionalMonitoring readings={readings} />

            {/* 7. ALERT HISTORY */}
            <AlertHistory alertHistory={alertHistory} />

            {/* 8. SYSTEM SERVICES (INFRASTRUCTURE STATUS) */}
            <SystemServices
              isGatewayOnline={serviceStatus.gateway}
              readingsOk={serviceStatus.readings}
              alertsOk={serviceStatus.alerts}
            />
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <div className="footer-inner font-mono">
          <div className="footer-left">
            <span className="footer-brand">FLOODWATCH</span>
            <span>· Real-Time Flood Telemetry & Emergency Response Network</span>
          </div>
          <div className="footer-right">
            <span>DevOps Microservices Portfolio</span>
            <span>· Docker · Kafka · MongoDB · Express · React</span>
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION & ACCESS KEY MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={() => fetchTelemetryData(true)}
      />
    </div>
  );
}

export default App;